"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface ResourceFormValues {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  eventDate: string;
  location: string;
  bookingEnabled: boolean;
  emailSubject: string;
  emailBody: string;
  status: string;
  order: number;
}

export const emptyResource: ResourceFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImageUrl: "",
  eventDate: "",
  location: "",
  bookingEnabled: true,
  emailSubject: "",
  emailBody: "",
  status: "DRAFT",
  order: 0,
};

const TOKENS = ["{{name}}", "{{organization}}", "{{title}}", "{{eventDate}}", "{{location}}"];

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]";

export default function ResourceForm({
  initial,
  resourceId,
}: {
  initial: ResourceFormValues;
  resourceId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(resourceId);
  const [form, setForm] = useState<ResourceFormValues>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Only auto-fill the slug while creating — changing it later would break live URLs.
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title),
    }));
  }

  async function handleCoverUpload(file: File) {
    setCoverUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Cover image upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, coverImageUrl: data.url }));
    } catch {
      setError("Cover image upload failed");
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.body.trim()) {
      setError("Body is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/resources/${resourceId}` : "/api/admin/resources",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            order: Number(form.order) || 0,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save resource");
        setLoading(false);
        return;
      }

      router.push("/admin/resources");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={handleTitleChange}
            className={inputClass}
            placeholder="e.g. Digital Skills Workshop for Contractors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            className={`${inputClass} font-mono`}
            placeholder="auto-generated-from-title"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave blank to auto-generate. Changing this on a live item breaks its existing URL.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Excerpt
          </label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
            className={`${inputClass} resize-y`}
            placeholder="Short summary shown on the listing card"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank for a non-event resource.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className={inputClass}
              placeholder="e.g. BBCA Office, London"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.coverImageUrl}
              onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="whitespace-nowrap px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {coverUploading ? "Uploading…" : "Upload"}
            </button>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverUpload(file);
              e.target.value = "";
            }}
          />
          {form.coverImageUrl && (
            // Blob host is not in next.config images config, so use a plain img here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImageUrl}
              alt="Cover preview"
              className="mt-3 h-32 w-auto rounded border border-gray-200 object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((p) => ({ ...p, order: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.bookingEnabled}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bookingEnabled: e.target.checked }))
                }
                className="w-4 h-4 accent-[#1B2A52]"
              />
              Allow seat booking
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Body <span className="text-red-500">*</span>
        </h2>
        <RichTextEditor
          value={form.body}
          onChange={(html) => setForm((p) => ({ ...p, body: html }))}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Confirmation Email
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sent to whoever books a seat. Leave both fields blank to use the default
            template.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={form.emailSubject}
            onChange={(e) => setForm((p) => ({ ...p, emailSubject: e.target.value }))}
            className={inputClass}
            placeholder="Your seat is confirmed — {{title}}"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <RichTextEditor
            value={form.emailBody}
            onChange={(html) => setForm((p) => ({ ...p, emailBody: html }))}
            allowImages={false}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Available tokens:</span>
            {TOKENS.map((t) => (
              <code
                key={t}
                className="text-xs bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700"
              >
                {t}
              </code>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B2A52] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Resource"}
        </button>
        <Link
          href="/admin/resources"
          className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
