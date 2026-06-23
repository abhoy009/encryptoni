#include "Cryption.hpp"
#include "../processes/Task.hpp"
#include "../fileHandling/ReadEnv.cpp"
#include <iostream>
#include <fstream>
#include <filesystem>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/err.h>

namespace fs = std::filesystem;

constexpr size_t SALT_SIZE = 16;
constexpr size_t IV_SIZE = 12;
constexpr size_t TAG_SIZE = 16;
constexpr size_t KEY_SIZE = 32; // 256 bits for AES-256
constexpr int PBKDF2_ITERATIONS = 100000;
constexpr size_t CHUNK_SIZE = 64 * 1024; // 64 KB chunks

bool encryptFile(const std::string& inputPath, const std::string& outputPath, const std::string& password) {
    std::ifstream inFile(inputPath, std::ios::binary);
    if (!inFile.is_open()) {
        std::cerr << "Failed to open input file for encryption: " << inputPath << std::endl;
        return false;
    }

    std::ofstream outFile(outputPath, std::ios::binary);
    if (!outFile.is_open()) {
        std::cerr << "Failed to open output file for encryption: " << outputPath << std::endl;
        return false;
    }

    // Generate random salt and IV
    unsigned char salt[SALT_SIZE];
    unsigned char iv[IV_SIZE];
    if (RAND_bytes(salt, SALT_SIZE) != 1 || RAND_bytes(iv, IV_SIZE) != 1) {
        std::cerr << "Error generating random salt/IV" << std::endl;
        return false;
    }

    // Write salt and IV (header metadata)
    outFile.write(reinterpret_cast<const char*>(salt), SALT_SIZE);
    outFile.write(reinterpret_cast<const char*>(iv), IV_SIZE);

    // Write a dummy tag placeholder (16 bytes)
    unsigned char dummyTag[TAG_SIZE] = {0};
    outFile.write(reinterpret_cast<const char*>(dummyTag), TAG_SIZE);

    // Derive key using PBKDF2
    unsigned char derivedKey[KEY_SIZE];
    if (PKCS5_PBKDF2_HMAC(password.c_str(), password.length(),
                          salt, SALT_SIZE,
                          PBKDF2_ITERATIONS,
                          EVP_sha256(),
                          KEY_SIZE, derivedKey) != 1) {
        std::cerr << "PBKDF2 key derivation failed" << std::endl;
        return false;
    }

    // Initialize EVP encrypt context
    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    if (!ctx) {
        std::cerr << "Failed to create EVP context" << std::endl;
        return false;
    }

    if (EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL) != 1) {
        std::cerr << "EVP_EncryptInit_ex failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, IV_SIZE, NULL) != 1) {
        std::cerr << "Setting IV length failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    if (EVP_EncryptInit_ex(ctx, NULL, NULL, derivedKey, iv) != 1) {
        std::cerr << "EVP_EncryptInit_ex key/IV setup failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    // Stream and encrypt file in chunks
    char inBuffer[CHUNK_SIZE];
    unsigned char outBuffer[CHUNK_SIZE + 16]; // extra padding space
    int outLen = 0;

    while (inFile.read(inBuffer, CHUNK_SIZE) || inFile.gcount() > 0) {
        std::streamsize bytesRead = inFile.gcount();
        if (EVP_EncryptUpdate(ctx, outBuffer, &outLen,
                               reinterpret_cast<const unsigned char*>(inBuffer), bytesRead) != 1) {
            std::cerr << "EVP_EncryptUpdate failed" << std::endl;
            EVP_CIPHER_CTX_free(ctx);
            return false;
        }
        outFile.write(reinterpret_cast<const char*>(outBuffer), outLen);
    }

    // Finalize
    if (EVP_EncryptFinal_ex(ctx, outBuffer, &outLen) != 1) {
        std::cerr << "EVP_EncryptFinal_ex failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }
    if (outLen > 0) {
        outFile.write(reinterpret_cast<const char*>(outBuffer), outLen);
    }

    // Get the computed authentication tag
    unsigned char tag[TAG_SIZE];
    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_GET_TAG, TAG_SIZE, tag) != 1) {
        std::cerr << "Failed to fetch authentication tag" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    EVP_CIPHER_CTX_free(ctx);
    inFile.close();

    // Seek back to write tag to placeholder slot
    outFile.seekp(SALT_SIZE + IV_SIZE, std::ios::beg);
    outFile.write(reinterpret_cast<const char*>(tag), TAG_SIZE);
    outFile.close();

    return true;
}

