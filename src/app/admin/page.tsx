import { prisma } from "@/lib/prisma";

async function getStats() {
  const [
    totalNews,
    totalLeadership,
    totalGallery,
    pendingApplications,
    totalStallBookings,
    totalVisitorRegistrations,
    totalResources,
    totalSeatBookings,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.executive.count(),
    prisma.galleryImage.count(),
    prisma.membershipApplication.count({ where: { status: "PENDING" } }),
    prisma.stallBooking.count(),
    prisma.visitorRegistration.count(),
    prisma.resource.count(),
    prisma.seatBooking.count(),
  ]);

  return {
    totalNews,
    totalLeadership,
    totalGallery,
    pendingApplications,
    totalStallBookings,
    totalVisitorRegistrations,
    totalResources,
    totalSeatBookings,
  };
}

export default async function AdminDashboard() {
  const {
    totalNews,
    totalLeadership,
    totalGallery,
    pendingApplications,
    totalStallBookings,
    totalVisitorRegistrations,
    totalResources,
    totalSeatBookings,
  } = await getStats();

  const stats = [
    {
      label: "Total News Articles",
      value: totalNews,
      color: "bg-blue-500",
      link: "/admin/news",
    },
    {
      label: "Leadership Profiles",
      value: totalLeadership,
      color: "bg-indigo-500",
      link: "/admin/leadership",
    },
    {
      label: "Gallery Images",
      value: totalGallery,
      color: "bg-purple-500",
      link: "/admin/gallery",
    },
    {
      label: "Pending Applications",
      value: pendingApplications,
      color: "bg-yellow-500",
      link: "/admin/membership-applications",
    },
    {
      label: "Stall Bookings",
      value: totalStallBookings,
      color: "bg-orange-500",
      link: "/admin/stall-bookings",
    },
    {
      label: "Visitor Registrations",
      value: totalVisitorRegistrations,
      color: "bg-teal-500",
      link: "/admin/visitor-registrations",
    },
    {
      label: "Resources & Seminars",
      value: totalResources,
      color: "bg-emerald-500",
      link: "/admin/resources",
    },
    {
      label: "Seats Booked",
      value: totalSeatBookings,
      color: "bg-rose-500",
      link: "/admin/resources",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to the BBCA admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block"
          >
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color} text-white font-bold text-lg mb-3`}
            >
              {stat.value}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </a>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/admin/news/new"
              className="flex items-center gap-2 text-sm text-[#1B2A52] hover:underline font-medium"
            >
              + Add News Article
            </a>
            <a
              href="/admin/leadership/new"
              className="flex items-center gap-2 text-sm text-[#1B2A52] hover:underline font-medium"
            >
              + Add Leadership Profile
            </a>
            <a
              href="/admin/gallery"
              className="flex items-center gap-2 text-sm text-[#1B2A52] hover:underline font-medium"
            >
              + Upload Gallery Image
            </a>
            <a
              href="/admin/resources/new"
              className="flex items-center gap-2 text-sm text-[#1B2A52] hover:underline font-medium"
            >
              + Add Resource or Seminar
            </a>
            <a
              href="/admin/membership-applications"
              className="flex items-center gap-2 text-sm text-[#1B2A52] hover:underline font-medium"
            >
              View Membership Applications
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-4">System Info</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">Environment:</span>{" "}
              {process.env.NODE_ENV}
            </div>
            <div>
              <span className="font-medium">Admin Panel:</span> v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
