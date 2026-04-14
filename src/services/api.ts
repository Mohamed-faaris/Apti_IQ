import { ConvexHttpClient } from 'convex/browser';
import { api as convexApi } from '../../convex/_generated/api';
import type { AnalyticsData, Chapter, DashboardStats, LeaderboardEntry, Lesson, Subject, Test, TestResult, Tournament } from '../shared/types';

const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL as string);

const mapSubject = (subject: { legacyId?: string; _id: string; name: string; icon: string; description: string; chaptersCount: number; order: number }): Subject => ({
  id: subject.legacyId ?? subject._id,
  name: subject.name,
  icon: subject.icon,
  description: subject.description,
  chaptersCount: subject.chaptersCount,
  progress: subject.order === 1 ? 60 : subject.order === 2 ? 45 : subject.order === 3 ? 30 : 75,
});

const mapChapter = (chapter: { legacyId?: string; subjectLegacyId?: string; _id: string; name: string; description: string; lessonsCount: number; progress: number; order: number }): Chapter => ({
  id: chapter.legacyId ?? chapter._id,
  subjectId: chapter.subjectLegacyId ?? '',
  name: chapter.name,
  description: chapter.description,
  lessonsCount: chapter.lessonsCount,
  progress: chapter.progress,
  order: chapter.order,
});

const mapLesson = (lesson: { legacyId?: string; chapterLegacyId?: string; _id: string; name: string; content: string; duration: number; completed: boolean; order: number; videoUrl?: string }): Lesson => ({
  id: lesson.legacyId ?? lesson._id,
  chapterId: lesson.chapterLegacyId ?? '',
  name: lesson.name,
  content: lesson.content,
  duration: lesson.duration,
  completed: lesson.completed,
  order: lesson.order,
  videoUrl: lesson.videoUrl,
});

const mapTest = (test: { legacyId?: string; _id: string; name: string; duration: number; totalMarks: number; questions: Test['questions'] }): Test => ({
  id: test.legacyId ?? test._id,
  name: test.name,
  duration: test.duration,
  totalMarks: test.totalMarks,
  questions: test.questions,
});

const mapLeaderboardEntry = (entry: { userId: string; name: string; college: string; score: number; testsCompleted: number; accuracy: number; profilePicture?: string }, index: number): LeaderboardEntry => ({
  rank: index + 1,
  userId: entry.userId,
  name: entry.name,
  college: entry.college,
  score: entry.score,
  testsCompleted: entry.testsCompleted,
  accuracy: entry.accuracy,
  profilePicture: entry.profilePicture,
});

