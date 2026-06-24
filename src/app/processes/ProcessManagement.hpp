#ifndef PROCESS_MANAGEMENT_HPP
#define PROCESS_MANAGEMENT_HPP

#include "Task.hpp"
#include <queue>
#include <memory>

enum class ExecutionMode {
    SERIAL,
    MULTIPROCESSING,
    MULTITHREADING
};

class ProcessManagement
{
public:
    ProcessManagement();
    bool submitToQueue(std::unique_ptr<Task> task);
    int executeTasks(ExecutionMode mode);

private:
    std::queue<std::unique_ptr<Task>> taskQueue;
};

#endif