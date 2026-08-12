"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  createdAt: string;
}

interface ResourceMeta {
  id: string;
  title: string;
  eventDate: string | null;
  location: string | null;
}

const PAGE_SIZE = 20;

export default function ResourceBookingsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [resource, setResource] = useState<ResourceMeta | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (debouncedSearch) query.set("q", debouncedSearch);
      const res = await fetch(`/api/admin/resources/${id}/bookings?${query}`);
      if (res.ok) {
        const data = await res.json();
        setResource(data.resource);
        setBookings(data.bookings);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [id, debouncedSearch, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/resources" className="text-sm text-gray-500 hover:text-gray-700">
          ← Resources
        </Link>
        <span className="text-gray-300">/</span>
        <Link
          href={`/admin/resources/${id}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {resource?.title ?? "Resource"}
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Bookings</h1>

        <a
          href={`/api/admin/resources/${id}/bookings/export`}
          className="ml-auto bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, organization, email or phone…"
          className="w-full max-w-xs px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
        />
        <p className="text-sm text-gray-500 whitespace-nowrap">
          {total} seat{total !== 1 ? "s" : ""} booked
        </p>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No bookings</p>
          <p className="text-sm">
            {debouncedSearch
              ? `No bookings match "${debouncedSearch}".`
              : "Nobody has booked a seat for this yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Organization
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Booked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[180px] truncate">
                    {b.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">
                    {b.organization}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate">
                    {b.email}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.phone}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(b.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
