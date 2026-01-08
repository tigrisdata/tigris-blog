#!/usr/bin/env bash

# Check that all blog posts have a valid category tag as the first tag.
# Valid category tags (case-insensitive, matched by slug):
#   - engineering
#   - build-with-tigris
#   - customers
#   - updates

set -euo pipefail

# Valid category slugs (lowercase, hyphenated)
VALID_SLUGS=("engineering" "build-with-tigris" "customers" "updates")

# Convert a tag to its slug form (lowercase, spaces to hyphens)
to_slug() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '-'
}

# Find all blog post index.mdx files
blog_dir="${1:-blog}"
errors=()

for file in "$blog_dir"/*/index.mdx; do
  if [[ ! -f "$file" ]]; then
    continue
  fi

  first_tag=""

  # Check for inline tag format: tags: [tag1, tag2, ...]
  if grep -qE '^tags:\s*\[' "$file"; then
    # Extract inline tags - get content between [ and ]
    first_tag=$(grep -oE '^tags:[[:space:]]*\[[^]]+\]' "$file" | sed 's/^tags:[[:space:]]*\[//' | sed 's/\]$//' | cut -d',' -f1 | xargs)
  else
    # Extract YAML list format tags
    # Find the line after "tags:" that starts with "  - "
    first_tag=$(awk '/^tags:/{found=1; next} found && /^[[:space:]]*-[[:space:]]/{gsub(/^[[:space:]]*-[[:space:]]*/, ""); print; exit}' "$file")
  fi

  # Trim whitespace
  first_tag=$(echo "$first_tag" | xargs)

  # Convert to slug for comparison (case-insensitive matching)
  first_tag_slug=$(to_slug "$first_tag")

  # Check if the first tag's slug matches a valid category slug
  is_valid=false
  for valid_slug in "${VALID_SLUGS[@]}"; do
    if [[ "$first_tag_slug" == "$valid_slug" ]]; then
      is_valid=true
      break
    fi
  done

  if ! $is_valid; then
    errors+=("$file: First tag '$first_tag' (slug: '$first_tag_slug') is not a valid category. Must match one of: ${VALID_SLUGS[*]}")
  fi
done

if ((${#errors[@]} > 0)); then
  echo "Category tag validation failed:"
  echo ""
  for error in "${errors[@]}"; do
    echo "  - $error"
  done
  echo ""
  echo "Valid category slugs (must be first tag): engineering, build-with-tigris, customers, updates"
  echo "Examples: 'Engineering', 'engineering', 'Build with Tigris', 'build with tigris', etc."
  exit 1
fi

echo "All blog posts have valid category tags."
exit 0