bool decryptFile(const std::string& inputPath, const std::string& outputPath, const std::string& password) {
    std::ifstream inFile(inputPath, std::ios::binary);
    if (!inFile.is_open()) {
        std::cerr << "Failed to open input file for decryption: " << inputPath << std::endl;
        return false;
    }

    // Read salt, IV, and tag headers
    unsigned char salt[SALT_SIZE];
    unsigned char iv[IV_SIZE];
    unsigned char tag[TAG_SIZE];

    inFile.read(reinterpret_cast<char*>(salt), SALT_SIZE);
    inFile.read(reinterpret_cast<char*>(iv), IV_SIZE);
    inFile.read(reinterpret_cast<char*>(tag), TAG_SIZE);

    if (inFile.gcount() < static_cast<std::streamsize>(TAG_SIZE)) {
        std::cerr << "Input file too short (headers missing): " << inputPath << std::endl;
        return false;
    }

    // Derive key using PBKDF2
    unsigned char derivedKey[KEY_SIZE];
    if (PKCS5_PBKDF2_HMAC(password.c_str(), password.length(),
                          salt, SALT_SIZE,
                          PBKDF2_ITERATIONS,
                          EVP_sha256(),
                          KEY_SIZE, derivedKey) != 1) {
        std::cerr << "PBKDF2 key derivation failed" << std::endl;
        return false;
    }

    std::ofstream outFile(outputPath, std::ios::binary);
    if (!outFile.is_open()) {
        std::cerr << "Failed to open output file for decryption: " << outputPath << std::endl;
        return false;
    }

    // Initialize EVP decrypt context
    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    if (!ctx) {
        std::cerr << "Failed to create EVP context" << std::endl;
        return false;
    }

    if (EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL) != 1) {
        std::cerr << "EVP_DecryptInit_ex failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, IV_SIZE, NULL) != 1) {
        std::cerr << "Setting IV length failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    if (EVP_DecryptInit_ex(ctx, NULL, NULL, derivedKey, iv) != 1) {
        std::cerr << "EVP_DecryptInit_ex key/IV setup failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    // Set expected verification tag
    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_TAG, TAG_SIZE, tag) != 1) {
        std::cerr << "Setting verification tag failed" << std::endl;
        EVP_CIPHER_CTX_free(ctx);
        return false;
    }

    // Stream and decrypt file in chunks
    char inBuffer[CHUNK_SIZE];
    unsigned char outBuffer[CHUNK_SIZE + 16];
    int outLen = 0;

    while (inFile.read(inBuffer, CHUNK_SIZE) || inFile.gcount() > 0) {
        std::streamsize bytesRead = inFile.gcount();
        if (EVP_DecryptUpdate(ctx, outBuffer, &outLen,
                               reinterpret_cast<const unsigned char*>(inBuffer), bytesRead) != 1) {
            std::cerr << "EVP_DecryptUpdate failed" << std::endl;
            EVP_CIPHER_CTX_free(ctx);
            return false;
        }
        outFile.write(reinterpret_cast<const char*>(outBuffer), outLen);
    }

    inFile.close();

    // Finalize decryption and verify GCM tag
    int ret = EVP_DecryptFinal_ex(ctx, outBuffer, &outLen);
    EVP_CIPHER_CTX_free(ctx);

    if (ret > 0) {
        if (outLen > 0) {
            outFile.write(reinterpret_cast<const char*>(outBuffer), outLen);
        }
        outFile.close();
        return true;
    } else {
        std::cerr << "Integrity verification failed for file: " << inputPath << " (wrong key or corrupt data)" << std::endl;
        outFile.close();
        fs::remove(outputPath);
        return false;
    }
}

int executeCryption(const std::string& taskData) {
    Task task = Task::fromString(taskData);
    ReadEnv env;
    std::string rawKey = env.getenv();

    // Trim trailing and leading whitespaces/newlines from environment password
    size_t first = rawKey.find_first_not_of(" \t\r\n");
    std::string password;
    if (first != std::string::npos) {
        size_t last = rawKey.find_last_not_of(" \t\r\n");
        password = rawKey.substr(first, (last - first + 1));
    } else {
        password = rawKey;
    }

    std::string tempPath = task.filePath + (task.action == Action::ENCRYPT ? ".tmp_enc" : ".tmp_dec");
    bool success = false;

    if (task.action == Action::ENCRYPT) {
        success = encryptFile(task.filePath, tempPath, password);
    } else {
        success = decryptFile(task.filePath, tempPath, password);
    }

    if (success) {
        std::error_code ec;
        fs::rename(tempPath, task.filePath, ec);
        if (ec) {
            std::cerr << "Error renaming temp file " << tempPath << " to " << task.filePath << ": " << ec.message() << std::endl;
            fs::remove(tempPath, ec);
            return 1;
        }
        return 0;
    } else {
        std::error_code ec;
        fs::remove(tempPath, ec);
        return 1;
    }
}