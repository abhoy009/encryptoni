#include "ReadEnv.hpp"
#include "IO.hpp"
#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <cstdlib>

std::string ReadEnv::getenv() {
    const char* envPass = std::getenv("ENCRYPTONI_PASSWORD");
    if (envPass != nullptr && envPass[0] != '\0') {
        return std::string(envPass);
    }

    std::string env_path = ".env";
    IO io(env_path);
    std::fstream f_stream = io.getFileStream();
    std::stringstream buffer;
    buffer << f_stream.rdbuf();
    std::string content = buffer.str();
    return content;
}