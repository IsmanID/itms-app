import { z } from "zod";

export const networkLogSchema = z.object({
  // Section A: Basic Incident Info
  assetId: z.string().min(1, "Asset is required"),
  logNumber: z.string().min(1, "Log number is required"),
  date: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  serviceType: z.enum(["PREVENTIVE", "CORRECTIVE", "ON_CALL", "GUARANTEE"]),
  problemDescription: z.string().min(1, "Problem description is required"),
  correction: z.string().min(1, "Correction is required"),

  // Section B: Physical Checklist
  physicalCheck: z.object({
    cleaning: z.boolean().default(false),
    cableManagement: z.boolean().default(false),
    powerSupply: z.boolean().default(false),
    rackMounting: z.boolean().default(false),
  }),

  // Section C: Interface Status (Ether1-13)
  interfaceStatus: z.record(z.string(), z.enum(["UP", "DOWN", "DISABLED"])).default({}),

  // Section D: Hardware Health
  hardwareResources: z.object({
    cpuUsage: z.string().min(1, "CPU usage is required"),
    ramUsage: z.string().min(1, "RAM usage is required"),
    temperature: z.string().min(1, "Temperature is required"),
  }),

  // Section E: Software & Security
  firmwareVersion: z.string().min(1, "Firmware version is required"),
  securityServices: z.object({
    webFilter: z.boolean().optional(),
    ips: z.boolean().optional(),
    appControl: z.boolean().optional(),
    antispam: z.boolean().optional(),
  }).optional(),

  // Section F: Config & Tests
  ipManagement: z.string().min(1, "IP Management info is required"),
  vlanStatus: z.string().min(1, "VLAN status is required"),
  pingResults: z.string().min(1, "Ping results are required"),

  // Signatures
  engineerSignature: z.string().min(1, "Engineer signature is required"),
  customerSignature: z.string().min(1, "Customer signature is required"),
});

export type NetworkLogFormValues = z.infer<typeof networkLogSchema>;
