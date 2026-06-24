#ifndef CRYPTION_HPP
#define CRYPTION_HPP

#include <string>

#include "../processes/Task.hpp"

bool encryptFile(const std::string& inputPath, const std::string& outputPath, const std::string& password);
bool decryptFile(const std::string& inputPath, const std::string& outputPath, const std::string& password);
int executeCryption(const Task& task);

#endif