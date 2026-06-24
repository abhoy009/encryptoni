CXX = g++

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
    OPENSSL_PREFIX = /usr
else
    OPENSSL_PREFIX = $(shell brew --prefix openssl@3 2>/dev/null || echo "/opt/homebrew/opt/openssl")
endif
CXXFLAGS = -std=c++17 -g -Wall -I. -Isrc/app/encryptDecrypt -Isrc/app/fileHandling -Isrc/app/processes -I$(OPENSSL_PREFIX)/include
LDFLAGS = -L$(OPENSSL_PREFIX)/lib -lcrypto

MAIN_TARGET = encrypt
CRYPTION_TARGET = decrypt

MAIN_SRC = main.cpp \
           src/app/processes/ProcessManagement.cpp \
           src/app/fileHandling/IO.cpp \
           src/app/fileHandling/ReadEnv.cpp \
           src/app/encryptDecrypt/Cryption.cpp

MAIN_OBJ = $(MAIN_SRC:.cpp=.o)

all: $(MAIN_TARGET) $(CRYPTION_TARGET)

$(MAIN_TARGET): $(MAIN_OBJ)
	$(CXX) $(CXXFLAGS) $^ $(LDFLAGS) -o $@

$(CRYPTION_TARGET): $(MAIN_OBJ)
	$(CXX) $(CXXFLAGS) $^ $(LDFLAGS) -o $@

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(MAIN_OBJ) $(MAIN_TARGET) $(CRYPTION_TARGET)

.PHONY: clean all