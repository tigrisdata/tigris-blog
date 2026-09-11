---
name: ascii-diagrams
description: |
  Guidelines for creating ascii diagrams in the Tigris blog style.
---

# Monospace ASCII diagrams

How the soft-delete figure set was built. Use this to add figures in the same style, or to
rebuild the set from scratch.

The style: box-drawing characters in a dark code block. No SVG, no images. A figure is plain
text plus color, so it can be copied into a post as text, diffed in git, and read in a terminal.

## Output

- `Soft Delete Diagrams.dc.html` — all figures on one page, each with a **copy** button.
- `diagrams/*.jsx` — one standalone React component per figure, generated from that page.
- `diagrams/index.js` — re-exports all ten components.

## The rule that drives everything

**Do not hand-type columns.** Every alignment defect in this set came from typing spaces by
hand. Generate each line with a small script that pads to absolute column positions, then write
the result into the page. Hand-editing a diagram means re-counting every row below it.

## Generator

A short script (run once per change) builds the figures and splices them into the page.

### Color markup

Lines are written with a token syntax so a line's *visual* length can be measured separately
from its markup:

```
{d:dim text}   {g:green}   {r:red}   {b:blue}   {a:amber}   {dd:slate border}
```

| token | hex       | use                                  |
| ----- | --------- | ------------------------------------ |
| `dd`  | `#475569` | inert box borders                    |
| `d`   | `#64748b` | secondary text, labels, `//` notes   |
| `g`   | `#4ade80` | the write, the live thing, the fork  |
| `r`   | `#f87171` | the delete, the tombstone            |
| `b`   | `#60a5fa` | pointers and data-flow arrows        |
| `a`   | `#f59e0b` | the soft-delete keyspace             |

Default text (no token) is `#cbd5e1`. Two accents per figure is the ceiling; a third color
should mean a third kind of thing, not emphasis.

The token regex must accept **multi-letter** names (`[a-z]+`). A single-letter class silently
passes `{dd:...}` through as literal text.

### Helpers

- `plain(s)` — strips tokens, returns the visible string. All measurement uses this.
- `pad(s, n)` — pads to column `n` using `plain` length.
- `L([col, text], ...)` — builds one line by placing segments at absolute columns. This is how
  side-by-side columns stay aligned.
- `box(width, lines, color)` — returns `[top, ...content, bottom]`. `width` is the inner width.
- `stem(width, at, color)` — a box bottom with a `┬` at index `at`, for a line dropping out.

`box()` asserts every content line is at most `width - 1`, which keeps a one-space gutter before
the right border. That assertion is load-bearing: it caught a full-width row that visual review
missed.

### Layout

Pick absolute columns per figure and reuse them for every row:

```js
const W = 36, R = 44;                    // inner width, right column origin
L([2, left[i]], [R, right[i]])           // two boxes, same row
```

Connectors are computed, never eyeballed. A rail under four boxes places its `┴` at each box's
stem column; a join line under two stems runs from one stem column to the other. Both were wrong
on the first pass because the dash counts were typed.

Keep every line at or under ~95 visible columns. Past that the block scrolls sideways inside its
card.

## Page assembly

Each figure is a `<div data-fig="NN">` with a header row (`FIG NN`, title, copy button) and one
`<pre>`.

**Every diagram line is its own `<div>` inside the `<pre>`.** Do not rely on newlines between
sibling `<span>` elements — a whitespace-only text node between two elements can be dropped,
which merges two rows onto one line and blows out the block width.

`<pre>` styling that matters:

- `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` — one font for latin
  **and** box-drawing glyphs. A webfont that lacks `U+2500–257F` falls back for the borders
  only, so border rows end up ~0.03px/char wider than content rows and the right edge of a frame
  visibly doubles.
- `white-space: pre`, `line-height: 1.3`, `font-size: 13px`.
- `background: #0f172a`, `1px solid #16202f`, `border-radius: 6px`, `padding: 32px`.

The copy button reads the `<pre>`'s child divs, strips trailing spaces per line, and joins with
newlines — so what lands on the clipboard is the plain-text diagram.

## JSX export

A second script parses the finished page with `DOMParser` and emits one component per figure:

- inline `style="…"` becomes a JSX style object (kebab keys camelCased),
- **each line is emitted as an explicit string literal** — `{"  ┌────┐"}`. JSX trims leading
  whitespace on text nodes that sit on their own source line, which would destroy the columns,
- props: `label`, `title`, `showHeader`, `fontSize`.

Because the exports are generated from the page, fix the page first and re-run the export. Never
patch a `.jsx` by hand.

## Checks before shipping

1. `pre.scrollWidth === pre.clientWidth` for every figure (no sideways scroll).
2. No two spans in one `<pre>` share a `y` (no merged rows).
3. `┌` count equals `└` count per figure — allowing for `└…┬…┘` used as a join connector.
4. No content row matches `/[^\s│─┬┴┌┐└┘╌╎▶◀▼▸]│/` (text touching a border).
5. No literal `{d:` / `{dd:` left in the rendered output.

## Pitfalls, in the order they were hit

| Symptom                                    | Cause                                              |
| ------------------------------------------ | -------------------------------------------------- |
| Markup visible as text on the page         | Template written HTML-escaped                      |
| Two diagram rows on one line; block scrolls | Newlines between sibling spans dropped             |
| Arrow stem 2 columns off its `┬`            | Hand-typed dash runs                               |
| Right border of a frame looks doubled      | Box glyphs from a fallback font                    |
| `{dd:` printed literally                   | Color regex matched one letter only                |
| Box with no bottom border                  | Emitted `box[0..3]` of a 5-row box                 |
| Text jammed against right border           | Content exactly filled the inner width             |

## Adding a figure

1. Add a block to the generator: pick inner widths and column origins, build boxes, place rows
   with `L`.
2. Run it — it splices the figure into the page by its `data-fig` id and reports the column
   count.
3. Run the five checks above.
4. Re-run the JSX export.

One idea per figure. If a figure needs two accent colors and more than about sixteen rows, it is
two figures.
