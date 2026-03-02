import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { StatCard } from '../../../shared/ui/StatCard';
import { Badge } from '../../../shared/ui/Badge';
import { useAuthStore } from '../../auth/store/authStore';
import { useToast } from '../../../shared/hooks/useToast';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const toast = useToast();
  const [createdTests, setCreatedTests] = useState<any[]>([]);

  // Load created tests from localStorage
  useState(() => {
    const tests = JSON.parse(localStorage.getItem('teacherTests') || '[]');
    setCreatedTests(tests.slice(-5)); // Show last 5 tests
  });

  const copyTestCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Test code copied to clipboard!');
  };

  // Mock teacher stats - replace with real API call
  const teacherStats = {
    totalStudents: 156,
    activeTests: 12,
    totalTests: 45,
    avgStudentScore: 78,
    recentActivity: [
      { id: 1, student: 'John Doe', action: 'Completed Algebra Test', score: 85, time: '2 hours ago' },
      { id: 2, student: 'Jane Smith', action: 'Completed Math Test', score: 92, time: '3 hours ago' },
      { id: 3, student: 'Mike Johnson', action: 'Started Geometry Test', time: '5 hours ago' },
    ],
    upcomingClasses: [
      { id: 1, subject: 'Mathematics', topic: 'Quadratic Equations', time: 'Today, 2:00 PM', students: 25 },
      { id: 2, subject: 'Logical Reasoning', topic: 'Puzzles', time: 'Tomorrow, 10:00 AM', students: 30 },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              👨‍🏫 Teacher Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/teacher/students')}>
              View Students
            </Button>
            <Button variant="primary" onClick={() => navigate('/teacher/create-test')}>
              + Create Test
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Students"
            value={teacherStats.totalStudents}
            icon="👥"
            trend="up"
            trendValue="+12"
          />
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
          <StatCard
            title="Avg Student Score"
            value={`${teacherStats.avgStudentScore}%`}
            icon="📊"
            trend="up"
            trendValue="+5%"
          />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-primary mb-4">⚡ Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/teacher/create-test')}
            >
              <span className="mr-2">🧪</span> Create Test
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/teacher/analytics')}
            >
              <span className="mr-2">📈</span> View Analytics
            </Button>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700">
              💡 <span className="font-medium">Tip:</span> Create tests and share the generated code with your students. They'll use it to join and take your test.
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Created Tests */}
        {createdTests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">🧪 Your Created Tests</h2>
                  <p className="text-sm text-gray-600 mt-1">Share these codes with your students</p>
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
                      <Badge variant="primary">{test.questions.length} Qs</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      <span>⏱️ {test.duration} min</span>
                      <span>📊 {test.totalMarks} marks</span>
                    </div>
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: createdTests.length > 0 ? 0.7 : 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">📋 Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {teacherStats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth"
                >
                  <div className="flex-1">
                    <p className="font-medium text-primary">{activity.student}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  {activity.score && (
                    <Badge variant={activity.score >= 80 ? 'success' : 'warning'}>
                      {activity.score}%
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-6">📅 Upcoming Classes</h2>
            <div className="space-y-4">
              {teacherStats.upcomingClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-primary">{classItem.subject}</p>
                      <p className="text-sm text-gray-700">{classItem.topic}</p>
                    </div>
                    <Badge variant="primary">{classItem.students} students</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                    <span>🕐</span>
                    <span>{classItem.time}</span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full mt-3">
                    Start Class
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Schedule
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Student Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <h2 className="text-2xl font-bold text-primary mb-6">📊 Student Performance Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <p className="text-4xl font-bold text-green-600 mb-2">45</p>
              <p className="text-sm text-gray-600">Excellent (80%+)</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-4xl font-bold text-yellow-600 mb-2">78</p>
              <p className="text-sm text-gray-600">Good (60-80%)</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <p className="text-4xl font-bold text-red-600 mb-2">33</p>
              <p className="text-sm text-gray-600">Need Help (&lt;60%)</p>
            </div>
          </div>
          <Button variant="primary" className="w-full mt-6">
            View Detailed Analytics
          </Button>
        </Card>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-primary mb-4">📚 Teaching Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="text-3xl mb-2">📖</div>
              <p className="font-bold text-primary mb-1">Lesson Templates</p>
              <p className="text-sm text-gray-600 mb-3">Pre-made lesson structures</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse
              </Button>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-bold text-primary mb-1">Question Bank</p>
              <p className="text-sm text-gray-600 mb-3">1000+ practice questions</p>
              <Button variant="outline" size="sm" className="w-full">
                Explore
              </Button>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-3xl mb-2">💡</div>
              <p className="font-bold text-primary mb-1">Teaching Tips</p>
              <p className="text-sm text-gray-600 mb-3">Best practices & guides</p>
              <Button variant="outline" size="sm" className="w-full">
                Learn
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
