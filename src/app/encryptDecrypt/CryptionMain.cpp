#include <iostream>
#include <getopt.h>
#include <cstdlib>
#include "Cryption.hpp"

void printUsage() {
    std::cout << "Usage: ./cryption <task_data> [--password <pass>]\n";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        printUsage();
        return 0;
    }

    static struct option long_options[] = {
        {"password", required_argument, 0, 'p'},
        {"help", no_argument, 0, 'h'},
        {0, 0, 0, 0}
    };

    int opt;
    int option_index = 0;
    while ((opt = getopt_long(argc, argv, "p:h", long_options, &option_index)) != -1) {
        switch (opt) {
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
        return executeCryption(argv[optind]);
    } else {
        std::cerr << "Error: <task_data> is required.\n";
        printUsage();
        return 1;
    }
}