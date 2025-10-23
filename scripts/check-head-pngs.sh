#!/usr/bin/env bash

set -euo pipefail

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  # No commits yet; nothing to check.
  exit 0
fi

mapfile -t new_pngs < <(
  git diff-tree --root --no-commit-id --name-only -r --diff-filter=A HEAD \
    | grep -i '\.png$' || true
)

if ((${#new_pngs[@]} == 0)); then
  exit 0
fi

echo "New .png files detected in HEAD commit:"
printf '  %s\n' "${new_pngs[@]}"
echo
echo "Please optimize these images to .webp with ffmpeg before committing."
exit 1
