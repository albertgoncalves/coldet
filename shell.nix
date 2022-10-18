with import <nixpkgs> {};
mkShell.override { stdenv = llvmPackages_14.stdenv; } {
    buildInputs = [
        html-tidy
        mypaint
        nodePackages.jshint
        python3Packages.flake8
        shellcheck
    ];
    shellHook = ''
        . .shellhook
    '';
}
