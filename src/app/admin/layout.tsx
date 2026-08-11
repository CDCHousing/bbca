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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[#1B2A52] text-white flex flex-col flex-shrink-0">
        {/* Logo / Brand */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">
            BBCA Admin
          </div>
          <div className="text-lg font-bold text-white leading-tight">
            British Bangladeshi
            <br />
            Construction Assoc.
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2 rounded text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="px-3 pb-6 border-t border-white/10 pt-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
