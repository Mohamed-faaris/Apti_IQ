import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { SkeletonCard } from '../../../shared/ui/Skeleton';
import { LearningNav } from '../components/LearningNav';

const LessonsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: lessons, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.LESSONS, id],
    queryFn: () => api.lessons.getByChapter(id!),
  });

  const { data: chapters } = useQuery({
    queryKey: [QUERY_KEYS.CHAPTERS],
    queryFn: () => api.chapters.getBySubject('1'), // This should be dynamic based on subject
  });

  const currentChapter = chapters?.find(c => c.id === id);
  const subjectId = currentChapter?.subjectId;
  const completedLessons = lessons?.filter(l => l.completed).length || 0;
  const totalLessons = lessons?.length || 0;
  const allLessonsComplete = completedLessons === totalLessons && totalLessons > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation - hidden on mobile */}
      <div className="hidden lg:block">
        <LearningNav currentSubjectId={subjectId} currentChapterId={id} />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 lg:space-y-8 px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              {currentChapter?.name || 'Lessons'}
            </h1>
            <p className="text-sm lg:text-base text-gray-600">{currentChapter?.description}</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            ← Back
          </Button>
        </div>

        {/* Progress Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-primary mb-2">Lesson Progress</h3>
              <p className="text-sm lg:text-base text-gray-600">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
            {allLessonsComplete && (
              <Badge variant="success" className="text-base lg:text-lg px-3 lg:px-4 py-1 lg:py-2">
                Chapter Complete! 🎉
              </Badge>
            )}
          </div>
        </Card>
        
        {/* Lessons List */}
        <div className="space-y-3 lg:space-y-4">
          {lessons?.map((lesson, i) => {
            const isInProgress = !lesson.completed && i > 0 && lessons[i - 1]?.completed;
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/lessons/${lesson.id}`}>
                  <Card hover className={isInProgress ? 'border-2 border-secondary/30' : ''}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 lg:gap-4 flex-1">
                        <div className="text-3xl lg:text-4xl">
                          {lesson.completed ? '✅' : isInProgress ? '📖' : '📄'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-2">
                            <span className="text-xs lg:text-sm font-medium text-gray-500">
                              Lesson {lesson.order}
                            </span>
                            {lesson.completed && <Badge variant="success">Completed</Badge>}
                            {isInProgress && <Badge variant="warning">In Progress</Badge>}
                            {!lesson.completed && !isInProgress && <Badge variant="default">Not Started</Badge>}
                          </div>
                          <h2 className="text-lg lg:text-xl font-bold text-primary mb-1 truncate">{lesson.name}</h2>
                          <p className="text-xs lg:text-sm text-gray-600">
                            ⏱️ {lesson.duration} minutes
                          </p>
                        </div>
                      </div>
                      {isInProgress && (
                        <Button variant="primary" className="hidden sm:block">Continue →</Button>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Chapter Test Card */}
        {allLessonsComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 lg:gap-4">
                  <div className="text-4xl lg:text-5xl">🎯</div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Chapter Test Unlocked!</h3>
                    <p className="text-sm lg:text-base text-gray-600">
                      Test your knowledge and earn your completion badge
                    </p>
                  </div>
                </div>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Test →
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LessonsPage;
