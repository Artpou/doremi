"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="btn btn-error"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </button>
  );
}
