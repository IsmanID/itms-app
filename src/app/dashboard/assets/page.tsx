import React from "react";
import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Server, HardDrive, Shield, Laptop } from "lucide-react";
import Link from "next/link";

const iconMap = {
  SERVER: Server,
  SWITCH: HardDrive,
  FIREWALL: Shield,
  PC: Laptop,
  LAPTOP: Laptop,
  PRINTER: HardDrive,
  OTHER: HardDrive,
};

import { AssetFilterBar } from "./filter-bar";

export default async function AssetsPage({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  const { search, category } = await searchParams;

  const where: any = {};
  
  if (search) {
    where.OR = [
      { tag: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.category = category;
  }

  const assets = await db.asset.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Assets Inventory</h1>
          <p className="text-muted-foreground">Manage and track your IT infrastructure components.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/assets/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Asset
          </Link>
        </Button>
      </div>

      <AssetFilterBar />

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Maintenance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const Icon = iconMap[asset.category] || HardDrive;
              return (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium capitalize">{asset.category.toLowerCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{asset.tag}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.updatedAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/assets/${asset.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="text-primary border-primary hover:bg-primary/5">
                        <Link href={`/dashboard/logs/new?assetId=${asset.id}`}>
                          Create Log
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No assets found. Start by adding one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
