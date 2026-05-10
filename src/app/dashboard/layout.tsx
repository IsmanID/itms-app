import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ClipboardList, Settings, LogOut } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="bg-primary text-white p-1 rounded">IT</div>
            MS Portal
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
            <LayoutDashboard className="h-5 w-5 text-slate-500" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/assets" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
            <Package className="h-5 w-5 text-slate-500" />
            <span>Assets Inventory</span>
          </Link>
          <Link href="/dashboard/logs" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
            <ClipboardList className="h-5 w-5 text-slate-500" />
            <span>Service Logs</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
            <Settings className="h-5 w-5 text-slate-500" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
