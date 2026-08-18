"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import { slugify } from "@/lib/validation/news";

export interface NewsFormValues {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  imageFit: "COVER" | "CONTAIN";
  status: string;
  publishedAt: string;
  order: number;
}

export const emptyNews: NewsFormValues = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  body: "",
  coverImageUrl: "",
  imageFit: "COVER",
  status: "DRAFT",
  publishedAt: "",
  order: 0,
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]";

export default function NewsForm({
  initial,
  newsId,
}: {
  initial: NewsFormValues;
  newsId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(newsId);
  const [form, setForm] = useState<NewsFormValues>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Only auto-fill the slug while creating — changing it later breaks live URLs.
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

    if (!form.body.replace(/<[^>]*>/g, "").trim()) {
      setError("Body is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/news/${newsId}` : "/api/admin/news",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save article");
        setLoading(false);
        return;
      }

      router.push("/admin/news");
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
            placeholder="e.g. BBCA Announces Build Festival London 2026"
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
            Leave blank to auto-generate. Changing this on a live article breaks its
            existing URL.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Label
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className={inputClass}
            placeholder="e.g. NEWS, PRESS RELEASE"
          />
          <p className="text-xs text-gray-400 mt-1">
            Small label above the headline on the card and article page.
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Fit
          </label>
          <select
            value={form.imageFit}
            onChange={(e) =>
              setForm((p) => ({ ...p, imageFit: e.target.value as "COVER" | "CONTAIN" }))
            }
            className={inputClass}
          >
            <option value="COVER">Fill the card (crops edges) — photos</option>
            <option value="CONTAIN">Fit inside (no crop) — logos and posters</option>
          </select>
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
            <p className="text-xs text-gray-400 mt-1">
              Only published articles appear on the website.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              Newest first. Blank sorts to the bottom.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              Tie-breaker for articles sharing a date.
            </p>
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

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B2A52] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Article"}
        </button>
        <Link
          href="/admin/news"
          className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
