import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardList, AlertCircle, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const assetCount = await db.asset.count();
  const logCount = await db.incident.count();

  const stats = [
    { name: "Total Assets", value: assetCount, icon: Package, color: "text-blue-600" },
    { name: "Maintenance Logs", value: logCount, icon: ClipboardList, color: "text-green-600" },
    { name: "Pending Issues", value: "3", icon: AlertCircle, color: "text-amber-600" },
    { name: "Healthy Systems", value: "98%", icon: CheckCircle2, color: "text-emerald-600" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ITMS Dashboard</h1>
        <p className="text-muted-foreground">Overview of your managed IT infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Maintenance Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Recent logs will appear here after they are created.</p>
        </CardContent>
      </Card>
    </div>
  );
}
