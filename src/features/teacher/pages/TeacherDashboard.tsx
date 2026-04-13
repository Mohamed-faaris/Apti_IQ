import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { StatCard } from '../../../shared/ui/StatCard';
import { Badge } from '../../../shared/ui/Badge';
import { useAuthStore } from '../../auth/store/authStore';
import { useToast } from '../../../shared/hooks/useToast';
import { TeacherNav } from '../components/TeacherNav';
import { api } from '../../../services/api';
import { useEffect, useState } from 'react';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const toast = useToast();
  const [createdTests, setCreatedTests] = useState<any[]>([]);

  useEffect(() => {
    api.teacher.listTests('class-1').then((tests) => setCreatedTests(tests));
  }, []);

  const copyTestCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Test code copied to clipboard!');
  };

  const teacherStats = { totalStudents: 25, activeTests: createdTests.length, totalTests: createdTests.length, avgStudentScore: 78, teacherActivity: [] };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation */}
      <TeacherNav />

      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-1 sm:mb-2">
              👨‍🏫 Teacher Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/teacher/test-results')}>
              Test Results
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/teacher/create-test')}>
              + Create Test
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Total Students" value={teacherStats.totalStudents} icon="👥" trend="up" trendValue="+0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Tests"
            value={teacherStats.activeTests}
            icon="🧪"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Total Tests Created"
            value={teacherStats.totalTests}
            icon="📝"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard title="Avg Student Score" value={`${teacherStats.avgStudentScore}%`} icon="📊" trend="up" trendValue="+0%" />
        </motion.div>
      </div>

      {/* Created Tests & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Created Tests */}
        {createdTests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary">🧪 Your Created Tests</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Share these codes with your students</p>
                </div>
                <Badge variant="success">{createdTests.length} Active</Badge>
              </div>
              <div className="space-y-3">
                {createdTests.map((test) => (
                  <div
                    key={test.id}
                    className="p-4 bg-white rounded-lg border border-green-200 hover:shadow-md transition-smooth"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-primary">{test.title}</p>
                        <p className="text-sm text-gray-600">{test.subject}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="primary">{test.questions.length} Qs</Badge>
                        {test.status === 'scheduled' && (
                          <Badge variant="warning">Scheduled</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <span>⏱️ {test.duration} min</span>
                      <span>📊 {test.totalMarks} marks</span>
                    </div>
                    {test.isScheduled && test.startDate && (
                      <div className="mt-2 text-xs text-blue-600">
                        📅 {new Date(test.startDate).toLocaleDateString()} {test.startTime} - {new Date(test.endDate).toLocaleDateString()} {test.endTime}
                      </div>
                    )}
                    <div className="mt-3 p-2 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Test Code:</p>
                        <p className="font-mono font-bold text-primary">{test.code}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyTestCode(test.code)}
                      >
                        📋 Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                className="w-full mt-4"
                onClick={() => navigate('/teacher/create-test')}
              >
                + Create New Test
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Teacher Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: createdTests.length > 0 ? 0.7 : 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary">📋 My Recent Activity</h2>
            </div>
            <div className="text-center py-10 text-gray-600">No activity yet.</div>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
