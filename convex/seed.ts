import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const subjects = [
  { legacyId: "1", name: "Mathematics", icon: "📐", description: "Quantitative aptitude", chaptersCount: 5, order: 1 },
  { legacyId: "2", name: "Logical Reasoning", icon: "🧩", description: "Analytical thinking", chaptersCount: 4, order: 2 },
  { legacyId: "3", name: "Verbal Ability", icon: "📚", description: "English comprehension", chaptersCount: 6, order: 3 },
  { legacyId: "4", name: "Data Interpretation", icon: "📊", description: "Charts and graphs", chaptersCount: 3, order: 4 },
] as const;

const chapters = [
  { legacyId: "1", subjectLegacyId: "1", name: "Number Systems", description: "Basic number theory and operations", lessonsCount: 8, progress: 80, order: 1 },
  { legacyId: "2", subjectLegacyId: "1", name: "Algebra", description: "Equations and expressions", lessonsCount: 10, progress: 50, order: 2 },
  { legacyId: "3", subjectLegacyId: "1", name: "Geometry", description: "Shapes, angles, and theorems", lessonsCount: 12, progress: 40, order: 3 },
  { legacyId: "4", subjectLegacyId: "1", name: "Percentages", description: "Profit, loss, and discounts", lessonsCount: 6, progress: 70, order: 4 },
  { legacyId: "5", subjectLegacyId: "1", name: "Time & Work", description: "Work efficiency problems", lessonsCount: 8, progress: 30, order: 5 },
  { legacyId: "6", subjectLegacyId: "2", name: "Puzzles", description: "Logical puzzles and arrangements", lessonsCount: 10, progress: 60, order: 1 },
  { legacyId: "7", subjectLegacyId: "2", name: "Blood Relations", description: "Family tree problems", lessonsCount: 6, progress: 50, order: 2 },
  { legacyId: "8", subjectLegacyId: "2", name: "Coding-Decoding", description: "Pattern recognition", lessonsCount: 8, progress: 40, order: 3 },
  { legacyId: "9", subjectLegacyId: "2", name: "Syllogisms", description: "Logical deductions", lessonsCount: 7, progress: 20, order: 4 },
  { legacyId: "10", subjectLegacyId: "3", name: "Reading Comprehension", description: "Passage understanding", lessonsCount: 12, progress: 35, order: 1 },
  { legacyId: "11", subjectLegacyId: "3", name: "Vocabulary", description: "Synonyms and antonyms", lessonsCount: 15, progress: 45, order: 2 },
  { legacyId: "12", subjectLegacyId: "3", name: "Grammar", description: "Sentence correction", lessonsCount: 10, progress: 25, order: 3 },
  { legacyId: "13", subjectLegacyId: "3", name: "Para Jumbles", description: "Sentence rearrangement", lessonsCount: 8, progress: 30, order: 4 },
  { legacyId: "14", subjectLegacyId: "3", name: "Fill in the Blanks", description: "Context-based completion", lessonsCount: 9, progress: 20, order: 5 },
  { legacyId: "15", subjectLegacyId: "3", name: "Idioms & Phrases", description: "Common expressions", lessonsCount: 7, progress: 15, order: 6 },
  { legacyId: "16", subjectLegacyId: "4", name: "Tables", description: "Tabular data analysis", lessonsCount: 8, progress: 80, order: 1 },
  { legacyId: "17", subjectLegacyId: "4", name: "Bar Charts", description: "Bar graph interpretation", lessonsCount: 10, progress: 75, order: 2 },
  { legacyId: "18", subjectLegacyId: "4", name: "Pie Charts", description: "Circular data representation", lessonsCount: 9, progress: 70, order: 3 },
] as const;

