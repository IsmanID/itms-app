"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssetFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      
      if (category && category !== "all") params.set("category", category);
      else params.delete("category");

      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, category, router, searchParams]);

  const clear = () => {
    setSearch("");
    setCategory("all");
    router.push("?");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border shadow-sm items-end">
      <div className="flex-1 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
          <Search className="h-3 w-3" /> Quick Search
        </label>
        <Input 
          placeholder="Search by Tag or Serial..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="w-full md:w-48 space-y-2">
        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
          <Filter className="h-3 w-3" /> Category
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="SERVER">Server</SelectItem>
            <SelectItem value="SWITCH">Switch</SelectItem>
            <SelectItem value="FIREWALL">Firewall</SelectItem>
            <SelectItem value="PC">PC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(search || (category && category !== "all")) && (
        <Button variant="ghost" onClick={clear} className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      )}
    </div>
  );
}
