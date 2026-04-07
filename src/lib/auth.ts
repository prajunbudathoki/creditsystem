import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET as string,
  baseURL: (process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL) as string,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  plugins: [nextCookies()],

  user: {
    additionalFields: {
      onboarded: { type: "boolean" },
      credits: { type: "number" },
      username: { type: "string" },
      skills: { type: "string[]" },
      role: { type: "string" },
      isSuspended: { type: "boolean" },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  hooks: {
    after: async (context: any) => {
      // Catch sign-ups to award bonus credits
      if (!context.path.includes("/sign-up")) return context;

      try {
        const response = context.response;
        if (!response || !response.ok) return context;

        const body = await response
          .clone()
          .json()
          .catch(() => null);
        const userId = body?.user?.id;
        if (!userId) return context;

        const existing = await db.creditTransaction.findFirst({
          where: { userId, type: "BONUS_SIGNUP" },
        });

        if (!existing) {
          await db.creditTransaction.create({
            data: {
              userId,
              type: "BONUS_SIGNUP",
              amount: 5,
              description: "Welcome bonus credits!",
            },
          });

          await db.user.update({
            where: { id: userId },
            data: { credits: { increment: 5 } },
          });
        }
        return context;
      } catch (error) {
        console.error("Auth hook error:", error);
        return context;
      }
    },
  },
});

export type Session = typeof auth.$Infer.Session;
