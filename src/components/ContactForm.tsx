"use client";

import { useId, useRef, useState } from "react";

/**
 * Contact form (Redesigning Stage 4) — a 2-column "Book A Meeting" layout:
 *   Full Name (full width) · Email | Company · Phone | Country · Brief (full).
 * Full-width cream pill submit button.
 *
 * Required + validated: name, email, message (existing rules + CMS microcopy).
 * Company / phone / country are optional. Submit POSTs to the Payload REST
 * endpoint `/api/contact-submissions`, so each message is stored in the CMS.
 */
type FormConfig = {
  recipientEmail: string;
  submitLabel: string;
  sendingLabel: string;
  sendAnotherLabel: string;
  submitError: string;
  labels: {
    fullName: string;
    email: string;
    company: string;
    phone: string;
    country: string;
    countryPlaceholder: string;
    message: string;
  };
  countries: string[];
  successHeading: string;
  successBody: string;
  errorSummary: string;
  fieldErrors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
  };
};

type Values = {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  message: string;
};
type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "loading" | "error" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY: Values = {
  name: "",
  email: "",
  company: "",
  phone: "",
  country: "",
  message: "",
};

export default function ContactForm({ form }: { form: FormConfig }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  // true when the send itself failed (network/server) rather than validation
  const [sendFailed, setSendFailed] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  const validate = (v: Values): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = form.fieldErrors.nameRequired;
    if (!v.email.trim()) e.email = form.fieldErrors.emailRequired;
    else if (!EMAIL_RE.test(v.email.trim()))
      e.email = form.fieldErrors.emailInvalid;
    if (!v.message.trim()) e.message = form.fieldErrors.messageRequired;
    return e;
  };

  const field =
    (k: keyof Values) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((p) => ({ ...p, [k]: e.target.value }));
      if (k in errors && errors[k as keyof Errors])
        setErrors((p) => ({ ...p, [k]: undefined }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return; // guard against double-submit
    const e2 = validate(values);
    setErrors(e2);
    setSendFailed(false);
    if (Object.keys(e2).length > 0) {
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // Store the submission in Payload CMS (visible in the admin dashboard).
    setStatus("loading");
    try {
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          phone: values.phone,
          country: values.country,
          message: values.message,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      setValues(EMPTY);
    } catch (err) {
      console.error("Contact form error:", err);
      setSendFailed(true);
      setStatus("error");
    }
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
          {form.successHeading}
        </p>
        <p className="font-body text-cream-dim text-sm">{form.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-body text-rebel-red hover:text-cream cursor-pointer text-sm transition-colors"
        >
          {form.sendAnotherLabel}
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {status === "error" && (
        <p
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="font-body text-rebel-red text-sm md:col-span-2"
        >
          {sendFailed ? form.submitError : form.errorSummary}
        </p>
      )}

      <Field 
        label={form.labels.fullName}
        id={id("name")}
        errId={errId("name")}
        error={errors.name}
        className="md:col-span-2"
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
        label={form.labels.email}
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

      <Field label={form.labels.company} id={id("company")} errId={errId("company")}>
        <input
          id={id("company")}
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={field("company")}
          className="rmz-input"
        />
      </Field>

      <Field label={form.labels.phone} id={id("phone")} errId={errId("phone")}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={field("phone")}
          className="rmz-input"
        />
      </Field>

      <Field label={form.labels.country} id={id("country")} errId={errId("country")}>
        <select
          id={id("country")}
          name="country"
          value={values.country}
          onChange={field("country")}
          className="rmz-input"
        >
          <option value="">{form.labels.countryPlaceholder}</option>
          {form.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label={form.labels.message}
        id={id("message")}
        errId={errId("message")}
        error={errors.message}
        className="md:col-span-2"
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
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="font-body bg-cream text-ink mt-2 h-[64px] w-full cursor-pointer rounded-full text-base font-semibold uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-60 md:col-span-2"
      >
        {status === "loading" ? form.sendingLabel : form.submitLabel}
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
  className = "",
}: {
  label: string;
  id: string;
  errId: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="font-body text-cream-dim text-base uppercase tracking-[0.2em]"
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
