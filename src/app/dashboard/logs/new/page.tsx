import React from "react";
import { ServerLogForm } from "@/components/forms/server-log-form";
import { NetworkLogForm } from "@/components/forms/network-log-form";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function NewLogPage({ searchParams }: { searchParams: Promise<{ assetId?: string }> }) {
  const { assetId } = await searchParams;

  if (!assetId) {
    const assets = await db.asset.findMany();
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-6 text-center">
        <div className="bg-white p-8 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Select an Asset</h2>
          <p className="text-muted-foreground mb-6">Choose an asset from the list below to begin a maintenance session.</p>
          
          <div className="grid grid-cols-1 gap-2 text-left">
            {assets.map((asset) => (
              <a 
                key={asset.id} 
                href={`/dashboard/logs/new?assetId=${asset.id}`}
                className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary transition-all flex justify-between items-center group"
              >
                <div>
                  <div className="font-bold text-slate-900">{asset.tag}</div>
                  <div className="text-xs text-muted-foreground">{asset.category} • {asset.location}</div>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm">
                  Select →
                </div>
              </a>
            ))}
            {assets.length === 0 && (
              <p className="text-center py-8 text-muted-foreground italic border-2 border-dashed rounded-lg">
                No assets found. Please register an asset first.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const asset = await db.asset.findUnique({
    where: { id: assetId }
  });

  if (!asset) {
    return notFound();
  }

  const isNetwork = asset.category === "SWITCH" || asset.category === "FIREWALL";
  const isFirewall = asset.category === "FIREWALL";

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-end px-4">
          <div>
            <h1 className="text-2xl font-bold">New Maintenance Session</h1>
            <p className="text-muted-foreground">
              Asset: <span className="font-mono font-bold text-primary">{asset.tag}</span> ({asset.location})
            </p>
          </div>
          <div className="text-sm px-3 py-1 bg-white border rounded-full font-medium shadow-sm">
            Category: {asset.category}
          </div>
        </div>

        {isNetwork ? (
          <NetworkLogForm assetId={assetId} isFirewall={isFirewall} />
        ) : (
          <ServerLogForm assetId={assetId} />
        )}
      </div>
    </div>
  );
}
