"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      
      if (type && type !== "all") params.set("type", type);
      else params.delete("type");

      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, type, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border shadow-sm items-end">
      <div className="flex-1 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
          <Search className="h-3 w-3" /> Search Logs
        </label>
        <Input 
          placeholder="Search Log No or Asset Tag..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="w-full md:w-48 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
          <Filter className="h-3 w-3" /> Service Type
        </label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PREVENTIVE">Preventive</SelectItem>
            <SelectItem value="CORRECTIVE">Corrective</SelectItem>
            <SelectItem value="ON_CALL">On-Call</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(search || (type && type !== "all")) && (
        <Button variant="ghost" onClick={() => { setSearch(""); setType("all"); router.push("?"); }} className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      )}
    </div>
  );
}
