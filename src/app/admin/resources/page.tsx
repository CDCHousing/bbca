"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface ResourceRow {
  id: string;
  title: string;
  slug: string;
  eventDate: string | null;
  location: string | null;
  bookingEnabled: boolean;
  status: "DRAFT" | "PUBLISHED";
  _count: { bookings: number };
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resources");
      if (res.ok) setResources(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  async function handleDelete(row: ResourceRow) {
    const warning =
      row._count.bookings > 0
        ? `Delete "${row.title}"?\n\nThis will also permanently delete its ${row._count.bookings} seat booking${
            row._count.bookings === 1 ? "" : "s"
          }. Export the bookings first if you need them.`
        : `Delete "${row.title}"?`;

    if (!window.confirm(warning)) return;

    const res = await fetch(`/api/admin/resources/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to delete resource");
      return;
    }
    setError("");
    fetchResources();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource &amp; Knowledge</h1>
          <p className="text-sm text-gray-500 mt-1">
            {resources.length} item{resources.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          New Resource
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 text-sm">Loading resources…</div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No resources yet</p>
          <p className="text-sm">
            Create your first workshop, seminar or knowledge article.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Bookings</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{r.title}</div>
                    <div className="text-xs text-gray-400 font-mono">/{r.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.eventDate
                      ? new Date(r.eventDate).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        r.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {r.bookingEnabled ? (
                      <Link
                        href={`/admin/resources/${r.id}/bookings`}
                        className="text-[#1B2A52] font-medium hover:underline"
                      >
                        {r._count.bookings}
                      </Link>
                    ) : (
                      <span className="text-gray-400">Off</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/resources/${r.id}`}
                      className="text-[#1B2A52] font-medium hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(r)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
