class Encryptoni < Formula
  desc "Parallel file encryption engine using AES-256-GCM + PBKDF2"
  homepage "https://github.com/abhoy009/encryptoni"
  url "https://github.com/abhoy009/encryptoni/archive/refs/tags/v#{version}.tar.gz"
  version "1.0.1"
  sha256 "efa14dff6d762951a01ffb2941821d26a04d1f7d7c367654add2f690670f7c88"
  license "MIT"
  head "https://github.com/abhoy009/encryptoni.git", branch: "main"

  depends_on "openssl@3"

  def install
    openssl = Formula["openssl@3"]

    # Build both binaries, pointing make at Homebrew's OpenSSL
    system "make", "OPENSSL_PREFIX=#{openssl.opt_prefix}"

    # Install both binaries to Homebrew's bin prefix
    bin.install "encrypt"
    bin.install "decrypt"

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
        encrypt ./my_folder --mode fork --password mypass
        encrypt "path/to/file.txt" --password mypass

      Installed via:
        brew tap abhoy009/encryptoni https://github.com/abhoy009/encryptoni
        brew install abhoy009/encryptoni/encryptoni
    EOS
  end

  test do
    # Verify the binary runs and prints usage cleanly (exit 0 with no args shows usage)
    assert_match "Usage", shell_output("#{bin}/encrypt 2>&1", 0)
    assert_match "Usage", shell_output("#{bin}/decrypt 2>&1", 0)
  end
end
