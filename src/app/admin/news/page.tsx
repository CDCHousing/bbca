import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteNewsButton from "./DeleteNewsButton";

export default async function AdminNewsPage() {
  const newsList = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Articles</h1>
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
                  Title
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Slug
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Published
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Created
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newsList.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs max-w-[160px] truncate">
                    {article.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "PUBLISHED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(
                          "en-GB"
                        )
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("en-GB")}
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
