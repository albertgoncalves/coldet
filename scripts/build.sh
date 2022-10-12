#!/usr/bin/env bash

set -eu

jshint "$WD/src"

clang-format -i -verbose "$WD/src/"*.js
clang-format -i -verbose "$WD/src/"*/*.js

"$WD/scripts/codegen.py"

tidy -config "$WD/.tidyrc" -m -q "$WD/"*.html
tidy -config "$WD/.tidyrc" -m -q "$WD/src/"*/*.html
