import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const markLessonComplete = mutation({
  args: { lessonLegacyId: v.string() },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.query("lessons").withIndex("by_legacyId", (q) => q.eq("legacyId", args.lessonLegacyId)).unique();
    if (!lesson) throw new Error("Lesson not found");
    await ctx.db.patch(lesson._id, { completed: true });
  },
});

export const updateProfile = mutation({
  args: {
    profileLegacyId: v.string(),
    name: v.optional(v.string()),
    college: v.optional(v.string()),
    linkedIn: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.query("profile").withIndex("by_legacyId", (q) => q.eq("legacyId", args.profileLegacyId)).unique();
    if (!profile) throw new Error("Profile not found");
    await ctx.db.patch(profile._id, {
      name: args.name ?? profile.name,
      college: args.college ?? profile.college,
      linkedIn: args.linkedIn ?? profile.linkedIn,
      profilePicture: args.profilePicture ?? profile.profilePicture,
    });
  },
});

export const registerTournament = mutation({
  args: { tournamentLegacyId: v.string() },
  handler: async (ctx, args) => {
    const tournament = await ctx.db.query("tournaments").withIndex("by_legacyId", (q) => q.eq("legacyId", args.tournamentLegacyId)).unique();
    if (!tournament) throw new Error("Tournament not found");
    await ctx.db.patch(tournament._id, {
      isRegistered: true,
      participants: tournament.participants + 1,
    });
  },
});
