"use server";

import { db } from "@/lib/db";
import { serverLogSchema, ServerLogFormValues } from "@/lib/schemas/server-log";
import { revalidatePath } from "next/cache";

export async function createServerLog(values: ServerLogFormValues) {
  try {
    const validatedFields = serverLogSchema.parse(values);

    const {
      assetId,
      logNumber,
      date,
      startTime,
      endTime,
      serviceType,
      problemDescription,
      correction,
      hardwareReplaced,
      engineerSignature,
      customerSignature,
      ...logSpecifics
    } = validatedFields;

    // Convert time strings to full dates for DB storage
    const baseDate = new Date(date);
    const start = new Date(baseDate);
    const [startH, startM] = startTime.split(":").map(Number);
    start.setHours(startH, startM);

    const end = new Date(baseDate);
    const [endH, endM] = endTime.split(":").map(Number);
    end.setHours(endH, endM);

    const result = await db.$transaction(async (tx) => {
      // 1. Create Incident
      const incident = await tx.incident.create({
        data: {
          logNumber,
          date: baseDate,
          startTime: start,
          endTime: end,
          serviceType,
          problemDescription,
          correction,
          hardwareReplaced: hardwareReplaced || undefined,
          engineerSignature,
          customerSignature,
          assetId,
        },
      });

      // 2. Create ServerLog
      const serverLog = await tx.serverLog.create({
        data: {
          incidentId: incident.id,
          physicalChecklist: logSpecifics.physicalChecklist,
          cpu: logSpecifics.hardwareSpecs.cpu,
          ram: logSpecifics.hardwareSpecs.ram,
          storage: logSpecifics.hardwareSpecs.storage,
          nic: logSpecifics.hardwareSpecs.nic,
          os: logSpecifics.systemStatus.os,
          antivirus: logSpecifics.systemStatus.antivirus,
          ipAddress: logSpecifics.systemStatus.ipAddress,
          performanceMetrics: logSpecifics.performanceMetrics,
          optimizationTasks: logSpecifics.optimizationTasks,
        },
      });

      return { incident, serverLog };
    });

    revalidatePath("/dashboard/logs");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create server log:", error);
    return { success: false, error: "Something went wrong" };
  }
}
