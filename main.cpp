#include <iostream>
#include <filesystem>
#include <getopt.h>
#include <cstdlib>
#include "./src/app/processes/ProcessManagement.hpp"
#include "./src/app/processes/Task.hpp"

namespace fs = std::filesystem;

void printUsage() {
    std::cout << "Usage: ./encrypt_decrypt <directory> --action <encrypt|decrypt> [--mode <serial|fork|thread>] [--password <pass>]\n";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        printUsage();
        return 0;
    }

    std::string directory;
    std::string action;
    std::string modeStr = "serial";

    static struct option long_options[] = {
        {"action", required_argument, 0, 'a'},
        {"mode", required_argument, 0, 'm'},
        {"password", required_argument, 0, 'p'},
        {"help", no_argument, 0, 'h'},
        {0, 0, 0, 0}
    };

    int opt;
    int option_index = 0;
    while ((opt = getopt_long(argc, argv, "a:m:p:h", long_options, &option_index)) != -1) {
        switch (opt) {
            case 'a':
                action = optarg;
                break;
            case 'm':
                modeStr = optarg;
                break;
            case 'p':
                setenv("ENCRYPTONI_PASSWORD", optarg, 1);
                break;
            case 'h':
            default:
                printUsage();
                return 0;
        }
    }

    if (optind < argc) {
        directory = argv[optind];
    } else {
        std::cerr << "Error: Directory path is required.\n";
        printUsage();
        return 1;
    }

    if (action != "encrypt" && action != "decrypt") {
        std::cerr << "Error: Action must be either 'encrypt' or 'decrypt'.\n";
        printUsage();
        return 1;
    }

    ExecutionMode mode = ExecutionMode::SERIAL;
    if (modeStr == "fork" || modeStr == "process" || modeStr == "multiprocessing") {
        mode = ExecutionMode::MULTIPROCESSING;
    } else if (modeStr == "thread" || modeStr == "multithreading") {
        mode = ExecutionMode::MULTITHREADING;
    }

    try {
        if (fs::exists(directory) && fs::is_directory(directory)) {
            ProcessManagement processManagement;

            for (const auto& entry : fs::recursive_directory_iterator(directory)) {
                if (entry.is_regular_file()) {
                    std::string filePath = entry.path().string();

                    // Skip hidden/system files, and our temporary files
                    if (entry.path().filename().string().rfind(".", 0) == 0 ||
                        filePath.find(".tmp_enc") != std::string::npos ||
                        filePath.find(".tmp_dec") != std::string::npos ||
                        entry.path().filename() == "Makefile" ||
                        entry.path().filename() == "encrypt_decrypt" ||
                        entry.path().filename() == "cryption") {
                        continue;
                    }

                    Action taskAction = (action == "encrypt") ? Action::ENCRYPT : Action::DECRYPT;
                    auto task = std::make_unique<Task>(filePath, taskAction);
                    processManagement.submitToQueue(std::move(task));
                }
            }

            processManagement.executeTasks(mode);
        } else {
            std::cout << "Invalid directory path!" << std::endl;
        }
    } catch (const fs::filesystem_error& ex) {
        std::cout << "Filesystem error: " << ex.what() << std::endl;
    }

    return 0;
}