"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import ConfirmDialog from "../../components/ConfirmDialog";
import { ToastStack, useToasts } from "../../components/Toast";
import { SOURCE_TABS, type SourceTab } from "../status";

interface PoolRecipient {
  email: string;
  name: string;
  organization: string;
}

interface Selected extends PoolRecipient {
  source: SourceTab;
}

const PREVIEW_SAMPLE = {
  name: "Sample Recipient",
  businessName: "Sample Organisation",
  organization: "Sample Organisation",
  email: "sample@example.com",
};

/** Mirrors renderTokensPlain — the server does the real substitution at send time. */
function renderPreviewTokens(template: string): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in PREVIEW_SAMPLE
      ? PREVIEW_SAMPLE[key as keyof typeof PREVIEW_SAMPLE]
      : match
  );
}

export default function NewEmailCampaignPage() {
  const router = useRouter();
  const { toasts, showToast, dismissToast } = useToasts();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [tab, setTab] = useState<SourceTab>("members");
  const [pools, setPools] = useState<Partial<Record<SourceTab, PoolRecipient[]>>>({});
  const [loadingPool, setLoadingPool] = useState(false);
  const [search, setSearch] = useState("");

  // Selection is keyed by email so it survives switching tabs and never
  // duplicates an address that appears in two sources.
  const [selected, setSelected] = useState<Record<string, Selected>>({});
  // Guards the one-time "tick every member" default so re-fetching the list
  // never silently re-ticks addresses the admin has deliberately unticked.
  const autoSelectedMembers = useRef(false);

  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [error, setError] = useState("");

  const pool = useMemo(() => pools[tab] ?? [], [pools, tab]);

  const loadPool = useCallback(
    async (source: SourceTab) => {
      setLoadingPool(true);
      try {
        const res = await fetch(`/api/admin/email/recipients?source=${source}`);
        if (!res.ok) {
          setError("Failed to load recipients");
          return;
        }
        const data = await res.json();
        setPools((prev) => ({ ...prev, [source]: data.recipients }));

        // Emailing the whole membership is the common case, so the Members tab
        // arrives fully ticked on first load. Every other source starts empty.
        if (source === "members" && !autoSelectedMembers.current) {
          autoSelectedMembers.current = true;
          setSelected((prev) => {
            const next = { ...prev };
            for (const r of data.recipients as PoolRecipient[]) {
              next[r.email] = { ...r, source: "members" };
            }
            return next;
          });
        }
      } finally {
        setLoadingPool(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!pools[tab]) loadPool(tab);
  }, [tab, pools, loadPool]);

  const filteredPool = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(
      (r) =>
        r.email.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.organization.toLowerCase().includes(q)
    );
  }, [pool, search]);

  const selectedEmails = Object.keys(selected);
  const selectedCount = selectedEmails.length;
  const allFilteredSelected =
    filteredPool.length > 0 && filteredPool.every((r) => selected[r.email]);

  function toggle(recipient: PoolRecipient) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[recipient.email]) delete next[recipient.email];
      else next[recipient.email] = { ...recipient, source: tab };
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelected((prev) => {
      const next = { ...prev };
      if (allFilteredSelected) {
        for (const r of filteredPool) delete next[r.email];
      } else {
        for (const r of filteredPool) next[r.email] = { ...r, source: tab };
      }
      return next;
    });
  }

  /** Only the sources that actually contributed a ticked address are submitted. */
  const activeSources = useMemo(
    () => [...new Set(Object.values(selected).map((s) => s.source))],
    [selected]
  );

  function validate(): string | null {
    if (subject.trim().length < 2) return "Add a subject line.";
    if (!body.trim() || body.trim() === "<p></p>") return "Write a message body.";
    if (selectedCount === 0) return "Pick at least one recipient.";
    return null;
  }

  /** Creates the DRAFT campaign and snapshots recipients. Returns its id. */
  async function createCampaign(): Promise<string | null> {
    const res = await fetch("/api/admin/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: subject.trim(),
        body,
        sources: activeSources,
        emails: selectedEmails,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save the campaign");
      return null;
    }
    const campaign = await res.json();
    return campaign.id as string;
  }

  async function handleSaveDraft() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSaving(true);
    try {
      const id = await createCampaign();
      if (id) router.push(`/admin/email/${id}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleSend() {
    setConfirmSend(false);
    setError("");
    setSending(true);
    try {
      const id = await createCampaign();
      if (!id) return;

      const res = await fetch(`/api/admin/email/${id}/send`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // The draft exists either way, so hand the admin its detail screen.
        showToast(data.error || data.message || "The send did not run.", "error");
        setTimeout(() => router.push(`/admin/email/${id}`), 1200);
        return;
      }
      router.push(`/admin/email/${id}`);
    } finally {
      setSending(false);
    }
  }

  async function handleTest() {
    const problem = validate();
    if (problem && problem !== "Pick at least one recipient.") {
      setError(problem);
      return;
    }
    setError("");
    setTesting(true);
    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.error || "Failed to send the test email", "error");
        return;
      }
      showToast(`Test email sent to ${data.to}.`);
    } finally {
      setTesting(false);
    }
  }

  const previewSubject = renderPreviewTokens(subject) || "(no subject yet)";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Email</h1>
          <p className="text-sm text-gray-500 mt-1">
            {selectedCount} recipient{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>
        <Link
          href="/admin/email"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          &larr; Back to campaigns
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. BBCA Annual Dinner — save the date"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
            />
            <p className="mt-2 text-xs text-gray-500">
              Tokens: <code>{"{{name}}"}</code>, <code>{"{{businessName}}"}</code>
              , <code>{"{{email}}"}</code> — work in the subject and the body.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <RichTextEditor
              value={body}
              onChange={setBody}
              allowImages={false}
              placeholder="Write your message to members…"
            />
          </div>

          {/* Preview — mirrors the branded shell in src/lib/email.ts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3">
              Preview{" "}
              <span className="font-normal text-gray-400">
                (tokens filled with sample values)
              </span>
            </h2>
            <div className="bg-[#F5F7FA] p-6 rounded">
              <div className="max-w-[600px] mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="bg-[#1B2A52] px-8 py-6">
                  <p className="text-white text-lg font-bold m-0">
                    {previewSubject}
                  </p>
                </div>
                <div
                  className="px-8 py-8 text-[#414C60] text-[15px] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_a]:text-[#1B2A52] [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html:
                      renderPreviewTokens(body) ||
                      "<p class='text-gray-400'>Your message will appear here.</p>",
                  }}
                />
                <div className="px-8 py-4 bg-[#F5F7FA] text-[#6E7A8C] text-xs">
                  British Bangladeshi Construction Association
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const problem = validate();
                if (problem) {
                  setError(problem);
                  return;
                }
                setError("");
                setConfirmSend(true);
              }}
              disabled={sending || saving}
              className="bg-[#D0202F] text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-[#b01a27] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Sending…" : `Send to ${selectedCount}`}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={saving || sending}
              className="bg-[#1B2A52] text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              onClick={handleTest}
              disabled={testing || sending}
              className="border border-gray-300 text-gray-700 rounded px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {testing ? "Sending…" : "Send test to me"}
            </button>
          </div>
        </div>

        {/* Recipients */}
        <div className="bg-white rounded-lg shadow p-5 h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recipients</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1B2A52] text-white text-xs font-medium tabular-nums">
              {selectedCount} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {SOURCE_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  tab === t.value
                    ? "bg-[#1B2A52] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this list…"
            className="w-full mb-3 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
          />

          {loadingPool && pool.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Loading…</p>
          ) : pool.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No contacts in this list yet.
            </p>
          ) : (
            <>
              <label className="flex items-center gap-2 px-2 py-2 border-b border-gray-200 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAllFiltered}
                  className="rounded border-gray-300"
                />
                Select all shown ({filteredPool.length})
              </label>

              <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
                {filteredPool.map((r) => (
                  <label
                    key={r.email}
                    className="flex items-start gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selected[r.email])}
                      onChange={() => toggle(r)}
                      className="mt-1 rounded border-gray-300"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900 truncate">
                        {r.name || r.email}
                      </span>
                      <span className="block text-gray-500 truncate">
                        {r.email}
                      </span>
                      {r.organization && (
                        <span className="block text-xs text-gray-400 truncate">
                          {r.organization}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          <p className="mt-3 text-xs text-gray-500">
            Members are approved membership applications. Rejected applications
            are never emailed.
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={confirmSend}
        title="Send this email"
        description={`Send "${subject.trim()}" to ${selectedCount} recipient${
          selectedCount === 1 ? "" : "s"
        }? This cannot be undone.`}
        confirmLabel="Send now"
        loadingLabel="Sending…"
        loading={sending}
        onConfirm={handleSend}
        onCancel={() => setConfirmSend(false)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
