import React from "react";
import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar, User, Tag } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ExportButton } from "@/components/reports/export-button";

import { LogFilterBar } from "./filter-bar";

export default async function LogsPage({ searchParams }: { searchParams: Promise<{ search?: string, type?: string }> }) {
  const { search, type } = await searchParams;

  const where: any = {};
  
  if (search) {
    where.OR = [
      { logNumber: { contains: search, mode: "insensitive" } },
      { asset: { tag: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (type && type !== "all") {
    where.serviceType = type;
  }

  const incidents = await db.incident.findMany({
    where,
    include: {
      asset: true,
      serverLog: true,
      networkLog: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Maintenance Logs</h1>
          <p className="text-muted-foreground">Historical records of all maintenance activities.</p>
        </div>
      </div>

      <LogFilterBar />

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead className="text-right">Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-mono font-bold">{incident.logNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(incident.date), "MMM dd, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {incident.asset.tag}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                    incident.serviceType === "PREVENTIVE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {incident.serviceType}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/logs/${incident.id}`}>View Detail</Link>
                    </Button>
                    <ExportButton 
                      logNumber={incident.logNumber}
                      size="sm"
                      data={{
                        logNumber: incident.logNumber,
                        date: incident.date.toISOString(),
                        assetTag: incident.asset.tag,
                        serviceType: incident.serviceType,
                        startTime: format(incident.startTime, "HH:mm"),
                        endTime: format(incident.endTime, "HH:mm"),
                        problemDescription: incident.problemDescription,
                        correction: incident.correction,
                        hardwareSpecs: incident.serverLog ? {
                          cpu: incident.serverLog.cpu,
                          ram: incident.serverLog.ram,
                          storage: incident.serverLog.storage,
                          nic: incident.serverLog.nic
                        } : {},
                        performanceMetrics: incident.serverLog?.performanceMetrics || [],
                        engineerSignature: incident.engineerSignature,
                        customerSignature: incident.customerSignature
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No service logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Helper function for CN in server component
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
