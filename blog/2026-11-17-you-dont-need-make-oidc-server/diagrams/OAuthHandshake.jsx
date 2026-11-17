// FIG 01 — the OAuth 2 handshake, and the part it leaves to every provider
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

const LANES = ["your app", "provider"];
const FIRST = 8; // the first lifeline
const GAP = 44; // columns between two lifelines
const COL = LANES.map((_, i) => FIRST + i * GAP);

// ------------------------------------------------- sequence diagram builder

// A row is a Map from column to { ch, style }. A style is "" for plain
// structure, a color name, or a "#tag" for a segment that the steps control.
const TAG_COLOR = {};

function put(row, col, text, style) {
  for (let i = 0; i < text.length; i++) {
    const old = row.get(col + i);
    if (old && old.ch !== " ") {
      throw new Error(`OAuthHandshake: "${text}" collides at ${col + i}`);
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
  if (dashes < 2) throw new Error(`OAuthHandshake: "${label}" is too long`);
  for (const c of COL) {
    if (c > lo && c < hi) throw new Error(`OAuthHandshake: "${label}" spans`);
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
      if (c !== COL[lane]) throw new Error(`OAuthHandshake: "${text}" crosses`);
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

const APP = 0;
const IDP = 1;

const LINES = render([
  ...header(),
  life(),
  msg("#authorize", APP, IDP, "302 /authorize?client_id=…", "cyan"),
  note("#login", IDP, "user logs in, says yes", "gray"),
  msg("#callback", IDP, APP, "302 /callback?code=…", "cyan"),
  msg("#token", APP, IDP, "POST /token  code + client_secret", "cyan"),
  msg("#accessToken", IDP, APP, "access_token", "cyan"),
  life(),
  msg("#userinfo", APP, IDP, "GET /user? /me? /v2/people?", "red"),
  msg("#userinfoReply", IDP, APP, "{ id? sub? login? }", "red"),
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
    caption: "your app sends the user to the provider with its client_id",
    ms: 2600,
  },
  {
    show: ["login"],
    caption: "the user logs in on the provider's page and says yes",
    ms: 2200,
  },
  {
    show: ["callback"],
    caption: "the provider sends the user back with a one-time code",
    ms: 2600,
  },
  {
    show: ["token", "accessToken"],
    caption: "your app trades the code and its client_secret for a token",
    ms: 3000,
  },
  {
    show: ["userinfo", "userinfoReply"],
    caption: "now: who is this user? every provider has its own answer",
    ms: 3200,
  },
  // The figure as a still, which is where it stops.
  {
    show: ALL,
    focus: ALL,
    caption:
      "OAuth 2 makes the token standard. it does not say who the user is",
    ms: 4000,
  },
];

const LABEL = "FIG 01";
const TITLE = "the OAuth 2 handshake, and the part it leaves to every provider";

// 42rem is Tailwind's max-w-2xl; the site does not ship Tailwind, so the
// value is inlined. Auto side margins center the block in the column.
const WRAP_STYLE = { maxWidth: "42rem", margin: "0 auto" };

export default function OAuthHandshake({
  label = LABEL,
  title = TITLE,
  fontSize,
}) {
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
