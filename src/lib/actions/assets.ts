"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAsset(data: {
  tag: string;
  category: "SERVER" | "SWITCH" | "FIREWALL" | "PC" | "LAPTOP" | "PRINTER" | "OTHER";
  serialNumber: string;
  location: string;
}) {
  try {
    const asset = await db.asset.create({
      data,
    });
    revalidatePath("/dashboard/assets");
    return { success: true, data: asset };
  } catch (error) {
    console.error("Failed to create asset:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function updateAsset(id: string, data: {
  tag: string;
  category: "SERVER" | "SWITCH" | "FIREWALL" | "PC" | "LAPTOP" | "PRINTER" | "OTHER";
  serialNumber: string;
  location: string;
}) {
  try {
    const asset = await db.asset.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/assets");
    return { success: true, data: asset };
  } catch (error) {
    console.error("Failed to update asset:", error);
    return { success: false, error: "Something went wrong" };
  }
}
