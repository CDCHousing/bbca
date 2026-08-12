"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  body: string;
  coverImageUrl: string | null;
  status: string;
  publishedAt: string | null;
}

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    body: "",
    coverImageUrl: "",
    status: "DRAFT",
    publishedAt: "",
  });

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/admin/news/${id}`);
        if (!res.ok) {
          setError("Failed to load article");
          setFetchLoading(false);
          return;
        }
        const data: NewsArticle = await res.json();
        setForm({
          title: data.title,
          slug: data.slug,
          body: data.body,
          coverImageUrl: data.coverImageUrl || "",
          status: data.status,
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString().split("T")[0]
            : "",
        });
      } catch {
        setError("Failed to load article");
      } finally {
        setFetchLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugify(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          body: form.body,
          coverImageUrl: form.coverImageUrl || null,
          status: form.status,
          publishedAt: form.publishedAt || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update article");
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

  if (fetchLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/news"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← News
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Edit Article</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={12}
            value={form.body}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, body: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52] resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            value={form.coverImageUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, coverImageUrl: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B2A52] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/news"
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
