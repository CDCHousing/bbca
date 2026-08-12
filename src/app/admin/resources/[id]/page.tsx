"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResourceForm, { emptyResource, type ResourceFormValues } from "../ResourceForm";

export default function EditResourcePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [initial, setInitial] = useState<ResourceFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/admin/resources/${id}`);
        if (!res.ok) {
          if (!cancelled) setError("Resource not found");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setInitial({
          ...emptyResource,
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          body: data.body ?? "",
          coverImageUrl: data.coverImageUrl ?? "",
          // <input type="date"> needs a bare YYYY-MM-DD value.
          eventDate: data.eventDate ? String(data.eventDate).slice(0, 10) : "",
          location: data.location ?? "",
          bookingEnabled: data.bookingEnabled ?? true,
          emailSubject: data.emailSubject ?? "",
          emailBody: data.emailBody ?? "",
          status: data.status ?? "DRAFT",
          order: data.order ?? 0,
        });
      } catch {
        if (!cancelled) setError("Failed to load resource");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/resources" className="text-sm text-gray-500 hover:text-gray-700">
          ← Resources
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Edit Resource</h1>
        <Link
          href={`/admin/resources/${id}/bookings`}
          className="ml-auto text-sm font-medium text-[#1B2A52] hover:underline"
        >
          View bookings →
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {!error &&
        (initial ? (
          <ResourceForm initial={initial} resourceId={id} />
        ) : (
          <div className="text-sm text-gray-500">Loading resource…</div>
        ))}
    </div>
  );
}
