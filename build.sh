#!/usr/bin/env sh
# Rebuilds index.html from the source parts in src/ (order matters).
cd "$(dirname "$0")" && cat src/head.html src/body.html src/core.js src/app.js src/globe.js src/app2.js > index.html && echo "Built index.html"
