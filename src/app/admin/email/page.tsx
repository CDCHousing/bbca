"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "../components/ConfirmDialog";
import { ToastStack, useToasts } from "../components/Toast";
import { CAMPAIGN_STATUS_STYLES } from "./status";

interface CampaignRow {
  id: string;
  subject: string;
  audienceLabel: string;
  status: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  sentAt: string | null;
  createdAt: string;
}

export default function AdminEmailPage() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<CampaignRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, showToast, dismissToast } = useToasts();

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/email?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  async function handleDelete() {
    const campaign = pendingDelete;
    if (!campaign) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/email/${campaign.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to delete campaign", "error");
        return;
      }
      setPendingDelete(null);
      showToast(`Deleted "${campaign.subject}".`);
      if (campaigns.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchCampaigns();
      }
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} campaign{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/email/new"
          className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          New Email
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading campaigns…</div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No emails yet</p>
          <p className="text-sm">
            Compose an email to your approved members, applicants or event
            attendees.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Subject
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Audience
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Sent
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Failed
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Created
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[260px] truncate">
                    {c.subject}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[220px] truncate">
                    {c.audienceLabel}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        CAMPAIGN_STATUS_STYLES[c.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 tabular-nums">
                    {c.sentCount} / {c.totalCount}
                  </td>
                  <td
                    className={`px-6 py-4 tabular-nums ${
                      c.failedCount > 0
                        ? "text-[#D0202F] font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {c.failedCount}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/email/${c.id}`}
                        className="bg-[#1B2A52] text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-[#14203D] transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setPendingDelete(c)}
                        className="border border-red-200 text-[#D0202F] rounded px-3 py-1.5 text-xs font-medium hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
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

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete campaign"
        description={
          pendingDelete
            ? `Delete "${pendingDelete.subject}" and its delivery record? This cannot be undone and does not unsend anything already delivered.`
            : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
