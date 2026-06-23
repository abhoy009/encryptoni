#include "ProcessManagement.hpp"
#include "../encryptDecrypt/Cryption.hpp"
#include <iostream>
#include <vector>
#include <thread>
#include <atomic>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>
#include <pthread.h>
#include <csignal>

static_assert(std::atomic<size_t>::is_always_lock_free, "size_t atomic must be lock-free");
static_assert(std::atomic<int>::is_always_lock_free, "int atomic must be lock-free");

struct SharedState {
    std::atomic<size_t> nextTaskIndex;
    std::atomic<int> successCount;
    std::atomic<int> failureCount;
};

struct ThreadArgs {
    const std::vector<std::unique_ptr<Task>>* tasks;
    pthread_mutex_t* mutex;
    size_t* nextTaskIndex;
    std::atomic<int>* successCount;
    std::atomic<int>* failureCount;
};

void* threadWorker(void* arg) {
    ThreadArgs* args = static_cast<ThreadArgs*>(arg);
    size_t totalTasks = args->tasks->size();

    while (true) {
        size_t taskIdx = 0;
        pthread_mutex_lock(args->mutex);
        taskIdx = *(args->nextTaskIndex);
        (*(args->nextTaskIndex))++;
        pthread_mutex_unlock(args->mutex);

        if (taskIdx >= totalTasks) {
            break;
        }

        const auto& task = (*args->tasks)[taskIdx];
        int result = executeCryption(task->toString());
        if (result == 0) {
            args->successCount->fetch_add(1);
        } else {
            args->failureCount->fetch_add(1);
        }
    }
    return nullptr;
}

ProcessManagement::ProcessManagement() {}

bool ProcessManagement::submitToQueue(std::unique_ptr<Task> task) {
    taskQueue.push(std::move(task));
    return true;
}

void ProcessManagement::executeTasks(ExecutionMode mode) {
    if (taskQueue.empty()) {
        std::cout << "No tasks to execute." << std::endl;
        return;
    }

    // Move tasks from queue to vector for O(1) random access
    std::vector<std::unique_ptr<Task>> tasks;
    while (!taskQueue.empty()) {
        tasks.push_back(std::move(taskQueue.front()));
        taskQueue.pop();
    }

    size_t totalTasks = tasks.size();

    if (mode == ExecutionMode::SERIAL) {
        std::cout << "Executing tasks sequentially (Serial Mode)..." << std::endl;
        int successCount = 0;
        int failureCount = 0;

        for (size_t i = 0; i < totalTasks; ++i) {
            std::cout << "Processing file (" << (i + 1) << "/" << totalTasks << "): " << tasks[i]->filePath << std::endl;
            int result = executeCryption(tasks[i]->toString());
            if (result == 0) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        std::cout << "\nSerial Execution Completed." << std::endl;
        std::cout << "Successfully processed: " << successCount << " files." << std::endl;
        std::cout << "Failed: " << failureCount << " files." << std::endl;

    } else if (mode == ExecutionMode::MULTIPROCESSING) {
        std::cout << "Executing tasks via Multiprocessing (fork + shared memory)..." << std::endl;

        // Allocate shared memory for IPC
        SharedState* sharedState = (SharedState*) mmap(
            NULL, sizeof(SharedState),
            PROT_READ | PROT_WRITE,
            MAP_SHARED | MAP_ANONYMOUS,
            -1, 0
        );

        if (sharedState == MAP_FAILED) {
            std::cerr << "mmap failed! Falling back to Serial Execution." << std::endl;
            // Repopulate queue and execute serially
            for (auto& task : tasks) {
                taskQueue.push(std::move(task));
            }
            executeTasks(ExecutionMode::SERIAL);
            return;
        }

        // Initialize atomic variables in mapped shared memory
        new (&sharedState->nextTaskIndex) std::atomic<size_t>(0);
        new (&sharedState->successCount) std::atomic<int>(0);
        new (&sharedState->failureCount) std::atomic<int>(0);

        int numWorkers = std::thread::hardware_concurrency();
        if (numWorkers <= 0) numWorkers = 4;
        if (numWorkers > static_cast<int>(totalTasks)) {
            numWorkers = totalTasks;
        }

        std::cout << "Spawning " << numWorkers << " worker processes..." << std::endl;

        std::vector<pid_t> pids;
        for (int i = 0; i < numWorkers; ++i) {
            pid_t pid = fork();
            if (pid < 0) {
                std::cerr << "Fork failed! Terminating spawned worker processes..." << std::endl;
                for (pid_t p : pids) {
                    kill(p, SIGKILL);
                }
                // Clean up shared memory
                sharedState->nextTaskIndex.~atomic();
                sharedState->successCount.~atomic();
                sharedState->failureCount.~atomic();
                munmap(sharedState, sizeof(SharedState));
                return;
            } else if (pid == 0) {
                // Child worker process loop
                while (true) {
                    size_t taskIdx = sharedState->nextTaskIndex.fetch_add(1);
                    if (taskIdx >= totalTasks) {
                        break;
                    }
                    int result = executeCryption(tasks[taskIdx]->toString());
                    if (result == 0) {
                        sharedState->successCount.fetch_add(1);
                    } else {
                        sharedState->failureCount.fetch_add(1);
                    }
                }
                std::exit(0);
            } else {
                pids.push_back(pid);
            }
        }

        // Parent process waits for all children
        for (pid_t pid : pids) {
            int status;
            waitpid(pid, &status, 0);
        }

        std::cout << "\nMultiprocessing Execution Completed." << std::endl;
        std::cout << "Successfully processed: " << sharedState->successCount.load() << " files." << std::endl;
        std::cout << "Failed: " << sharedState->failureCount.load() << " files." << std::endl;

        // Destruct and unmap
        sharedState->nextTaskIndex.~atomic();
        sharedState->successCount.~atomic();
        sharedState->failureCount.~atomic();
        munmap(sharedState, sizeof(SharedState));

    } else if (mode == ExecutionMode::MULTITHREADING) {
        std::cout << "Executing tasks via Multithreading (pthread)..." << std::endl;

        pthread_mutex_t mutex;
        pthread_mutex_init(&mutex, NULL);

        size_t nextTaskIndex = 0;
        std::atomic<int> successCount(0);
        std::atomic<int> failureCount(0);

        ThreadArgs args = { &tasks, &mutex, &nextTaskIndex, &successCount, &failureCount };

        int numThreads = std::thread::hardware_concurrency();
        if (numThreads <= 0) numThreads = 4;
        if (numThreads > static_cast<int>(totalTasks)) {
            numThreads = totalTasks;
        }

        std::cout << "Creating " << numThreads << " worker threads..." << std::endl;

        std::vector<pthread_t> threads(numThreads);
        for (int i = 0; i < numThreads; ++i) {
            pthread_create(&threads[i], NULL, threadWorker, &args);
        }

        for (int i = 0; i < numThreads; ++i) {
            pthread_join(threads[i], NULL);
        }

        pthread_mutex_destroy(&mutex);

        std::cout << "\nMultithreading Execution Completed." << std::endl;
        std::cout << "Successfully processed: " << successCount.load() << " files." << std::endl;
        std::cout << "Failed: " << failureCount.load() << " files." << std::endl;
    }
}