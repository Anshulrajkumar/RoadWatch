import { useEffect, useRef } from "react";

const ComplaintSuccessModal = ({ open, onClose, onGoToDashboard }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(11, 26, 55, 0.55)",
        backdropFilter: "blur(4px)",
        animation: "rw-modal-fade-in 0.2s ease-out",
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 24px rgba(26, 26, 26, 0.08)",
          width: "100%",
          maxWidth: "420px",
          margin: "0 16px",
          overflow: "hidden",
          animation: "rw-modal-slide-up 0.25s ease-out",
        }}
      >
        {/* Header bar — same style as card headers in the app */}
        <div
          style={{
            background: "var(--navy)",
            padding: "12px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.8)",
              margin: 0,
            }}
          >
            Submission Confirmed
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 24px 24px" }}>
          {/* Success icon */}
          <div
            style={{
              width: 56,
              height: 56,
              margin: "0 auto 20px",
              background: "rgba(226, 135, 31, 0.1)",
              border: "2px solid var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.35rem",
              fontWeight: 600,
              color: "var(--ink)",
              textAlign: "center",
              margin: "0 0 12px",
            }}
          >
            Complaint Submitted Successfully
          </h2>

          <p
            style={{
              fontFamily: "'Source Sans 3', system-ui, sans-serif",
              fontSize: "0.875rem",
              color: "rgba(28, 27, 27, 0.7)",
              textAlign: "center",
              lineHeight: 1.6,
              margin: "0 0 28px",
            }}
          >
            Your complaint has been submitted successfully.
            <br />
            You can track progress and view status updates from your dashboard.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              id="success-modal-go-to-dashboard"
              onClick={onGoToDashboard}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "var(--navy)",
                color: "#fff",
                border: "none",
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--navy)")}
            >
              Go to Dashboard
            </button>

            <button
              type="button"
              id="success-modal-ok"
              onClick={onClose}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                color: "var(--navy)",
                border: "1px solid var(--navy)",
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--navy)";
                e.currentTarget.style.color = "var(--navy)";
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe animations injected inline */}
      <style>{`
        @keyframes rw-modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rw-modal-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ComplaintSuccessModal;
