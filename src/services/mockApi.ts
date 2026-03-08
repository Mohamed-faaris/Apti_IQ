import { MOCK_API_DELAY } from '../shared/constants';
import type {
  User,
  DashboardStats,
  Subject,
  Chapter,
  Lesson,
  Test,
  TestResult,
  LeaderboardEntry,
  AnalyticsData,
  Tournament,
} from '../shared/types';

const delay = (ms: number = MOCK_API_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
const mockStore = {
  users: [] as User[],
  currentUser: null as User | null,
  subjects: [] as Subject[],
  chapters: [] as Chapter[],
  lessons: [] as Lesson[],
  tests: [] as Test[],
  results: [] as TestResult[],
  leaderboard: [] as LeaderboardEntry[],
  tournaments: [] as Tournament[],
};

// Initialize mock data
const initializeMockData = () => {
  mockStore.subjects = [
    { id: '1', name: 'Mathematics', icon: '📐', description: 'Quantitative aptitude', chaptersCount: 5, progress: 60 },
    { id: '2', name: 'Logical Reasoning', icon: '🧩', description: 'Analytical thinking', chaptersCount: 4, progress: 45 },
    { id: '3', name: 'Verbal Ability', icon: '📚', description: 'English comprehension', chaptersCount: 6, progress: 30 },
    { id: '4', name: 'Data Interpretation', icon: '📊', description: 'Charts and graphs', chaptersCount: 3, progress: 75 },
  ];

  mockStore.chapters = [
    // Mathematics chapters
    { id: '1', subjectId: '1', name: 'Number Systems', description: 'Basic number theory and operations', lessonsCount: 8, progress: 80, order: 1 },
    { id: '2', subjectId: '1', name: 'Algebra', description: 'Equations and expressions', lessonsCount: 10, progress: 50, order: 2 },
    { id: '3', subjectId: '1', name: 'Geometry', description: 'Shapes, angles, and theorems', lessonsCount: 12, progress: 40, order: 3 },
    { id: '4', subjectId: '1', name: 'Percentages', description: 'Profit, loss, and discounts', lessonsCount: 6, progress: 70, order: 4 },
    { id: '5', subjectId: '1', name: 'Time & Work', description: 'Work efficiency problems', lessonsCount: 8, progress: 30, order: 5 },
    
    // Logical Reasoning chapters
    { id: '6', subjectId: '2', name: 'Puzzles', description: 'Logical puzzles and arrangements', lessonsCount: 10, progress: 60, order: 1 },
    { id: '7', subjectId: '2', name: 'Blood Relations', description: 'Family tree problems', lessonsCount: 6, progress: 50, order: 2 },
    { id: '8', subjectId: '2', name: 'Coding-Decoding', description: 'Pattern recognition', lessonsCount: 8, progress: 40, order: 3 },
    { id: '9', subjectId: '2', name: 'Syllogisms', description: 'Logical deductions', lessonsCount: 7, progress: 20, order: 4 },
    
    // Verbal Ability chapters
    { id: '10', subjectId: '3', name: 'Reading Comprehension', description: 'Passage understanding', lessonsCount: 12, progress: 35, order: 1 },
    { id: '11', subjectId: '3', name: 'Vocabulary', description: 'Synonyms and antonyms', lessonsCount: 15, progress: 45, order: 2 },
    { id: '12', subjectId: '3', name: 'Grammar', description: 'Sentence correction', lessonsCount: 10, progress: 25, order: 3 },
    { id: '13', subjectId: '3', name: 'Para Jumbles', description: 'Sentence rearrangement', lessonsCount: 8, progress: 30, order: 4 },
    { id: '14', subjectId: '3', name: 'Fill in the Blanks', description: 'Context-based completion', lessonsCount: 9, progress: 20, order: 5 },
    { id: '15', subjectId: '3', name: 'Idioms & Phrases', description: 'Common expressions', lessonsCount: 7, progress: 15, order: 6 },
    
    // Data Interpretation chapters
    { id: '16', subjectId: '4', name: 'Tables', description: 'Tabular data analysis', lessonsCount: 8, progress: 80, order: 1 },
    { id: '17', subjectId: '4', name: 'Bar Charts', description: 'Bar graph interpretation', lessonsCount: 10, progress: 75, order: 2 },
    { id: '18', subjectId: '4', name: 'Pie Charts', description: 'Circular data representation', lessonsCount: 9, progress: 70, order: 3 },
  ];

  mockStore.lessons = [
    // Number Systems lessons
    { id: '1', chapterId: '1', name: 'Introduction to Numbers', content: '# Introduction to Numbers\n\nNumbers are the foundation of mathematics. Learn about natural numbers, whole numbers, integers, and rational numbers.', duration: 15, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/5SqLJRUNh3A' },
    { id: '2', chapterId: '1', name: 'Prime Numbers', content: '# Prime Numbers\n\nA prime number is divisible only by 1 and itself. Learn identification techniques and properties.', duration: 20, completed: true, order: 2, videoUrl: 'https://www.youtube.com/embed/mIStB5X4U8M' },
    { id: '3', chapterId: '1', name: 'HCF and LCM', content: '# HCF and LCM\n\nHighest Common Factor and Lowest Common Multiple are fundamental concepts in number theory.', duration: 25, completed: true, order: 3, videoUrl: 'https://www.youtube.com/embed/Jj7l8fJcKAw' },
    { id: '4', chapterId: '1', name: 'Divisibility Rules', content: '# Divisibility Rules\n\nQuick tricks to check if a number is divisible by 2, 3, 4, 5, 6, 8, 9, 10, and 11.', duration: 18, completed: false, order: 4, videoUrl: 'https://www.youtube.com/embed/UNgr3IxCUKA' },
    { id: '5', chapterId: '1', name: 'Number Series', content: '# Number Series\n\nIdentify patterns in sequences and find missing numbers.', duration: 22, completed: false, order: 5, videoUrl: 'https://www.youtube.com/embed/Qhaz36TZG5Y' },
    
    // Algebra lessons
    { id: '6', chapterId: '2', name: 'Linear Equations', content: '# Linear Equations\n\nSolve equations of the form ax + b = c.', duration: 20, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM' },
    { id: '7', chapterId: '2', name: 'Quadratic Equations', content: '# Quadratic Equations\n\nSolve ax² + bx + c = 0 using factorization and formula.', duration: 30, completed: false, order: 2, videoUrl: 'https://www.youtube.com/embed/i7idZfS8t8w' },
    { id: '8', chapterId: '2', name: 'Inequalities', content: '# Inequalities\n\nUnderstand and solve linear inequalities.', duration: 18, completed: false, order: 3, videoUrl: 'https://www.youtube.com/embed/VqKq78PVO9g' },
    
    // Puzzles lessons
    { id: '9', chapterId: '6', name: 'Seating Arrangements', content: '# Seating Arrangements\n\nSolve circular and linear seating puzzles.', duration: 25, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/Yx8Tn0UT8Hs' },
    { id: '10', chapterId: '6', name: 'Floor Puzzles', content: '# Floor Puzzles\n\nArrange people across different floors based on conditions.', duration: 28, completed: false, order: 2, videoUrl: 'https://www.youtube.com/embed/8p7Yx8tn0hs' },
    
    // Reading Comprehension lessons
    { id: '11', chapterId: '10', name: 'Main Idea Questions', content: '# Main Idea Questions\n\nIdentify the central theme of a passage.', duration: 20, completed: false, order: 1, videoUrl: 'https://www.youtube.com/embed/TqQQexKZook' },
    { id: '12', chapterId: '10', name: 'Inference Questions', content: '# Inference Questions\n\nDraw logical conclusions from the passage.', duration: 22, completed: false, order: 2, videoUrl: 'https://www.youtube.com/embed/8Z5sMb7QV-Y' },
    
    // Tables lessons
    { id: '13', chapterId: '16', name: 'Basic Table Reading', content: '# Basic Table Reading\n\nExtract information from tabular data.', duration: 15, completed: true, order: 1, videoUrl: 'https://www.youtube.com/embed/RjQda040BU0' },
    { id: '14', chapterId: '16', name: 'Percentage Calculations', content: '# Percentage Calculations\n\nCalculate percentages from table data.', duration: 20, completed: true, order: 2, videoUrl: 'https://www.youtube.com/embed/WYWPx317qgw' },
  ];

  mockStore.leaderboard = Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    userId: `user-${i + 1}`,
    name: `Student ${i + 1}`,
    college: i % 3 === 0 ? 'MIT' : i % 3 === 1 ? 'Stanford' : 'Harvard',
    score: 1000 - i * 50,
    testsCompleted: 20 - i,
    accuracy: 95 - i * 2,
  }));

  // Initialize tournaments
  mockStore.tournaments = [
    // World Level
    {
      id: 't-1',
      name: 'Global Aptitude Championship 2026',
      description: 'The world\'s largest aptitude competition with participants from 150+ countries',
      organizer: 'World Aptitude Federation',
      organizerType: 'world',
      level: 'expert',
      startDate: '2026-04-01',
      endDate: '2026-04-15',
      registrationDeadline: '2026-03-25',
      status: 'upcoming',
      participants: 45230,
      maxParticipants: 50000,
      prizePool: '$100,000',
      prizes: [
        { position: '1st', reward: '$50,000 + Trophy', badge: '🥇' },
        { position: '2nd', reward: '$30,000 + Trophy', badge: '🥈' },
        { position: '3rd', reward: '$20,000 + Trophy', badge: '🥉' },
      ],
      eligibility: 'Open to all',
      duration: 120,
      questionsCount: 100,
      isRegistered: false,
      tags: ['Mathematics', 'Reasoning', 'Verbal'],
    },
    {
      id: 't-2',
      name: 'International Math Olympiad',
      description: 'Test your mathematical prowess against the world\'s best',
      organizer: 'International Math Society',
      organizerType: 'world',
      level: 'advanced',
      startDate: '2026-03-20',
      endDate: '2026-03-20',
      registrationDeadline: '2026-03-15',
      status: 'ongoing',
      participants: 12500,
      prizePool: '$50,000',
      prizes: [
        { position: 'Top 10', reward: '$5,000 each', badge: '🏆' },
        { position: 'Top 100', reward: 'Gold Badge', badge: '⭐' },
      ],
      eligibility: 'Open to all',
      duration: 90,
      questionsCount: 50,
      isRegistered: true,
      tags: ['Mathematics', 'Problem Solving'],
    },

    // Country Level (India)
    {
      id: 't-3',
      name: 'All India Aptitude Test 2026',
      description: 'National level competition for Indian students',
      organizer: 'National Testing Agency',
      organizerType: 'country',
      level: 'intermediate',
      startDate: '2026-03-25',
      endDate: '2026-03-25',
      registrationDeadline: '2026-03-20',
      status: 'upcoming',
      participants: 25000,
      maxParticipants: 30000,
      prizePool: '₹25,00,000',
      prizes: [
        { position: '1st', reward: '₹10,00,000', badge: '🥇' },
        { position: '2nd', reward: '₹8,00,000', badge: '🥈' },
        { position: '3rd', reward: '₹7,00,000', badge: '🥉' },
      ],
      eligibility: 'Indian residents only',
      duration: 90,
      questionsCount: 75,
      isRegistered: true,
      tags: ['All Subjects', 'National'],
    },
    {
      id: 't-4',
      name: 'India Reasoning Challenge',
      description: 'Sharpen your logical reasoning skills',
      organizer: 'Indian Aptitude Council',
      organizerType: 'country',
      level: 'beginner',
      startDate: '2026-04-10',
      endDate: '2026-04-10',
      registrationDeadline: '2026-04-05',
      status: 'upcoming',
      participants: 8500,
      prizePool: '₹5,00,000',
      prizes: [
        { position: 'Top 50', reward: '₹10,000 each', badge: '🎯' },
      ],
      eligibility: 'Indian students',
      duration: 60,
      questionsCount: 50,
      isRegistered: false,
      tags: ['Logical Reasoning'],
    },

    // Region Level
    {
      id: 't-5',
      name: 'South India Aptitude League',
      description: 'Regional championship for South Indian states',
      organizer: 'South India Education Board',
      organizerType: 'region',
      level: 'intermediate',
      startDate: '2026-03-28',
      endDate: '2026-03-28',
      registrationDeadline: '2026-03-23',
      status: 'upcoming',
      participants: 5200,
      maxParticipants: 10000,
      prizePool: '₹10,00,000',
      prizes: [
        { position: '1st', reward: '₹5,00,000', badge: '🥇' },
        { position: '2nd', reward: '₹3,00,000', badge: '🥈' },
        { position: '3rd', reward: '₹2,00,000', badge: '🥉' },
      ],
      eligibility: 'Students from TN, KA, AP, TG, KL',
      duration: 75,
      questionsCount: 60,
      isRegistered: false,
      tags: ['Regional', 'All Subjects'],
    },

    // State Level
    {
      id: 't-6',
      name: 'Karnataka State Aptitude Championship',
      description: 'Compete with the best minds in Karnataka',
      organizer: 'Karnataka Education Department',
      organizerType: 'state',
      level: 'beginner',
      startDate: '2026-04-05',
      endDate: '2026-04-05',
      registrationDeadline: '2026-03-30',
      status: 'upcoming',
      participants: 3200,
      prizePool: '₹3,00,000',
      prizes: [
        { position: '1st', reward: '₹1,50,000', badge: '🥇' },
        { position: '2nd', reward: '₹1,00,000', badge: '🥈' },
        { position: '3rd', reward: '₹50,000', badge: '🥉' },
      ],
      eligibility: 'Karnataka residents',
      duration: 60,
      questionsCount: 50,
      isRegistered: false,
      tags: ['State Level', 'Karnataka'],
    },
    {
      id: 't-7',
      name: 'Tamil Nadu Math Challenge',
      description: 'Mathematics competition for TN students',
      organizer: 'TN Math Association',
      organizerType: 'state',
      level: 'intermediate',
      startDate: '2026-03-15',
      endDate: '2026-03-15',
      registrationDeadline: '2026-03-10',
      status: 'completed',
      participants: 4500,
      prizePool: '₹2,00,000',
      prizes: [
        { position: 'Top 20', reward: '₹10,000 each', badge: '🏆' },
      ],
      eligibility: 'Tamil Nadu students',
      duration: 90,
      questionsCount: 40,
      isRegistered: true,
      tags: ['Mathematics', 'State'],
    },

    // Company Organized
    {
      id: 't-8',
      name: 'Google Aptitude Challenge 2026',
      description: 'Compete for internship opportunities at Google',
      organizer: 'Google India',
      organizerType: 'company',
      level: 'advanced',
      startDate: '2026-04-15',
      endDate: '2026-04-15',
      registrationDeadline: '2026-04-10',
      status: 'upcoming',
      participants: 15000,
      maxParticipants: 20000,
      prizePool: 'Internships + ₹15,00,000',
      prizes: [
        { position: 'Top 10', reward: 'Google Internship', badge: '💼' },
        { position: 'Top 100', reward: '₹15,000 each', badge: '🎁' },
      ],
      eligibility: 'Engineering students',
      duration: 120,
      questionsCount: 80,
      isRegistered: false,
      tags: ['Coding', 'Aptitude', 'Google'],
    },
    {
      id: 't-9',
      name: 'Microsoft Talent Hunt',
      description: 'Showcase your skills to Microsoft recruiters',
      organizer: 'Microsoft',
      organizerType: 'company',
      level: 'expert',
      startDate: '2026-03-22',
      endDate: '2026-03-22',
      registrationDeadline: '2026-03-18',
      status: 'ongoing',
      participants: 12000,
      prizePool: 'Job Offers + ₹10,00,000',
      prizes: [
        { position: 'Top 5', reward: 'Job Offer', badge: '💼' },
        { position: 'Top 50', reward: '₹20,000 each', badge: '🏆' },
      ],
      eligibility: 'Final year students',
      duration: 150,
      questionsCount: 100,
      isRegistered: true,
      tags: ['Aptitude', 'Coding', 'Microsoft'],
    },
    {
      id: 't-10',
      name: 'Amazon Campus Challenge',
      description: 'Get hired by Amazon through this competition',
      organizer: 'Amazon',
      organizerType: 'company',
      level: 'advanced',
      startDate: '2026-04-20',
      endDate: '2026-04-20',
      registrationDeadline: '2026-04-15',
      status: 'upcoming',
      participants: 18000,
      prizePool: 'Interviews + ₹8,00,000',
      prizes: [
        { position: 'Top 20', reward: 'Direct Interview', badge: '💼' },
        { position: 'Top 100', reward: '₹8,000 each', badge: '🎁' },
      ],
      eligibility: 'All students',
      duration: 90,
      questionsCount: 70,
      isRegistered: false,
      tags: ['Aptitude', 'Amazon'],
    },

    // College Organized
    {
      id: 't-11',
      name: 'IIT Delhi Inter-College Championship',
      description: 'Compete against students from top colleges',
      organizer: 'IIT Delhi',
      organizerType: 'college',
      level: 'advanced',
      startDate: '2026-03-30',
      endDate: '2026-03-30',
      registrationDeadline: '2026-03-25',
      status: 'upcoming',
      participants: 2500,
      maxParticipants: 3000,
      prizePool: '₹5,00,000',
      prizes: [
        { position: '1st', reward: '₹2,00,000', badge: '🥇' },
        { position: '2nd', reward: '₹1,50,000', badge: '🥈' },
        { position: '3rd', reward: '₹1,00,000', badge: '🥉' },
      ],
      eligibility: 'College students',
      duration: 90,
      questionsCount: 60,
      isRegistered: false,
      tags: ['Inter-College', 'IIT'],
    },
    {
      id: 't-12',
      name: 'MIT Campus Aptitude Fest',
      description: 'Annual aptitude competition at MIT',
      organizer: 'MIT',
      organizerType: 'college',
      level: 'beginner',
      startDate: '2026-04-08',
      endDate: '2026-04-08',
      registrationDeadline: '2026-04-03',
      status: 'upcoming',
      participants: 800,
      maxParticipants: 1000,
      prizePool: '₹1,00,000',
      prizes: [
        { position: '1st', reward: '₹50,000', badge: '🥇' },
        { position: '2nd', reward: '₹30,000', badge: '🥈' },
        { position: '3rd', reward: '₹20,000', badge: '🥉' },
      ],
      eligibility: 'MIT students only',
      duration: 60,
      questionsCount: 50,
      isRegistered: true,
      tags: ['Campus', 'MIT'],
    },
  ];
};

initializeMockData();

export const mockApi = {
  // Auth
  login: async (email: string): Promise<User> => {
    await delay();
    
    // Admin credentials for testing
    if (email === 'admin@aptiq.com') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@aptiq.com',
        name: 'Admin User',
        college: 'AptIQ Platform',
        role: 'admin',
        badges: [],
        createdAt: new Date().toISOString(),
      };
      mockStore.currentUser = adminUser;
      return adminUser;
    }
    
    // Teacher credentials for testing
    if (email === 'teacher@aptiq.com') {
      const teacherUser: User = {
        id: 'teacher-1',
        email: 'teacher@aptiq.com',
        name: 'Prof. Smith',
        college: 'AptIQ Platform',
        role: 'teacher',
        badges: [],
        createdAt: new Date().toISOString(),
      };
      mockStore.currentUser = teacherUser;
      return teacherUser;
    }
    
    // Default student user
    const user: User = {
      id: '1',
      email,
      name: 'John Doe',
      college: 'MIT',
      role: 'student',
      badges: [],
      createdAt: new Date().toISOString(),
    };
    mockStore.currentUser = user;
    return user;
  },

  register: async (data: { email: string; password: string; name: string; role?: 'student' | 'teacher' }): Promise<User> => {
    await delay();
    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role || 'student',
      badges: [],
      createdAt: new Date().toISOString(),
    };
    mockStore.users.push(user);
    mockStore.currentUser = user;
    return user;
  },

  logout: async (): Promise<void> => {
    await delay();
    mockStore.currentUser = null;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay();
    return {
      currentStreak: 7,
      totalTests: 24,
      accuracy: 87.5,
      weakestSubject: 'Verbal Ability',
      recentActivity: [
        { id: '1', type: 'test', title: 'Mock Test 5', timestamp: new Date().toISOString(), score: 85 },
        { id: '2', type: 'lesson', title: 'Algebra Basics', timestamp: new Date().toISOString() },
      ],
      badges: [
        { id: '1', name: 'First Test', icon: '🎯', description: 'Completed first test', earnedAt: new Date().toISOString() },
      ],
    };
  },

  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    await delay();
    return mockStore.subjects;
  },

  // Chapters
  getChapters: async (subjectId: string): Promise<Chapter[]> => {
    await delay();
    return mockStore.chapters.filter(c => c.subjectId === subjectId);
  },

  // Lessons
  getLessons: async (chapterId: string): Promise<Lesson[]> => {
    await delay();
    return mockStore.lessons.filter(l => l.chapterId === chapterId);
  },

  getLesson: async (lessonId: string): Promise<Lesson> => {
    await delay();
    const lesson = mockStore.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  markLessonComplete: async (lessonId: string): Promise<void> => {
    await delay();
    const lesson = mockStore.lessons.find(l => l.id === lessonId);
    if (lesson) lesson.completed = true;
  },

  // Tests
  getTest: async (testId: string): Promise<Test> => {
    await delay();
    return {
      id: testId,
      name: 'Mock Aptitude Test 1',
      duration: 60,
      totalMarks: 100,
      questions: [
        // Mathematics questions
        {
          id: 'q-1',
          text: 'If a train travels 120 km in 2 hours, what is its average speed?',
          options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
          correctAnswer: 1,
          subject: 'Mathematics',
          explanation: 'Speed = Distance/Time = 120/2 = 60 km/h'
        },
        {
          id: 'q-2',
          text: 'What is 25% of 80?',
          options: ['15', '20', '25', '30'],
          correctAnswer: 1,
          subject: 'Mathematics',
          explanation: '25% of 80 = (25/100) × 80 = 20'
        },
        {
          id: 'q-3',
          text: 'If x + 5 = 12, what is the value of x?',
          options: ['5', '6', '7', '8'],
          correctAnswer: 2,
          subject: 'Mathematics',
          explanation: 'x + 5 = 12, therefore x = 12 - 5 = 7'
        },
        {
          id: 'q-4',
          text: 'The HCF of 12 and 18 is:',
          options: ['2', '3', '6', '9'],
          correctAnswer: 2,
          subject: 'Mathematics',
          explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6'
        },
        
        // Logical Reasoning questions
        {
          id: 'q-5',
          text: 'If all roses are flowers and some flowers are red, which conclusion is valid?',
          options: [
            'All roses are red',
            'Some roses are red',
            'No roses are red',
            'Cannot be determined'
          ],
          correctAnswer: 3,
          subject: 'Logical Reasoning',
          explanation: 'We cannot determine if roses are red from the given statements.'
        },
        {
          id: 'q-6',
          text: 'Complete the series: 2, 6, 12, 20, 30, ?',
          options: ['40', '42', '44', '46'],
          correctAnswer: 1,
          subject: 'Logical Reasoning',
          explanation: 'Pattern: +4, +6, +8, +10, +12. Next is 30 + 12 = 42'
        },
        {
          id: 'q-7',
          text: 'If CODING is written as DPEJOH, how is BRAIN written?',
          options: ['CSBJO', 'CSBJM', 'CTBJO', 'CQBHM'],
          correctAnswer: 0,
          subject: 'Logical Reasoning',
          explanation: 'Each letter is shifted by +1. B→C, R→S, A→B, I→J, N→O'
        },
        
        // Verbal Ability questions
        {
          id: 'q-8',
          text: 'Choose the synonym of "Abundant":',
          options: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
          correctAnswer: 1,
          subject: 'Verbal Ability',
          explanation: 'Abundant means plentiful or existing in large quantities.'
        },
        {
          id: 'q-9',
          text: 'Identify the grammatically correct sentence:',
          options: [
            'She don\'t like coffee',
            'She doesn\'t likes coffee',
            'She doesn\'t like coffee',
            'She don\'t likes coffee'
          ],
          correctAnswer: 2,
          subject: 'Verbal Ability',
          explanation: 'Correct form: She doesn\'t like coffee (third person singular)'
        },
        {
          id: 'q-10',
          text: 'Choose the antonym of "Brave":',
          options: ['Courageous', 'Fearless', 'Cowardly', 'Bold'],
          correctAnswer: 2,
          subject: 'Verbal Ability',
          explanation: 'Cowardly is the opposite of brave.'
        },
        
        // Data Interpretation questions
        {
          id: 'q-11',
          text: 'A pie chart shows: Sales A=40%, B=30%, C=20%, D=10%. If total sales are $1000, what are sales of B?',
          options: ['$200', '$300', '$400', '$500'],
          correctAnswer: 1,
          subject: 'Data Interpretation',
          explanation: '30% of $1000 = $300'
        },
        {
          id: 'q-12',
          text: 'In a bar chart, if Product A sold 50 units and Product B sold 75 units, what is the ratio A:B?',
          options: ['1:2', '2:3', '3:4', '1:3'],
          correctAnswer: 1,
          subject: 'Data Interpretation',
          explanation: '50:75 = 2:3 (dividing both by 25)'
        },
        
        // Additional mixed questions
        {
          id: 'q-13',
          text: 'If a shopkeeper offers 20% discount on marked price of $500, what is the selling price?',
          options: ['$400', '$420', '$450', '$480'],
          correctAnswer: 0,
          subject: 'Mathematics',
          explanation: 'Discount = 20% of 500 = $100. Selling price = 500 - 100 = $400'
        },
        {
          id: 'q-14',
          text: 'A can complete a work in 10 days, B in 15 days. Working together, in how many days can they complete it?',
          options: ['5 days', '6 days', '7 days', '8 days'],
          correctAnswer: 1,
          subject: 'Mathematics',
          explanation: 'Combined rate = 1/10 + 1/15 = 1/6. Time = 6 days'
        },
        {
          id: 'q-15',
          text: 'Choose the correctly spelled word:',
          options: ['Occassion', 'Occasion', 'Ocasion', 'Occation'],
          correctAnswer: 1,
          subject: 'Verbal Ability',
          explanation: 'The correct spelling is "Occasion" with double C and single S.'
        },
      ],
    };
  },

  submitTest: async (testId: string, answers: Record<string, number>): Promise<TestResult> => {
    await delay();
    const test = await mockApi.getTest(testId);
    const correctAnswers = Object.entries(answers).filter(
      ([qId, ans]) => test.questions.find(q => q.id === qId)?.correctAnswer === ans
    ).length;

    const result: TestResult = {
      id: Date.now().toString(),
      testId,
      score: (correctAnswers / test.questions.length) * 100,
      totalQuestions: test.questions.length,
      correctAnswers,
      timeTaken: 45,
      subjectBreakdown: [
        { subject: 'Mathematics', correct: 8, total: 10, accuracy: 80 },
      ],
      answers,
      completedAt: new Date().toISOString(),
    };

    mockStore.results.push(result);
    return result;
  },

  getTestResult: async (resultId: string): Promise<TestResult> => {
    await delay();
    const result = mockStore.results.find(r => r.id === resultId);
    if (!result) throw new Error('Result not found');
    return result;
  },

  // Leaderboard
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await delay();
    return mockStore.leaderboard;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    await delay();
    return {
      subjectAccuracy: [
        { subject: 'Mathematics', accuracy: 85 },
        { subject: 'Logical Reasoning', accuracy: 78 },
        { subject: 'Verbal Ability', accuracy: 72 },
        { subject: 'Data Interpretation', accuracy: 90 },
      ],
      performanceOverTime: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 86400000).toLocaleDateString(),
        score: 70 + Math.random() * 20,
      })),
      strengthWeakness: [
        { label: 'Strengths', value: 65 },
        { label: 'Weaknesses', value: 35 },
      ],
      avgTimePerQuestion: 2.5,
    };
  },

  // Profile
  getProfile: async (): Promise<User> => {
    await delay();
    if (!mockStore.currentUser) throw new Error('Not authenticated');
    return mockStore.currentUser;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    await delay();
    if (!mockStore.currentUser) throw new Error('Not authenticated');
    mockStore.currentUser = { ...mockStore.currentUser, ...data };
    return mockStore.currentUser;
  },

  // Tournaments
  getTournaments: async (levelFilter: string, statusFilter: string): Promise<Tournament[]> => {
    await delay();
    let filtered = mockStore.tournaments;
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(t => t.organizerType === levelFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    return filtered;
  },

  getTournament: async (id: string): Promise<Tournament> => {
    await delay();
    const tournament = mockStore.tournaments.find(t => t.id === id);
    if (!tournament) throw new Error('Tournament not found');
    return tournament;
  },

  registerTournament: async (id: string): Promise<void> => {
    await delay();
    const tournament = mockStore.tournaments.find(t => t.id === id);
    if (tournament) {
      tournament.isRegistered = true;
      tournament.participants += 1;
    }
  },
};
