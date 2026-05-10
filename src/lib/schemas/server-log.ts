import { z } from "zod";

export const performanceMetricSchema = z.object({
  scale: z.string().min(1, "Scale is required"),
  counter: z.string().min(1, "Counter is required"),
  last: z.string().optional(),
  avg: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
});

export const serverLogSchema = z.object({
  // Section A: Basic Incident Info
  assetId: z.string().min(1, "Asset is required"),
  logNumber: z.string().min(1, "Log number is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  serviceType: z.enum(["PREVENTIVE", "CORRECTIVE", "ON_CALL", "GUARANTEE"]),
  problemDescription: z.string().min(1, "Problem description is required"),
  correction: z.string().min(1, "Correction is required"),

  // Section B: Physical Checklist
  physicalChecklist: z.object({
    cleaning: z.boolean().default(false),
    cableManagement: z.boolean().default(false),
    powerSupply: z.boolean().default(false),
    coolingSystem: z.boolean().default(false),
  }),

  // Section C: Hardware Specs
  hardwareSpecs: z.object({
    cpu: z.string().min(1, "CPU is required"),
    ram: z.string().min(1, "RAM is required"),
    storage: z.string().min(1, "Storage is required"),
    nic: z.string().min(1, "NIC is required"),
  }),

  // Section D: System Status
  systemStatus: z.object({
    os: z.string().min(1, "OS is required"),
    antivirus: z.string().min(1, "Antivirus is required"),
    ipAddress: z.string().ip("Invalid IP address"),
  }),

  // Section E: Performance Metrics
  performanceMetrics: z.array(performanceMetricSchema).min(1, "At least one metric is required"),

  // Section F: Optimization Tasks
  optimizationTasks: z.object({
    diskCleanup: z.boolean().default(false),
    registryOptimization: z.boolean().default(false),
    softwareUpdates: z.boolean().default(false),
    backupCheck: z.boolean().default(false),
  }),

  // Section G: Hardware Replaced
  hardwareReplaced: z.array(z.object({
    partName: z.string(),
    serialNumber: z.string(),
  })).optional(),

  // Section H: Signatures
  engineerSignature: z.string().min(1, "Engineer signature is required"),
  customerSignature: z.string().min(1, "Customer signature is required"),
});

export type ServerLogFormValues = z.infer<typeof serverLogSchema>;
