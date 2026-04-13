import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';

const ProgressPage = () => {
  const navigate = useNavigate();
  const detailedProgress: Array<{ subject: string; icon: string; progress: number; totalChapters: number; completedChapters: number; totalLessons: number; completedLessons: number; chapters: Array<{ name: string; lessons: number; completed: number; progress: number }> }> = [];

  const overallProgress = detailedProgress.reduce((acc, s) => acc + s.progress, 0) / detailedProgress.length;
  const totalLessons = detailedProgress.reduce((acc, s) => acc + s.totalLessons, 0);
  const completedLessons = detailedProgress.reduce((acc, s) => acc + s.completedLessons, 0);
  const totalChapters = detailedProgress.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChapters = detailedProgress.reduce((acc, s) => acc + s.completedChapters, 0);

  if (detailedProgress.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <DashboardNav />
        <div className="flex-1 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
          <Card className="text-center py-12">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-lg text-gray-600 mb-2">No progress data yet</p>
            <p className="text-sm text-gray-500 mb-6">Start learning to see subject and lesson progress here.</p>
            <Button variant="primary" onClick={() => navigate('/subjects')}>Browse Subjects</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation - Sidebar hidden on mobile, but floating button always visible */}
      <DashboardNav />

      <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">📚 Learning Progress</h1>
          <p className="text-xs sm:text-sm text-gray-600">Track your subject and lesson completion</p>
        </motion.div>

        {/* Overall Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">Overall Learning Progress</h2>
                <p className="text-sm sm:text-base text-gray-600">Your cumulative progress across all subjects</p>
              </div>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary"
                >
                  {Math.round(overallProgress)}%
                </motion.div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">Complete</p>
              </div>
            </div>

            <div className="bg-gray-200 rounded-full h-3 sm:h-4 mb-4 sm:mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="bg-gradient-to-r from-primary to-secondary h-3 sm:h-4 rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg">
                <p className="text-2xl sm:text-3xl font-bold text-primary">{detailedProgress.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Subjects</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg">
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{completedChapters}/{totalChapters}</p>
                <p className="text-xs sm:text-sm text-gray-600">Chapters Done</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{completedLessons}/{totalLessons}</p>
                <p className="text-xs sm:text-sm text-gray-600">Lessons Done</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg">
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{Math.round((completedLessons/totalLessons)*100)}%</p>
                <p className="text-xs sm:text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Subject-wise Detailed Progress */}
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-4 sm:mb-6">Subject-wise Progress</h2>
          <div className="space-y-4 sm:space-y-6">
            {detailedProgress.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card hover className="cursor-pointer" onClick={() => navigate(`/subjects/${index + 1}/chapters`)}>
                  {/* Subject Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4">
                    <div className="text-4xl sm:text-5xl flex-shrink-0">{subject.icon}</div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-primary">{subject.subject}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {subject.completedChapters}/{subject.totalChapters} chapters • {subject.completedLessons}/{subject.totalLessons} lessons
                          </p>
                        </div>
                        <Badge 
                          variant={
                            subject.progress >= 75 ? 'success' : 
                            subject.progress >= 50 ? 'warning' : 
                            'default'
                          }
                          className="text-base sm:text-lg px-3 sm:px-4 py-1 sm:py-2"
                        >
                          {subject.progress}%
                        </Badge>
                      </div>

                      <div className="bg-gray-200 rounded-full h-2 sm:h-3 mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          className={`h-2 sm:h-3 rounded-full ${
                            subject.progress >= 75 ? 'bg-green-500' :
                            subject.progress >= 50 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chapter Breakdown */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-3">Chapter Progress:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {subject.chapters.map((chapter, idx) => (
                        <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm font-medium text-primary truncate pr-2">
                              {chapter.name}
                            </span>
                            <Badge 
                              variant={
                                chapter.progress === 100 ? 'success' :
                                chapter.progress >= 50 ? 'warning' :
                                'default'
                              }
                              size="sm"
                            >
                              {chapter.progress}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>{chapter.completed}/{chapter.lessons} lessons</span>
                            {chapter.progress === 100 && <span className="text-green-600">✓ Complete</span>}
                          </div>
                          <div className="bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                chapter.progress === 100 ? 'bg-green-500' :
                                chapter.progress >= 50 ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${chapter.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="primary" size="sm" className="w-full sm:w-auto">
                      {subject.progress === 100 ? 'Review Lessons' : 'Continue Learning'} →
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Milestones */}
        <Card>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-4 sm:mb-6">🎯 Learning Milestones</h2>
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                overallProgress >= 25 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-3xl sm:text-4xl">{overallProgress >= 25 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-primary">Beginner Level</h3>
                <p className="text-xs sm:text-sm text-gray-600">Complete 25% of all lessons</p>
              </div>
              {overallProgress >= 25 && <Badge variant="success">Achieved</Badge>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                overallProgress >= 50 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-3xl sm:text-4xl">{overallProgress >= 50 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-primary">Intermediate Level</h3>
                <p className="text-xs sm:text-sm text-gray-600">Complete 50% of all lessons</p>
              </div>
              {overallProgress >= 50 && <Badge variant="success">Achieved</Badge>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                overallProgress >= 75 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-3xl sm:text-4xl">{overallProgress >= 75 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-primary">Advanced Level</h3>
                <p className="text-xs sm:text-sm text-gray-600">Complete 75% of all lessons</p>
              </div>
              {overallProgress >= 75 && <Badge variant="success">Achieved</Badge>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                overallProgress === 100 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="text-3xl sm:text-4xl">{overallProgress === 100 ? '✅' : '⭕'}</div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-primary">Master Level</h3>
                <p className="text-xs sm:text-sm text-gray-600">Complete 100% of all lessons</p>
              </div>
              {overallProgress === 100 && <Badge variant="success">Achieved</Badge>}
            </motion.div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-2">Ready to continue learning?</h3>
              <p className="text-sm sm:text-base text-gray-600">Pick up where you left off or explore new topics</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={() => navigate('/subjects')} className="w-full sm:w-auto">
                Browse Subjects
              </Button>
              <Button variant="primary" onClick={() => navigate('/test')} className="w-full sm:w-auto">
                Test Your Knowledge
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};


export default ProgressPage;
