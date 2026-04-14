export interface User {
  id: string;
  email: string;
  name: string;
  college?: string;
  linkedIn?: string;
  profilePicture?: string;
  badges: Badge[];
  createdAt: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  college?: string;
  linkedIn?: string;
  profilePicture?: string;
  role: 'student' | 'teacher' | 'admin';
  badges: Badge[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface DashboardStats {
  currentStreak: number;
  totalTests: number;
  accuracy: number;
  weakestSubject: string;
  recentActivity: Activity[];
  badges: Badge[];
}

export interface Activity {
  id: string;
  type: 'test' | 'lesson' | 'achievement';
  title: string;
  timestamp: string;
  score?: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  chaptersCount: number;
  progress: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  lessonsCount: number;
  progress: number;
  order: number;
}

export interface Lesson {
  id: string;
  chapterId: string;
  name: string;
  content: string;
  duration: number;
  completed: boolean;
  order: number;
  videoUrl?: string;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subject?: string;
}

export interface Test {
  id: string;
  name: string;
  duration: number;
  questions: Question[];
  totalMarks: number;
}

export interface TestSession {
  testId: string;
  startTime: number;
  answers: Record<string, number>;
  markedForReview: Set<string>;
  violations: number;
  isFullscreen: boolean;
}

export interface TestResult {
  id: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  subjectBreakdown: SubjectScore[];
  answers: Record<string, number>;
  completedAt: string;
}

export interface SubjectScore {
  subject: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  college: string;
  score: number;
  testsCompleted: number;
  accuracy: number;
  profilePicture?: string;
}

export interface AnalyticsData {
  subjectAccuracy: { subject: string; accuracy: number }[];
  performanceOverTime: { date: string; score: number }[];
  strengthWeakness: { label: string; value: number }[];
  avgTimePerQuestion: number;
}

export type FilterType = 'national' | 'college';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  organizer: string;
  organizerType: 'world' | 'country' | 'region' | 'state' | 'company' | 'college';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  maxParticipants?: number;
  prizePool: string;
  prizes: Prize[];
  eligibility: string;
  duration: number; // in minutes
  questionsCount: number;
  isRegistered: boolean;
  thumbnail?: string;
  tags: string[];
}

export interface Prize {
  position: string;
  reward: string;
  badge?: string;
}

export interface TournamentResult {
  tournamentId: string;
  userId: string;
  rank: number;
  score: number;
  accuracy: number;
  timeTaken: number;
  prize?: string;
  badge?: Badge;
}

export interface TournamentLeaderboard {
  tournamentId: string;
  entries: TournamentLeaderboardEntry[];
  userRank?: number;
}

export interface TournamentLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  college?: string;
  country?: string;
  state?: string;
  score: number;
  accuracy: number;
  timeTaken: number;
  profilePicture?: string;
}
