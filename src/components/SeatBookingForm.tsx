"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
  website: string; // honeypot — must stay empty
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  website: "",
};

export default function SeatBookingForm({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
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
      const res = await fetch(`/api/resources/${slug}/book`, {
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
      <div
        className="bg-white border border-[#E3E7ED] rounded-[18px] shadow-md flex flex-col items-center text-center"
        style={{ padding: "48px 40px" }}
      >
        <div className="w-[64px] h-[64px] rounded-full bg-[#0A7D3E] flex items-center justify-center mb-5">
          <Check size={32} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="font-bold text-[#1B2A52] mb-3" style={{ fontSize: "20px" }}>
          Your seat is booked.
        </h2>
        <p
          className="text-[#414C60] max-w-[420px]"
          style={{ fontSize: "15px", lineHeight: "1.7" }}
        >
          Thank you for registering for {title}. A confirmation email is on its way — do
          check your spam folder if it does not arrive shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E3E7ED] rounded-[18px] shadow-md p-6 sm:p-8"
      noValidate
    >
      <h2 className="font-bold text-[#1B2A52] mb-1" style={{ fontSize: "19px" }}>
        Book Your Seat
      </h2>
      <p className="text-[#6E7A8C] mb-6" style={{ fontSize: "13.5px" }}>
        Fill in your details and we will confirm your place by email.
      </p>

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

      <div className="flex flex-col" style={{ gap: "22px" }}>
        <div>
          <FieldLabel htmlFor="booking-name" required>
            Name
          </FieldLabel>
          <FieldInput
            id="booking-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
            error={errors.name}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <FieldLabel htmlFor="booking-email" required>
            Email
          </FieldLabel>
          <FieldInput
            id="booking-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <FieldLabel htmlFor="booking-phone" required>
            Phone
          </FieldLabel>
          <FieldInput
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9+]*"
            autoComplete="tel"
            value={form.phone}
            onChange={handlePhoneChange}
            required
            error={errors.phone}
          />
          <FieldError message={errors.phone} />
        </div>

        <div>
          <FieldLabel htmlFor="booking-organization" required>
            Organization
          </FieldLabel>
          <FieldInput
            id="booking-organization"
            name="organization"
            type="text"
            autoComplete="organization"
            value={form.organization}
            onChange={handleChange}
            required
            error={errors.organization}
          />
          <FieldError message={errors.organization} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 w-full inline-flex items-center justify-center bg-[#1B2A52] text-white font-semibold rounded-full transition-all hover:bg-[#14203D] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
        style={{ fontSize: "14px", padding: "14px 24px" }}
      >
        <span>{submitting ? "Booking…" : "Book Your Seat"}</span>
        {!submitting && <ArrowRight size={14} strokeWidth={2.5} className="ml-3" />}
      </button>
    </form>
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
    <label
      htmlFor={htmlFor}
      className="block font-bold text-[#1B2A52] mb-1.5"
      style={{ fontSize: "13px" }}
    >
      {children}
      {required && (
        <span className="text-[#D0202F] ml-0.5" aria-hidden="true">
          {" "}
          *
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
