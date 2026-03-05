import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { DashboardNav } from '../../dashboard/components/DashboardNav';

const StudentAnalyticsPage = () => {
  // Mock data - replace with actual API calls
  const performanceData = {
    overallAccuracy: 78,
    totalTests: 45,
    totalQuestions: 1350,
    correctAnswers: 1053,
    averageTime: '2.5 min',
    strongestSubject: 'Quantitative Aptitude',
    weakestSubject: 'Verbal Ability',
  };

  const subjectPerformance = [
    { subject: 'Quantitative Aptitude', accuracy: 85, tests: 15, icon: '🔢' },
    { subject: 'Logical Reasoning', accuracy: 80, tests: 12, icon: '🧩' },
    { subject: 'Verbal Ability', accuracy: 65, tests: 10, icon: '📖' },
    { subject: 'Data Interpretation', accuracy: 82, tests: 8, icon: '📊' },
  ];

  const recentTests = [
    { name: 'Mock Test #12', date: '2 days ago', score: 85, accuracy: 85, time: '45 min' },
    { name: 'Practice Test - Quant', date: '5 days ago', score: 92, accuracy: 92, time: '30 min' },
    { name: 'Advanced Test', date: '1 week ago', score: 78, accuracy: 78, time: '60 min' },
    { name: 'Mock Test #11', date: '1 week ago', score: 80, accuracy: 80, time: '45 min' },
  ];

  const weeklyProgress = [
    { week: 'Week 1', tests: 8, accuracy: 72 },
    { week: 'Week 2', tests: 10, accuracy: 75 },
    { week: 'Week 3', tests: 12, accuracy: 78 },
    { week: 'Week 4', tests: 15, accuracy: 82 },
  ];

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600';
    if (accuracy >= 70) return 'text-blue-600';
    if (accuracy >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 85) return 'bg-green-500';
    if (accuracy >= 70) return 'bg-blue-500';
    if (accuracy >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation */}
      <div className="hidden lg:block">
        <DashboardNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
            📊 My Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Track your performance and identify areas for improvement
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Overall Accuracy</p>
              <p className={`text-2xl sm:text-3xl font-bold ${getAccuracyColor(performanceData.overallAccuracy)}`}>
                {performanceData.overallAccuracy}%
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Tests</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {performanceData.totalTests}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Questions Solved</p>
              <p className="text-2xl sm:text-3xl font-bold text-secondary">
                {performanceData.totalQuestions}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Avg Time/Question</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent">
                {performanceData.averageTime}
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">
              📚 Subject-wise Performance
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {subjectPerformance.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">{subject.icon}</span>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-primary">
                          {subject.subject}
                        </p>
                        <p className="text-xs text-gray-600">{subject.tests} tests completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base sm:text-lg font-bold ${getAccuracyColor(subject.accuracy)}`}>
                        {subject.accuracy}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.accuracy}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className={`h-2 rounded-full ${getAccuracyBg(subject.accuracy)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-l-4 border-green-500 bg-green-50/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl">💪</span>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-primary mb-1 sm:mb-2">
                    Strongest Subject
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-green-600 mb-1">
                    {performanceData.strongestSubject}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Keep up the excellent work! You're performing exceptionally well in this area.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-orange-500 bg-orange-50/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl">📈</span>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-primary mb-1 sm:mb-2">
                    Needs Improvement
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-orange-600 mb-1">
                    {performanceData.weakestSubject}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Focus more practice here to improve your overall performance.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">
              📈 Weekly Progress
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {weeklyProgress.map((week, index) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-16 sm:w-20">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">{week.week}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {week.tests} tests • {week.accuracy}% accuracy
                      </p>
                      <Badge variant={week.accuracy >= 80 ? 'success' : week.accuracy >= 70 ? 'primary' : 'warning'}>
                        {week.accuracy >= 80 ? '🔥 Great' : week.accuracy >= 70 ? '👍 Good' : '📚 Practice'}
                      </Badge>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${week.accuracy}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-2 rounded-full ${getAccuracyBg(week.accuracy)}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4">
              📝 Recent Test Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-bold text-primary">Test</th>
                    <th className="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-bold text-primary">Date</th>
                    <th className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm font-bold text-primary">Score</th>
                    <th className="text-center py-2 px-2 sm:px-3 text-xs sm:text-sm font-bold text-primary">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTests.map((test, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-3">
                        <p className="text-xs sm:text-sm font-medium text-primary">{test.name}</p>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3">
                        <p className="text-xs text-gray-600">{test.date}</p>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-center">
                        <Badge variant={test.accuracy >= 85 ? 'success' : test.accuracy >= 70 ? 'primary' : 'warning'}>
                          {test.score}%
                        </Badge>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-center">
                        <p className="text-xs sm:text-sm text-gray-600">{test.time}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl sm:text-3xl">💡</span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-primary mb-2">
                  Personalized Insights
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Your accuracy has improved by 10% in the last month. Great progress!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>You're most productive during morning hours (9 AM - 12 PM).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">!</span>
                    <span>Focus on Verbal Ability - 3 more practice sessions recommended.</span>
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
