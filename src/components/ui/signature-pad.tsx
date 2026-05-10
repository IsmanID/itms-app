"use client";

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface SignaturePadProps {
  label: string;
  onSave: (signature: string) => void;
  defaultValue?: string;
}

export function SignaturePad({ label, onSave, defaultValue }: SignaturePadProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-40 bg-muted animate-pulse rounded-lg border-2" />;
  }

  const clear = () => {
    sigCanvas.current?.clear();
    onSave("");
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      onSave(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          className="h-8 px-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>
      <Card className="overflow-hidden border-2 bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={handleEnd}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
        />
      </Card>
    </div>
  );
}
