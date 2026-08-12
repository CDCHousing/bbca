"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface FormState {
  name: string;
  phone: string;
  email: string;
  profession: string;
  website: string; // honeypot — must stay empty
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  profession: "",
  website: "",
};

export default function VisitorRegistrationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    // digits only, allow a single leading +
    const raw = e.target.value;
    const cleaned = (raw.startsWith("+") ? "+" : "") + raw.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, phone: cleaned }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/visitor-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.fieldErrors) {
          const mapped: FieldErrors = {};
          for (const key of Object.keys(data.fieldErrors)) {
            mapped[key as keyof FieldErrors] = data.fieldErrors[key][0];
          }
          setErrors(mapped);
        }
        setSubmitError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setForm(initialForm);
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-[#F5F7FA] py-14" style={{ paddingBottom: "80px" }}>
        <div className="max-w-[760px] mx-auto px-6">
          <div className="bg-white border border-[#E3E7ED] rounded-[18px] shadow-md flex flex-col items-center text-center" style={{ padding: "56px 40px" }}>
            <Image
              src="/bbca-logo.svg"
              alt="BBCA logo"
              height={56}
              width={160}
              style={{ height: "56px", width: "auto" }}
              className="mb-7"
              priority
            />
            <h1 className="font-bold text-[#1B2A52] mb-3" style={{ fontSize: "var(--text-f22)" }}>
              Thank you for registering for the Build Festival.
            </h1>
            <p className="text-[#414C60] max-w-[480px]" style={{ fontSize: "15px", lineHeight: "1.7" }}>
              We&apos;ll send your visitor confirmation shortly.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F7FA] py-14" style={{ paddingBottom: "80px" }}>
      <div className="max-w-[760px] mx-auto px-6">
        {/* Centered header */}
        <div className="flex flex-col items-center text-center mb-9">
          <div className="mb-5">
            <Image
              src="/bbca-logo.svg"
              alt="BBCA logo"
              height={56}
              width={160}
              style={{ height: "56px", width: "auto" }}
              priority
            />
          </div>
          <h1 className="font-bold text-[#1B2A52] uppercase mb-1.5" style={{ fontSize: "var(--text-f24)" }}>
            British Bangladeshi Construction Association
          </h1>
          <p className="font-semibold text-[#0A7D3E]" style={{ fontSize: "var(--text-f17)" }}>
            Build Festival Visitor Registration
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E3E7ED] rounded-[18px] shadow-md p-6 sm:p-8 md:p-10"
          noValidate
        >
          {submitError && (
            <div
              className="mb-6 rounded-[10px] border border-[#D0202F]/30 bg-[#D0202F]/5 text-[#D0202F]"
              style={{ padding: "12px 16px", fontSize: "13.5px" }}
            >
              {submitError}
            </div>
          )}

          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="sr-only"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "22px" }}>
            <div>
              <FieldLabel htmlFor="name" required>Name</FieldLabel>
              <FieldInput
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                error={errors.name}
              />
              <FieldError message={errors.name} />
            </div>

            <div>
              <FieldLabel htmlFor="phone" required>Phone</FieldLabel>
              <FieldInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9+]*"
                value={form.phone}
                onChange={handlePhoneChange}
                required
                error={errors.phone}
              />
              <FieldError message={errors.phone} />
            </div>

            <div>
              <FieldLabel htmlFor="email" required>Email</FieldLabel>
              <FieldInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <FieldLabel htmlFor="profession" required>Profession</FieldLabel>
              <FieldInput
                id="profession"
                name="profession"
                type="text"
                value={form.profession}
                onChange={handleChange}
                required
                error={errors.profession}
              />
              <FieldError message={errors.profession} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full flex items-center justify-center gap-0 bg-[#1B2A52] text-white font-semibold rounded-full cursor-pointer transition-all duration-150 hover:bg-[#14203D] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A52] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-[#1B2A52]"
            style={{ height: "50px", fontSize: "15px" }}
          >
            <span>{submitting ? "Submitting…" : "Register as Visitor"}</span>
            {!submitting && <ArrowRight size={14} strokeWidth={2.5} className="ml-3" />}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─── small helpers ─────────────────────────────────────────────────────── */

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block font-bold text-[#1B2A52] mb-1.5" style={{ fontSize: "13px" }}>
      {children}
      {required && (
        <span className="text-[#D0202F] ml-0.5" aria-hidden="true">
          {" "}*
        </span>
      )}
    </label>
  );
}

function FieldInput({
  className = "",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string; error?: string }) {
  return (
    <input
      {...props}
      className={`w-full border rounded-[10px] bg-[#F5F7FA] text-[#414C60] ${
        error ? "border-[#D0202F]" : "border-[#E3E7ED]"
      } ${className}`}
      style={{ height: "46px", padding: "0 14px", fontSize: "14px" }}
    />
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[#D0202F] mt-1.5" style={{ fontSize: "12px" }}>
      {message}
    </p>
  );
}
