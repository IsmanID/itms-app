"use server";

import { db } from "@/lib/db";
import { networkLogSchema, NetworkLogFormValues } from "@/lib/schemas/network-log";
import { revalidatePath } from "next/cache";

export async function createNetworkLog(values: NetworkLogFormValues) {
  try {
    const validatedFields = networkLogSchema.parse(values);

    const {
      assetId,
      logNumber,
      date,
      startTime,
      endTime,
      serviceType,
      problemDescription,
      correction,
      engineerSignature,
      customerSignature,
      ...logSpecifics
    } = validatedFields;

    const baseDate = new Date(date);
    const start = new Date(baseDate);
    const [startH, startM] = startTime.split(":").map(Number);
    start.setHours(startH, startM);

    const end = new Date(baseDate);
    const [endH, endM] = endTime.split(":").map(Number);
    end.setHours(endH, endM);

    const result = await db.$transaction(async (tx) => {
      const incident = await tx.incident.create({
        data: {
          logNumber,
          date: baseDate,
          startTime: start,
          endTime: end,
          serviceType,
          problemDescription,
          correction,
          engineerSignature,
          customerSignature,
          assetId,
        },
      });

      const networkLog = await tx.networkLog.create({
        data: {
          incidentId: incident.id,
          physicalCheck: logSpecifics.physicalCheck,
          interfaceStatus: logSpecifics.interfaceStatus,
          cpuUsage: logSpecifics.hardwareResources.cpuUsage,
          ramUsage: logSpecifics.hardwareResources.ramUsage,
          temperature: logSpecifics.hardwareResources.temperature,
          firmwareVersion: logSpecifics.firmwareVersion,
          securityServices: logSpecifics.securityServices || {},
          ipManagement: logSpecifics.ipManagement,
          vlanStatus: logSpecifics.vlanStatus,
          pingResults: logSpecifics.pingResults,
        },
      });

      return { incident, networkLog };
    });

    revalidatePath("/dashboard/logs");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create network log:", error);
    return { success: false, error: "Something went wrong" };
  }
}
