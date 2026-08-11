"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // Placeholder — wire up to API route in Week 3
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  }

  const inputClass =
    "w-full rounded-xl border border-[#E3E7ED] bg-[#F5F7FA] px-4 py-3.5 text-[14.5px] text-[#1B2A52] placeholder:text-[#6E7A8C] focus:outline-none focus:border-[#1B2A52] focus:bg-white transition-colors";

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-[#E4F0F2] border border-[#0A7D3E]/20 px-8 py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-[#0A7D3E] flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-[#1B2A52] mb-2">Message Sent!</h3>
        <p className="text-[14.5px] text-[#414C60]">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-bold text-[#414C60] uppercase tracking-wider mb-1.5">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#414C60] uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-bold text-[#414C60] uppercase tracking-wider mb-1.5">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="+44 7900 000000"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-[12px] font-bold text-[#414C60] uppercase tracking-wider mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help you?"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full inline-flex items-center justify-center gap-3 bg-[#1B2A52] text-white font-semibold text-[14px] pl-6 pr-4 py-3.5 rounded-full hover:bg-[#14203D] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{status === "sending" ? "Sending…" : "Send Message"}</span>
        <ArrowRight size={13} strokeWidth={2.5} className="ml-2" />
      </button>
    </form>
  );
}
