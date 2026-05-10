"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { networkLogSchema, NetworkLogFormValues } from "@/lib/schemas/network-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SignaturePad } from "@/components/ui/signature-pad";
import { ChevronLeft, ChevronRight, Save, Activity, ShieldCheck, Network } from "lucide-react";
import { createNetworkLog } from "@/lib/actions/network-log";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  "Incident Info",
  "Physical & Interfaces",
  "Health & Security",
  "Connectivity Tests",
  "Sign-off"
];

export function NetworkLogForm({ assetId, isFirewall = false }: { assetId: string, isFirewall?: boolean }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill 13 interfaces
  const initialInterfaces: Record<string, "UP" | "DOWN" | "DISABLED"> = {};
  for (let i = 1; i <= 13; i++) {
    initialInterfaces[`Ether${i}`] = "UP";
  }

  const form = useForm<NetworkLogFormValues>({
    resolver: zodResolver(networkLogSchema),
    defaultValues: {
      assetId,
      date: new Date(),
      serviceType: "PREVENTIVE",
      physicalCheck: {
        cleaning: false,
        cableManagement: false,
        powerSupply: false,
        rackMounting: false,
      },
      interfaceStatus: initialInterfaces,
      securityServices: isFirewall ? {
        webFilter: false,
        ips: false,
        appControl: false,
        antispam: false,
      } : undefined,
    }
  });

  const onSubmit = async (data: NetworkLogFormValues) => {
    setIsSubmitting(true);
    const result = await createNetworkLog(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Network log saved successfully!");
      router.push(`/dashboard/logs/${result.data?.incident.id}`);
    } else {
      toast.error(result.error || "Failed to save log");
    }
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="bg-blue-50/50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <Network className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{isFirewall ? "Firewall" : "Switch"} Maintenance Log</CardTitle>
              <CardDescription>Network infrastructure health report</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            <Progress value={progressValue} className="w-32 mt-2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Step 0: Incident Info */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label>Log Number</Label>
                <Input {...form.register("logNumber")} placeholder="LOG-NET-001" />
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select onValueChange={(v) => form.setValue("serviceType", v as any)} defaultValue={form.getValues("serviceType")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                    <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" {...form.register("startTime")} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" {...form.register("endTime")} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Problem Description</Label>
                <Textarea {...form.register("problemDescription")} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Correction</Label>
                <Textarea {...form.register("correction")} />
              </div>
            </div>
          )}

          {/* Step 1: Physical & Interfaces */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Physical Checklist</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(form.getValues("physicalCheck")).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key}
                        checked={form.watch(`physicalCheck.${key as keyof typeof networkLogSchema._type.physicalCheck}`)}
                        onCheckedChange={(checked) => form.setValue(`physicalCheck.${key as keyof typeof networkLogSchema._type.physicalCheck}`, !!checked)}
                      />
                      <Label htmlFor={key} className="capitalize text-xs">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Interface Status (Ether 1-13)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.keys(form.getValues("interfaceStatus")).map((port) => (
                    <div key={port} className="p-2 border rounded-md bg-muted/20">
                      <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">{port}</Label>
                      <Select 
                        onValueChange={(v) => form.setValue(`interfaceStatus.${port}`, v as any)}
                        defaultValue={form.getValues(`interfaceStatus.${port}`)}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UP" className="text-green-600">UP</SelectItem>
                          <SelectItem value="DOWN" className="text-red-600">DOWN</SelectItem>
                          <SelectItem value="DISABLED" className="text-slate-500">DISABLED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health & Security */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>CPU Usage (%)</Label>
                  <Input {...form.register("hardwareResources.cpuUsage")} placeholder="e.g. 15%" />
                </div>
                <div className="space-y-2">
                  <Label>RAM Usage (%)</Label>
                  <Input {...form.register("hardwareResources.ramUsage")} placeholder="e.g. 40%" />
                </div>
                <div className="space-y-2">
                  <Label>Temperature (°C)</Label>
                  <Input {...form.register("hardwareResources.temperature")} placeholder="e.g. 42°C" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Firmware Version</Label>
                <Input {...form.register("firmwareVersion")} placeholder="e.g. v7.2.4 LTS" />
              </div>

              {isFirewall && (
                <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    Security Services
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["webFilter", "ips", "appControl", "antispam"].map((key) => {
                      const securityServices = form.watch("securityServices");
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sec-${key}`}
                            checked={!!securityServices?.[key as keyof typeof securityServices]}
                            onCheckedChange={(checked) => form.setValue(`securityServices.${key}` as any, !!checked)}
                          />
                          <Label htmlFor={`sec-${key}`} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Connectivity Tests */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label>IP Management / Interface IP</Label>
                <Input {...form.register("ipManagement")} placeholder="e.g. 10.0.0.1/24" />
              </div>
              <div className="space-y-2">
                <Label>VLAN Status</Label>
                <Input {...form.register("vlanStatus")} placeholder="e.g. VLAN 10, 20, 30 Active" />
              </div>
              <div className="space-y-2">
                <Label>Ping / Traceroute Results</Label>
                <Textarea {...form.register("pingResults")} placeholder="Paste test results here..." className="font-mono text-xs" />
              </div>
            </div>
          )}

          {/* Step 4: Sign-off */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4">
              <SignaturePad label="Engineer Signature" onSave={(sig) => form.setValue("engineerSignature", sig)} />
              <SignaturePad label="Customer Signature" onSave={(sig) => form.setValue("customerSignature", sig)} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Saving..." : "Submit Network Log"} <Save className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
