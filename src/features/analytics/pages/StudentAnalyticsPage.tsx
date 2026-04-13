import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { DashboardNav } from '../../dashboard/components/DashboardNav';
import { useNavigate } from 'react-router-dom';

const StudentAnalyticsPage = () => {
  const navigate = useNavigate();
  const testStats = { totalTests: 0, practiceTests: 0, mockTests: 0, advancedTests: 0, averageScore: 0, highestScore: 0, lowestScore: 0, totalTimeSpent: '0 hours' };
  const completedTests: any[] = [];
  const subjectWisePerformance: any[] = [];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTestTypeIcon = (type: string) => {
    if (type === 'Mock Test') return '🏢';
    if (type === 'Practice Test') return '📝';
    if (type === 'Advanced Test') return '🎯';
    return '📋';
  };

  if (completedTests.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <DashboardNav />
        <div className="flex-1 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
          <Card className="text-center py-12">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-lg text-gray-600 mb-2">No analytics yet</p>
            <p className="text-sm text-gray-500 mb-6">Complete tests to see your performance analysis here.</p>
            <Button variant="primary" onClick={() => navigate('/test')}>Take Test</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation - Sidebar hidden on mobile, but floating button always visible */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
            📊 Test Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Detailed analysis of all your completed tests
          </p>
        </motion.div>

        {/* Overall Test Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Tests</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {testStats.totalTests}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                P:{testStats.practiceTests} M:{testStats.mockTests} A:{testStats.advancedTests}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Average Score</p>
              <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(testStats.averageScore)}`}>
                {testStats.averageScore}%
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Highest Score</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {testStats.highestScore}%
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Time Spent</p>
              <p className="text-2xl sm:text-3xl font-bold text-secondary">
                {testStats.totalTimeSpent}
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Subject-wise Test Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">
              📚 Subject-wise Test Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {subjectWisePerformance.map((subject: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{subject.icon}</span>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-primary">
                          {subject.subject}
                        </p>
                        <p className="text-xs text-gray-600">{subject.tests} tests completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-center p-2 bg-white rounded">
                      <p className={`text-lg font-bold ${getScoreColor(subject.avgScore)}`}>
                        {subject.avgScore}%
                      </p>
                      <p className="text-xs text-gray-600">Avg Score</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <p className="text-lg font-bold text-green-600">
                        {subject.bestScore}%
                      </p>
                      <p className="text-xs text-gray-600">Best Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Completed Tests - Detailed View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-primary">
                📝 Completed Tests ({completedTests.length})
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/test')}>
                Take New Test
              </Button>
            </div>
            
            <div className="space-y-4">
              {completedTests.map((test: any, index: number) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all"
                >
                  {/* Test Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-2xl">{getTestTypeIcon(test.type)}</span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-primary">
                          {test.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" size="sm">{test.type}</Badge>
                          {test.company && (
                            <Badge variant="primary" size="sm">{test.company}</Badge>
                          )}
                          <span className="text-xs text-gray-500">{test.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(test.score)}`}>
                        {test.score}%
                      </p>
                      <p className="text-xs text-gray-600">Score</p>
                    </div>
                  </div>

                  {/* Test Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 text-center">
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-lg font-bold text-green-600">{test.correctAnswers}</p>
                      <p className="text-xs text-gray-600">Correct</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="text-lg font-bold text-red-600">{test.wrongAnswers}</p>
                      <p className="text-xs text-gray-600">Wrong</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold text-gray-600">{test.unattempted}</p>
                      <p className="text-xs text-gray-600">Skipped</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-lg font-bold text-blue-600">{test.timeTaken}</p>
                      <p className="text-xs text-gray-600">of {test.timeLimit}</p>
                    </div>
                  </div>

                  {/* Subject-wise Breakdown */}
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Subject Breakdown:</p>
                    <div className="space-y-2">
                      {test.subjects.map((subject: { name: string; correct: number; total: number; accuracy: number }, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm text-gray-700">{subject.name}</span>
                              <span className={`text-xs sm:text-sm font-bold ${getScoreColor(subject.accuracy)}`}>
                                {subject.correct}/{subject.total} ({subject.accuracy}%)
                              </span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${getScoreBg(subject.accuracy)}`}
                                style={{ width: `${subject.accuracy}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/test/results/${test.id}`)}
                    >
                      View Detailed Analysis →
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl sm:text-3xl">💡</span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-primary mb-2">
                  Performance Insights
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Your average score has improved by 12% in the last month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>You perform best in Data Interpretation (88% avg)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">!</span>
                    <span>Focus on Verbal Ability - 5 more practice tests recommended</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">⭐</span>
                    <span>Mock tests show 15% better performance than practice tests</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentAnalyticsPage;
