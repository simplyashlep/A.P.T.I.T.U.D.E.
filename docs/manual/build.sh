#!/usr/bin/env bash
# Compile the compartmentalized Aptitudinal Alignment manual.
# Requires XeLaTeX (Tectonic or TeX Live). Run twice for the TOC.
set -euo pipefail
cd "$(dirname "$0")"
xelatex -interaction=nonstopmode 00-main.tex
xelatex -interaction=nonstopmode 00-main.tex
echo "Manual built: docs/manual/00-main.pdf"
