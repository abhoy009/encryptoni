#!/bin/bash

# Setup benchmark files
echo "Creating benchmark directory and generating test files..."
mkdir -p benchmark_test
for i in {1..200}
do
    dd if=/dev/urandom of=benchmark_test/file_$i.bin bs=1M count=5 conv=notrunc 2>/dev/null
done
echo "Total benchmark data size: 1 GB (200 files of 5 MB each)"

# Benchmark Serial Mode
echo -e "\n=== Benchmarking Serial Mode ==="
start_time=$(date +%s)
echo -e "benchmark_test\nencrypt\nserial" | ./encrypt_decrypt > /dev/null
end_time=$(date +%s)
serial_enc_time=$((end_time - start_time))
echo "Serial Encryption Time: ${serial_enc_time} seconds"

# Restore files for next test
echo -e "benchmark_test\ndecrypt\nserial" | ./encrypt_decrypt > /dev/null

# Benchmark Multiprocessing Mode (fork)
echo -e "\n=== Benchmarking Multiprocessing Mode (fork) ==="
start_time=$(date +%s)
echo -e "benchmark_test\nencrypt\nfork" | ./encrypt_decrypt > /dev/null
end_time=$(date +%s)
fork_enc_time=$((end_time - start_time))
echo "Multiprocessing Encryption Time: ${fork_enc_time} seconds"

# Restore files for next test
echo -e "benchmark_test\ndecrypt\nfork" | ./encrypt_decrypt > /dev/null

# Benchmark Multithreading Mode (thread)
echo -e "\n=== Benchmarking Multithreading Mode (thread) ==="
start_time=$(date +%s)
echo -e "benchmark_test\nencrypt\nthread" | ./encrypt_decrypt > /dev/null
end_time=$(date +%s)
thread_enc_time=$((end_time - start_time))
echo "Multithreading Encryption Time: ${thread_enc_time} seconds"

# Restore files
echo -e "benchmark_test\ndecrypt\nthread" | ./encrypt_decrypt > /dev/null

# Cleanup
echo -e "\nCleaning up benchmark directory..."
rm -rf benchmark_test

# Speedup summary
echo -e "\n=== Speedup Summary ==="
if [ $fork_enc_time -gt 0 ]; then
    fork_speedup=$(echo "scale=2; $serial_enc_time / $fork_enc_time" | bc)
    echo "Multiprocessing Speedup: ${fork_speedup}x"
else
    echo "Multiprocessing Speedup: N/A (time was 0s)"
fi

if [ $thread_enc_time -gt 0 ]; then
    thread_speedup=$(echo "scale=2; $serial_enc_time / $thread_enc_time" | bc)
    echo "Multithreading Speedup: ${thread_speedup}x"
else
    echo "Multithreading Speedup: N/A (time was 0s)"
fi
