// FIG 05 — CIMD: the client_id is a URL, and the server reads it
//
// Nothing gets registered. The auth server fetches the client's metadata
// document from the URL in client_id, checks it, and runs the login. There is
// no client_secret anywhere: the client proves itself with PKCE.
//
// Hand-written animated figure. var/oidc-server-diagrams.mjs does NOT
// generate this file; it only re-exports it from index.js and checks every
// frame of it.
//
// Per .claude/skills/ascii-diagrams: no hand-typed columns and no hand-typed
// dash runs. Every cell goes through put(), which places text at an absolute
// column and throws when two cells collide. Every arrow is computed from the
// two lifelines it joins.

import { AnimatedAsciiFigure } from "@site/src/components/AnimatedAsciiFigure";

// ------------------------------------------------------------------ geometry

const LANES = ["MCP client", "auth server", "tigris.dev"];
const FIRST = 8; // the first lifeline
const GAP = 30; // columns between two lifelines
const COL = LANES.map((_, i) => FIRST + i * GAP);
// ------------------------------------------------- sequence diagram builder

// A row is a Map from column to { ch, style }. A style is "" for plain
// structure, a color name, or a "#tag" for a segment that the steps control.
const TAG_COLOR = {};

function put(row, col, text, style) {
  for (let i = 0; i < text.length; i++) {
    const old = row.get(col + i);
    if (old && old.ch !== " ") {
      throw new Error(`CimdFlow: "${text}" collides at ${col + i}`);
    }
    row.set(col + i, { ch: text[i], style });
  }
}

function life(skip = []) {
  const row = new Map();
  COL.forEach((c, i) => skip.includes(i) || put(row, c, "│", "gray"));
  return row;
}

function header() {
  const rows = [new Map(), new Map(), new Map()];
  LANES.forEach((name, i) => {
    const w = name.length + 4;
    const at = COL[i] - Math.floor(w / 2) - 1;
    const left = COL[i] - at - 1;
    put(rows[0], at, "┌" + "─".repeat(w) + "┐", "gray");
    put(rows[1], at, "│", "gray");
    put(rows[1], at + 3, name, "base");
    put(rows[1], at + w + 1, "│", "gray");
    put(
      rows[2],
      at,
      "└" + "─".repeat(left) + "┬" + "─".repeat(w - left - 1) + "┘",
      "gray"
    );
  });
  return rows;
}

// One message is one row: the label rides inside the arrow.
function msg(tag, from, to, label, color) {
  TAG_COLOR[tag] = color;
  const row = life();
  const lo = Math.min(COL[from], COL[to]);
  const hi = Math.max(COL[from], COL[to]);
  const n = hi - lo - 1;
  const dashes = n - label.length - 5;
  if (dashes < 2) throw new Error(`CimdFlow: "${label}" is too long`);
  for (const c of COL) {
    if (c > lo && c < hi) throw new Error(`CimdFlow: "${label}" spans`);
  }
  const arrow =
    to > from
      ? "── " + label + " " + "─".repeat(dashes) + "▶"
      : "◀" + "─".repeat(dashes) + " " + label + " ──";
  put(row, lo + 1, arrow, tag);
  return row;
}

// A note sits beside one lifeline. It must not cross a neighbor's lifeline.
function note(tag, lane, text, color, side = "right") {
  TAG_COLOR[tag] = color;
  const row = life();
  const at = side === "right" ? COL[lane] + 2 : COL[lane] - 2 - text.length;
  for (const c of COL) {
    if (c >= at - 1 && c <= at + text.length) {
      if (c !== COL[lane]) throw new Error(`CimdFlow: "${text}" crosses`);
    }
  }
  put(row, at, text, tag);
  return row;
}

// Group runs of cells that share a style into segments.
function render(rows) {
  return rows.map((row) => {
    const end = Math.max(-1, ...row.keys()) + 1;
    const segs = [];
    let style = null;
    let buf = "";
    const flush = () => {
      if (!buf) return;
      if (style === "") segs.push(buf);
      else if (style.startsWith("#")) segs.push([style, buf, TAG_COLOR[style]]);
      else segs.push([style, buf]);
      buf = "";
    };
    for (let c = 0; c < end; c++) {
      const cell = row.get(c) || { ch: " ", style: "" };
      const s = cell.ch === " " ? "" : cell.style;
      if (s !== style) {
        flush();
        style = s;
      }
      buf += cell.ch;
    }
    flush();
    return segs;
  });
}

// --------------------------------------------------------------------- lines

const CLIENT = 0;
const AS = 1;
const SITE = 2;

const LINES = render([
  ...header(),
  life(),
  msg("#authorize", CLIENT, AS, "client_id = a URL", "cyan"),
  msg("#fetch", AS, SITE, "GET metadata.json", "cyan"),
  msg("#doc", SITE, AS, "{ client_id, … }", "cyan"),
  note("#idOk", AS, "client_id == URL ✓", "green"),
  note("#redirectOk", AS, "redirect_uri listed ✓", "green"),
  life(),
  note("#login", AS, "user logs in", "gray"),
  msg("#callback", AS, CLIENT, "302 callback?code=…", "base"),
  msg("#token", CLIENT, AS, "POST /token, no secret", "base"),
  msg("#accessToken", AS, CLIENT, "access_token", "green"),
  life(),
]);

// --------------------------------------------------------------------- steps

// Every tag the figure declares, read back off the lines so the last frame
// cannot drift out of step with them.
const ALL = [
  ...new Set(
    LINES.flat()
      .filter((s) => Array.isArray(s) && s[0].startsWith("#"))
      .map((s) => s[0].slice(1))
  ),
];

const STEPS = [
  {
    show: ["authorize"],
    caption: "the client starts a login. its client_id is a URL it controls",
    ms: 2800,
  },
  {
    show: ["fetch", "doc"],
    caption: "the auth server fetches that URL to learn who the client is",
    ms: 2800,
  },
  {
    show: ["idOk", "redirectOk"],
    caption: "the document must name itself and list the redirect in use",
    ms: 3000,
  },
  {
    show: ["login", "callback", "token", "accessToken"],
    caption: "the rest is the usual handshake, with PKCE in place of a secret",
    ms: 3200,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    caption: "nothing was registered, so there is nothing to clean up",
    ms: 4000,
  },
];

const LABEL = "FIG 05";
const TITLE = "CIMD: the client_id is a URL, and the server reads it";

// 42rem is Tailwind's max-w-2xl; the site does not ship Tailwind, so the
// value is inlined. Auto side margins center the block in the column.
const WRAP_STYLE = { maxWidth: "42rem", margin: "0 auto" };

export default function CimdFlow({ label = LABEL, title = TITLE, fontSize }) {
  return (
    <div style={WRAP_STYLE}>
      <AnimatedAsciiFigure
        label={label}
        title={title}
        lines={LINES}
        steps={STEPS}
        fontSize={fontSize}
      />
    </div>
  );
}
