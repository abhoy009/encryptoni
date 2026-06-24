#include <iostream>
#include <filesystem>
#include <getopt.h>
#include <cstdlib>
#include "./src/app/processes/ProcessManagement.hpp"
#include "./src/app/processes/Task.hpp"

namespace fs = std::filesystem;

void printUsage(const std::string& execName) {
    std::cout << "Usage: ./" << execName << " <path> [--mode <serial|fork|thread>] [--password <pass>]\n";
}

int main(int argc, char* argv[]) {
    std::string execName = fs::path(argv[0]).filename().string();
    if (argc < 2) {
        printUsage(execName);
        return 0;
    }

    std::string targetPath;
    std::string action = (execName.find("decrypt") != std::string::npos) ? "decrypt" : "encrypt";
    std::string modeStr = "serial";

    static struct option long_options[] = {
        {"mode", required_argument, 0, 'm'},
        {"password", required_argument, 0, 'p'},
        {"help", no_argument, 0, 'h'},
        {0, 0, 0, 0}
    };

    int opt;
    int option_index = 0;
    while ((opt = getopt_long(argc, argv, "m:p:h", long_options, &option_index)) != -1) {
        switch (opt) {
            case 'm':
                modeStr = optarg;
                break;
            case 'p':
                setenv("ENCRYPTONI_PASSWORD", optarg, 1);
                break;
            case 'h':
            default:
                printUsage(execName);
                return 0;
        }
    }

    if (optind < argc) {
        targetPath = argv[optind];
    } else {
        std::cerr << "Error: Target path is required.\n";
        printUsage(execName);
        return 1;
    }

    ExecutionMode mode = ExecutionMode::SERIAL;
    if (modeStr == "fork" || modeStr == "process" || modeStr == "multiprocessing") {
        mode = ExecutionMode::MULTIPROCESSING;
    } else if (modeStr == "thread" || modeStr == "multithreading") {
        mode = ExecutionMode::MULTITHREADING;
    }

    try {
        if (fs::exists(targetPath)) {
            ProcessManagement processManagement;
            Action taskAction = (action == "encrypt") ? Action::ENCRYPT : Action::DECRYPT;

            if (fs::is_directory(targetPath)) {
                for (const auto& entry : fs::recursive_directory_iterator(targetPath)) {
                    if (entry.is_regular_file()) {
                        std::string filePath = entry.path().string();

                        // Skip hidden/system files, and our temporary files
                        if (entry.path().filename().string().rfind(".", 0) == 0 ||
                            filePath.find(".tmp_enc") != std::string::npos ||
                            filePath.find(".tmp_dec") != std::string::npos ||
                            entry.path().filename() == "Makefile" ||
                            entry.path().filename() == "encrypt" ||
                            entry.path().filename() == "decrypt") {
                            continue;
                        }

                        auto task = std::make_unique<Task>(filePath, taskAction);
                        processManagement.submitToQueue(std::move(task));
                    }
                }
            } else if (fs::is_regular_file(targetPath)) {
                auto task = std::make_unique<Task>(targetPath, taskAction);
                processManagement.submitToQueue(std::move(task));
            }

            return processManagement.executeTasks(mode) > 0 ? 1 : 0;
        } else {
            std::cout << "Invalid path!" << std::endl;
            return 1;
        }
    } catch (const fs::filesystem_error& ex) {
        std::cout << "Filesystem error: " << ex.what() << std::endl;
        return 1;
    }
}