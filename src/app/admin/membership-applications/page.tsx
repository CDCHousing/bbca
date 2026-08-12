"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Application {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const PAGE_SIZE = 20;

export default function MembershipApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/membership-applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // reset to page 1 whenever the filter or search changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Membership Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} application
            {total !== 1 ? "s" : ""}
            {statusFilter ? ` (filtered: ${statusFilter})` : ""}
          </p>
        </div>

        <a
          href="/api/admin/membership-applications/export"
          className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Filter + search */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Filter by status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search business, contact, email or phone…"
          className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No applications</p>
          <p className="text-sm">
            {debouncedSearch
              ? `No applications match "${debouncedSearch}".`
              : statusFilter
              ? `No ${statusFilter.toLowerCase()} applications found.`
              : "No membership applications have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Business Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Contact
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Phone
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Submitted
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[180px] truncate">
                    {app.businessName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.contactName}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">
                    {app.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[app.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/membership-applications/${app.id}`}
                      className="bg-[#1B2A52] text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-[#14203D] transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