const lessons = [
  { legacyId: "1", chapterLegacyId: "1", name: "Introduction to Numbers", duration: 15, completed: true, order: 1, videoUrl: "https://www.youtube.com/embed/5SqLJRUNh3A", content: "<h1>Introduction to Numbers</h1><p>Numbers are the foundation of mathematics and aptitude tests.</p>" },
  { legacyId: "2", chapterLegacyId: "1", name: "Prime Numbers", duration: 20, completed: true, order: 2, videoUrl: "https://www.youtube.com/embed/mIStB5X4U8M", content: "<h1>Prime Numbers</h1><p>A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.</p>" },
  { legacyId: "3", chapterLegacyId: "1", name: "HCF and LCM", duration: 25, completed: true, order: 3, videoUrl: "https://www.youtube.com/embed/Jj7l8fJcKAw", content: "<h1>HCF and LCM</h1><p>Highest Common Factor (HCF) and Lowest Common Multiple (LCM) are fundamental concepts.</p>" },
  { legacyId: "4", chapterLegacyId: "1", name: "Divisibility Rules", duration: 18, completed: false, order: 4, videoUrl: "https://www.youtube.com/embed/UNgr3IxCUKA", content: "<h1>Divisibility Rules</h1><p>Quick tricks to check if a number is divisible by another without actual division.</p>" },
  { legacyId: "5", chapterLegacyId: "1", name: "Number Series", duration: 22, completed: false, order: 5, videoUrl: "https://www.youtube.com/embed/Qhaz36TZG5Y", content: "<h1>Number Series</h1><p>Identify patterns in sequences and find missing numbers.</p>" },
  { legacyId: "6", chapterLegacyId: "2", name: "Linear Equations", duration: 20, completed: true, order: 1, videoUrl: "https://www.youtube.com/embed/WUvTyaaNkzM", content: "<h1>Linear Equations</h1><p>Master the art of solving linear equations.</p>" },
  { legacyId: "7", chapterLegacyId: "2", name: "Quadratic Equations", duration: 30, completed: false, order: 2, videoUrl: "https://www.youtube.com/embed/i7idZfS8t8w", content: "<h1>Quadratic Equations</h1><p>Learn to solve quadratic equations.</p>" },
  { legacyId: "8", chapterLegacyId: "2", name: "Inequalities", duration: 18, completed: false, order: 3, videoUrl: "https://www.youtube.com/embed/VqKq78PVO9g", content: "<h1>Inequalities</h1><p>Master the art of solving and graphing inequalities.</p>" },
  { legacyId: "9", chapterLegacyId: "6", name: "Seating Arrangements", duration: 25, completed: true, order: 1, videoUrl: "https://www.youtube.com/embed/Yx8Tn0UT8Hs", content: "<h1>Seating Arrangements</h1><p>Master one of the most common logical reasoning topics.</p>" },
  { legacyId: "10", chapterLegacyId: "6", name: "Floor Puzzles", duration: 28, completed: false, order: 2, videoUrl: "https://www.youtube.com/embed/8p7Yx8tn0hs", content: "<h1>Floor Puzzles</h1><p>Learn to solve floor-based arrangement puzzles.</p>" },
  { legacyId: "11", chapterLegacyId: "10", name: "Main Idea Questions", duration: 20, completed: false, order: 1, videoUrl: "https://www.youtube.com/embed/TqQQexKZook", content: "<h1>Main Idea Questions</h1><p>Learn to identify the central theme of any passage.</p>" },
  { legacyId: "12", chapterLegacyId: "10", name: "Inference Questions", duration: 22, completed: false, order: 2, videoUrl: "https://www.youtube.com/embed/8Z5sMb7QV-Y", content: "<h1>Inference Questions</h1><p>Master the art of reading between the lines.</p>" },
  { legacyId: "13", chapterLegacyId: "16", name: "Basic Table Reading", duration: 15, completed: true, order: 1, videoUrl: "https://www.youtube.com/embed/RjQda040BU0", content: "<h1>Basic Table Reading</h1><p>Extract information from tabular data efficiently.</p>" },
  { legacyId: "14", chapterLegacyId: "16", name: "Percentage Calculations", duration: 18, completed: false, order: 2, videoUrl: "https://www.youtube.com/embed/9vM7Qw6YVQw", content: "<h1>Percentage Calculations</h1><p>Calculate percentages from table data quickly and accurately.</p>" },
] as const;

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("subjects").take(1);
    if (existing.length > 0) return null;

    const subjectIds = new Map<string, Id<"subjects">>();
    for (const subject of subjects) {
      const subjectId = await ctx.db.insert("subjects", {
        legacyId: subject.legacyId,
        name: subject.name,
        icon: subject.icon,
        description: subject.description,
        chaptersCount: subject.chaptersCount,
        order: subject.order,
      });
      subjectIds.set(subject.legacyId, subjectId);
    }

    const chapterIds = new Map<string, Id<"chapters">>();
    for (const chapter of chapters) {
      const subjectId = subjectIds.get(chapter.subjectLegacyId);
      if (!subjectId) throw new Error(`Missing subject ${chapter.subjectLegacyId}`);
      const chapterId = await ctx.db.insert("chapters", {
        legacyId: chapter.legacyId,
        subjectId,
        subjectLegacyId: chapter.subjectLegacyId,
        name: chapter.name,
        description: chapter.description,
        lessonsCount: chapter.lessonsCount,
        progress: chapter.progress,
        order: chapter.order,
      });
      chapterIds.set(chapter.legacyId, chapterId);
    }

    for (const lesson of lessons) {
      const chapterId = chapterIds.get(lesson.chapterLegacyId);
      if (!chapterId) throw new Error(`Missing chapter ${lesson.chapterLegacyId}`);
      await ctx.db.insert("lessons", {
        legacyId: lesson.legacyId,
        chapterId,
        chapterLegacyId: lesson.chapterLegacyId,
        name: lesson.name,
        content: lesson.content,
        duration: lesson.duration,
        completed: lesson.completed,
        order: lesson.order,
        videoUrl: lesson.videoUrl,
      });
    }

    await ctx.db.insert("tests", {
      legacyId: "mock-1",
      name: "Mock Aptitude Test 1",
      duration: 60,
      totalMarks: 100,
      questions: [
        { id: "q-1", text: "If a train travels 120 km in 2 hours, what is its average speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], correctAnswer: 1, subject: "Mathematics", explanation: "Speed = Distance/Time = 120/2 = 60 km/h" },
        { id: "q-2", text: "What is 25% of 80?", options: ["15", "20", "25", "30"], correctAnswer: 1, subject: "Mathematics", explanation: "25% of 80 = (25/100) × 80 = 20" },
        { id: "q-3", text: "If x + 5 = 12, what is the value of x?", options: ["5", "6", "7", "8"], correctAnswer: 2, subject: "Mathematics", explanation: "x + 5 = 12, therefore x = 12 - 5 = 7" },
        { id: "q-4", text: "The HCF of 12 and 18 is:", options: ["2", "3", "6", "9"], correctAnswer: 2, subject: "Mathematics", explanation: "Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6" },
        { id: "q-5", text: "If all roses are flowers and some flowers are red, which conclusion is valid?", options: ["All roses are red", "Some roses are red", "No roses are red", "Cannot be determined"], correctAnswer: 3, subject: "Logical Reasoning", explanation: "We cannot determine if roses are red from the given statements." },
        { id: "q-6", text: "Complete the series: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"], correctAnswer: 1, subject: "Logical Reasoning", explanation: "Pattern: +4, +6, +8, +10, +12. Next is 30 + 12 = 42" },
        { id: "q-7", text: "If CODING is written as DPEJOH, how is BRAIN written?", options: ["CSBJO", "CSBJM", "CTBJO", "CQBHM"], correctAnswer: 0, subject: "Logical Reasoning", explanation: "Each letter is shifted by +1. B→C, R→S, A→B, I→J, N→O" },
        { id: "q-8", text: "Choose the synonym of \"Abundant\":", options: ["Scarce", "Plentiful", "Rare", "Limited"], correctAnswer: 1, subject: "Verbal Ability", explanation: "Abundant means plentiful or existing in large quantities." },
        { id: "q-9", text: "Identify the grammatically correct sentence:", options: ["She don\'t like coffee", "She doesn\'t likes coffee", "She doesn\'t like coffee", "She don\'t likes coffee"], correctAnswer: 2, subject: "Verbal Ability", explanation: "Correct form: She doesn\'t like coffee (third person singular)" },
        { id: "q-10", text: "Choose the antonym of \"Brave\":", options: ["Courageous", "Fearless", "Cowardly", "Bold"], correctAnswer: 2, subject: "Verbal Ability", explanation: "Cowardly is the opposite of brave." },
        { id: "q-11", text: "A pie chart shows: Sales A=40%, B=30%, C=20%, D=10%. If total sales are $1000, what are sales of B?", options: ["$200", "$300", "$400", "$500"], correctAnswer: 1, subject: "Data Interpretation", explanation: "30% of $1000 = $300" },
        { id: "q-12", text: "In a bar chart, if Product A sold 50 units and Product B sold 75 units, what is the ratio A:B?", options: ["1:2", "2:3", "3:4", "1:3"], correctAnswer: 1, subject: "Data Interpretation", explanation: "50:75 = 2:3 (dividing both by 25)" },
        { id: "q-13", text: "If a shopkeeper offers 20% discount on marked price of $500, what is the selling price?", options: ["$400", "$420", "$450", "$480"], correctAnswer: 0, subject: "Mathematics", explanation: "Discount = 20% of 500 = $100. Selling price = 500 - 100 = $400" },
        { id: "q-14", text: "A can complete a work in 10 days, B in 15 days. Working together, in how many days can they complete it?", options: ["5 days", "6 days", "7 days", "8 days"], correctAnswer: 1, subject: "Mathematics", explanation: "Combined rate = 1/10 + 1/15 = 1/6. Time = 6 days" },
        { id: "q-15", text: "Choose the correctly spelled word:", options: ["Occassion", "Occasion", "Ocasion", "Occation"], correctAnswer: 1, subject: "Verbal Ability", explanation: "The correct spelling is \"Occasion\" with double C and single S." },
      ],
    });

    await ctx.db.insert("testResults", {
      legacyId: "result-1",
      userId: "demo-user",
      testId: "mock-1",
      score: 85,
      totalQuestions: 15,
      correctAnswers: 13,
      timeTaken: 45,
      subjectBreakdown: [
        { subject: "Mathematics", correct: 8, total: 10, accuracy: 80 },
      ],
      answers: {},
      completedAt: new Date().toISOString(),
    });

    await ctx.db.insert("profile", {
      legacyId: "demo-user",
      userId: "demo-user",
      name: "John Doe",
      college: "MIT",
      role: "student",
      badges: [{ id: "1", name: "First Test", icon: "🎯", description: "Completed first test", earnedAt: new Date().toISOString() }],
    });

    await ctx.db.insert("leaderboard", { legacyId: "1", userId: "1", name: "John Doe", college: "MIT", score: 98, testsCompleted: 31, accuracy: 94 });
    await ctx.db.insert("leaderboard", { legacyId: "2", userId: "2", name: "Prof. Smith", college: "AptIQ Platform", score: 95, testsCompleted: 28, accuracy: 91 });
    await ctx.db.insert("leaderboard", { legacyId: "3", userId: "3", name: "Admin User", college: "AptIQ Platform", score: 92, testsCompleted: 26, accuracy: 89 });

    await ctx.db.insert("tournaments", {
      legacyId: "1",
      name: "National Aptitude Cup",
      description: "A nationwide aptitude competition for students and professionals.",
      organizer: "AptiQ",
      organizerType: "country",
      level: "intermediate",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      registrationDeadline: new Date().toISOString(),
      status: "upcoming",
      participants: 120,
      maxParticipants: 500,
      prizePool: "$10,000",
      prizes: [
        { position: "1st", reward: "$5,000", badge: "🏆" },
        { position: "2nd", reward: "$3,000", badge: "🥈" },
        { position: "3rd", reward: "$2,000", badge: "🥉" },
      ],
      eligibility: "Open to all registered users",
      duration: 90,
      questionsCount: 50,
      isRegistered: false,
      tags: ["aptitude", "national", "students"],
    });

    await ctx.db.insert("teacherClasses", { legacyId: "class-1", teacherId: "demo-teacher", name: "Mathematics - Section A", subject: "Mathematics", code: "CLS-MA123", students: 25, createdAt: new Date().toISOString() });
    await ctx.db.insert("teacherClasses", { legacyId: "class-2", teacherId: "demo-teacher", name: "Logical Reasoning - Section B", subject: "Logical Reasoning", code: "CLS-LR456", students: 30, createdAt: new Date().toISOString() });
    await ctx.db.insert("teacherClasses", { legacyId: "class-3", teacherId: "demo-teacher", name: "Data Interpretation - Section C", subject: "Data Interpretation", code: "CLS-DI789", students: 20, createdAt: new Date().toISOString() });

    await ctx.db.insert("classNotes", { legacyId: "note-1", classId: "class-1", title: "Quadratic Equations", content: "Review the standard form and factorization method.", fileName: "quadratic_notes.pdf", createdAt: new Date().toISOString() });
    await ctx.db.insert("classUpdates", { legacyId: "update-1", classId: "class-1", message: "Test scheduled for next Monday. Please prepare chapters 1-5.", createdAt: new Date().toISOString() });

    await ctx.db.insert("teacherTests", {
      legacyId: "teacher-test-1",
      classId: "class-1",
      code: "ALG-101",
      title: "Algebra Basics Test",
      subject: "Mathematics",
      duration: "45",
      totalMarks: "100",
      isScheduled: false,
      status: "active",
      questions: [
        { id: "tq-1", text: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
      ],
      createdAt: new Date().toISOString(),
    });

    await ctx.db.insert("teacherAnnouncements", { legacyId: "announcement-1", title: "Welcome to AptIQ", message: "Start your learning journey today!", date: "2024-03-01" });
    await ctx.db.insert("teacherAnnouncements", { legacyId: "announcement-2", title: "New Features Added", message: "Check out our new test engine with anti-cheat features.", date: "2024-03-05" });

    return null;
  },
});
