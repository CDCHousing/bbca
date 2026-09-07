"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ConfirmDialog from "../../components/ConfirmDialog";
import { ToastStack, useToasts } from "../../components/Toast";
import { CAMPAIGN_STATUS_STYLES, RECIPIENT_STATUS_STYLES } from "../status";

interface Campaign {
  id: string;
  subject: string;
  body: string;
  audienceLabel: string;
  status: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  sentAt: string | null;
  createdAt: string;
}

interface Recipient {
  id: string;
  email: string;
  name: string;
  organization: string;
  status: string;
  error: string | null;
  providerId: string | null;
  sentAt: string | null;
}

export default function EmailCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toasts, showToast, dismissToast } = useToasts();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<null | "send" | "retry" | "test">(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCampaign = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/email/${id}${params}`);
      if (res.ok) {
        const data = await res.json();
        setCampaign(data.campaign);
        setRecipients(data.recipients);
      }
    } finally {
      setLoading(false);
    }
  }, [id, statusFilter]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  const pendingCount = campaign
    ? campaign.totalCount - campaign.sentCount - campaign.failedCount
    : 0;

  async function runSend() {
    setConfirmSend(false);
    setBusy("send");
    try {
      const res = await fetch(`/api/admin/email/${id}/send`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.error || data.message || "The send did not run.", "error");
        return;
      }
      showToast(
        data.remaining > 0
          ? `Sent ${data.sent}. ${data.remaining} still queued — press Resume to continue.`
          : `Finished: ${data.sent} sent, ${data.failed} failed.`,
        data.failed > 0 ? "error" : "success"
      );
    } finally {
      setBusy(null);
      await fetchCampaign();
    }
  }

  async function runRetry() {
    setBusy("retry");
    try {
      const res = await fetch(`/api/admin/email/${id}/retry`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.error || data.message || "Retry did not run.", "error");
        return;
      }
      showToast(`Retried ${data.retried}: ${data.sent} sent, ${data.failed} failed.`);
    } finally {
      setBusy(null);
      await fetchCampaign();
    }
  }

  async function runTest() {
    if (!campaign) return;
    setBusy("test");
    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: campaign.subject, body: campaign.body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.error || "Failed to send the test email", "error");
        return;
      }
      showToast(`Test email sent to ${data.to}.`);
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/email/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to delete campaign", "error");
        return;
      }
      router.push("/admin/email");
    } finally {
      setDeleting(false);
    }
  }

  if (loading && !campaign) {
    return <div className="p-8 text-sm text-gray-500">Loading campaign…</div>;
  }

  if (!campaign) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500 mb-4">Campaign not found.</p>
        <Link href="/admin/email" className="text-sm text-[#1B2A52] underline">
          Back to campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            {campaign.subject}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {campaign.audienceLabel} · created{" "}
            {new Date(campaign.createdAt).toLocaleString("en-GB")}
            {campaign.sentAt
              ? ` · sent ${new Date(campaign.sentAt).toLocaleString("en-GB")}`
              : ""}
          </p>
        </div>
        <Link
          href="/admin/email"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          &larr; Back to campaigns
        </Link>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Status
          </div>
          <span
            className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              CAMPAIGN_STATUS_STYLES[campaign.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {campaign.status}
          </span>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Recipients
          </div>
          <div className="text-xl font-bold text-gray-900 tabular-nums">
            {campaign.totalCount}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Sent</div>
          <div className="text-xl font-bold text-[#0A7D3E] tabular-nums">
            {campaign.sentCount}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Failed
          </div>
          <div
            className={`text-xl font-bold tabular-nums ${
              campaign.failedCount > 0 ? "text-[#D0202F]" : "text-gray-400"
            }`}
          >
            {campaign.failedCount}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {pendingCount > 0 && (
          <button
            onClick={() => setConfirmSend(true)}
            disabled={busy !== null}
            className="bg-[#D0202F] text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-[#b01a27] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy === "send"
              ? "Sending…"
              : campaign.status === "SENDING"
              ? `Resume sending (${pendingCount})`
              : `Send to ${pendingCount}`}
          </button>
        )}
        {campaign.failedCount > 0 && (
          <button
            onClick={runRetry}
            disabled={busy !== null}
            className="bg-[#1B2A52] text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy === "retry"
              ? "Retrying…"
              : `Retry failed (${campaign.failedCount})`}
          </button>
        )}
        <button
          onClick={runTest}
          disabled={busy !== null}
          className="border border-gray-300 text-gray-700 rounded px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy === "test" ? "Sending…" : "Send test to me"}
        </button>
        <a
          href={`/api/admin/email/${campaign.id}/export`}
          className="border border-gray-300 text-gray-700 rounded px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Export CSV
        </a>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={busy !== null}
          className="border border-red-200 text-[#D0202F] rounded px-5 py-2.5 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>

      {/* Message */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Message</h2>
        <div
          className="text-[#414C60] text-[15px] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_a]:text-[#1B2A52] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: campaign.body }}
        />
      </div>

      {/* Recipients */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Recipients</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-semibold text-gray-600">
                Name
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">
                Email
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recipients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No recipients match this filter.
                </td>
              </tr>
            ) : (
              recipients.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-3 text-gray-900 max-w-[200px] truncate">
                    {r.name || "—"}
                    {r.organization && (
                      <span className="block text-xs text-gray-400 truncate">
                        {r.organization}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-600 max-w-[220px] truncate">
                    {r.email}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        RECIPIENT_STATUS_STYLES[r.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500 max-w-[320px]">
                    {r.error ? (
                      <span className="text-[#D0202F]">{r.error}</span>
                    ) : r.sentAt ? (
                      new Date(r.sentAt).toLocaleString("en-GB")
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirmSend}
        title={campaign.status === "SENDING" ? "Resume sending" : "Send this email"}
        description={`Send "${campaign.subject}" to ${pendingCount} recipient${
          pendingCount === 1 ? "" : "s"
        }? This cannot be undone.`}
        confirmLabel="Send now"
        loadingLabel="Sending…"
        loading={busy === "send"}
        onConfirm={runSend}
        onCancel={() => setConfirmSend(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete campaign"
        description={`Delete "${campaign.subject}" and its delivery record? This cannot be undone and does not unsend anything already delivered.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
