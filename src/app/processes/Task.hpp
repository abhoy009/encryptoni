// Task.hpp
#ifndef TASK_HPP
#define TASK_HPP

#include <string>
#include <sstream>
#include <stdexcept>

enum class Action {
    ENCRYPT,
    DECRYPT
};

struct Task {
    std::string filePath;
    Action action;

    Task(std::string filePath, Action action) : filePath(filePath), action(action) {}
};

#endif