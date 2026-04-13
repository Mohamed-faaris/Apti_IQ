import { query } from "./_generated/server";
import { v } from "convex/values";

export const listSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").withIndex("by_order").take(50);
  },
});

export const listChaptersBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db.query("chapters").withIndex("by_subjectId_and_order", (q) => q.eq("subjectId", args.subjectId)).take(50);
  },
});

export const listLessonsByChapter = query({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    return await ctx.db.query("lessons").withIndex("by_chapterId_and_order", (q) => q.eq("chapterId", args.chapterId)).take(50);
  },
});
