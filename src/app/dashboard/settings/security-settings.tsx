"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Key, Loader2, QrCode, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { changePassword, generate2FASecret, verifyAndEnable2FA, disable2FA } from "@/lib/actions/auth";
import QRCode from "qrcode";

export function SecuritySettings({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<{ secret: string; qr: string } | null>(null);
  const [otpToken, setOtpToken] = useState("");

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const current = formData.get("current") as string;
    const newPass = formData.get("new") as string;
    const confirm = formData.get("confirm") as string;

    if (newPass !== confirm) {
      toast.error("New passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await changePassword({ current, new: newPass });
    setLoading(false);
    if (result.success) {
      toast.success("Password updated successfully.");
      e.currentTarget.reset();
    } else {
      toast.error(result.error);
    }
  };

  const setup2FA = async () => {
    setLoading(true);
    const result = await generate2FASecret();
    if (result.success && result.otpauth) {
      const qr = await QRCode.toDataURL(result.otpauth);
      setTwoFactorData({ secret: result.secret!, qr });
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const confirm2FA = async () => {
    if (!twoFactorData) return;
    setLoading(true);
    const result = await verifyAndEnable2FA(twoFactorData.secret, otpToken);
    if (result.success) {
      toast.success("2FA enabled successfully.");
      setTwoFactorData(null);
      setOtpToken("");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const remove2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) return;
    setLoading(true);
    const result = await disable2FA();
    if (result.success) {
      toast.success("2FA disabled.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> Change Password
          </CardTitle>
          <CardDescription>Secure your account with a strong password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input name="current" type="password" required />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input name="new" type="password" required />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input name="confirm" type="password" required />
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>Add an extra layer of security using Google Authenticator.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.twoFactorEnabled ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-4 rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5" /> 2FA is currently active
              </div>
              <Button variant="destructive" onClick={remove2FA} disabled={loading} className="w-fit">
                Disable 2FA
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 font-medium bg-amber-50 p-4 rounded-lg border border-amber-200">
                <AlertCircle className="h-5 w-5" /> 2FA is not yet enabled
              </div>
              
              {!twoFactorData ? (
                <Button onClick={setup2FA} disabled={loading}>
                  <QrCode className="h-4 w-4 mr-2" /> Setup 2FA
                </Button>
              ) : (
                <div className="space-y-4 p-6 border rounded-xl bg-slate-50 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                      <img src={twoFactorData.qr} alt="QR Code" className="w-48 h-48" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="text-sm font-medium">
                        1. Scan this QR code with Google Authenticator.<br/>
                        2. Enter the 6-digit code below to confirm.
                      </div>
                      <div className="space-y-2">
                        <Label>Verification Code</Label>
                        <Input 
                          placeholder="000000" 
                          value={otpToken}
                          onChange={(e) => setOtpToken(e.target.value)}
                          className="font-mono text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={confirm2FA} disabled={loading || otpToken.length !== 6}>
                          Verify & Enable
                        </Button>
                        <Button variant="ghost" onClick={() => setTwoFactorData(null)}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
