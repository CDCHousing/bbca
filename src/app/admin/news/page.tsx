import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteNewsButton from "./DeleteNewsButton";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const newsList = await prisma.news.findMany({
    orderBy: [
      { publishedAt: { sort: "desc", nulls: "last" } },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News &amp; Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            {newsList.length} article{newsList.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          + New Article
        </Link>
      </div>

      {newsList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No articles yet</p>
          <p className="text-sm">
            Create your first news article to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Article
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Published
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newsList.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {article.coverImageUrl ? (
                        // Blob host is not in next.config images, so use a plain img.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.coverImageUrl}
                          alt=""
                          className={`w-16 h-10 rounded bg-gray-200 shrink-0 ${
                            article.imageFit === "CONTAIN"
                              ? "object-contain p-0.5"
                              : "object-cover"
                          }`}
                        />
                      ) : (
                        <div className="w-16 h-10 rounded bg-gray-200 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate max-w-[320px]">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-400 font-mono truncate max-w-[320px]">
                          /news/{article.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs uppercase tracking-wide">
                    {article.category ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/news/${article.id}/edit`}
                        className="bg-[#1B2A52] text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-[#14203D] transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteNewsButton id={article.id} title={article.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
