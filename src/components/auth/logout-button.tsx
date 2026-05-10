"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-slate-500"
    >
      <LogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
}
