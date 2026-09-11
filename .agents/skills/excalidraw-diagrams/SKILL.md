---
name: excalidraw-diagrams
description:
  Guidelines for creating clean, readable Excalidraw diagrams embedded as inline
  SVG via JSON data files. Use when creating architecture diagrams, flow
  diagrams, or any visual documentation.
metadata:
  trigger: Creating Excalidraw diagrams, architecture visuals, flow diagrams
---

# Excalidraw Diagram Guidelines

These rules produce clean, readable, customer-facing diagrams embedded as inline
SVG in the Tigris docs site.

## CRITICAL — Read Before Writing Any Diagram

> **NEVER use `label` properties on shapes.** This is the #1 source of broken
> diagrams. The `label` property causes text to overflow and clip outside boxes.
> Always create a **separate `text` element** positioned inside the shape. See
> the example below.

## Setup — Do This First

The renderer needs two files in `src/components/diagrams/`:

- `ExcalidrawDiagram.tsx` — the React component that draws the inline SVG
- `virgilFont.ts` — the embedded Virgil font data

Both files are in the `resources/` directory of this skill. If one of these
files is not in `src/components/diagrams/`, copy it from `resources/` before you
write a diagram:

```bash
mkdir -p src/components/diagrams
cp .claude/skills/excalidraw-diagrams/resources/ExcalidrawDiagram.tsx src/components/diagrams/
cp .claude/skills/excalidraw-diagrams/resources/virgilFont.ts src/components/diagrams/
```

Do not overwrite a file that is already there. The version in the repository can
have local changes.

### Frame styles

The `.mermaid-frame` wrapper needs these styles. If `src/css/custom.css` does not
contain a `.mermaid-frame` rule, add this block:

```css
/* Excalidraw diagram frame (see .claude/skills/excalidraw-diagrams) */
.markdown .mermaid-frame {
  padding: 0;
  margin: 1.5rem auto;
  max-width: 48rem;
  text-align: center;
}

.markdown .mermaid-frame svg {
  margin: 0 auto;
  display: inline-block;
  max-height: 460px;
}
```

These rules center the diagram and hold it to a readable width. Without them, a
wide diagram fills the column and the text becomes too small to read.

## Embedding Pattern

Diagrams are embedded as React components that render inline SVG. Each diagram
has three parts:

1. **JSON data file** in `src/components/diagrams/data/<name>.json` — an array
   of Excalidraw-style element objects
2. **Wrapper component** in `src/components/diagrams/<Name>Diagram.tsx` — thin
   wrapper that imports the JSON and passes it to `ExcalidrawDiagram`
3. **MDX import** in the doc page — imports the wrapper and renders it inside a
   `<div className="mermaid-frame">`

### Wrapper component template

```tsx
import React from "react";
import ExcalidrawDiagram from "./ExcalidrawDiagram";
import elements from "./data/<name>.json";

export default function <Name>Diagram() {
  return <ExcalidrawDiagram elements={elements} />;
}
```

### MDX usage

Add a mermaid-syntax HTML comment above the diagram for agent readability, then
render the component:

```mdx
{/_ <!-- Mermaid UML description for AI agents:
graph LR
  A[Component] --> B[Component] --> _/}

<div className="mermaid-frame">
  <NameDiagram />
</div>
```

## JSON Data Format — Correct Example

This shows the RIGHT way to put text inside a box — as a separate `text`
element, not a `label`:

```json
[
  {
    "type": "rectangle",
    "id": "mybox",
    "x": 50,
    "y": 100,
    "width": 200,
    "height": 55,
    "backgroundColor": "#142229",
    "fillStyle": "solid",
    "roundness": { "type": 3 },
    "strokeColor": "#2a4050",
    "strokeWidth": 2
  },
  {
    "type": "text",
    "id": "myboxlbl",
    "x": 75,
    "y": 113,
    "text": "My Label",
    "fontSize": 16,
    "fontFamily": 1,
    "strokeColor": "#c8d6de"
  }
]
```

**Key points:**

- The rectangle has NO `label` property
- The text element is positioned ~25px inward from the box edges
- `fontFamily: 1` is set on every text element (Virgil hand-drawn font)
- Text `x`/`y` places the top-left of the first line of text

### Multi-line text

Use `\n` in the `text` field. The renderer splits on newlines and renders
`<tspan>` elements. Account for ~1.3× fontSize vertical spacing per line.

