import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verify } from "otplib";
import { CredentialsSignin } from "next-auth";

class OTPRequiredError extends CredentialsSignin {
  constructor() {
    super();
    this.code = "OTP_REQUIRED";
  }
}
class InvalidOTPError extends CredentialsSignin {
  constructor() {
    super();
    this.code = "INVALID_OTP";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        console.log("User found:", !!user);

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        // 2FA Check
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.otp) {
            throw new OTPRequiredError();
          }
          
          const isValidOTP = verify({
            token: credentials.otp as string,
            secret: user.twoFactorSecret
          });

          if (!isValidOTP) {
            throw new InvalidOTPError();
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV !== "production",
});
