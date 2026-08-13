import React, { useState } from 'react';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const LINES = [
  "┌─ server / API plane ───────────────────┐   ┌─ worker deployment ──────────────────┐",
  "│ ┌────────────────────────┐             │   │ ┌─────────────┐       ┌──────────┐   │",
  "│ │ api gateway            │             │   │ │ scheduler 1 │──┬───▶│ worker 1 │   │",
  "│ └────────────┬───────────┘             │   │ └─────────────┘  │    └──────────┘   │",
  "│              │                         │   │                  │    ┌──────────┐   │",
  "│              ▼                         │   │                  └───▶│ worker 2 │   │",
  "│ ┌────────────────────────┐             │   │                       └──────────┘   │",
  "│ │ transaction layer      │             │   │                       ┌──────────┐   │",
  "│ └────────────┬───────────┘             │   │                       │ worker 3 │   │",
  "│              │                         │   │                       └──────────┘   │",
  "│              ▼                         │   │                                      │",
  "│ ┌────────────────────────┐             │   │ ┌─────────────┐       ┌──────────┐   │",
  "│ │ query processing       │             │   │ │ scheduler 2 │──┬───▶│ worker 4 │   │",
  "│ └────────────┬───────────┘             │   │ └─────────────┘  │    └──────────┘   │",
  "│         ┌────┴──────────┐              │   │                  │    ┌──────────┐   │",
  "│         ▼               ▼              │   │                  └───▶│ worker 5 │   │",
  "│ ┌──────────────┐ ┌─────────────┐       │   │                       └──────────┘   │",
  "│ │ metadata row │ │ queue item  │       │   │                       ┌──────────┐   │",
  "│ └───────┬──────┘ └──────┬──────┘       │   │                       │ worker 6 │   │",
  "│         └─────────────┬─┘              │   │                       └──────────┘   │",
  "│                       ▼                │   │                                      │",
  "│            ┌──────────┬─────────┐      │   │                                      │",
  "│            │ commit             │      │   │                                      │",
  "│            └──────────┬─────────┘      │   │                                      │",
  "│                       │                │   │                                      │",
  "└───────────────────────┬────────────────┘   └─────────┴────────────────────────────┘",
  "                        │                              ▲",
  "                        ▼                              │",
  "┌─ FOUNDATIONDB ────────┬──────────────────────────────┴─────────────────────────────┐",
  "│                ┌──────┬─────┐               ┌────────┴───────┐                     │",
  "│                │ data       │               │ queue          │                     │",
  "│                └────────────┘               └────────────────┘                     │",
  "└────────────────────────────────────────────────────────────────────────────────────┘",
  "",
  "// one transaction writes the metadata row and the queue item together"
];

