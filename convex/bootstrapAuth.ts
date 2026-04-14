import { action } from "./_generated/server";
import { createAccount } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

const demoAccounts = [
  { email: "demo@aptiq.com", secret: "Demo@1234", name: "John Doe", role: "student" as const },
  { email: "teacher@aptiq.com", secret: "Teacher@1234", name: "Prof. Smith", role: "teacher" as const },
  { email: "admin@aptiq.com", secret: "Admin@1234", name: "Admin User", role: "admin" as const },
];

const profileByEmail = {
  "demo@aptiq.com": { college: "MIT" },
  "teacher@aptiq.com": { college: "AptIQ Academy" },
  "admin@aptiq.com": { college: "AptIQ Platform" },
} as const;

export const bootstrapDemoAuth = action({
  args: {},
  handler: async (ctx) => {
    for (const account of demoAccounts) {
      try {
        const { user } = await createAccount(ctx, {
          provider: "password",
          account: { id: account.email, secret: account.secret },
          profile: {
            email: account.email,
            name: account.name,
          },
        });

        await ctx.runMutation(api.bootstrapProfile.upsertDemoProfile, {
          userId: String(user._id),
          email: account.email,
          name: account.name,
          college: profileByEmail[account.email as keyof typeof profileByEmail].college,
          role: account.role,
        });
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes("already exists")) {
          throw error;
        }
      }
    }
  },
});
