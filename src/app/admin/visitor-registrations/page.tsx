"use client";

import { useState, useEffect, useCallback } from "react";

interface Registration {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: string;
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function VisitorRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (debouncedSearch) params.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/visitor-registrations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Registrations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} registration{total !== 1 ? "s" : ""}
          </p>
        </div>

        <a
          href="/api/admin/visitor-registrations/export"
          className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, profession, email or phone…"
          className="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No visitor registrations</p>
          <p className="text-sm">
            {debouncedSearch
              ? `No registrations match "${debouncedSearch}".`
              : "No visitor registrations have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Profession</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[180px] truncate">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">
                    {r.profession}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">
                    {r.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{r.phone}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && registrations.length > 0 && (
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
