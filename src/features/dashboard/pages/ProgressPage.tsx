import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';

const ProgressPage = () => {
  const navigate = useNavigate();

  const { data: subjects } = useQuery({
    queryKey: [QUERY_KEYS.SUBJECTS],
    queryFn: api.subjects.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: api.dashboard.getStats,
  });

  const overallProgress = subjects
    ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation - Hidden on mobile, shown in hamburger menu */}
      <div className="hidden lg:block">
        <DashboardNav />
      </div>

      <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">Learning Progress</h1>
          <p className="text-xs sm:text-sm text-gray-600">Track your journey across all subjects</p>
        </motion.div>

        {/* Overall Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">Overall Progress</h2>
                <p className="text-gray-600">Your cumulative learning across all subjects</p>
              </div>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-6xl font-bold text-primary"
                >
                  {overallProgress}%
                </motion.div>
                <p className="text-sm text-gray-600 mt-2">Complete</p>
              </div>
            </div>

            <div className="bg-gray-200 rounded-full h-4 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold text-green-600">{stats?.totalTests || 0}</p>
                <p className="text-sm text-gray-600">Tests Completed</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{stats?.currentStreak || 0}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{stats?.accuracy || 0}%</p>
                <p className="text-sm text-gray-600">Avg Accuracy</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Subject-wise Progress */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Subject-wise Progress</h2>
          <div className="space-y-4">
            {subjects?.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card hover className="cursor-pointer" onClick={() => navigate(`/subjects/${subject.id}/chapters`)}>
                  <div className="flex items-center gap-6">
                    <div className="text-5xl flex-shrink-0">{subject.icon}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-primary">{subject.name}</h3>
                          <p className="text-sm text-gray-600">{subject.description}</p>
                        </div>
                        <Badge 
                          variant={
                            subject.progress >= 75 ? 'success' : 
                            subject.progress >= 50 ? 'warning' : 
                            'default'
                          }
                          className="text-lg px-4 py-2"
                        >
                          {subject.progress}%
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>{subject.chaptersCount} chapters</span>
                          <span>{Math.round((subject.progress / 100) * subject.chaptersCount)} completed</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                            className={`h-3 rounded-full ${
                              subject.progress >= 75 ? 'bg-green-500' :
                              subject.progress >= 50 ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {subject.progress === 100 && (
                            <Badge variant="success">✓ Completed</Badge>
                          )}
                          {subject.progress > 0 && subject.progress < 100 && (
                            <Badge variant="warning">In Progress</Badge>
                          )}
                          {subject.progress === 0 && (
                            <Badge variant="default">Not Started</Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Continue →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Milestones */}
        <Card>
          <h2 className="text-2xl font-bold text-primary mb-6">Learning Milestones</h2>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                overallProgress >= 25 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-4xl">{overallProgress >= 25 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="font-bold text-primary">Beginner</h3>
                <p className="text-sm text-gray-600">Complete 25% of all subjects</p>
              </div>
              {overallProgress >= 25 && <Badge variant="success">Achieved</Badge>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                overallProgress >= 50 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-4xl">{overallProgress >= 50 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="font-bold text-primary">Intermediate</h3>
                <p className="text-sm text-gray-600">Complete 50% of all subjects</p>
              </div>
              {overallProgress >= 50 && <Badge variant="success">Achieved</Badge>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                overallProgress >= 75 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-4xl">{overallProgress >= 75 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="font-bold text-primary">Advanced</h3>
                <p className="text-sm text-gray-600">Complete 75% of all subjects</p>
              </div>
              {overallProgress >= 75 && <Badge variant="success">Achieved</Badge>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                overallProgress === 100 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-4xl">{overallProgress === 100 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="font-bold text-primary">Master</h3>
                <p className="text-sm text-gray-600">Complete 100% of all subjects</p>
              </div>
              {overallProgress === 100 && <Badge variant="success">Achieved</Badge>}
            </motion.div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">Ready to continue?</h3>
              <p className="text-gray-600">Pick up where you left off</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/subjects')}>
                Browse Subjects
              </Button>
              <Button variant="primary" onClick={() => navigate('/test')}>
                Take a Test
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};


export default ProgressPage;
