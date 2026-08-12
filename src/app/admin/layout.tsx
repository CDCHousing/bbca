import Link from "next/link";
import SignOutButton from "./components/SignOutButton";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/leadership", label: "Association Leadership" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/resources", label: "Resource & Knowledge" },
  { href: "/admin/membership-applications", label: "Membership Applications" },
  { href: "/admin/stall-bookings", label: "Stall Bookings" },
  { href: "/admin/visitor-registrations", label: "Visitor Registrations" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      {/* Sidebar — becomes a stacked top bar with a scrollable nav row below md */}
      <aside className="w-full md:w-64 md:min-h-screen bg-[#1B2A52] text-white flex flex-col md:flex-shrink-0">
        {/* Logo / Brand */}
        <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-white/10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-200 md:mb-1">
              BBCA Admin
            </div>
            <div className="hidden md:block text-lg font-bold text-white leading-tight">
              British Bangladeshi
              <br />
              Construction Assoc.
            </div>
          </div>
          <div className="md:hidden">
            <SignOutButton />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex md:flex-col flex-1 gap-1 md:gap-0 md:space-y-1 px-3 py-3 md:py-4 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center whitespace-nowrap px-3 py-2 rounded text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="hidden md:block px-3 pb-6 border-t border-white/10 pt-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