export const api = {
  auth: {
    login: async () => { throw new Error('Use Convex Auth signIn'); },
    register: async () => { throw new Error('Use Convex Auth signIn'); },
    logout: async () => { return; },
  },
  dashboard: {
    getStats: async (): Promise<DashboardStats> => client.query(convexApi.data.getDashboardStats, {}),
  },
  subjects: {
    getAll: async (): Promise<Subject[]> => {
      const subjects = await client.query(convexApi.data.listSubjects, {});
      return subjects.map(mapSubject);
    },
  },
  chapters: {
    getBySubject: async (subjectId: string): Promise<Chapter[]> => {
      const chapters = await client.query(convexApi.data.listChaptersBySubject, { subjectLegacyId: subjectId });
      return chapters.map(mapChapter);
    },
  },
  lessons: {
    getByChapter: async (chapterId: string): Promise<Lesson[]> => {
      const lessons = await client.query(convexApi.data.listLessonsByChapter, { chapterLegacyId: chapterId });
      return lessons.map(mapLesson);
    },
    getById: async (lessonId: string): Promise<Lesson> => {
      const lesson = await client.query(convexApi.data.getLessonByLegacyId, { lessonLegacyId: lessonId });
      if (!lesson) throw new Error('Lesson not found');
      return mapLesson(lesson);
    },
    markComplete: async (lessonId: string): Promise<void> => {
      await client.mutation(convexApi.mutations.markLessonComplete, { lessonLegacyId: lessonId });
    },
  },
  tests: {
    getById: async (testId: string): Promise<Test> => {
      const test = await client.query(convexApi.data.getTestByLegacyId, { testLegacyId: testId });
      if (!test) throw new Error('Test not found');
      return mapTest(test);
    },
    submit: async (testId: string, answers: Record<string, number>): Promise<TestResult> => ({
      id: `result-${Date.now()}`,
      testId,
      score: 85,
      totalQuestions: Object.keys(answers).length,
      correctAnswers: Object.keys(answers).length,
      timeTaken: 45,
      subjectBreakdown: [],
      answers,
      completedAt: new Date().toISOString(),
    }),
    getResult: async (resultId: string): Promise<TestResult> => {
      const result = await client.query(convexApi.data.getTestResultByLegacyId, { resultLegacyId: resultId });
      if (!result) throw new Error('Result not found');
      return {
        id: result.legacyId ?? result._id,
        testId: result.testId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        timeTaken: result.timeTaken,
        subjectBreakdown: result.subjectBreakdown,
        answers: result.answers,
        completedAt: result.completedAt,
      };
    },
  },
  leaderboard: {
    get: async (): Promise<LeaderboardEntry[]> => {
      const entries = await client.query(convexApi.data.listLeaderboard, {});
      return entries.map(mapLeaderboardEntry);
    },
  },
  analytics: {
    get: async (): Promise<AnalyticsData> => client.query(convexApi.data.listAnalytics, {}),
  },
  profile: {
    getMyProfile: async () => {
      return client.query(convexApi.data.getMyProfile, {});
    },
    get: async (): Promise<{ id: string; email: string; name: string; college?: string; linkedIn?: string; profilePicture?: string; role: 'student' | 'teacher' | 'admin'; badges: { id: string; name: string; icon: string; description: string; earnedAt: string }[]; createdAt: string; }> => {
      const profile = await client.query(convexApi.data.getProfileByLegacyId, { profileLegacyId: 'demo-user' });
      if (!profile) throw new Error('Profile not found');
      return {
        id: profile.legacyId ?? profile.userId,
        email: 'demo@aptiq.com',
        name: profile.name,
        college: profile.college,
        linkedIn: profile.linkedIn,
        profilePicture: profile.profilePicture,
        role: profile.role,
        badges: profile.badges,
        createdAt: new Date().toISOString(),
      };
    },
    getHistory: async (): Promise<TestResult[]> => {
      const results = await client.query(convexApi.data.listTestResultsByUser, { userId: 'demo-user' });
      return results.map((result) => ({
        id: result.legacyId ?? result._id,
        testId: result.testId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        timeTaken: result.timeTaken,
        subjectBreakdown: result.subjectBreakdown,
        answers: result.answers,
        completedAt: result.completedAt,
      }));
    },
    update: async (data: Partial<{ name: string; college?: string; linkedIn?: string; profilePicture?: string }>) => {
      await client.mutation(convexApi.mutations.updateProfile, {
        profileLegacyId: 'demo-user',
        name: data.name,
        college: data.college,
        linkedIn: data.linkedIn,
        profilePicture: data.profilePicture,
      });
      return api.profile.get();
    },
  },
  tournaments: {
    getAll: async (levelFilter: string, statusFilter: string): Promise<Tournament[]> => {
      const tournaments = await client.query(convexApi.data.listTournaments, { levelFilter, statusFilter });
      return tournaments.map((tournament) => ({
        id: tournament.legacyId ?? tournament._id,
        name: tournament.name,
        description: tournament.description,
        organizer: tournament.organizer,
        organizerType: tournament.organizerType,
        level: tournament.level,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        registrationDeadline: tournament.registrationDeadline,
        status: tournament.status,
        participants: tournament.participants,
        maxParticipants: tournament.maxParticipants,
        prizePool: tournament.prizePool,
        prizes: tournament.prizes,
        eligibility: tournament.eligibility,
        duration: tournament.duration,
        questionsCount: tournament.questionsCount,
        isRegistered: tournament.isRegistered,
        thumbnail: tournament.thumbnail,
        tags: tournament.tags,
      }));
    },
    getById: async (tournamentId: string): Promise<Tournament> => {
      const tournament = await client.query(convexApi.data.getTournamentByLegacyId, { tournamentLegacyId: tournamentId });
      if (!tournament) throw new Error('Tournament not found');
      return {
        id: tournament.legacyId ?? tournament._id,
        name: tournament.name,
        description: tournament.description,
        organizer: tournament.organizer,
        organizerType: tournament.organizerType,
        level: tournament.level,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        registrationDeadline: tournament.registrationDeadline,
        status: tournament.status,
        participants: tournament.participants,
        maxParticipants: tournament.maxParticipants,
        prizePool: tournament.prizePool,
        prizes: tournament.prizes,
        eligibility: tournament.eligibility,
        duration: tournament.duration,
        questionsCount: tournament.questionsCount,
        isRegistered: tournament.isRegistered,
        thumbnail: tournament.thumbnail,
        tags: tournament.tags,
      };
    },
    register: async (tournamentId: string): Promise<void> => {
      await client.mutation(convexApi.mutations.registerTournament, { tournamentLegacyId: tournamentId });
    },
  },
  teacher: {
    listClasses: async (teacherId: string) => client.query(convexApi.teacher.listTeacherClasses, { teacherId }),
    createClass: async (teacherId: string, name: string, subject: string, code: string) => client.mutation(convexApi.teacher.createTeacherClass, { teacherId, name, subject, code }),
    deleteClass: async (classId: string) => client.mutation(convexApi.teacher.deleteTeacherClass, { classId }),
    listNotes: async (classId: string) => client.query(convexApi.teacher.listClassNotes, { classId }),
    listUpdates: async (classId: string) => client.query(convexApi.teacher.listClassUpdates, { classId }),
    addNote: async (classId: string, title: string, content: string, fileName?: string) => client.mutation(convexApi.teacher.addClassNote, { classId, title, content, fileName }),
    addUpdate: async (classId: string, message: string) => client.mutation(convexApi.teacher.addClassUpdate, { classId, message }),
    listTests: async (classId: string) => client.query(convexApi.teacher.listTeacherTests, { classId }),
    createTest: async (payload: {
      classId: string;
      code: string;
      title: string;
      subject: string;
      duration: string;
      totalMarks: string;
      startDate?: string;
      startTime?: string;
      endDate?: string;
      endTime?: string;
      isScheduled: boolean;
      status: 'active' | 'scheduled';
      questions: { id: string; text: string; options: string[]; correctAnswer: number }[];
    }) => client.mutation(convexApi.teacher.createTeacherTest, payload),
    listAnnouncements: async () => client.query(convexApi.teacher.listAnnouncements, {}),
    addAnnouncement: async (title: string, message: string) => client.mutation(convexApi.teacher.addAnnouncement, { title, message }),
  },
};
