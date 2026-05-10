import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileDown, Calendar, Clock, Tag, MapPin, ClipboardCheck, Activity } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { ExportButton } from "@/components/reports/export-button";

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const incident = await db.incident.findUnique({
    where: { id },
    include: {
      asset: true,
      serverLog: true,
      networkLog: true,
    }
  });

  if (!incident) {
    notFound();
  }

  // Map data for PDF report
  const reportData = {
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
  };

  const isServer = !!incident.serverLog;
  const isNetwork = !!incident.networkLog;

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/logs">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Logs
            </Link>
          </Button>
          <ExportButton data={reportData} logNumber={incident.logNumber} variant="default" />
        </div>

        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{incident.logNumber}</CardTitle>
                  <CardDescription>Maintenance Session Record</CardDescription>
                </div>
                <div className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  {incident.serviceType}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Date</div>
                  <div className="font-medium">{format(new Date(incident.date), "PPP")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Time Session</div>
                  <div className="font-medium">
                    {format(new Date(incident.startTime), "HH:mm")} - {format(new Date(incident.endTime), "HH:mm")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-slate-100">
              <CardTitle className="text-lg">Asset Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-bold">{incident.asset.tag}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 inline mr-1" /> {incident.asset.location}
              </div>
              <div className="text-sm">SN: {incident.asset.serialNumber}</div>
            </CardContent>
          </Card>
        </div>

        {/* Problem & Correction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardCheck className="h-5 w-5 text-slate-600" /> Analysis & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-bold">Problem Description</Label>
              <p className="mt-1 p-3 bg-slate-50 border rounded-md text-sm italic">"{incident.problemDescription}"</p>
            </div>
            <div>
              <Label className="text-xs uppercase text-muted-foreground font-bold">Correction Taken</Label>
              <p className="mt-1 p-3 bg-green-50 border border-green-100 rounded-md text-sm">{incident.correction}</p>
            </div>
          </CardContent>
        </Card>

        {/* Specific Log Details */}
        {isServer && incident.serverLog && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" /> Performance Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <table className="w-full text-sm border">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-2 text-left">Metric</th>
                      <th className="p-2 text-center">Last</th>
                      <th className="p-2 text-center">Avg</th>
                      <th className="p-2 text-center">Min</th>
                      <th className="p-2 text-center">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(incident.serverLog.performanceMetrics as any[]).map((m, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{m.scale} - {m.counter}</td>
                        <td className="p-2 text-center">{m.last}</td>
                        <td className="p-2 text-center">{m.avg}</td>
                        <td className="p-2 text-center">{m.min}</td>
                        <td className="p-2 text-center">{m.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Hardware Config</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>CPU:</span><span className="font-bold">{incident.serverLog.cpu}</span></div>
                  <div className="flex justify-between"><span>RAM:</span><span className="font-bold">{incident.serverLog.ram}</span></div>
                  <div className="flex justify-between"><span>IP:</span><span className="font-bold">{incident.serverLog.ipAddress}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Optimization Status</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(incident.serverLog.optimizationTasks as any).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${v ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <Card>
            <CardHeader className="text-center border-b"><CardTitle className="text-sm">Engineer Sign-off</CardTitle></CardHeader>
            <CardContent className="p-4 flex flex-col items-center">
              {incident.engineerSignature ? (
                <img src={incident.engineerSignature} className="h-32 object-contain" alt="Engineer Signature" />
              ) : <div className="h-32 flex items-center text-muted-foreground italic">No signature</div>}
              <div className="mt-4 border-t w-full text-center pt-2 text-sm font-bold">IT Support Engineer</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center border-b"><CardTitle className="text-sm">Customer Sign-off</CardTitle></CardHeader>
            <CardContent className="p-4 flex flex-col items-center">
              {incident.customerSignature ? (
                <img src={incident.customerSignature} className="h-32 object-contain" alt="Customer Signature" />
              ) : <div className="h-32 flex items-center text-muted-foreground italic">No signature</div>}
              <div className="mt-4 border-t w-full text-center pt-2 text-sm font-bold">Authorized Representative</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Minimal components needed for the server component
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={className}>{children}</label>;
}
