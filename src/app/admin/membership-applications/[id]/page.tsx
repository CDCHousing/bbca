import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusUpdateForm from "./StatusUpdateForm";
import { formatSerial } from "@/lib/membership-serial";
import { getSerialMap } from "@/lib/membership-serial.server";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.membershipApplication.findUnique({
    where: { id },
  });

  if (!application) {
    notFound();
  }

  const serials = await getSerialMap();
  const serial = serials.get(application.id);

  const fields = [
    { label: "Business Name", value: application.businessName },
    { label: "Contact Name", value: application.contactName },
    { label: "Email", value: application.email },
    { label: "Phone", value: application.phone },
    { label: "Business Type", value: application.businessType },
    { label: "Address", value: application.address },
    { label: "Message", value: application.message || "—" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/membership-applications"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Applications
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Application Detail</h1>
      </div>

      {/* Status header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {application.businessName}
            </h2>
            <p className="text-xs font-mono text-gray-400 mb-1">
              S/N {serial ? formatSerial(serial) : "—"}
            </p>
            <p className="text-sm text-gray-500">
              Submitted{" "}
              {new Date(application.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              STATUS_STYLES[application.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {application.status}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Update Status
          </p>
          <StatusUpdateForm
            applicationId={application.id}
            currentStatus={application.status}
          />
        </div>
      </div>

      {/* Application fields */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Application Details</h3>
        <dl className="space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">
                {field.label}
              </dt>
              <dd className="col-span-2 text-sm text-gray-900 whitespace-pre-wrap">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Document */}
      {application.documentUrl && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            Uploaded Document
          </h3>
          <a
            href={application.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#1B2A52] underline hover:text-[#14203D] font-medium"
          >
            View Document
          </a>
        </div>
      )}

      {/* Timestamps */}
      <div className="mt-6 text-xs text-gray-400 space-y-1">
        <div>
          Created: {new Date(application.createdAt).toISOString()}
        </div>
        <div>
          Updated: {new Date(application.updatedAt).toISOString()}
        </div>
        <div>ID: {application.id}</div>
      </div>
    </div>
  );
}
