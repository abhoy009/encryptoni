#!/bin/bash

# Simple test suite for Encryptoni

set -e

echo "Running tests..."

TEST_FILE="test/sample.txt"
ENC_FILE="test/sample.txt"
DEC_FILE="test/sample.txt"
PASS="testpass"

# Setup
mkdir -p test
echo "Hello, Encryptoni!" > $TEST_FILE
cp $TEST_FILE test/sample_orig.txt

# Test 1: Encrypt and Decrypt a single file
echo "Test 1: Round-trip encryption and decryption"
./encrypt "test/sample.txt" --password $PASS > /dev/null
# File should now be encrypted
if diff test/sample_orig.txt $TEST_FILE > /dev/null; then
    echo "FAIL: File was not encrypted"
    exit 1
fi

./decrypt "test/sample.txt" --password $PASS > /dev/null
# File should now be decrypted
if ! diff test/sample_orig.txt $TEST_FILE > /dev/null; then
    echo "FAIL: Decrypted file does not match original"
    exit 1
fi
echo "PASS: Round-trip successful"

# Test 2: Tamper Detection
echo "Test 2: Tamper detection"
./encrypt "test/sample.txt" --password $PASS > /dev/null

# Modify one byte of the encrypted file
printf '\x00' | dd of=$TEST_FILE bs=1 seek=20 count=1 conv=notrunc 2>/dev/null

# Decryption should fail
if ./decrypt "test/sample.txt" --password $PASS 2>/dev/null; then
    echo "FAIL: Tampered file was successfully decrypted (should have failed)"
    exit 1
fi

if [ ! -f $TEST_FILE ]; then
    echo "FAIL: Original tampered file was incorrectly deleted upon verification failure"
    exit 1
fi
echo "PASS: Tamper detection successful"

# Cleanup
rm -f test/sample_orig.txt

echo "All tests passed!"
