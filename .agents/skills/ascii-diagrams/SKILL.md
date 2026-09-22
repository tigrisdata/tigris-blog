---
name: ascii-diagrams
description: |
  Guidelines for creating ascii diagrams in the Tigris blog style, static and
  animated. Use for box-drawing figures in a dark code block, for the generator
  that builds them, and for step-by-step figures built on AnimatedAsciiFigure.
---

# Monospace ASCII diagrams

How the soft-delete figure set was built. Use this to add figures in the same style, or to
rebuild the set from scratch.

The style: box-drawing characters in a dark code block. No SVG, no images. A figure is plain
text plus color, so it can be copied into a post as text, diffed in git, and read in a terminal.

## Output

- `Soft Delete Diagrams.dc.html` — all figures on one page, each with a **copy** button.
- `diagrams/*.jsx` — one standalone React component per figure, generated from that page.
- `diagrams/index.js` — re-exports every component, generated and animated alike.

A later set (quick-fdb-kafka) drops the HTML page and has the generator write
the `.jsx` files directly. Its animated figures are hand-written next to the
generated ones. See **Animated figures** below.

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

## Animated figures

Some figures carry a sequence: a claim, a crash, a chain that builds itself. A
still picture of a sequence shows only its last frame, and the reader has to
reconstruct the order from labels. Animate those. Keep a figure static when it
states one fact.

Two static figures that share a timeline are one figure. The quick-fdb-kafka
set had "the job finishes" and "the worker dies instead" as two figures drawn
on the same axis. They became one figure with a branch at each tick.

That merge did not need steps. Both endings are true at the same time, so the
reader wants them side by side, and the steps only added clutter. Animate a
figure when the order is the content. Merge, and stay still, when the figure
holds alternatives.

An animated figure is **hand-written**. The generator does not produce it. The
generator's rule still holds: no hand-typed columns, no hand-typed dash runs.
Each animated file carries its own `L()` that pads to absolute columns and
throws when two cells collide.

```js
import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";
```

### Lines and segments

`lines` is an array of lines. A line is an array of segments. An empty array is
a blank line. A segment has one of three shapes:

| Shape                     | Meaning                                          |
| ------------------------- | ------------------------------------------------ |
| `"text"`                  | Structure. Always visible, never dim.            |
| `["green", "text"]`       | A static color. Always visible.                  |
| `["#id", "text", "green"]` | Tagged. The steps control it.                    |

A tag is a key that starts with `#`. The third item is the color the segment
takes when a step gives it focus. Without focus, the segment is dim. Before its
first step, the segment is invisible.

The color names are `green`, `red`, `gray`, `amber`, `cyan`, `violet` and
`base`. They are the same hues as the generator's tokens, plus three more.
Two accents is still the target. A third accent must mean a third kind of
thing, such as the work, the crash, and the time path.

Several segments can share one tag. They then appear together. Do not share a
tag between segments that need different replacement text.

### Steps

A step is an object:

| Key       | What it does                                                  |
| --------- | ------------------------------------------------------------- |
| `show`    | Tags that become visible. Visibility accumulates.             |
| `focus`   | Tags that light up. The rest go dim. Defaults to `show`.       |
| `text`    | Per-tag text replacements for this step.                      |
| `caption` | One line of text under the figure.                            |
| `ms`      | How long the step holds.                                      |

`text` is not cumulative. Each step repeats the full state that it wants.

Pass `cumulative={false}` for a figure whose steps are alternatives. Pass
`loop` with `rest` for a figure that cycles one item at a time. The `rest`
frame is what a paused figure shows, and it is the frame the server renders.

### The one invariant: nothing moves

A segment that is not visible yet keeps its columns at opacity 0. A replacement
is padded or cut to the width of the original text. As a result:

- the server-rendered HTML holds the complete figure, so a reader without
  JavaScript and a crawler both get all of it,
- hand-aligned columns cannot shift between steps.

Two consequences for how you draw:

- To move a thing, draw it in both places and blank the first copy. Blank it
  with `" "`, one space. An empty string is falsy, so the component keeps the
  original text.
- To change a glyph, give that glyph its own tag. A branch elbow can start as
  `"└─"` and become `"├─"` when the second branch appears. The words beside it
  do not move, because they are a different segment.

### Conventions in this set

- The last step shows and focuses everything. It is the figure as a still, and
  a figure that does not loop rests there. Read the tag list off the lines so
  the last frame cannot drift:

  ```js
  const ALL = [
    ...new Set(
      LINES.flat()
        .filter((s) => Array.isArray(s) && s[0].startsWith("#"))
        .map((s) => s[0].slice(1))
    ),
  ];
  ```

- Playback starts only when the whole figure is on screen. The component
  handles this. Do not lower the bar to a fraction of the figure: the first
  step is often the still that the figure animates away from.
- Captions are lowercase and they name what changed. The caption carries the
  sentence, so the figure does not have to.
- Keep a figure at about 16 rows. A step-by-step figure earns a few more rows
  than a static one, because the steps do the explaining.

### Checking an animated figure

Node cannot import the file, because of the JSX and the `@site` alias. Strip
the imports and the export, then evaluate the rest and render it:

```js
const body = src.replace(/^import .*$/gm, "").replace(/export default function[\s\S]*$/m, "");
const { LINES, STEPS } = new Function(`${body}; return { LINES, STEPS };`)();
```

Then join each line's segment text, apply each step's `text` map, and measure
the result. This gives the plain-text figure for every frame. Run the five
checks below on all of them, not only on the first.

## Checks before shipping

1. `pre.scrollWidth === pre.clientWidth` for every figure (no sideways scroll).
2. No two spans in one `<pre>` share a `y` (no merged rows).
3. `┌` count equals `└` count per figure — allowing for `└…┬…┘` used as a join connector.
4. No content row matches `/[^\s│─┬┴┌┐└┘╌╎▶◀▼▸]│/` (text touching a border).
5. No literal `{d:` / `{dd:` left in the rendered output.

A built page is a good place to run checks 1 and 4, because the figures are
server-rendered in full. Strip `\x00` from the HTML before you measure it. The
build puts stray NUL bytes inside long runs of `─`, in this post and in every
other one. They are invisible to the browser and they add one to any length
that you count yourself.

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
| A step's replacement text does nothing     | The replacement was `""`, which is falsy           |
| Two segments change when one should        | They share a tag                                   |
| A row is one column too wide when measured | A NUL byte from the build, inside a run of `─`     |

## Adding a figure

1. Add a block to the generator: pick inner widths and column origins, build boxes, place rows
   with `L`.
2. Run it — it splices the figure into the page by its `data-fig` id and reports the column
   count.
3. Run the five checks above.
4. Re-run the JSX export.

One idea per figure. If a figure needs two accent colors and more than about sixteen rows, it is
two figures.

## Adding an animated figure

1. Write the component by hand, next to the generated ones.
2. Give it its own `L()`. Make it throw on a column collision.
3. Build `LINES` first. Tag only what the steps change.
4. Write the steps. End with the frame that shows and focuses everything.
5. Render every frame to plain text and run the five checks on each one.
6. Remove the figure's block from the generator, if it replaces a static one.
7. Add the name to the generator's `ANIMATED` set and to its `ORDER` list.

The generator owns `index.js` for the whole set. If an animated name is missing
from `ORDER`, the export disappears. The `ORDER` check throws when a name is in
one list and not the other.
