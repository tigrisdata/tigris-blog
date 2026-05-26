import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface ZoomableDiagramProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

export default function ZoomableDiagram({
  children,
  ariaLabel = "Diagram. Click to enlarge.",
}: ZoomableDiagramProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        className={styles.trigger}
      >
        {!open && children}
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className={styles.dialog}
        aria-label="Enlarged diagram"
      >
        {open && <div className={styles.content}>{children}</div>}
      </dialog>
    </>
  );
}
