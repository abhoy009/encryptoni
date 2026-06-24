# Encryptoni — Quick Start Guide

Encryptoni encrypts and decrypts files using AES-256-GCM. Two commands are available:

- **`encrypt`** — encrypts an entire directory or a single file
- **`decrypt`** — decrypts an entire directory or a single file

---

## Install

### Homebrew (macOS)
```bash
brew tap abhoy009/encryptoni
brew install encryptoni
```

### Build from Source
```bash
# macOS
brew install openssl@3

# Ubuntu / Debian
sudo apt-get install build-essential libssl-dev

git clone https://github.com/abhoy009/encryptoni.git
cd encryptoni
make
```

---

## Set a Password

Supply your password in one of three ways (checked in this order):

1. **Flag**: `--password yourpass`
2. **Environment variable**: `export ENCRYPTONI_PASSWORD=yourpass`
3. **`.env` file** in the current directory: `PASSWORD=yourpass`

---

## Encrypt a Directory

```bash
encrypt ./my_folder --password yourpass
```

Add `--mode fork` for maximum speed on multi-core machines:

```bash
encrypt ./my_folder --mode fork --password yourpass
```

Available modes: `serial` (default), `fork`, `thread`

---

## Decrypt a Directory

```bash
decrypt ./my_folder --password yourpass
```

---

## Encrypt / Decrypt a Single File

```bash
# Encrypt
encrypt "./report.pdf" --password yourpass

# Decrypt
decrypt "./report.pdf" --password yourpass
```

---

## Help

```bash
encrypt --help
decrypt --help
man encryptoni
```
