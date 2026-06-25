"use client";

import { useId, useRef, useState } from "react";
import { site } from "@/content/site";

/**
 * Contact form (TASK.md §5 /contact). Client-side validation, accessible
 * labels + error wiring, and a success/error state written in the interface's
 * own voice (no fake apology copy).
 *
 * TODO(endpoint): submit currently composes a mailto: to {site.email}. Replace
 * with a real endpoint (Resend / Formspree) — swap the body of `submit()`.
 */
type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "error" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const summaryRef = useRef<HTMLParagraphElement>(null);

  const validate = (v: typeof values): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = "Tell us who you are.";
    if (!v.email.trim()) e.email = "We need an email to reply to.";
    else if (!EMAIL_RE.test(v.email.trim()))
      e.email = "That email doesn't look right.";
    if (!v.message.trim()) e.message = "Add a line about what you're making.";
    return e;
  };

  const field = (k: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate(values);
    setErrors(e2);
    if (Object.keys(e2).length > 0) {
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // --- placeholder submit: compose a mailto: (see TODO above) ---
    const subject = encodeURIComponent(`New project — ${values.name}`);
    const body = encodeURIComponent(
      `${values.message}\n\n— ${values.name}\n${values.email}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("success");
    setValues({ name: "", email: "", message: "" });
  };

  const id = (k: string) => `${uid}-${k}`;
  const errId = (k: string) => `${uid}-${k}-err`;

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-rebel-red/40 flex flex-col items-start gap-4 border-l-2 py-6 pl-6"
      >
        <p className="font-display text-cream text-2xl italic">
          Got it. Your message is on its way.
        </p>
        <p className="font-body text-cream-dim text-sm">
          We read everything ourselves and reply in our own words — usually
          within a couple of days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-body text-rebel-red hover:text-cream cursor-pointer text-sm transition-colors"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6">
      {status === "error" && (
        <p
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="font-body text-rebel-red text-sm"
        >
          A couple of fields need a look before this can send.
        </p>
      )}

      <Field
        label="Name"
        id={id("name")}
        errId={errId("name")}
        error={errors.name}
      >
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={field("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? errId("name") : undefined}
          className="rmz-input"
        />
      </Field>

      <Field
        label="Email"
        id={id("email")}
        errId={errId("email")}
        error={errors.email}
      >
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={field("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? errId("email") : undefined}
          className="rmz-input"
        />
      </Field>

      <Field
        label="Message"
        id={id("message")}
        errId={errId("message")}
        error={errors.message}
      >
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          value={values.message}
          onChange={field("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? errId("message") : undefined}
          className="rmz-input resize-y"
        />
      </Field>

      <button
        type="submit"
        className="group border-cream/25 hover:border-rebel-red hover:text-rebel-red mt-2 flex w-fit cursor-pointer items-center gap-3 border px-6 py-3 transition-colors"
      >
        <span className="font-display text-lg italic">Send it</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}

function Field({
  label,
  id,
  errId,
  error,
  children,
}: {
  label: string;
  id: string;
  errId: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-body text-cream-dim text-xs uppercase tracking-[0.2em]"
      >
        {label}
      </label>
      {children}
      {error && (
        <span id={errId} className="font-body text-rebel-red text-xs">
          {error}
        </span>
      )}
    </div>
  );
}
