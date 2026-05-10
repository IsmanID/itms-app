"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverLogSchema, ServerLogFormValues } from "@/lib/schemas/server-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SignaturePad } from "@/components/ui/signature-pad";
import { Plus, Trash2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { createServerLog } from "@/lib/actions/server-log";
import { toast } from "sonner";

const steps = [
  "Incident Info",
  "Physical & Hardware",
  "System & Performance",
  "Optimization & Parts",
  "Sign-off"
];

export function ServerLogForm({ assetId }: { assetId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServerLogFormValues>({
    resolver: zodResolver(serverLogSchema),
    defaultValues: {
      assetId,
      date: new Date(),
      serviceType: "PREVENTIVE",
      physicalChecklist: {
        cleaning: false,
        cableManagement: false,
        powerSupply: false,
        coolingSystem: false,
      },
      optimizationTasks: {
        diskCleanup: false,
        registryOptimization: false,
        softwareUpdates: false,
        backupCheck: false,
      },
      performanceMetrics: [
        { scale: "CPU", counter: "% Processor Time", last: "0", avg: "0", min: "0", max: "0" },
        { scale: "Memory", counter: "% Committed Bytes", last: "0", avg: "0", min: "0", max: "0" }
      ],
      hardwareReplaced: [],
    }
  });

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control: form.control,
    name: "performanceMetrics"
  });

  const { fields: partFields, append: appendPart, remove: removePart } = useFieldArray({
    control: form.control,
    name: "hardwareReplaced"
  });

  const onSubmit = async (data: ServerLogFormValues) => {
    setIsSubmitting(true);
    const result = await createServerLog(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Server log saved successfully!");
      router.push(`/dashboard/logs/${result.data?.incident.id}`);
    } else {
      toast.error(result.error || "Failed to save log");
    }
  };

  const nextStep = async () => {
    // In a real app, you'd validate only the current step's fields here
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Server Maintenance Log</CardTitle>
            <CardDescription>Comprehensive ITMS maintenance report</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            <Progress value={progressValue} className="w-32 mt-2" />
          </div>
        </div>
        <div className="flex gap-2">
          {steps.map((step, i) => (
            <div 
              key={step} 
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= currentStep ? "bg-primary" : "bg-primary/20"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Step 0: Incident Info */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="logNumber">Log Number</Label>
                <Input {...form.register("logNumber")} placeholder="e.g. LOG-2024-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select 
                  onValueChange={(v) => form.setValue("serviceType", v as any)}
                  defaultValue={form.getValues("serviceType")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREVENTIVE">Preventive Maintenance</SelectItem>
                    <SelectItem value="CORRECTIVE">Corrective Maintenance</SelectItem>
                    <SelectItem value="ON_CALL">On-Call Support</SelectItem>
                    <SelectItem value="GUARANTEE">Guarantee Claim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input type="time" {...form.register("startTime")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input type="time" {...form.register("endTime")} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="problemDescription">Problem Description</Label>
                <Textarea {...form.register("problemDescription")} placeholder="Describe the initial state/problem..." />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="correction">Correction / Action Taken</Label>
                <Textarea {...form.register("correction")} placeholder="What steps were taken to resolve/maintain?" />
              </div>
            </div>
          )}

          {/* Step 1: Physical & Hardware */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Physical Checklist</h3>
                  {Object.keys(form.getValues("physicalChecklist")).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key}
                        checked={form.watch(`physicalChecklist.${key as keyof typeof serverLogSchema._type.physicalChecklist}`)}
                        onCheckedChange={(checked) => form.setValue(`physicalChecklist.${key as keyof typeof serverLogSchema._type.physicalChecklist}`, !!checked)}
                      />
                      <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Hardware Specs</h3>
                  <div className="space-y-2">
                    <Label>CPU</Label>
                    <Input {...form.register("hardwareSpecs.cpu")} placeholder="e.g. Xeon E5-2670" />
                  </div>
                  <div className="space-y-2">
                    <Label>RAM</Label>
                    <Input {...form.register("hardwareSpecs.ram")} placeholder="e.g. 32GB ECC" />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage</Label>
                    <Input {...form.register("hardwareSpecs.storage")} placeholder="e.g. 2x 1TB SSD RAID 1" />
                  </div>
                  <div className="space-y-2">
                    <Label>NIC</Label>
                    <Input {...form.register("hardwareSpecs.nic")} placeholder="e.g. 2x 10Gbps SFP+" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: System & Performance */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Operating System</Label>
                  <Input {...form.register("systemStatus.os")} placeholder="e.g. Windows Server 2022" />
                </div>
                <div className="space-y-2">
                  <Label>Antivirus Status</Label>
                  <Input {...form.register("systemStatus.antivirus")} placeholder="e.g. Defender Active" />
                </div>
                <div className="space-y-2">
                  <Label>IP Address</Label>
                  <Input {...form.register("systemStatus.ipAddress")} placeholder="192.168.1.100" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Performance Metrics</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendMetric({ scale: "", counter: "", last: "", avg: "", min: "", max: "" })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Metric
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Scale</th>
                        <th className="p-2 text-left">Counter</th>
                        <th className="p-2 text-left">Last</th>
                        <th className="p-2 text-left">Avg</th>
                        <th className="p-2 text-left">Min</th>
                        <th className="p-2 text-left">Max</th>
                        <th className="p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricFields.map((field, index) => (
                        <tr key={field.id} className="border-t">
                          <td className="p-1"><Input variant="ghost" {...form.register(`performanceMetrics.${index}.scale`)} /></td>
                          <td className="p-1"><Input variant="ghost" {...form.register(`performanceMetrics.${index}.counter`)} /></td>
                          <td className="p-1"><Input variant="ghost" {...form.register(`performanceMetrics.${index}.last`)} /></td>
                          <td className="p-1"><Input variant="ghost" {...form.register(`performanceMetrics.${index}.avg`)} /></td>
                          <td className="p-1"><Input variant="ghost" {...form.register(`performanceMetrics.${index}.min`)} /></td>
                          <td className="p-1"><Input variant="ghost" {...form.register(`performanceMetrics.${index}.max`)} /></td>
                          <td className="p-1 text-center">
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeMetric(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Optimization & Parts */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Optimization Tasks</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(form.getValues("optimizationTasks")).map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key}
                        checked={form.watch(`optimizationTasks.${key as keyof typeof serverLogSchema._type.optimizationTasks}`)}
                        onCheckedChange={(checked) => form.setValue(`optimizationTasks.${key as keyof typeof serverLogSchema._type.optimizationTasks}`, !!checked)}
                      />
                      <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Hardware Replaced</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendPart({ partName: "", serialNumber: "" })}>
                    <Plus className="h-4 w-4 mr-1" /> Add Part
                  </Button>
                </div>
                {partFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end border p-3 rounded-lg bg-muted/20">
                    <div className="flex-1 space-y-1">
                      <Label>Part Name</Label>
                      <Input {...form.register(`hardwareReplaced.${index}.partName`)} placeholder="e.g. PSU 750W" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label>Serial Number</Label>
                      <Input {...form.register(`hardwareReplaced.${index}.serialNumber`)} placeholder="SN-XXXX-XXXX" />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removePart(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {partFields.length === 0 && <p className="text-sm text-muted-foreground italic">No hardware replaced in this session.</p>}
              </div>
            </div>
          )}

          {/* Step 4: Sign-off */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <SignaturePad 
                label="Engineer Signature" 
                onSave={(sig) => form.setValue("engineerSignature", sig)}
              />
              <SignaturePad 
                label="Customer Signature" 
                onSave={(sig) => form.setValue("customerSignature", sig)}
              />
              {form.formState.errors.engineerSignature && <p className="text-destructive text-xs">{form.formState.errors.engineerSignature.message}</p>}
              {form.formState.errors.customerSignature && <p className="text-destructive text-xs">{form.formState.errors.customerSignature.message}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Saving..." : "Submit Maintenance Log"} <Save className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
