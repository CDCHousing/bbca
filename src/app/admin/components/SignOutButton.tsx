"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full text-left px-4 py-2 text-sm text-red-300 hover:text-white hover:bg-red-700 rounded transition-colors"
    >
      Sign Out
    </button>
  );
}
