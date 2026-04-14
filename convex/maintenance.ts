import { mutation } from "./_generated/server";

export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const clear = async <T extends string>(table: T) => {
      const docs = await (ctx.db.query(table as any) as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    };

    await clear("classNotes");
    await clear("classUpdates");
    await clear("chapters");
    await clear("leaderboard");
    await clear("lessons");
    await clear("profile");
    await clear("subjects");
    await clear("teacherAnnouncements");
    await clear("teacherClasses");
    await clear("teacherTests");
    await clear("testResults");
    await clear("tests");
    await clear("tournaments");
    await clear("users");
    await clear("authSessions");
    await clear("authAccounts");
    await clear("authRefreshTokens");
    await clear("authVerificationCodes");
    await clear("authVerifiers");
    await clear("authRateLimits");
  },
});
