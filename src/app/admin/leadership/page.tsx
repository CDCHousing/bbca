import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import DeleteLeadershipButton from "./DeleteLeadershipButton";

export default async function AdminLeadershipPage() {
  const profiles = await prisma.executive.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Association Leadership
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {profiles.length} profile{profiles.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/leadership/new"
          className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors"
        >
          + Add Profile
        </Link>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No profiles yet</p>
          <p className="text-sm">Add your first leadership profile.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Photo
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Title
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Order
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {profile.photoUrl ? (
                      <Image
                        src={profile.photoUrl}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {profile.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{profile.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.category === "EXECUTIVE"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {profile.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{profile.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/leadership/${profile.id}/edit`}
                        className="bg-[#1B2A52] text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-[#14203D] transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteLeadershipButton
                        id={profile.id}
                        name={profile.name}
                      />
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
