import { query } from "./_generated/server";
import { v } from "convex/values";

export const listSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").withIndex("by_order").take(100);
  },
});

export const listChaptersBySubject = query({
  args: { subjectLegacyId: v.string() },
  handler: async (ctx, args) => {
    const subject = await ctx.db
      .query("subjects")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.subjectLegacyId))
      .unique();
    if (!subject) return [];
    return await ctx.db.query("chapters").withIndex("by_subjectId_and_order", (q) => q.eq("subjectId", subject._id)).take(100);
  },
});

export const listLessonsByChapter = query({
  args: { chapterLegacyId: v.string() },
  handler: async (ctx, args) => {
    const chapter = await ctx.db
      .query("chapters")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.chapterLegacyId))
      .unique();
    if (!chapter) return [];
    return await ctx.db.query("lessons").withIndex("by_chapterId_and_order", (q) => q.eq("chapterId", chapter._id)).take(100);
  },
});

export const getLessonByLegacyId = query({
  args: { lessonLegacyId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.lessonLegacyId))
      .unique();
  },
});

export const getTestByLegacyId = query({
  args: { testLegacyId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tests")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.testLegacyId))
      .unique();
  },
});

export const getProfileByLegacyId = query({
  args: { profileLegacyId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profile")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.profileLegacyId))
      .unique();
  },
});

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("profile")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async () => ({
    currentStreak: 7,
    totalTests: 24,
    accuracy: 87.5,
    weakestSubject: "Verbal Ability",
    recentActivity: [
      { id: "1", type: "test" as const, title: "Mock Test 5", timestamp: new Date().toISOString(), score: 85 },
      { id: "2", type: "lesson" as const, title: "Algebra Basics", timestamp: new Date().toISOString() },
    ],
    badges: [{ id: "1", name: "First Test", icon: "🎯", description: "Completed first test", earnedAt: new Date().toISOString() }],
  }),
});

export const listLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("leaderboard").take(100)).sort((a, b) => b.score - a.score);
  },
});

export const listAnalytics = query({
  args: {},
  handler: async () => ({
    subjectAccuracy: [
      { subject: "Mathematics", accuracy: 85 },
      { subject: "Logical Reasoning", accuracy: 78 },
      { subject: "Verbal Ability", accuracy: 72 },
      { subject: "Data Interpretation", accuracy: 90 },
    ],
    performanceOverTime: Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - (9 - i) * 86400000).toLocaleDateString(),
      score: 70 + i,
    })),
    strengthWeakness: [
      { label: "Strengths", value: 65 },
      { label: "Weaknesses", value: 35 },
    ],
    avgTimePerQuestion: 2.5,
  }),
});

export const listTournaments = query({
  args: { levelFilter: v.string(), statusFilter: v.string() },
  handler: async (ctx, args) => {
    let tournaments = await ctx.db.query("tournaments").take(100);
    if (args.levelFilter !== "all") {
      tournaments = tournaments.filter((t) => t.organizerType === args.levelFilter);
    }
    if (args.statusFilter !== "all") {
      tournaments = tournaments.filter((t) => t.status === args.statusFilter);
    }
    return tournaments;
  },
});

export const getTournamentByLegacyId = query({
  args: { tournamentLegacyId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournaments")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.tournamentLegacyId))
      .unique();
  },
});

export const getTestResultByLegacyId = query({
  args: { resultLegacyId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testResults")
      .withIndex("by_legacyId", (q) => q.eq("legacyId", args.resultLegacyId))
      .unique();
  },
});

export const listTestResultsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("testResults").withIndex("by_userId", (q) => q.eq("userId", args.userId)).take(100);
  },
});
