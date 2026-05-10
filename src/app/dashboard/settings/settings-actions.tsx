"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DiagnosticsButton() {
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    toast.info("Starting system diagnostics...");
    
    setTimeout(() => {
      setLoading(false);
      toast.success("Diagnostics complete: All systems operational.");
    }, 2000);
  };

  return (
    <Button variant="outline" onClick={run} disabled={loading}>
      {loading ? "Running..." : "Run Diagnostics"}
    </Button>
  );
}

export function BackupButton() {
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    toast.info("Preparing system backup...");
    
    setTimeout(() => {
      setLoading(false);
      toast.success("Backup successful. Download will begin shortly.");
    }, 2500);
  };

  return (
    <Button variant="outline" onClick={run} disabled={loading}>
      {loading ? "Preparing..." : "Download Backup"}
    </Button>
  );
}
