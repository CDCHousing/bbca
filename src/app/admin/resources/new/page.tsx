"use client";

import Link from "next/link";
import ResourceForm, { emptyResource } from "../ResourceForm";

export default function NewResourcePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/resources" className="text-sm text-gray-500 hover:text-gray-700">
          ← Resources
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Resource</h1>
      </div>

      <ResourceForm initial={emptyResource} />
    </div>
  );
}
