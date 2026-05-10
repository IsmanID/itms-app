"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateAsset } from "@/lib/actions/assets";

export function EditAssetForm({ asset }: { asset: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      tag: formData.get("tag") as string,
      category: formData.get("category") as any,
      serialNumber: formData.get("serialNumber") as string,
      location: formData.get("location") as string,
    };

    const result = await updateAsset(asset.id, data);
    setLoading(false);

    if (result.success) {
      toast.success("Asset updated successfully");
      router.push("/dashboard/assets");
    } else {
      toast.error("Failed to update asset");
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle>Edit Asset: {asset.tag}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag">Asset Tag</Label>
            <Input name="tag" defaultValue={asset.tag} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={asset.category}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVER">Server</SelectItem>
                <SelectItem value="SWITCH">Switch</SelectItem>
                <SelectItem value="FIREWALL">Firewall</SelectItem>
                <SelectItem value="PC">PC / Desktop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input name="serialNumber" defaultValue={asset.serialNumber} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input name="location" defaultValue={asset.location} required />
          </div>
          <div className="pt-4 flex gap-2 justify-end border-t">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? "Updating..." : "Update Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
