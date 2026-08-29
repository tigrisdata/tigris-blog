import React from "react";

/**
 * Two beats, 8s loop, narrated by one changing line:
 *   ① a write lands: the life bar snaps to 15 minutes
 *   ② more writes bounce off, the entry is already dying
 */

const subtext = "var(--tigris-diagram-subtext, #94a3b8)";

const phaseStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 26,
  textAlign: "center",
  fontSize: 11.5,
  color: subtext,
  opacity: 0,
};

export default function CooldownDiagram(): JSX.Element {
  return (
    <div
      role="img"
      aria-label="A cached size entry has a life bar of about four days. A write lands and the bar snaps to fifteen minutes. More writes bounce off, ignored, because the entry is already dying."
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        height: 175,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes cdn-loop {
          0% { opacity: 0; }
          3%, 92% { opacity: 1; }
          98%, 100% { opacity: 0; }
        }
        @keyframes cdn-bar {
          0%, 18% { width: 322px; }
          26% { width: 84px; }
          100% { width: 56px; }
        }
        @keyframes cdn-write {
          0%, 8% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          18% { offset-distance: 100%; opacity: 1; }
          19%, 100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes cdn-ring {
          0%, 18% { transform: scale(0.2); opacity: 0; }
          21% { transform: scale(1); opacity: 0.8; }
          28%, 100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes cdn-bounce {
          0% { offset-distance: 0%; opacity: 0; }
          3% { opacity: 1; }
          8% { offset-distance: 55%; opacity: 1; }
          12% { offset-distance: 100%; opacity: 0; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes cdn-t1 { 0%,18% {opacity:1} 23%,100% {opacity:0} }
        @keyframes cdn-t2 { 0%,20% {opacity:0} 26%,100% {opacity:1} }
        @keyframes cdn-wlabel { 0%,6% {opacity:0} 9%,20% {opacity:1} 24%,100% {opacity:0} }
        @keyframes cdn-p1 { 0%,8% {opacity:0} 12%,44% {opacity:1} 48%,100% {opacity:0} }
        @keyframes cdn-p2 { 0%,50% {opacity:0} 54%,88% {opacity:1} 92%,100% {opacity:0} }
      `}</style>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          textAlign: "center",
          fontSize: 16,
          fontWeight: 600,
          color: "#62feb5",
        }}
      >
        What a write does to a cached size
      </div>
      <div style={{ animation: "cdn-loop 8s linear infinite" }}>
        {/* the two narrating lines */}
        <div
          style={{
            ...phaseStyle,
            color: "#62feb5",
            animation: "cdn-p1 8s linear infinite",
          }}
        >
          ① a write lands: 15 minutes to live
        </div>
        <div style={{ ...phaseStyle, animation: "cdn-p2 8s linear infinite" }}>
          ② more writes change nothing, the entry is already dying
        </div>

        {/* the entry */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 70,
            width: 360,
            height: 84,
            borderRadius: 12,
            background: "var(--tigris-diagram-node-bg, #13221e)",
            border: "1px solid rgba(98, 254, 181, 0.4)",
            color: "var(--tigris-diagram-text, #bac1be)",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div>cached size · 840 GB</div>
            <div style={{ position: "relative", height: 16, marginTop: 2 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  fontSize: 11.5,
                  color: "var(--tigris-diagram-subtext, #94a3b8)",
                  animation: "cdn-t1 8s linear infinite",
                }}
              >
                expires in 4 days
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  fontSize: 11.5,
                  color: "#62feb5",
                  opacity: 0,
                  animation: "cdn-t2 8s linear infinite",
                }}
              >
                expires in 15 minutes
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 19,
              bottom: 10,
              height: 6,
              borderRadius: 3,
              background: "#62feb5",
              animation: "cdn-bar 8s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 19,
              bottom: 26,
              fontSize: 9,
              color: "var(--tigris-diagram-subtext, #94a3b8)",
            }}
          >
            time left
          </div>
        </div>

        {/* impact ring */}
        <div
          style={{
            position: "absolute",
            left: 196,
            top: 58,
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "2px solid #62feb5",
            opacity: 0,
            animation: "cdn-ring 8s ease-out infinite",
          }}
        />

        {/* the write that shortens */}
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 28,
            fontSize: 11.5,
            color: "#62feb5",
            opacity: 0,
            animation: "cdn-wlabel 8s linear infinite",
          }}
        >
          write
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#62feb5",
            offsetPath: 'path("M 44 46 C 100 44, 160 50, 206 68")',
            offsetRotate: "0deg",
            animation: "cdn-write 8s ease-in infinite",
          }}
        />

        {/* later writes bounce off */}
        {[4.4, 5.2, 6.0].map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: subtext,
              opacity: 0,
              offsetPath: `path("M ${90 + i * 40} 42 C ${150 + i * 34} 46, ${
                210 + i * 26
              } 54, ${252 + i * 28} 68 C ${266 + i * 28} 54, ${
                276 + i * 28
              } 46, ${284 + i * 28} 40")`,
              offsetRotate: "0deg",
              animation: "cdn-bounce 8s ease-in-out infinite",
              animationDelay: `${d}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
