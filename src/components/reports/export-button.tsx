"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ServerReportPDF } from "./server-report";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface ExportButtonProps {
  data: any;
  logNumber: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function ExportButton({ 
  data, 
  logNumber, 
  variant = "outline", 
  size = "default",
  showText = true
}: ExportButtonProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant={variant} size={size} disabled>
        <FileDown className={showText ? "mr-2 h-4 w-4" : "h-4 w-4"} />
        {showText && "Loading..."}
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ServerReportPDF data={data} />}
      fileName={`Report_${logNumber}.pdf`}
    >
      {({ loading }) => (
        <Button variant={variant} size={size} disabled={loading}>
          <FileDown className={showText ? "mr-2 h-4 w-4" : "h-4 w-4"} />
          {showText && (loading ? "Generating..." : "Export PDF")}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
