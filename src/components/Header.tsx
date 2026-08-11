"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { OriginButton } from "@/components/ui/origin-button";

type NavChild = { label: string; href: string };
type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "About BBCA", href: "/about" },
      { label: "Why Join BBCA", href: "/why-join" },
    ],
  },
  {
    label: "Membership",
    children: [
      { label: "Membership Form", href: "/membership" },
      // { label: "Association Leadership", href: "/association-leadership" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { label: "News & Insights", href: "/news" },
      { label: "Photo Archive", href: "/gallery" },
    ],
  },
  { label: "Resource & Knowledge", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const COLLAPSE_AT = 80;
    const EXPAND_AT = 20;
    const handler = () => {
      const y = window.scrollY;
      setScrolled((prev) => {
        if (!prev && y > COLLAPSE_AT) return true;
        if (prev && y < EXPAND_AT) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isItemActive = (item: NavItem) => {
    if (item.href) {
      return item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    }
    return (item.children ?? []).some((c) =>
      c.href === "/" ? pathname === "/" : pathname.startsWith(c.href)
    );
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Floating pill nav */}
      <div className="flex justify-center w-full py-2 px-4">
        <motion.div
          animate={{
            paddingTop: scrolled ? 10 : 20,
            paddingBottom: scrolled ? 10 : 20,
            boxShadow: scrolled
              ? "0 8px 32px rgba(20,32,61,0.18)"
              : "0 16px 48px rgba(20,32,61,0.13)",
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex items-center justify-between px-8 bg-white rounded-xl w-full max-w-[1700px] relative z-10"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-4">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Image
                src="/bbca-logo.svg"
                alt="BBCA"
                width={180}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item, i) => {
              const active = isItemActive(item);
              const label = item.label;

              if (item.children) {
                return (
                  <div
                    key={label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <motion.button
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="relative flex items-center gap-0.5 px-[13px] py-3.5 text-[13px] font-bold uppercase tracking-[0.3px] whitespace-nowrap transition-colors"
                      style={{ color: active || openDropdown === label ? "#1B2A52" : "#414C60" }}
                    >
                      {label}
                      <ChevronDown
                        size={13}
                        className="mt-0.5 transition-transform duration-200"
                        style={{ transform: openDropdown === label ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                      <motion.span
                        className="absolute left-[13px] right-[13px] bottom-[5px] h-[2.5px] rounded-full bg-[#DA9028]"
                        animate={{ scaleX: active || openDropdown === label ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ transformOrigin: "left" }}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {openDropdown === label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-xl border border-[#E3E7ED] py-2 min-w-[200px] z-50"
                        >
                          {item.children.map((child) => {
                            const childActive = pathname.startsWith(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.3px] whitespace-nowrap transition-colors hover:bg-[#F5F7FA]"
                                style={{ color: childActive ? "#1B2A52" : "#414C60" }}
                                onClick={() => setOpenDropdown(null)}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className="relative block px-[13px] py-3.5 text-[13px] font-bold uppercase tracking-[0.3px] whitespace-nowrap transition-colors"
                    style={{ color: active ? "#1B2A52" : "#414C60" }}
                    onMouseEnter={() => setOpenDropdown(null)}
                  >
                    {label}
                    <motion.span
                      className="absolute left-[13px] right-[13px] bottom-[5px] h-[2.5px] rounded-full bg-[#DA9028]"
                      animate={{ scaleX: active ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Become a Member button */}
          <motion.div
            className="hidden lg:block shrink-0 ml-4"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <OriginButton
              onClick={() => { window.location.href = "/membership"; }}
              fillColor="#1B2A52"
              className="gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-[0.5px] text-white bg-[#D0202F] whitespace-nowrap"
            >
              Become a Member
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </OriginButton>
          </motion.div>

          {/* Mobile hamburger */}
          <motion.button
            className="lg:hidden flex items-center text-[#1B2A52]"
            onClick={() => setMobileOpen(true)}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={22} />
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-[200] pt-20 px-6 lg:hidden overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 text-[#1B2A52]"
              onClick={() => setMobileOpen(false)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <X size={24} />
            </motion.button>

            <div className="flex flex-col space-y-1 pb-10">
              {NAV_ITEMS.map((item, i) => {
                if (item.children) {
                  const isExpanded = mobileOpenSection === item.label;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.06 + 0.1 }}
                    >
                      <button
                        className="flex items-center justify-between w-full py-3 text-base font-bold text-[#1B2A52] uppercase tracking-wide border-b border-[#E3E7ED]"
                        onClick={() => setMobileOpenSection(isExpanded ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className="transition-transform duration-200"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: "hidden" }}
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block pl-4 py-2.5 text-sm font-semibold text-[#414C60] uppercase tracking-wide hover:text-[#1B2A52]"
                                onClick={() => { setMobileOpen(false); setMobileOpenSection(null); }}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-3 text-base font-bold text-[#1B2A52] uppercase tracking-wide border-b border-[#E3E7ED]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.55 }}
                className="pt-6"
              >
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wide text-white bg-[#1B2A52] hover:bg-[#D0202F] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Become a Member
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
