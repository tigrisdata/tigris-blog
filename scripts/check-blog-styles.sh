#!/usr/bin/env bash

set -euo pipefail

# Check that new/modified blog posts have styles.css imported
# This ensures consistent styling across all posts (especially hero images)

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
  echo "Warning: Unable to resolve base reference '${base_ref}'. Skipping styles check." >&2
  exit 0
fi

# Find new or modified blog post index files
changed_posts=()
while IFS= read -r line; do
  [[ -n "$line" ]] && changed_posts+=("$line")
done < <(git diff --name-only --diff-filter=AM "${base_ref}...HEAD" | grep -E '^blog/[^/]+/index\.mdx?$' || true)

if ((${#changed_posts[@]} == 0)); then
  exit 0
fi

missing_styles=()
missing_import=()

for index_file in "${changed_posts[@]}"; do
  post_dir=$(dirname "${index_file}")
  styles_file="${post_dir}/styles.css"

  # Check if styles.css exists
  if [[ ! -f "${styles_file}" ]]; then
    missing_styles+=("${post_dir}/")
    continue
  fi

  # Check if styles.css is imported in the MDX file
  if ! grep -q 'import styles from "!!raw-loader!./styles.css"' "${index_file}"; then
    missing_import+=("${index_file}")
    continue
  fi

  # Check if the style tag is present
  if ! grep -q '<style>{styles}</style>' "${index_file}"; then
    missing_import+=("${index_file}")
  fi
done

exit_code=0

if ((${#missing_styles[@]} > 0)); then
  echo "Blog posts missing styles.css file:"
  printf '  %s\n' "${missing_styles[@]}"
  echo
  exit_code=1
fi

if ((${#missing_import[@]} > 0)); then
  echo "Blog posts with styles.css but missing import/style tag:"
  printf '  %s\n' "${missing_import[@]}"
  echo
  exit_code=1
fi

if ((exit_code == 1)); then
  echo "Please add styles.css and import it in your blog post:"
  echo '  import styles from "!!raw-loader!./styles.css";'
  echo '  <style>{styles}</style>'
  echo
  echo "You can copy styles.css from another recent blog post."
fi

exit ${exit_code}
