"use client";

import { useState } from "react";

type Fields = {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  organization: "",
  subject: "",
  message: "",
};

const SUBJECTS = [
  "General enquiry",
  "Fundraising strategy",
  "Major gifts",
  "Foundation capacity building",
  "Board development",
  "Coaching",
  "Workshop or retreat",
  "Speaking request",
];

/**
 * Mockup form — validates properly, then shows the success state without
 * sending anything. The real build posts to a route handler that emails Andrea
 * and stores the enquiry.
 */
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof Fields) => (v: string) =>
    setFields((f) => ({ ...f, [key]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = "Please tell us your name.";
    if (!fields.email.trim()) next.email = "We need an email to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = "That email doesn't look right.";
    if (!fields.message.trim()) next.message = "Let us know what you need.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 650);
  };

  if (sent) {
    return (
      <div className="relative border border-paper/15 p-10 md:p-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2.5 -top-2.5 h-10 w-10 border-r-2 border-t-2 border-brass-400"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-10 w-10 border-b-2 border-l-2 border-brass-400"
        />
        <p className="label text-brass-400">Message sent</p>
        <h2 className="mt-6 text-3xl text-paper md:text-4xl">Thank you.</h2>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-paper/65">
          Andrea reads every message herself and usually replies within two
          business days. If it is time-sensitive, booking a discovery call is
          faster.
        </p>
        <button
          type="button"
          onClick={() => {
            setFields(EMPTY);
            setSent(false);
          }}
          className="mt-8 text-sm text-brass-300 underline underline-offset-4 transition-colors hover:text-brass-200"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
      <Field
        label="Full name"
        required
        value={fields.name}
        error={errors.name}
        onChange={set("name")}
        autoComplete="name"
      />
      <Field
        label="Email"
        type="email"
        required
        value={fields.email}
        error={errors.email}
        onChange={set("email")}
        autoComplete="email"
      />
      <Field
        label="Organization"
        value={fields.organization}
        onChange={set("organization")}
        autoComplete="organization"
      />

      <div>
        <label htmlFor="c-subject" className="mb-2.5 block label text-paper/65">
          What is this about?
        </label>
        <select
          id="c-subject"
          value={fields.subject}
          onChange={(e) => set("subject")(e.target.value)}
          className="w-full border border-paper/20 bg-olive-950 px-4 py-3.5 text-[0.95rem] text-paper transition-colors focus:border-brass-400 focus:outline-none"
        >
          <option value="">Choose one…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="Message"
        required
        multiline
        value={fields.message}
        error={errors.message}
        onChange={set("message")}
        className="sm:col-span-2"
      />

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="group inline-flex w-full items-center justify-center gap-3 bg-brass-400 px-8 py-4 label text-olive-950 transition-colors duration-300 hover:bg-brass-300 disabled:opacity-60 sm:w-auto"
        >
          {busy ? "Sending…" : "Send Message"}
          {!busy && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
  error,
  className = "",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  error?: string;
  className?: string;
  autoComplete?: string;
}) {
  const id = `c-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const base =
    "w-full border bg-transparent px-4 py-3.5 text-[0.95rem] text-paper placeholder:text-paper/25 transition-colors duration-200 focus:outline-none";
  const tone = error
    ? "border-red-400/70 focus:border-red-400"
    : "border-paper/20 focus:border-brass-400";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 flex items-baseline gap-2">
        <span className="label text-paper/65">{label}</span>
        {required && <span className="text-brass-400">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`${base} ${tone} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`${base} ${tone}`}
        />
      )}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
