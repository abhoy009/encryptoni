class Encryptoni < Formula
  desc "Parallel file encryption engine using AES-256-GCM + PBKDF2"
  homepage "https://github.com/abhoy009/encryptoni"
  url "https://github.com/abhoy009/encryptoni/archive/refs/tags/v#{version}.tar.gz"
  version "1.0.0"
  # Run `brew fetch --build-from-source encryptoni` after tagging to get the real hash:
  #   curl -sL https://github.com/abhoy009/encryptoni/archive/refs/tags/v1.0.0.tar.gz | shasum -a 256
  sha256 "61ea82539f078c245858782ecf870565b5e4218ae95d02d90107fc9ffac9c3bd"
  license "MIT"
  head "https://github.com/abhoy009/encryptoni.git", branch: "main"

  depends_on "openssl@3"

  def install
    openssl = Formula["openssl@3"]

    # Build both binaries, pointing make at Homebrew's OpenSSL
    system "make", "OPENSSL_PREFIX=#{openssl.opt_prefix}"

    # Install both binaries to Homebrew's bin prefix
    bin.install "encrypt_decrypt"
    bin.install "cryption"

    # Install man page
    man1.install "man/encryptoni.1"
  end

  def caveats
    <<~EOS
      encryptoni resolves passwords in this order:
        1. --password flag
        2. ENCRYPTONI_PASSWORD environment variable
        3. A .env file in the current directory containing: PASSWORD=<yourpass>

      Quick start:
        encrypt_decrypt ./my_folder --action encrypt --mode fork --password mypass
        cryption "path/to/file.txt,ENCRYPT" --password mypass
    EOS
  end

  test do
    # Verify the binary runs and prints usage cleanly (exit 0 with no args shows usage)
    assert_match "Usage", shell_output("#{bin}/encrypt_decrypt 2>&1", 0)
    assert_match "Usage", shell_output("#{bin}/cryption 2>&1", 0)
  end
end
