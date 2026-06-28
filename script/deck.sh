#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DECKS_DIR="$REPO_ROOT/decks"
STARTER_DIR="$DECKS_DIR/slidev-starter"

usage() {
  cat <<EOF
Usage: script/deck.sh <command> <deck-name>

Commands:
  new     <name>   Create a new deck from the starter template
  dev     <name>   Start Slidev dev server
  build   <name>   Build for production
  export  <name>   Export PDF (saves to public/slides/)
  deploy  <name>   Deploy to Vercel (creates project on first run)
  list             List all decks
EOF
  exit 1
}

require_deck() {
  local name="$1"
  if [[ ! -d "$DECKS_DIR/$name" ]]; then
    echo "Error: deck '$name' not found in decks/" >&2
    exit 1
  fi
}

cmd_new() {
  local name="$1"
  local dest="$DECKS_DIR/$name"

  if [[ -d "$dest" ]]; then
    echo "Error: deck '$name' already exists" >&2
    exit 1
  fi

  cp -r "$STARTER_DIR" "$dest"

  # Update package.json name
  sed -i '' "s/\"name\": \".*\"/\"name\": \"$name\"/" "$dest/package.json"

  # Reset slides.md
  cat > "$dest/slides.md" <<SLIDES
---
theme: seriph
title: $name
---

# $name

---

## Slide 2
SLIDES

  echo "Created decks/$name"
  echo "Next: cd decks/$name && pnpm install && pnpm dev"
}

cmd_dev() {
  local name="$1"
  require_deck "$name"
  cd "$DECKS_DIR/$name"
  pnpm dev
}

cmd_build() {
  local name="$1"
  require_deck "$name"
  cd "$DECKS_DIR/$name"
  pnpm build
}

cmd_export() {
  local name="$1"
  require_deck "$name"
  cd "$DECKS_DIR/$name"
  pnpm export

  local pdf="$DECKS_DIR/$name/slides-export.pdf"
  if [[ -f "$pdf" ]]; then
    local date_prefix
    date_prefix=$(date +%Y%m%d)
    local dest="$REPO_ROOT/public/slides/${date_prefix}_${name}.pdf"
    cp "$pdf" "$dest"
    echo "Exported to public/slides/${date_prefix}_${name}.pdf"
  fi
}

cmd_deploy() {
  local name="$1"
  require_deck "$name"

  if ! command -v vercel &>/dev/null; then
    echo "Error: vercel CLI not found. Install with: npm i -g vercel" >&2
    exit 1
  fi

  cd "$DECKS_DIR/$name"
  vercel --prod
}

cmd_list() {
  echo "Decks:"
  for d in "$DECKS_DIR"/*/; do
    local deck_name
    deck_name=$(basename "$d")
    [[ "$deck_name" == "slidev-starter" ]] && continue
    echo "  $deck_name"
  done
}

[[ $# -lt 1 ]] && usage

command="$1"
shift

case "$command" in
  new|dev|build|export|deploy)
    [[ $# -lt 1 ]] && { echo "Error: deck name required" >&2; usage; }
    "cmd_$command" "$1"
    ;;
  list)
    cmd_list
    ;;
  *)
    usage
    ;;
esac
