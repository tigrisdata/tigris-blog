#!/usr/bin/env bash

set -euo pipefail

# Files that are allowed to ship as .png despite the rule below.
#
# Entries are exact, full repo-relative paths -- never a directory and never a
# wildcard -- so adding one file here cannot let any other .png through.
#
# static/img/SOC2-badge-new.png: the SOC 2 Type II compliance mark, copied
# unmodified from the marketing site (website repo:
# public/images/SOC2-badge-new.png), where the .png is the canonical asset.
# A compliance badge has to ship as the artwork it was issued as, so it is not
# re-encoded to .webp.
png_allowlist=(
  "static/img/SOC2-badge-new.png"
)

# Exact string match; the quoted right-hand side is compared literally, so no
# entry can act as a glob.
is_allowlisted_png() {
  local candidate="$1"
  local allowed
  for allowed in "${png_allowlist[@]}"; do
    if [[ "${candidate}" == "${allowed}" ]]; then
      return 0
    fi
  done
  return 1
}

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

mapfile -t added_pngs < <(
  git diff --name-only --diff-filter=A "${base_ref}...HEAD" \
    | grep -i '\.png$' || true
)

new_pngs=()
for png in ${added_pngs[@]+"${added_pngs[@]}"}; do
  if is_allowlisted_png "${png}"; then
    echo "Allowlisted .png, not flagged: ${png}" >&2
    continue
  fi
  new_pngs+=("${png}")
done

if ((${#new_pngs[@]} == 0)); then
  exit 0
fi

echo "New .png files detected relative to ${base_ref}:"
printf '  %s\n' "${new_pngs[@]}"
echo
echo "Please optimize these images to .webp with ffmpeg before committing."
exit 1
