import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertDemoProfile = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    college: v.optional(v.string()),
    role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("profile").withIndex("by_legacyId", (q) => q.eq("legacyId", args.email)).unique();
    const data = {
      legacyId: args.email,
      userId: args.userId,
      name: args.name,
      college: args.college,
      role: args.role,
      badges: [],
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return;
    }

    await ctx.db.insert("profile", data);
  },
});
