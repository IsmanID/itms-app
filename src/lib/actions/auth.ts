"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateSecret, generateURI, verify } from "otplib";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function changePassword(data: { current: string; new: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { success: false, error: "User not found" };

  const isValid = await bcrypt.compare(data.current, user.password);
  if (!isValid) return { success: false, error: "Incorrect current password" };

  const hashedPassword = await bcrypt.hash(data.new, 10);
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function generate2FASecret() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const secret = generateSecret();
  const otpauth = generateURI({
    secret,
    label: session.user.email!,
    issuer: "ITMS Portal"
  });

  return { success: true, secret, otpauth };
}

export async function verifyAndEnable2FA(secret: string, token: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const isValid = verify({ token, secret });
  if (!isValid) return { success: false, error: "Invalid verification code" };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function disable2FA() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: null,
      twoFactorEnabled: false,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
