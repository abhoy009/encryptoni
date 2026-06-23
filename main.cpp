#include <iostream>
#include <filesystem>
#include "./src/app/processes/ProcessManagement.hpp"
#include "./src/app/processes/Task.hpp"

namespace fs = std::filesystem;

int main(int argc, char* argv[]) {
    std::string directory;
    std::string action;
    std::string modeStr;

    std::cout << "Enter the directory path: ";
    std::getline(std::cin, directory);

    std::cout << "Enter the action (encrypt/decrypt): ";
    std::getline(std::cin, action);

    std::cout << "Enter the execution mode (serial/fork/thread): ";
    std::getline(std::cin, modeStr);

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