export default function ControlPlaneWorkers({
  label = 'FIG 03',
  title = 'control plane, workers, shared FDB',
  showHeader = true,
  fontSize = 13,
  caption = 'The API plane never talks to workers directly. One transaction writes the metadata row and the queue item; schedulers lease work out of the same keyspace.',
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(LINES.join('\n')).then(done, done);
    else done();
  };
  return (
    <div data-fig="03" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: MONO, maxWidth: '52rem', marginLeft: 'auto', marginRight: 'auto' }}>
      {showHeader && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.16em', color: '#f59e0b' }}>{label}</span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>{title}</span>
          <span style={{ flex: 1 }} />
          <button
            onClick={copy}
            style={{
              fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#64748b', background: 'transparent', border: '1px solid #1e293b',
              borderRadius: 4, padding: '5px 10px', cursor: 'pointer',
            }}
          >
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      )}
      <pre
        style={{
          margin: 0, background: '#0f172a', border: '1px solid #16202f', borderRadius: 6,
          padding: 32, fontFamily: MONO, fontSize, lineHeight: 1.3,
          whiteSpace: 'pre', color: '#cbd5e1', overflow: 'hidden',
        }}
      >
        <div><span key={0} style={{ color: '#475569' }}>{"┌─"}</span><span key={1} style={{ color: '#64748b' }}>{" server / API plane "}</span><span key={2} style={{ color: '#475569' }}>{"───────────────────┐"}</span><span key={3}>{"   "}</span><span key={4} style={{ color: '#475569' }}>{"┌─"}</span><span key={5} style={{ color: '#64748b' }}>{" worker deployment "}</span><span key={6} style={{ color: '#475569' }}>{"──────────────────┐"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"┌────────────────────────┐"}</span><span key={3}>{"             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{" "}</span><span key={8} style={{ color: '#475569' }}>{"┌─────────────┐"}</span><span key={9}>{"       "}</span><span key={10} style={{ color: '#475569' }}>{"┌──────────┐"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{" api gateway            "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"             "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{" "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11} style={{ color: '#f87171' }}>{" scheduler 1 "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span><span key={13} style={{ color: '#60a5fa' }}>{"──"}</span><span key={14} style={{ color: '#475569' }}>{"┬"}</span><span key={15} style={{ color: '#60a5fa' }}>{"───▶"}</span><span key={16} style={{ color: '#475569' }}>{"│"}</span><span key={17}>{" worker 1 "}</span><span key={18} style={{ color: '#475569' }}>{"│"}</span><span key={19}>{"   "}</span><span key={20} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"└────────────┬───────────┘"}</span><span key={3}>{"             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{" "}</span><span key={8} style={{ color: '#475569' }}>{"└─────────────┘"}</span><span key={9}>{"  "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11}>{"    "}</span><span key={12} style={{ color: '#475569' }}>{"└──────────┘"}</span><span key={13}>{"   "}</span><span key={14} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"              "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{"                         "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                  "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"    "}</span><span key={10} style={{ color: '#475569' }}>{"┌──────────┐"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"              "}</span><span key={2} style={{ color: '#60a5fa' }}>{"▼"}</span><span key={3}>{"                         "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                  "}</span><span key={8} style={{ color: '#475569' }}>{"└"}</span><span key={9} style={{ color: '#60a5fa' }}>{"───▶"}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11}>{" worker 2 "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span><span key={13}>{"   "}</span><span key={14} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"┌────────────────────────┐"}</span><span key={3}>{"             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                       "}</span><span key={8} style={{ color: '#475569' }}>{"└──────────┘"}</span><span key={9}>{"   "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{" transaction layer      "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"             "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"                       "}</span><span key={10} style={{ color: '#475569' }}>{"┌──────────┐"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"└────────────┬───────────┘"}</span><span key={3}>{"             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                       "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9} style={{ color: '#64748b' }}>{" worker 3 "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"              "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{"                         "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                       "}</span><span key={8} style={{ color: '#475569' }}>{"└──────────┘"}</span><span key={9}>{"   "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"              "}</span><span key={2} style={{ color: '#60a5fa' }}>{"▼"}</span><span key={3}>{"                         "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                                      "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"┌────────────────────────┐"}</span><span key={3}>{"             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{" "}</span><span key={8} style={{ color: '#475569' }}>{"┌─────────────┐"}</span><span key={9}>{"       "}</span><span key={10} style={{ color: '#475569' }}>{"┌──────────┐"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{" query processing       "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"             "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{" "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11} style={{ color: '#60a5fa' }}>{" scheduler 2 "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span><span key={13} style={{ color: '#60a5fa' }}>{"──"}</span><span key={14} style={{ color: '#475569' }}>{"┬"}</span><span key={15} style={{ color: '#60a5fa' }}>{"───▶"}</span><span key={16} style={{ color: '#475569' }}>{"│"}</span><span key={17}>{" worker 4 "}</span><span key={18} style={{ color: '#475569' }}>{"│"}</span><span key={19}>{"   "}</span><span key={20} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"└────────────┬───────────┘"}</span><span key={3}>{"             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{" "}</span><span key={8} style={{ color: '#475569' }}>{"└─────────────┘"}</span><span key={9}>{"  "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11}>{"    "}</span><span key={12} style={{ color: '#475569' }}>{"└──────────┘"}</span><span key={13}>{"   "}</span><span key={14} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"         "}</span><span key={2} style={{ color: '#475569' }}>{"┌────┴──────────┐"}</span><span key={3}>{"              "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                  "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"    "}</span><span key={10} style={{ color: '#475569' }}>{"┌──────────┐"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"         "}</span><span key={2} style={{ color: '#60a5fa' }}>{"▼"}</span><span key={3}>{"               "}</span><span key={4} style={{ color: '#60a5fa' }}>{"▼"}</span><span key={5}>{"              "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"                  "}</span><span key={10} style={{ color: '#475569' }}>{"└"}</span><span key={11} style={{ color: '#60a5fa' }}>{"───▶"}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span><span key={13}>{" worker 5 "}</span><span key={14} style={{ color: '#475569' }}>{"│"}</span><span key={15}>{"   "}</span><span key={16} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"┌──────────────┐"}</span><span key={3}>{" "}</span><span key={4} style={{ color: '#475569' }}>{"┌─────────────┐"}</span><span key={5}>{"       "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"                       "}</span><span key={10} style={{ color: '#475569' }}>{"└──────────┘"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3} style={{ color: '#4ade80' }}>{" metadata row "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{" "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7} style={{ color: '#f87171' }}>{" queue item  "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"       "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11}>{"   "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span><span key={13}>{"                       "}</span><span key={14} style={{ color: '#475569' }}>{"┌──────────┐"}</span><span key={15}>{"   "}</span><span key={16} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{" "}</span><span key={2} style={{ color: '#475569' }}>{"└───────┬──────┘"}</span><span key={3}>{" "}</span><span key={4} style={{ color: '#475569' }}>{"└──────┬──────┘"}</span><span key={5}>{"       "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"                       "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span><span key={11} style={{ color: '#64748b' }}>{" worker 6 "}</span><span key={12} style={{ color: '#475569' }}>{"│"}</span><span key={13}>{"   "}</span><span key={14} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"         "}</span><span key={2} style={{ color: '#475569' }}>{"└─────────────┬─┘"}</span><span key={3}>{"              "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                       "}</span><span key={8} style={{ color: '#475569' }}>{"└──────────┘"}</span><span key={9}>{"   "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"                       "}</span><span key={2} style={{ color: '#60a5fa' }}>{"▼"}</span><span key={3}>{"                "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                                      "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"            "}</span><span key={2} style={{ color: '#475569' }}>{"┌──────────┬─────────┐"}</span><span key={3}>{"      "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                                      "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"            "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{" commit             "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"      "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"   "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"                                      "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"            "}</span><span key={2} style={{ color: '#475569' }}>{"└──────────┬─────────┘"}</span><span key={3}>{"      "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                                      "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"                       "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3}>{"                "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"   "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7}>{"                                      "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"└───────────────────────┬────────────────┘"}</span><span key={1}>{"   "}</span><span key={2} style={{ color: '#475569' }}>{"└─────────┴────────────────────────────┘"}</span></div>
        <div><span key={0}>{"                        "}</span><span key={1} style={{ color: '#475569' }}>{"│"}</span><span key={2}>{"                              "}</span><span key={3} style={{ color: '#f87171' }}>{"▲"}</span></div>
        <div><span key={0}>{"                        "}</span><span key={1} style={{ color: '#60a5fa' }}>{"▼"}</span><span key={2}>{"                              "}</span><span key={3} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"┌─"}</span><span key={1} style={{ color: '#64748b' }}>{" FOUNDATIONDB "}</span><span key={2} style={{ color: '#475569' }}>{"────────┬──────────────────────────────┴─────────────────────────────┐"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"                "}</span><span key={2} style={{ color: '#475569' }}>{"┌──────┬─────┐"}</span><span key={3}>{"               "}</span><span key={4} style={{ color: '#475569' }}>{"┌────────┴───────┐"}</span><span key={5}>{"                     "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"                "}</span><span key={2} style={{ color: '#475569' }}>{"│"}</span><span key={3} style={{ color: '#64748b' }}>{" data       "}</span><span key={4} style={{ color: '#475569' }}>{"│"}</span><span key={5}>{"               "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span><span key={7} style={{ color: '#f87171' }}>{" queue          "}</span><span key={8} style={{ color: '#475569' }}>{"│"}</span><span key={9}>{"                     "}</span><span key={10} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"│"}</span><span key={1}>{"                "}</span><span key={2} style={{ color: '#475569' }}>{"└────────────┘"}</span><span key={3}>{"               "}</span><span key={4} style={{ color: '#475569' }}>{"└────────────────┘"}</span><span key={5}>{"                     "}</span><span key={6} style={{ color: '#475569' }}>{"│"}</span></div>
        <div><span key={0} style={{ color: '#475569' }}>{"└────────────────────────────────────────────────────────────────────────────────────┘"}</span></div>
        <div style={{ height: '1.3em' }} />
        <div><span key={0} style={{ color: '#64748b' }}>{"// one transaction writes the metadata row and the queue item together"}</span></div>
      </pre>
      {caption && (
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, textWrap: 'pretty', marginBottom: '1rem' }}>
          {caption}
        </div>
      )}
    </div>
  );
}
