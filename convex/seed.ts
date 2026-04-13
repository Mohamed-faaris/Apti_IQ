import { internalMutation } from "./_generated/server";

const subjects = [
  { name: "Mathematics", icon: "📐", description: "Quantitative aptitude", chaptersCount: 5, order: 1 },
  { name: "Logical Reasoning", icon: "🧩", description: "Analytical thinking", chaptersCount: 4, order: 2 },
  { name: "Verbal Ability", icon: "📚", description: "English comprehension", chaptersCount: 6, order: 3 },
  { name: "Data Interpretation", icon: "📊", description: "Charts and graphs", chaptersCount: 3, order: 4 },
] as const;

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingSubjects = await ctx.db.query("subjects").take(1);
    if (existingSubjects.length > 0) {
      return null;
    }

    const subjectIds = await Promise.all(
      subjects.map((subject) => ctx.db.insert("subjects", subject)),
    );

    await ctx.db.insert("chapters", {
      subjectId: subjectIds[0],
      name: "Number Systems",
      description: "Basic number theory and operations",
      lessonsCount: 8,
      progress: 80,
      order: 1,
    });

    await ctx.db.insert("tests", {
      name: "Mock Aptitude Test 1",
      duration: 60,
      totalMarks: 100,
      questions: [
        {
          id: "q-1",
          text: "If a train travels 120 km in 2 hours, what is its average speed?",
          options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
          correctAnswer: 1,
          subject: "Mathematics",
          explanation: "Speed = Distance/Time = 120/2 = 60 km/h",
        },
      ],
    });

    return null;
  },
});
