"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StatusUpdateForm({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/admin/membership-applications/${applicationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Failed to update status");
        return;
      }

      setMessage("Status updated successfully");
      router.refresh();
    } catch {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
      >
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
      <button
        onClick={handleSave}
        disabled={loading || status === currentStatus}
        className="bg-[#1B2A52] text-white rounded px-4 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Status"}
      </button>
      {message && (
        <span
          className={`text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
