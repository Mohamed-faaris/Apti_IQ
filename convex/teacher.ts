import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listTeacherClasses = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("teacherClasses").withIndex("by_teacherId", (q) => q.eq("teacherId", args.teacherId)).take(100);
  },
});

export const createTeacherClass = mutation({
  args: { teacherId: v.string(), name: v.string(), subject: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teacherClasses", {
      teacherId: args.teacherId,
      name: args.name,
      subject: args.subject,
      code: args.code,
      students: 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const deleteTeacherClass = mutation({
  args: { classId: v.string() },
  handler: async (ctx, args) => {
    const klass = await ctx.db.query("teacherClasses").withIndex("by_legacyId", (q) => q.eq("legacyId", args.classId)).unique();
    if (klass) await ctx.db.delete(klass._id);
  },
});

export const listClassNotes = query({
  args: { classId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("classNotes").withIndex("by_classId", (q) => q.eq("classId", args.classId)).take(100);
  },
});

export const listClassUpdates = query({
  args: { classId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("classUpdates").withIndex("by_classId", (q) => q.eq("classId", args.classId)).take(100);
  },
});

export const addClassNote = mutation({
  args: { classId: v.string(), title: v.string(), content: v.string(), fileName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("classNotes", {
      classId: args.classId,
      title: args.title,
      content: args.content,
      fileName: args.fileName,
      createdAt: new Date().toISOString(),
    });
  },
});

export const addClassUpdate = mutation({
  args: { classId: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("classUpdates", {
      classId: args.classId,
      message: args.message,
      createdAt: new Date().toISOString(),
    });
  },
});

export const listTeacherTests = query({
  args: { classId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("teacherTests").withIndex("by_classId", (q) => q.eq("classId", args.classId)).take(100);
  },
});

export const createTeacherTest = mutation({
  args: {
    classId: v.string(),
    code: v.string(),
    title: v.string(),
    subject: v.string(),
    duration: v.string(),
    totalMarks: v.string(),
    startDate: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endDate: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isScheduled: v.boolean(),
    status: v.union(v.literal("active"), v.literal("scheduled")),
    questions: v.array(v.object({ id: v.string(), text: v.string(), options: v.array(v.string()), correctAnswer: v.number() })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teacherTests", {
      legacyId: args.code,
      classId: args.classId,
      code: args.code,
      title: args.title,
      subject: args.subject,
      duration: args.duration,
      totalMarks: args.totalMarks,
      startDate: args.startDate,
      startTime: args.startTime,
      endDate: args.endDate,
      endTime: args.endTime,
      isScheduled: args.isScheduled,
      status: args.status,
      questions: args.questions,
      createdAt: new Date().toISOString(),
    });
  },
});

export const listAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teacherAnnouncements").take(100);
  },
});

export const addAnnouncement = mutation({
  args: { title: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teacherAnnouncements", {
      title: args.title,
      message: args.message,
      date: new Date().toISOString().split('T')[0],
    });
  },
});
