"use client";

import { useState, type FormEvent } from "react";

const LOAN_TYPES = ["MSME Loan", "Loan Against Property", "Equipment & Machinery Finance", "Affordable Housing Finance"];

type Status = "idle" | "submitting" | "success" | "error";

interface LoanEligibilityProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

export function LoanEligibility({
  eyebrow = "Loan Eligibility",
  heading = "Know where you stand in two minutes.",
  subheading = "Share a few basic details and our team will call you back with an indicative eligibility range — no obligation, no impact on your credit score.",
}: LoanEligibilityProps) {
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
      loanType: String(form.get("loanType") ?? ""),
      requestedAmount: String(form.get("requestedAmount") ?? ""),
      source: "loan-eligibility",
      website: String(form.get("_hp") ?? ""), // honeypot - stays empty for real users
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      if (formElement?.reset) {
        formElement.reset();
      }
    } catch (err) {
      // Log and surface the actual error for easier debugging.
      // eslint-disable-next-line no-console
      console.error("Loan eligibility submit failed:", err);
      const msg = err && typeof err === "object" && "message" in err ? (err as any).message : String(err);
      setErrorMessage(msg || "Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="loan-eligibility" className="py-20" aria-labelledby="eligibility-heading">
        <div className="container-content max-w-xl text-center">
          <h2 id="eligibility-heading" className="text-2xl">Request received.</h2>
          <p className="mt-3 font-body text-ledger/75">
            A relationship manager will reach out within one business day to discuss your eligibility.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="loan-eligibility" className="bg-ledger py-20 text-paper" aria-labelledby="eligibility-heading">
      <div className="container-content grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow text-growth-300">{eyebrow}</p>
          <h2 id="eligibility-heading" className="mt-3 text-3xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-md font-body text-paper/75">
            {subheading}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-card bg-paper p-8 text-ledger">
          {/* Honeypot - hidden from sighted and screen-reader users, bots fill it anyway */}
          <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
            <label htmlFor="hp">Leave this field empty</label>
            <input
              type="text"
              id="hp"
              name="_hp"
              tabIndex={-1}
              autoComplete="off"
              inputMode="none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="fullName" className="font-body text-sm font-medium">Full name</label>
              <input id="fullName" name="fullName" type="text" required minLength={2} className="rounded-card border border-ledger/20 px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="font-body text-sm font-medium">Phone number</label>
              <input id="phone" name="phone" type="tel" required className="rounded-card border border-ledger/20 px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-body text-sm font-medium">Email</label>
              <input id="email" name="email" type="email" required className="rounded-card border border-ledger/20 px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="companyName" className="font-body text-sm font-medium">Business name</label>
              <input id="companyName" name="companyName" type="text" className="rounded-card border border-ledger/20 px-3 py-2" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="loanType" className="font-body text-sm font-medium">Loan type</label>
              <select id="loanType" name="loanType" required className="rounded-card border border-ledger/20 px-3 py-2">
                <option value="">Select one</option>
                {LOAN_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="requestedAmount" className="font-body text-sm font-medium">Amount needed (₹)</label>
              <input id="requestedAmount" name="requestedAmount" type="text" placeholder="e.g. 15,00,000" className="rounded-card border border-ledger/20 px-3 py-2" />
            </div>
          </div>

          {status === "error" && errorMessage && (
            <p role="alert" className="mt-4 font-body text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 w-full disabled:opacity-60">
            {status === "submitting" ? "Submitting…" : "Check My Eligibility"}
          </button>
        </form>
      </div>
    </section>
  );
}
