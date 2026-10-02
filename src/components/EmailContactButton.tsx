import { useEffect, useRef, useState } from "react";

const emailAddress = "sarath231097@gmail.com";
const subject = "AI engineering opportunity";
const gmailUrl =
  "https://mail.google.com/mail/?" +
  new URLSearchParams({ view: "cm", fs: "1", to: emailAddress, su: subject });

export default function EmailContactButton() {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyStatus("Email address copied.");
    } catch {
      addressRef.current?.focus();
      addressRef.current?.select();
      setCopyStatus("Address selected. Copy it to use in your email.");
    }
  };

  return (
    <div
      className="e-email-contact"
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="e-button e-button-secondary e-email-attention"
        ref={buttonRef}
        aria-expanded={open}
        aria-controls="role-email-options"
        data-analytics-event="hero_contact_open"
        onClick={() => {
          setOpen(!open);
          setCopyStatus("");
        }}
      >
        Email me about a role
        <span aria-hidden="true">↗</span>
      </button>
      {open && (
        <div
          className="e-email-options"
          id="role-email-options"
          role="group"
          aria-label="Email options"
        >
          <p>Let’s talk about the role.</p>
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="contact_gmail_open"
          >
            Open Gmail <span aria-hidden="true">↗</span>
          </a>
          <input
            ref={addressRef}
            aria-label="Sarath’s email address"
            value={emailAddress}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            onClick={copyAddress}
            data-analytics-event="hero_email_copy_click"
          >
            {copyStatus === "Email address copied."
              ? "✓ Email copied"
              : "Copy email address"}
          </button>
          <span className="e-email-status" role="status">
            {copyStatus}
          </span>
        </div>
      )}
    </div>
  );
}
