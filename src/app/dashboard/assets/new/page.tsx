"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAsset } from "@/lib/actions/assets";

export default function NewAssetPage() {
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

    const result = await createAsset(data);
    setLoading(false);

    if (result.success) {
      toast.success("Asset created successfully");
      router.push("/dashboard/assets");
    } else {
      toast.error("Failed to create asset");
    }
  }

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Register New IT Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Asset Tag</Label>
              <Input name="tag" placeholder="e.g. SRV-001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="SERVER">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              <Input name="serialNumber" placeholder="e.g. SN12345678" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input name="location" placeholder="e.g. Data Center Room A" required />
            </div>
            <div className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Asset"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
