"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Mail, Loader2, Key } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        otp,
        redirect: false,
      });

      console.log("SignIn Result:", result);
      if (result?.error || result?.code) {
        const errorCode = (result as any).code || result?.error;
        if (errorCode?.includes("OTP_REQUIRED") || errorCode === "OTP_REQUIRED") {
          setIsOtpRequired(true);
          toast.info("2FA Required. Please enter your Google Authenticator code.");
        } else if (errorCode?.includes("INVALID_OTP") || errorCode === "INVALID_OTP") {
          toast.error("Invalid OTP code.");
        } else {
          toast.error("Invalid email or password.");
        }
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2 text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">ITMS Portal</CardTitle>
          <CardDescription>Managed Service Authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {!isOtpRequired ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@itms-portal.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-center space-y-2">
                  <p className="text-sm font-medium text-primary">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Please enter the 6-digit code from your authenticator app for <strong>{email}</strong></p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Authenticator Code</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input 
                      id="otp" 
                      type="text" 
                      placeholder="000000" 
                      className="pl-10 font-mono tracking-[0.5em] text-xl text-center h-12"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs" 
                  type="button"
                  onClick={() => {
                    setIsOtpRequired(false);
                    setOtp("");
                  }}
                >
                  ← Back to Login
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isOtpRequired ? "Verify & Sign In" : "Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground justify-center">
          Secure Access Monitoring Active
        </CardFooter>
      </Card>
    </div>
  );
}
