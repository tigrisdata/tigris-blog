import React, { useEffect, useState } from "react";

interface ZoomableDiagramProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

export default function ZoomableDiagram({
  children,
  ariaLabel = "Diagram. Click to enlarge.",
}: ZoomableDiagramProps): JSX.Element {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        style={{
          display: "block",
          width: "100%",
          maxWidth: "42rem",
          margin: "1.5rem auto",
          padding: 0,
          background: "none",
          border: "none",
          cursor: "zoom-in",
        }}
      >
        {children}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged diagram"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "min(95vw, 1400px)",
              maxHeight: "90vh",
              overflow: "auto",
              cursor: "default",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}