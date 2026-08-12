"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, FileText, Download } from "lucide-react";

interface FormState {
  name: string;
  phone: string;
  email: string;
  organization: string;
  website: string; // honeypot — must stay empty
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  organization: "",
  website: "",
};

// Placeholder PDF — drop the real file at public/stall-booking-form.pdf
// to make the preview + download work.
const STALL_BOOKING_PDF = "/stall-booking-form.pdf";

export default function StallBookingPage() {
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
      const res = await fetch("/api/stall-booking", {
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
              Thank you for booking your stall at the Build Festival.
            </h1>
            <p className="text-[#414C60] max-w-[480px]" style={{ fontSize: "15px", lineHeight: "1.7" }}>
              Our team will contact you shortly to confirm your stall booking details.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F7FA] py-14" style={{ paddingBottom: "80px" }}>
      <div className="max-w-[1080px] mx-auto px-6">
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
            Build Festival Stall Booking
          </p>
        </div>

        {/* Two-column layout: PDF panel (left) + form (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left — PDF view + download */}
          <div className="bg-white border border-[#E3E7ED] rounded-[18px] shadow-md overflow-hidden flex flex-col h-full">
            <div
              className="flex items-center justify-between gap-3 border-b border-[#E3E7ED]"
              style={{ padding: "18px 22px" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D0202F] flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-bold text-[#1B2A52]" style={{ fontSize: "15px" }}>
                    Stall Booking Form
                  </div>
                  <div className="text-[#6E7A8C]" style={{ fontSize: "12px" }}>
                    PDF · Fill &amp; submit
                  </div>
                </div>
              </div>
            </div>

            {/* PDF preview area */}
            <div
              className="flex flex-col items-center justify-center text-center bg-[#F5F7FA] flex-1"
              style={{ padding: "52px 28px", minHeight: "320px" }}
            >
              <div
                className="w-[74px] h-[74px] rounded-2xl bg-[#D0202F] flex items-center justify-center mb-5 shadow-md"
                style={{ boxShadow: "0 10px 24px rgba(208,32,47,0.28)" }}
              >
                <FileText size={34} className="text-white" strokeWidth={1.8} />
              </div>
              <div className="font-bold text-[#1B2A52] mb-1.5" style={{ fontSize: "var(--text-f16)" }}>
                Download the Stall Booking Form
              </div>
              <p className="text-[#414C60] max-w-[280px] mb-6" style={{ fontSize: "13.5px", lineHeight: "1.65" }}>
                Open the PDF to review the stall booking details and pricing, then fill out the form on this page.
              </p>
              <a
                href={STALL_BOOKING_PDF}
                download
                className="inline-flex items-center gap-2.5 bg-[#1B2A52] text-white font-semibold rounded-full transition-all hover:bg-[#14203D] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                style={{ fontSize: "14px", padding: "13px 24px" }}
              >
                <Download size={15} strokeWidth={2.5} />
                Download PDF
              </a>
            </div>
          </div>

          {/* Right — form card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E3E7ED] rounded-[18px] shadow-md p-6 sm:p-8"
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

            {/* Fields stacked vertically, one per row */}
            <div className="flex flex-col" style={{ gap: "22px" }}>
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
                <FieldLabel htmlFor="organization" required>Organization</FieldLabel>
                <FieldInput
                  id="organization"
                  name="organization"
                  type="text"
                  value={form.organization}
                  onChange={handleChange}
                  required
                  error={errors.organization}
                />
                <FieldError message={errors.organization} />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full flex items-center justify-center gap-0 bg-[#1B2A52] text-white font-semibold rounded-full cursor-pointer transition-all duration-150 hover:bg-[#14203D] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A52] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-[#1B2A52]"
              style={{ height: "50px", fontSize: "15px" }}
            >
              <span>{submitting ? "Submitting…" : "Book Your Stall"}</span>
              {!submitting && <ArrowRight size={14} strokeWidth={2.5} className="ml-3" />}
            </button>
          </form>
        </div>
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
