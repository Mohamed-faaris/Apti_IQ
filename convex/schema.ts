import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  subjects: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    icon: v.string(),
    description: v.string(),
    chaptersCount: v.number(),
    order: v.number(),
  }).index("by_order", ["order"]).index("by_name", ["name"]).index("by_legacyId", ["legacyId"]),
  chapters: defineTable({
    legacyId: v.optional(v.string()),
    subjectId: v.id("subjects"),
    subjectLegacyId: v.optional(v.string()),
    name: v.string(),
    description: v.string(),
    lessonsCount: v.number(),
    progress: v.number(),
    order: v.number(),
  })
    .index("by_subjectId", ["subjectId"])
    .index("by_subjectId_and_order", ["subjectId", "order"])
    .index("by_subjectId_and_name", ["subjectId", "name"])
    .index("by_subjectLegacyId", ["subjectLegacyId"])
    .index("by_legacyId", ["legacyId"]),
  lessons: defineTable({
    legacyId: v.optional(v.string()),
    chapterId: v.id("chapters"),
    chapterLegacyId: v.optional(v.string()),
    name: v.string(),
    content: v.string(),
    duration: v.number(),
    completed: v.boolean(),
    order: v.number(),
    videoUrl: v.optional(v.string()),
  })
    .index("by_chapterId", ["chapterId"])
    .index("by_chapterId_and_order", ["chapterId", "order"])
    .index("by_chapterId_and_name", ["chapterId", "name"])
    .index("by_chapterLegacyId", ["chapterLegacyId"])
    .index("by_legacyId", ["legacyId"]),
  tests: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    duration: v.number(),
    totalMarks: v.number(),
    questions: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        explanation: v.optional(v.string()),
        subject: v.optional(v.string()),
      }),
    ),
  }).index("by_name", ["name"]).index("by_legacyId", ["legacyId"]),
  testResults: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.string(),
    testId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    timeTaken: v.number(),
    subjectBreakdown: v.array(
      v.object({
        subject: v.string(),
        correct: v.number(),
        total: v.number(),
        accuracy: v.number(),
      }),
    ),
    answers: v.record(v.string(), v.number()),
    completedAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_testId", ["userId", "testId"])
    .index("by_legacyId", ["legacyId"]),
  leaderboard: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.string(),
    name: v.string(),
    college: v.string(),
    score: v.number(),
    testsCompleted: v.number(),
    accuracy: v.number(),
    profilePicture: v.optional(v.string()),
  }).index("by_score", ["score"]).index("by_legacyId", ["legacyId"]),
  profile: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.string(),
    name: v.string(),
    college: v.optional(v.string()),
    linkedIn: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")),
    badges: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        icon: v.string(),
        description: v.string(),
        earnedAt: v.string(),
      }),
    ),
  }).index("by_userId", ["userId"]).index("by_legacyId", ["legacyId"]),
  tournaments: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.string(),
    organizer: v.string(),
    organizerType: v.union(
      v.literal("world"),
      v.literal("country"),
      v.literal("region"),
      v.literal("state"),
      v.literal("company"),
      v.literal("college"),
    ),
    level: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"), v.literal("expert")),
    startDate: v.string(),
    endDate: v.string(),
    registrationDeadline: v.string(),
    status: v.union(v.literal("upcoming"), v.literal("ongoing"), v.literal("completed")),
    participants: v.number(),
    maxParticipants: v.optional(v.number()),
    prizePool: v.string(),
    prizes: v.array(
      v.object({
        position: v.string(),
        reward: v.string(),
        badge: v.optional(v.string()),
      }),
    ),
    eligibility: v.string(),
    duration: v.number(),
    questionsCount: v.number(),
    isRegistered: v.boolean(),
    thumbnail: v.optional(v.string()),
    tags: v.array(v.string()),
  }).index("by_status", ["status"]).index("by_name", ["name"]).index("by_legacyId", ["legacyId"]),
  teacherClasses: defineTable({
    legacyId: v.optional(v.string()),
    teacherId: v.string(),
    name: v.string(),
    subject: v.string(),
    code: v.string(),
    students: v.number(),
    createdAt: v.string(),
  }).index("by_teacherId", ["teacherId"]).index("by_code", ["code"]).index("by_legacyId", ["legacyId"]),
  classNotes: defineTable({
    legacyId: v.optional(v.string()),
    classId: v.string(),
    title: v.string(),
    content: v.string(),
    fileName: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_classId", ["classId"]).index("by_legacyId", ["legacyId"]),
  classUpdates: defineTable({
    legacyId: v.optional(v.string()),
    classId: v.string(),
    message: v.string(),
    createdAt: v.string(),
  }).index("by_classId", ["classId"]).index("by_legacyId", ["legacyId"]),
  teacherTests: defineTable({
    legacyId: v.optional(v.string()),
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
    createdAt: v.string(),
  }).index("by_classId", ["classId"]).index("by_code", ["code"]).index("by_legacyId", ["legacyId"]),
  teacherAnnouncements: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    message: v.string(),
    date: v.string(),
  }).index("by_legacyId", ["legacyId"]),
});
