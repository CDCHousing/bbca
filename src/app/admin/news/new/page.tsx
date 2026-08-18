"use client";

import Link from "next/link";
import NewsForm, { emptyNews } from "../NewsForm";

export default function NewNewsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/news" className="text-sm text-gray-500 hover:text-gray-700">
          ← News
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Article</h1>
      </div>

      <NewsForm initial={emptyNews} />
    </div>
  );
}
