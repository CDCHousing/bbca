"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteNewsButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
