// Library for generating ASCII sequence diagrams as AsciiFigure LINES arrays.
//
// Used to author the ascii-art diagram components under blog/*/diagrams/.
// Import it from a one-off script, describe the figure, print the plain-text
// render to eyeball it, then paste the emitted LINES literal into a JSX
// component that renders <AsciiFigure /> (see
// src/components/AsciiFigure/index.jsx and, for examples,
// blog/2026-09-01-conflict-resolution-is-fun/diagrams/).
//
// Example:
//   import { makeFigure, toPlain, toJs } from "./scripts/ascii-seqgen.mjs";
//   const f = makeFigure({ cols: [4, 28, 52], noteCol: 56 });
//   f.header(["client", "server", "worker"]);
//   f.msg(0, 1, "PUT object", { notes: ["stored durably"] });
//   f.msg(1, 0, "200 OK", { dashed: true, labelColor: "green" });
//   f.sep(["time passes"]);
//   console.log(toPlain(f.render())); // preview
//   console.log(toJs(f.render())); // paste into the component
//
// Conventions: solid ├──▶ arrows for requests, dashed ◀─ ─ ┤ for replies,
// ┼ where an arrow crosses a lifeline, gray notes in a column right of the
// lifelines, and a · row for time skips. Color keys: green, red, gray.

const DEFAULT = "";

export function makeFigure({ cols, noteCol }) {
  const rows = []; // each row: array of [char, colorKey]

  function newRow(glyph = "│") {
    const row = [];
    const width = cols[cols.length - 1] + 1;
    for (let c = 0; c < width; c++) row.push([" ", DEFAULT]);
    for (const col of cols) row[col] = [glyph, DEFAULT];
    return row;
  }

  function overlay(row, col, text, color = DEFAULT) {
    for (let k = 0; k < text.length; k++) {
      while (row.length <= col + k) row.push([" ", DEFAULT]);
      row[col + k] = [text[k], color];
    }
  }

  function header(labels) {
    const row = [];
    for (let i = 0; i < labels.length; i++) {
      const start = Math.max(0, cols[i] - Math.floor(labels[i].length / 2));
      overlay(row, start, labels[i]);
    }
    rows.push(row);
    rows.push(newRow());
  }

  function note(lines, color = "gray") {
    for (const text of lines) {
      const row = newRow();
      overlay(row, noteCol, text, color);
      rows.push(row);
    }
  }

  function gap() {
    rows.push(newRow());
  }

  function msg(i, j, label, opts = {}) {
    const ci = cols[i],
      cj = cols[j];
    // label row
    const lrow = newRow();
    overlay(lrow, Math.min(ci, cj) + 2, label, opts.labelColor ?? DEFAULT);
    rows.push(lrow);
    // arrow row
    const arow = newRow();
    const left = Math.min(ci, cj);
    const right = Math.max(ci, cj);
    if (!opts.dashed) {
      // solid, left-to-right
      arow[left] = ["├", DEFAULT];
      for (let c = left + 1; c < right; c++)
        arow[c] = [cols.includes(c) ? "┼" : "─", DEFAULT];
      arow[right - 1] = ["▶", DEFAULT];
    } else {
      // dashed return, right-to-left (from right back to left)
      arow[left + 1] = ["◀", DEFAULT];
      for (let c = left + 2; c < right; c++) {
        if (cols.includes(c)) arow[c] = ["┼", DEFAULT];
        else arow[c] = [(c - left) % 2 === 0 ? "─" : " ", DEFAULT];
      }
      arow[right] = ["┤", DEFAULT];
    }
    rows.push(arow);
    if (opts.notes) note(opts.notes, opts.noteColor);
  }

  function sep(lines = []) {
    rows.push(newRow("·"));
    if (lines.length) note(lines);
    else gap();
  }

  function render() {
    return rows.map((row) => {
      // trim trailing spaces
      let end = row.length;
      while (end > 0 && row[end - 1][0] === " ") end--;
      const segs = [];
      for (let c = 0; c < end; c++) {
        const [ch, color] = row[c];
        const last = segs[segs.length - 1];
        if (last && last.color === color) last.text += ch;
        else segs.push({ text: ch, color });
      }
      return segs.map((s) =>
        s.color === DEFAULT ? s.text : [s.color, s.text]
      );
    });
  }

  return { header, msg, note, gap, sep, render };
}

export function toPlain(lines) {
  return lines
    .map((segs) => segs.map((s) => (typeof s === "string" ? s : s[1])).join(""))
    .join("\n");
}

export function toJs(lines) {
  return (
    "[\n" +
    lines
      .map(
        (segs) =>
          "  [" +
          segs
            .map((s) =>
              typeof s === "string"
                ? JSON.stringify(s)
                : `[${JSON.stringify(s[0])}, ${JSON.stringify(s[1])}]`
            )
            .join(", ") +
          "],"
      )
      .join("\n") +
    "\n]"
  );
}
