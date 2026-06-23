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

    std::string toString() const {
        std::ostringstream oss;
        oss << filePath << "," << (action == Action::ENCRYPT ? "ENCRYPT" : "DECRYPT");
        return oss.str();
    }

    static Task fromString(const std::string& taskData) {
        std::istringstream iss(taskData);
        std::string filePath;
        std::string actionStr;

        if (std::getline(iss, filePath, ',') && std::getline(iss, actionStr)) {
            Action action = (actionStr == "ENCRYPT") ? Action::ENCRYPT : Action::DECRYPT;
            return Task(filePath, action);
        } else {
            throw std::runtime_error("Invalid task data format");
        }
    }
};

#endif