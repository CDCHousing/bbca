import PageHero from "@/components/PageHero";
import ContactForm from "./ContactForm";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

const CONTACT_ROWS = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "020 8004 3327",
    multiline: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@bbcauk.org",
    multiline: false,
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Cranbrook Road\nLondon, IG2 6JZ\nUnited Kingdom",
    multiline: true,
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Fri: 10:00 AM – 7:00 PM\nSaturday: 10:00 AM – 5:00 PM\nSunday: Closed",
    multiline: true,
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/bbca.association?igsh=YWwzN2VwYzByMmpj" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591693263416" },
  { label: "YouTube", href: "https://www.youtube.com/@bbca.association" },
];

const CONNECT_LINKS = [
  { label: "Resource & Knowledge", href: "/resources" },
  { label: "About Us", href: "/about" },
  { label: "Why Join BBCA", href: "/why-join" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" />

      <section className="bg-white pb-[90px] pt-[64px]">
        <div className="max-w-[1080px] mx-auto px-6">

          {/* Dark card */}
          <div
            className="rounded-[18px] bg-[#051F44] text-white grid grid-cols-1 lg:grid-cols-2 gap-12"
            style={{ padding: "52px 48px" }}
          >
            {/* Left — contact info */}
            <div>
              <h3 className="text-f24 font-bold text-white mb-9">
                BBCA Contact Information
              </h3>

              <div className="space-y-7">
                {CONTACT_ROWS.map(({ icon: Icon, label, value, multiline }) => (
                  <div key={label} className="flex gap-4 items-start">
                    {/* Red icon circle */}
                    <div className="shrink-0 w-10 h-10 rounded-full bg-[#D0202F] flex items-center justify-center mt-0.5">
                      <Icon size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[10.5px] font-bold text-white/45 uppercase tracking-widest mb-1">
                        {label}
                      </p>
                      {multiline ? (
                        <div className="text-[14.5px] text-white/85 leading-relaxed">
                          {value.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[14.5px] text-white/85 font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — social + connect */}
            <div className="flex flex-col gap-10">
              {/* Social */}
              <div>
                <h3 className="text-f20 font-bold text-white mb-5">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full border text-[13px] font-semibold text-white/80 hover:text-white hover:border-white/50 transition-colors"
                      style={{ borderColor: "#3a3a3a" }}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Connect More */}
              <div>
                <h3 className="text-f16 font-bold text-white/60 uppercase tracking-wider mb-5">
                  Connect More
                </h3>
                <div className="space-y-3">
                  {CONNECT_LINKS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-3 group"
                    >
                      <span className="text-[14.5px] font-semibold text-white/80 group-hover:text-white transition-colors">
                        {label}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-[#DA9028] transition-transform group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact form — hidden for now */}

        </div>
      </section>
    </>
  );
}
