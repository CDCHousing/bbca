"use client";

import { useCallback, useEffect, useState } from "react";

interface VideoRow {
  id: string;
  videoId: string;
  title: string;
  order: number;
  published: boolean;
}

interface FormValues {
  videoUrl: string;
  title: string;
  order: number;
  published: boolean;
}

const emptyForm: FormValues = { videoUrl: "", title: "", order: 0, published: true };

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]";

export default function AdminHomeVideosPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/home-videos");
      if (res.ok) setVideos(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  function startEdit(row: VideoRow) {
    setEditingId(row.id);
    setForm({
      videoUrl: `https://www.youtube.com/watch?v=${row.videoId}`,
      title: row.title,
      order: row.order,
      published: row.published,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(
        editingId ? `/api/admin/home-videos/${editingId}` : "/api/admin/home-videos",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.fieldErrors?.videoUrl?.[0] ?? data.error ?? "Failed to save video"
        );
        return;
      }

      cancelEdit();
      fetchVideos();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: VideoRow) {
    if (!window.confirm(`Remove "${row.title}" from the home page?`)) return;

    const res = await fetch(`/api/admin/home-videos/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete video");
      return;
    }
    if (editingId === row.id) cancelEdit();
    setError("");
    fetchVideos();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Home Page Videos</h1>
        <p className="text-sm text-gray-500 mt-1">
          YouTube videos shown under News &amp; Events on the home page.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {editingId ? "Edit Video" : "Add Video"}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            YouTube URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.videoUrl}
            onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=AXMkjkDWADg"
          />
          <p className="text-xs text-gray-400 mt-1">
            Any YouTube link works — watch, youtu.be, shorts or embed.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className={inputClass}
            placeholder="Shown to screen readers and as the player title"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <p className="text-xs text-gray-400 mt-1">Lowest number shows first.</p>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                className="w-4 h-4 accent-[#1B2A52]"
              />
              Show on the home page
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1B2A52] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add Video"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading videos…</div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No videos yet</p>
          <p className="text-sm">
            Add a YouTube link above and it appears on the home page straight away.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              {/* YouTube thumbnail host is not in next.config images, so use a plain img. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                alt=""
                className="w-full aspect-video object-cover bg-gray-200"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-medium text-gray-900 text-sm leading-snug">
                  {v.title}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">{v.videoId}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      v.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {v.published ? "Visible" : "Hidden"}
                  </span>
                  <span className="text-xs text-gray-400">Order {v.order}</span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3 text-sm">
                  <button
                    onClick={() => startEdit(v)}
                    className="text-[#1B2A52] font-medium hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-gray-500 hover:underline"
                  >
                    Open ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
