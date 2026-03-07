import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { StudentLayout } from './layouts/StudentLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { SkeletonCard } from '../shared/ui/Skeleton';

// Lazy loaded routes
const SubjectsPage = lazy(() => import('../features/learning/pages/SubjectsPage'));
const ChaptersPage = lazy(() => import('../features/learning/pages/ChaptersPage'));
const LessonsPage = lazy(() => import('../features/learning/pages/LessonsPage'));
const LessonDetailPage = lazy(() => import('../features/learning/pages/LessonDetailPage'));
const TestSelectionPage = lazy(() => import('../features/test-engine/pages/TestSelectionPage'));
const TestInstructionsPage = lazy(() => import('../features/test-engine/pages/TestInstructionsPage'));
const TestPage = lazy(() => import('../features/test-engine/pages/TestPage'));
const TestResultsPage = lazy(() => import('../features/test-engine/pages/TestResultsPage'));
const LeaderboardPage = lazy(() => import('../features/leaderboard/pages/LeaderboardPage'));
const StudentAnalyticsPage = lazy(() => import('../features/analytics/pages/StudentAnalyticsPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const AdminPage = lazy(() => import('../features/admin/pages/AdminPage'));
const ProgressPage = lazy(() => import('../features/dashboard/pages/ProgressPage'));
const TournamentsPage = lazy(() => import('../features/tournaments/pages/TournamentsPage'));
const BadgesStreaksPage = lazy(() => import('../features/achievements/pages/BadgesStreaksPage'));
const TeacherDashboard = lazy(() => import('../features/teacher/pages/TeacherDashboard'));
const StudentsPage = lazy(() => import('../features/teacher/pages/StudentsPage'));
const CreateTestPage = lazy(() => import('../features/teacher/pages/CreateTestPage'));
const TeacherAnalyticsPage = lazy(() => import('../features/teacher/pages/TeacherAnalyticsPage'));
const TeacherTestResultsPage = lazy(() => import('../features/teacher/pages/TeacherTestResultsPage'));
const NotesPage = lazy(() => import('../features/teacher/pages/NotesPage'));
const ClassesPage = lazy(() => import('../features/teacher/pages/ClassesPage'));
const ClassDetailPage = lazy(() => import('../features/teacher/pages/ClassDetailPage'));
const MyClassesPage = lazy(() => import('../features/student/pages/MyClassesPage'));
const ClassTestsPage = lazy(() => import('../features/student/pages/ClassTestsPage'));

const LoadingFallback = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<StudentLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <TeacherDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <StudentsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-test"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <CreateTestPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/analytics"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <TeacherAnalyticsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/test-results"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <TeacherTestResultsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/notes"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <NotesPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/classes"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <ClassesPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/classes/:classId"
          element={
            <ProtectedRoute requireTeacher>
              <Suspense fallback={<LoadingFallback />}>
                <ClassDetailPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-classes"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <MyClassesPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:classId/tests"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ClassTestsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ProgressPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <SubjectsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:id/chapters"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ChaptersPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chapters/:id/lessons"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <LessonsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <LessonDetailPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TestSelectionPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/instructions"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TestInstructionsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/active"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TestPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:id/results"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TestResultsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <LeaderboardPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <TournamentsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <BadgesStreaksPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <StudentAnalyticsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin route - standalone without navbar */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingFallback />}>
              <AdminPage />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
