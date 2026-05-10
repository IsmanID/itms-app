import React from "react";
import { db } from "@/lib/db";
import { EditAssetForm } from "./edit-form";
import { notFound } from "next/navigation";

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await db.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    notFound();
  }

  return (
    <div className="p-8">
      <EditAssetForm asset={asset} />
    </div>
  );
}
