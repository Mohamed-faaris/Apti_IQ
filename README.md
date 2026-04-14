# AptIQ - Aptitude Learning Platform

A production-grade, full-stack aptitude learning platform built with React, TypeScript, and modern web technologies.

## how to run the project

1. npm install
2. npm run dev

## Database commands

- `npm run db:seed` — seed the Convex database
- `npm run db:clear` — clear the Convex database
- `npm run db:fresh-seed` — reset and seed the Convex database

## 🚀 Features

- **Notebook-Themed UI**: Beautiful warm cream paper design with ruled lines and fixed background
- **3D Animated Landing Page**: Calm, professional animations with floating notebook elements
- **Comprehensive Learning System**: 4-level hierarchy (Subjects → Chapters → Lessons → Practice)
- **Real-Time Testing Engine**: Production-grade test interface with anti-cheat mechanisms
- **Performance-Based Recommendations**: Smart study suggestions based on test results
- **Live Leaderboard**: Real-time rankings with socket simulation
- **Analytics Dashboard**: Detailed performance insights with interactive charts
- **Anti-Cheat System**: Fullscreen enforcement, tab switch, screen change, and right-click detection
- **Violation Modal System**: Professional animated warnings with violation tracking
- **Progress Tracking**: Comprehensive progress page with milestones and subject breakdowns
- **Scroll Navigation**: Smart scroll buttons on results page for long content
- **Profile Management**: User profiles with badges and test history
- **Admin Panel**: Question management and violation monitoring

## 🛠️ Tech Stack

- **React 18+** with TypeScript
- **Vite** for blazing-fast development
- **React Router v6** for routing
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Socket.io-client** for real-time features (mocked)
- **Axios** for API calls (mocked)
- **React Hook Form + Zod** for form validation

## 📁 Project Structure

```
src/
├── app/                    # App configuration
│   ├── layouts/           # Layout components
│   ├── providers.tsx      # App providers
│   └── router.tsx         # Route configuration
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboard
│   ├── learning/         # Learning system
│   ├── test-engine/      # Test engine with anti-cheat
│   ├── leaderboard/      # Real-time leaderboard
│   ├── analytics/        # Analytics dashboard
│   ├── profile/          # User profile
│   └── admin/            # Admin panel
├── services/             # API and socket services
│   ├── api.ts           # API abstraction layer
│   ├── mockApi.ts       # Mock API implementation
│   └── socket.ts        # Socket service (mocked)
├── shared/               # Shared resources
│   ├── ui/              # Reusable UI components
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # Constants
│   └── types/           # TypeScript types
└── theme/               # Design tokens

```

## 🎨 Design System - Notebook Theme

- **Background**: #FFF8E7 (Warm Cream) - Fixed attachment for immersive experience
- **Card Background**: #FFFBF0 (Notebook Paper)
- **Primary**: #2C3E50 (Ink Blue)
- **Secondary**: #9B59B6 (Soft Purple)
- **Accent**: #E74C3C (Light Red)
- **Border/Lines**: #D4A574 (Tan) - Ruled lines and borders
- **Test Background**: #FAF6ED (Lighter Cream) with subtle grid pattern
- **Transitions**: 300ms for UI, 1000ms for charts
- **Paper texture**: Realistic ruled lines (32px spacing), hole punches, margin lines
- **Shadows**: Warm brown tones for depth (rgba(139, 69, 19, 0.1))

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 🔐 Authentication

Use any email/password combination to login (mock authentication).

Example:

- Email: `test@example.com`
- Password: `password123`

## 📊 Features Overview

### Landing Page

- Calm 3D animations with floating notebook pages, pencil, sticky notes, and books
- Smooth easing and professional motion design
- Notebook-themed feature cards with hole punches
- Responsive hero section with warm cream background

### Learning System

- 4-level hierarchy: Subjects → Chapters → Lessons → Practice
- Continue Learning banner with progress tracking
- Status badges (Not Started, In Progress, Completed)
- Chapter test unlock system
- Left navigation sidebar for easy access
- Lesson detail page with notebook styling
- Practice quizzes with 70% passing requirement
- Browse subjects: Mathematics, Logical Reasoning, Verbal Ability, Data Interpretation
- 18 chapters with descriptions across all subjects
- 14+ lessons with realistic content and duration

### Dashboard

