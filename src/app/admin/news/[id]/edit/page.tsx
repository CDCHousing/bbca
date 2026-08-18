"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import NewsForm, { emptyNews, type NewsFormValues } from "../../NewsForm";

export default function EditNewsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [initial, setInitial] = useState<NewsFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/admin/news/${id}`);
        if (!res.ok) {
          if (!cancelled) setError("Article not found");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setInitial({
          ...emptyNews,
          title: data.title ?? "",
          slug: data.slug ?? "",
          category: data.category ?? "",
          excerpt: data.excerpt ?? "",
          body: data.body ?? "",
          coverImageUrl: data.coverImageUrl ?? "",
          imageFit: data.imageFit ?? "COVER",
          status: data.status ?? "DRAFT",
          // <input type="date"> needs a bare YYYY-MM-DD value.
          publishedAt: data.publishedAt ? String(data.publishedAt).slice(0, 10) : "",
          order: data.order ?? 0,
        });
      } catch {
        if (!cancelled) setError("Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/news" className="text-sm text-gray-500 hover:text-gray-700">
          ← News
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Edit Article</h1>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {!error &&
        (initial ? (
          <NewsForm initial={initial} newsId={id} />
        ) : (
          <div className="text-sm text-gray-500">Loading article…</div>
        ))}
    </div>
  );
}
