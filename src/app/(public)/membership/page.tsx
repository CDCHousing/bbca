"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, UploadCloud } from "lucide-react";
import { membershipFormSchema } from "@/lib/validation/membership";

interface FormState {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  address: string;
  message: string;
  website: string; // honeypot — must stay empty
  file: File | null;
}

type FieldErrors = Partial<Record<keyof Omit<FormState, "file">, string>> & {
  document?: string;
};

const initialForm: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  businessType: "",
  address: "",
  message: "",
  website: "",
  file: null,
};

export default function MembershipPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [submitted]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    // digits only, allow a single leading +
    const raw = e.target.value;
    const cleaned =
      (raw.startsWith("+") ? "+" : "") + raw.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, phone: cleaned }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, document: undefined }));
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, document: undefined }));
  }

  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
  const MAX_SIZE = 10 * 1024 * 1024;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const result = membershipFormSchema.safeParse({
      businessName: form.businessName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      businessType: form.businessType,
      address: form.address,
      message: form.message,
    });

    const nextErrors: FieldErrors = {};
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      for (const key of Object.keys(flat) as (keyof typeof flat)[]) {
        const msg = flat[key]?.[0];
        if (msg) nextErrors[key as keyof FieldErrors] = msg;
      }
    }

    if (form.file) {
      if (!ALLOWED_TYPES.includes(form.file.type)) {
        nextErrors.document = "Only PDF, JPG or PNG files are allowed";
      } else if (form.file.size > MAX_SIZE) {
        nextErrors.document = "File must be 10MB or smaller";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("businessName", form.businessName.trim());
      body.append("contactName", form.contactName.trim());
      body.append("email", form.email.trim());
      body.append("phone", form.phone.trim());
      body.append("businessType", form.businessType.trim());
      body.append("address", form.address.trim());
      body.append("message", form.message.trim());
      body.append("website", form.website); // honeypot
      if (form.file) body.append("document", form.file);

      const res = await fetch("/api/membership", {
        method: "POST",
        body,
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
            <h1
              className="font-bold text-[#1B2A52] mb-3"
              style={{ fontSize: "22px" }}
            >
              Thank you for submitting your application to join BBCA.
            </h1>
            <p
              className="text-[#414C60] max-w-[480px]"
              style={{ fontSize: "15px", lineHeight: "1.7" }}
            >
              You will receive written confirmation once your application has
              been reviewed and approved. We will contact you if we require
              any further information.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-[#F5F7FA] py-14"
      style={{ paddingBottom: "80px" }}
    >
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
          <h1
            className="font-bold text-[#1B2A52] uppercase mb-1.5"
            style={{ fontSize: "24px" }}
          >
            British Bangladeshi Construction Association
          </h1>
          <p
            className="font-semibold text-[#0A7D3E]"
            style={{ fontSize: "17px" }}
          >
            Membership Application Form
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

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "22px" }}
          >
            {/* 1. Business name — full width */}
            <div className="md:col-span-2">
              <FieldLabel htmlFor="businessName" required>
                Business / Organisation name
              </FieldLabel>
              <FieldInput
                id="businessName"
                name="businessName"
                type="text"
                value={form.businessName}
                onChange={handleChange}
                required
                error={errors.businessName}
              />
              <FieldError message={errors.businessName} />
            </div>

            {/* 2. Contact person name */}
            <div>
              <FieldLabel htmlFor="contactName" required>
                Contact person name
              </FieldLabel>
              <FieldInput
                id="contactName"
                name="contactName"
                type="text"
                value={form.contactName}
                onChange={handleChange}
                required
                error={errors.contactName}
              />
              <FieldError message={errors.contactName} />
            </div>

            {/* 3. Email */}
            <div>
              <FieldLabel htmlFor="email" required>
                Email
              </FieldLabel>
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

            {/* 4. Phone — digits only */}
            <div>
              <FieldLabel htmlFor="phone" required>
                Phone
              </FieldLabel>
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

            {/* 5. Business type — text */}
            <div>
              <FieldLabel htmlFor="businessType" required>
                Business type / industry
              </FieldLabel>
              <FieldInput
                id="businessType"
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                required
                error={errors.businessType}
              />
              <FieldError message={errors.businessType} />
            </div>

            {/* 6. Address — full width */}
            <div className="md:col-span-2">
              <FieldLabel htmlFor="address" required>
                Address
              </FieldLabel>
              <FieldInput
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                required
                error={errors.address}
              />
              <FieldError message={errors.address} />
            </div>

            {/* 7. Message — full width textarea */}
            <div className="md:col-span-2">
              <FieldLabel htmlFor="message">
                Message / additional info
              </FieldLabel>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-[#E3E7ED] rounded-[10px] bg-[#F5F7FA] text-[#414C60] resize-y"
                style={{
                  minHeight: "104px",
                  padding: "12px 14px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              />
            </div>

            {/* 8. File upload — full width */}
            <div className="md:col-span-2">
              <FieldLabel htmlFor="fileUpload">Document upload</FieldLabel>
              <label
                htmlFor="fileUpload"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center cursor-pointer rounded-[12px] border-2 border-dashed transition-colors duration-150 ${
                  dragging
                    ? "border-[#1B2A52] bg-[#E4F0F2]"
                    : errors.document
                    ? "border-[#D0202F] bg-transparent"
                    : "border-[#c3ccd8] bg-transparent hover:border-[#1B2A52]"
                }`}
                style={{ padding: "26px" }}
              >
                <div
                  className="w-11 h-11 rounded-[11px] bg-white flex items-center justify-center mb-3 shadow-sm"
                >
                  <UploadCloud size={22} className="text-[#6E7A8C]" strokeWidth={1.8} />
                </div>
                <p
                  className="text-[#6E7A8C] text-center"
                  style={{ fontSize: "13.5px" }}
                >
                  {form.file ? (
                    <span className="font-semibold text-[#1B2A52]">
                      {form.file.name}
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-[#1B2A52]">
                        Drag &amp; drop or browse
                      </span>{" "}
                      · PDF, JPG, PNG (max 10MB)
                    </>
                  )}
                </p>
                <input
                  id="fileUpload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <FieldError message={errors.document} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full flex items-center justify-center gap-0 bg-[#1B2A52] text-white font-semibold rounded-full cursor-pointer transition-all duration-150 hover:bg-[#14203D] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2A52] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-[#1B2A52]"
            style={{ height: "50px", fontSize: "15px" }}
          >
            <span>{submitting ? "Submitting…" : "Submit Application"}</span>
            {!submitting && (
              <ArrowRight size={14} strokeWidth={2.5} className="ml-3" />
            )}
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
    <label
      htmlFor={htmlFor}
      className="block font-bold text-[#1B2A52] mb-1.5"
      style={{ fontSize: "13px" }}
    >
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
}: React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  error?: string;
}) {
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