- Smart recommendation engine based on user behavior
- Performance-based study suggestions
- Areas to Improve section with:
  - Weak subjects (red border, <50% accuracy)
  - Moderate subjects (orange border, 50-70%)
  - Strong subjects (green border, >70%)
  - Personalized 4-week study plan
- Current streak tracking with emotional anchoring
- Left navigation sidebar with quick links
- Recent activity feed
- Badge collection and achievements

### Test Engine (Production-Grade)

- Auto-enter fullscreen on test start with vendor prefixes
- Professional exam-like interface with 5 structural zones
- Question centered (75% width), navigation compact on right (25%)
- Countdown timer with critical time warning
- Question navigation grid with 5 states:
  - Current (blue)
  - Answered (green)
  - Marked for Review (yellow)
  - Visited (gray)
  - Not Visited (light gray)
- Mark questions for review
- Copy-paste prevention
- Back button prevention
- Anti-cheat detection:
  - Fullscreen exit detection (1-second delay to prevent false positives)
  - Tab switch detection
  - Screen change detection (5-second polling)
  - Right-click prevention
  - Window blur detection
- Violation modal system with:
  - Violation type display
  - Current count and remaining violations
  - Continue button
  - Optional fullscreen re-entry
- Auto-submit after 3 violations
- No navbar during test for distraction-free experience
- 15 realistic aptitude questions with explanations

### Test Results

- Comprehensive score breakdown
- Subject-wise performance analysis
- Question-by-question review with explanations
- Smart scroll navigation:
  - "Scroll to Bottom" button when at top
  - "Scroll to Top" button when at bottom
  - Smooth animated scrolling
  - Auto-hides when reaching destination

### Progress Tracking

- Overall progress percentage
- Subject-wise breakdown with progress bars
- Learning milestones:
  - Beginner (25%)
  - Intermediate (50%)
  - Advanced (75%)
  - Master (100%)
- Quick action buttons to subjects and tests

### Leaderboard

- National and college filters
- Top 3 medal display
- Real-time updates every 5 seconds (mocked)
- Animated rank changes

### Analytics

- Subject-wise accuracy (bar chart)
- Performance over time (line chart)
- Strengths vs weaknesses (pie chart)
- Average time per question

### Profile

- Personal information management
- Badge collection
- Test history
- Quick stats

### Admin Panel (Lazy Loaded)

- Question CRUD interface
- Bulk CSV upload UI
- Violation logs
- Platform analytics

## 🔌 Backend Integration

The app is built with a clean service abstraction layer. To connect to a real backend:

1. Update `src/services/api.ts` to use real API endpoints instead of `mockApi`
2. Configure `VITE_API_URL` in `.env`
3. Implement real socket connection in `src/services/socket.ts`

All business logic is isolated from UI components, making backend integration seamless.

## 🎯 State Management

- **Zustand**: Auth state, test session with violations tracking, UI state (toasts, modals)
- **TanStack Query**: Server data (subjects, chapters, lessons, tests, dashboard stats, leaderboard, analytics)
- **Session Storage**: Fullscreen state tracking across navigation

## 🚀 Deployment

### Build

```bash
npm run build
```

The `dist` folder will contain the production build.

### Deploy to S3 + CloudFront

1. Build the project
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

### Environment Variables

- `VITE_API_URL`: Backend API URL (currently mocked)

## 📱 Responsive Design

The app is fully responsive and works on:

- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## ⚡ Performance

- Code splitting for admin and analytics routes
- Lazy loading for route components
- Optimized re-renders with Zustand selectors
- React Query caching (5-minute stale time)
- Framer Motion animations (≤300ms)

## 🎨 Animation Features

- 3D landing page animations with floating elements
- Page transitions (fade + slide)
- Counter animations
- Hover elevation effects (y: -4px)
- Scroll-triggered fade-in
- Toast slide-in
- Skeleton shimmer
- Chart animations (1000ms)
- Violation modal animations with scale effects
- Question transition animations
- Smooth scroll navigation with easing
- Notebook page curl effects

## 🔒 Security Features

- Protected routes
- Role-based access control (admin)
- Anti-cheat mechanisms
- Input validation with Zod
- XSS prevention

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

This is a demonstration project. For production use, implement:

- Real backend API
- Real-time socket connection
- File upload functionality
- Email verification
- Password reset
- OAuth integration
- Advanced analytics

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using React + TypeScript + Vite
