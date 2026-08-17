"use client";

import { useState, type FormEvent } from "react";

interface SimpleLeadFormProps {
  source: "contact-us" | "careers";
  messageLabel?: string;
  submitLabel?: string;
  showCompanyName?: boolean;
  showSubject?: boolean;
  subjectLabel?: string;
  /** "dark" is for use on a colored/dark panel background (e.g. the consultation split section). */
  variant?: "light" | "dark";
}

type Status = "idle" | "submitting" | "success" | "error";

export function SimpleLeadForm({
  source,
  messageLabel = "Message",
  submitLabel = "Submit",
  showCompanyName = true,
  showSubject = true,
  subjectLabel = "Subject",
  variant = "light",
}: SimpleLeadFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("submitting");
    setErrorMessage(null);

    const form = new FormData(formElement);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      companyName: String(form.get("companyName") ?? ""),
      subject: String(form.get("subject") ?? ""),
      website: String(form.get("_hp") ?? ""),
      source,
      message: String(form.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error("API error response:", data);

        const issues = data?.issues;
        let validationMessage: string | null = null;

        if (issues?.fieldErrors) {
          validationMessage = Object.values(issues.fieldErrors).flat().filter(Boolean).join(" ");
        }

        if (!validationMessage && issues?.formErrors) {
          validationMessage = issues.formErrors.filter(Boolean).join(" ");
        }

        setErrorMessage(validationMessage || data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      if (formElement?.reset) {
        formElement.reset();
      }
    } catch (err) {
      // Log the real error for debugging and show a clearer message to the user
      // while preserving the original fallback.
      // eslint-disable-next-line no-console
      console.error("Lead form submit failed:", err);
      const msg = err && typeof err === "object" && "message" in err ? (err as any).message : String(err);
      setErrorMessage(msg || "Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const labelClass = `font-body text-sm font-medium ${variant === "dark" ? "text-paper" : "text-ledger"}`;
  const inputClass = `rounded-card border px-3 py-2.5 ${
    variant === "dark" ? "border-paper/30 bg-paper/10 text-paper placeholder:text-paper/50" : "border-ledger/20"
  }`;

  if (status === "success") {
    return (
      <div role="status" className={`flex flex-col items-center gap-4 rounded-[24px] p-8 text-center ${variant === "dark" ? "bg-paper/10 border border-paper/20" : "bg-growth-50 border border-growth-200"}`}>
        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${variant === "dark" ? "bg-paper/20" : "bg-growth-100"}`}>
          <svg className={`h-8 w-8 ${variant === "dark" ? "text-paper" : "text-growth-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className={`font-display text-xl font-semibold ${variant === "dark" ? "text-paper" : "text-growth-900"}`}>
            Message Received!
          </h3>
          <p className={`mt-2 font-body text-sm ${variant === "dark" ? "text-paper/80" : "text-growth-700"}`}>
            Thank you for reaching out. We appreciate your inquiry and will be in touch shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor={`${source}-hp`}>Leave this field empty</label>
        <input
          type="text"
          id={`${source}-hp`}
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          inputMode="none"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${source}-fullName`} className={labelClass}>Name</label>
          <input id={`${source}-fullName`} name="fullName" type="text" required minLength={2} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${source}-phone`} className={labelClass}>Phone</label>
          <input id={`${source}-phone`} name="phone" type="tel" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${source}-email`} className={labelClass}>Email</label>
          <input id={`${source}-email`} name="email" type="email" required className={inputClass} />
        </div>
        {showCompanyName && (
          <div className="flex flex-col gap-1">
            <label htmlFor={`${source}-companyName`} className={labelClass}>
              {source === "careers" ? "Current employer (optional)" : "Company name (optional)"}
            </label>
            <input id={`${source}-companyName`} name="companyName" type="text" className={inputClass} />
          </div>
        )}
        {showSubject && (
          <div className="flex flex-col gap-1">
            <label htmlFor={`${source}-subject`} className={labelClass}>{subjectLabel}</label>
            <input id={`${source}-subject`} name="subject" type="text" className={inputClass} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${source}-message`} className={labelClass}>{messageLabel}</label>
        <textarea id={`${source}-message`} name="message" rows={4} required className={inputClass} />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="font-body text-sm text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-60 ${
          variant === "dark"
            ? "bg-paper text-[#0B4F75] hover:bg-paper/90"
            : "btn-primary"
        }`}
      >
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