## Font

- **Always set `fontFamily: 1`** on every text element. This is Excalidraw's
  hand-drawn font (Virgil). Without it, text renders in a mismatched default.

## Text Sizing

- The Virgil font renders **significantly wider** than you'd expect from the
  pixel coordinates. Always overestimate the space text needs by ~40%.
- Make boxes wide enough to hold the text with **at least 25px padding** from
  all edges.

## Spacing Between Elements

- **Minimum 160px horizontal gap** between connected boxes. This gives arrow
  labels room to breathe.
- **Minimum 125px vertical gap** between connected boxes.
- Arrow labels must be placed **at least 25px away from the arrow line** — above
  for forward arrows, below for return arrows.
- **Never place a text label between two parallel arrows.** Put labels on the
  outer sides (above the top arrow, below the bottom arrow).

## Arrow Labels

- Place labels as **separate `text` elements** above or below arrows, never
  overlapping them. Do NOT use `label` on arrows either.
- For bidirectional flows (request → / ← response), stagger the arrows
  vertically with ~50px gap and put labels on opposite sides.

## Zone Labels

- Place zone labels (for dashed-border grouping boxes) in the **upper-left
  corner** of the zone, ~15px inward from the top-left edges.
- Use a smaller font size (14–16px) and secondary text color.

## Box Internal Padding

- Text inside boxes should have **at least 25px padding** from all edges.
- For multi-line box content (title + subtitle), leave **30px between lines**.

## Styling

- The `ExcalidrawDiagram` component provides its own dark background (`#0e1920`)
  and border-radius. Do NOT add borders to the SVG or to the `.mermaid-frame`
  wrapper — the diagram is self-contained.
- Do NOT add borders, background colors, or border-radius via inline styles on
  the SVG element.

## Color Scheme (Tigris Dark Theme)

Use this palette to match the Tigris brand:

```
Background:        #0e1920 (SVG bg, set by component)
Node fill:         #142229 (boxes, containers)
Zone backgrounds:  #142229 at opacity 40 (dashed grouping zones)
Borders:           #1e3340 (zones), #2a4050 (node borders)
Primary text:      #c8d6de
Secondary text:    #8fa3b0
Primary accent:    #62FEB5 (Tigris green — highlights, key elements)
Dark on accent:    #0A171E (text on green backgrounds)

Additional accent colors:
  Steel blue:  #5BA4CF (secondary flows, metadata, gRPC, gossip)
  Sandstone:   #CF8E5B (warnings, cache miss)
  Muted coral: #CF5B5B (errors)

Do NOT use saturated purple (#8b5cf6), bright amber (#f59e0b), or
bright red (#ef4444) — they clash with the cool-toned palette.
```

## Layout Pattern

- Use **dashed stroke zones** to group related components (e.g., "Your
  Infrastructure" vs "Tigris Cloud")
- Use **numbered step badges** (filled circles with numbers) to guide reading
  order
- Include a **Legend box** with sample arrows explaining line styles (solid =
  request, dashed = response, colored = upstream fetch)
- Add an **explanatory callout box** (dashed border) for key performance facts

## Verification

After creating or modifying a diagram, run the dev server (`npm start`) and
visually check the page in the browser. Look for:

1. Text clipping or cutoff at box edges
2. Arrow lines crossing over text labels
3. Sufficient contrast (text readable against backgrounds)
4. All elements visible and nothing overlapping
5. Multi-line text rendering correctly (not as a single line)

## Common Mistakes to Avoid

These are listed in order of severity. Every one of these has caused a broken
diagram in the past:

1. **Do not use `label` property on ANY element** — text clips and overflows.
   Always use separate `text` elements. This applies to rectangles, diamonds,
   ellipses, AND arrows.
2. **Do not forget `fontFamily: 1`** — causes wrong font rendering on every text
   element.
3. **Do not make boxes too narrow** — Virgil font is ~40% wider than you expect.
   A 6-character label needs a box at least 150px wide.
4. **Do not place zone labels at the bottom** — convention is upper-left corner.
5. **Do not add borders to the SVG or wrapper** — the component handles styling.
6. **Do not place text between two parallel arrows** — always gets obscured.
7. **Do not use gaps under 120px between connected elements** — labels collide.
8. **Do not change colors when asked to fix spacing** — always preserve the
   approved palette.
