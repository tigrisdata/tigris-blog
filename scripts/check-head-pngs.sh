#!/usr/bin/env bash

set -euo pipefail

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  # No commits yet; nothing to check.
  exit 0
fi

base_ref="${1:-}"

if [[ -z "${base_ref}" ]]; then
  if git rev-parse --verify origin/HEAD >/dev/null 2>&1; then
    base_ref="origin/HEAD"
  elif git rev-parse --verify HEAD^ >/dev/null 2>&1; then
    base_ref="HEAD^"
  else
    # Single commit repository; nothing to compare against.
    exit 0
  fi
fi

if ! git rev-parse --verify "${base_ref}" >/dev/null 2>&1; then
  echo "Warning: Unable to resolve base reference '${base_ref}'. Skipping PNG check." >&2
  exit 0
fi

mapfile -t new_pngs < <(
  git diff --name-only --diff-filter=A "${base_ref}...HEAD" \
    | grep -i '\.png$' || true
)

if ((${#new_pngs[@]} == 0)); then
  exit 0
fi

echo "New .png files detected relative to ${base_ref}:"
printf '  %s\n' "${new_pngs[@]}"
echo
echo "Please optimize these images to .webp with ffmpeg before committing."
exit 1
