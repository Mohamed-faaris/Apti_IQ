import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { NotebookPage } from '../../../shared/ui/NotebookPage';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { SkeletonCard } from '../../../shared/ui/Skeleton';
import { LearningNav } from '../components/LearningNav';

const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { data: lesson, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.LESSONS, id],
    queryFn: () => api.lessons.getById(id!),
  });

  const { data: chapters } = useQuery({
    queryKey: [QUERY_KEYS.CHAPTERS],
    queryFn: () => api.chapters.getBySubject('1'),
  });

  const chapterId = lesson?.chapterId;
  const currentChapter = chapters?.find(c => c.id === chapterId);
  const subjectId = currentChapter?.subjectId;

  const markCompleteMutation = useMutation({
    mutationFn: () => api.lessons.markComplete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LESSONS] });
      toast.success('Lesson marked as complete!');
      setTimeout(() => navigate(-1), 1500);
    },
  });

  const handleQuizSubmit = () => {
    if (!lesson?.quiz) return;
    
    const correct = lesson.quiz.questions.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    
    const score = (correct / lesson.quiz.questions.length) * 100;
    
    if (score >= 70) {
      toast.success(`Great job! Score: ${score.toFixed(0)}% - Lesson completed!`);
      markCompleteMutation.mutate();
    } else {
      toast.warning(`Score: ${score.toFixed(0)}%. You need 70% to pass. Try again!`);
      setQuizAnswers({});
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      <div className="hidden lg:block">
        <LearningNav currentSubjectId={subjectId} currentChapterId={chapterId} currentLessonId={id} />
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto space-y-4 lg:space-y-6 px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            ← Back to Lessons
          </Button>
          {lesson?.completed && (
            <Badge variant="success">
              ✅ Completed
            </Badge>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* YouTube Video Section */}
          {lesson?.videoUrl && (
            <Card className="mb-4 lg:mb-6 overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="mb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="text-2xl lg:text-3xl">📺</span> Video Lesson
                </h2>
                <p className="text-xs lg:text-sm text-gray-600">Watch this video to understand the concept better</p>
              </div>
              <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={lesson.videoUrl}
                  title={lesson.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
          )}

          <NotebookPage showLines={true} showMargin={true}>
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-3">
                <Badge variant="default">Lesson {lesson?.order}</Badge>
                <span className="text-xs lg:text-sm text-gray-600 flex items-center gap-1">
                  <span>⏱️</span> {lesson?.duration} minutes
                </span>
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-primary font-handwriting mb-2">{lesson?.name}</h1>
              <div className="h-1 w-16 lg:w-24 bg-secondary rounded-full"></div>
            </div>
            
            <div className="prose prose-sm lg:prose-lg max-w-none text-gray-800">
              <div dangerouslySetInnerHTML={{ __html: lesson?.content || '' }} />
            </div>
          </NotebookPage>
        </motion.div>

        {lesson?.quiz && !lesson.completed && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-2">Quick Practice</h2>
                <p className="text-sm lg:text-base text-gray-600">
                  Test your understanding with {lesson.quiz.questions.length} questions (70% to pass)
                </p>
              </div>
              {!showQuiz && (
                <Button variant="primary" onClick={() => setShowQuiz(true)} className="w-full lg:w-auto">
                  Start Practice →
                </Button>
              )}
            </div>

            {showQuiz && (
              <div className="space-y-4 lg:space-y-6 mt-6">
                {lesson.quiz.questions.map((question, qIndex) => (
                  <div key={question.id} className="p-4 lg:p-5 bg-white rounded-lg shadow-sm">
                    <p className="font-medium text-primary mb-4 text-base lg:text-lg">
                      {qIndex + 1}. {question.text}
                    </p>
                    <div className="space-y-2 lg:space-y-3">
                      {question.options.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className={`flex items-center gap-3 p-3 lg:p-4 rounded-lg cursor-pointer transition-smooth text-sm lg:text-base ${
                            quizAnswers[question.id] === oIndex
                              ? 'bg-secondary text-white'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={oIndex}
                            checked={quizAnswers[question.id] === oIndex}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [question.id]: oIndex })}
                            className="w-4 h-4 lg:w-5 lg:h-5"
                          />
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== lesson.quiz.questions.length}
                    isLoading={markCompleteMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    Submit Practice
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizAnswers({});
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {!lesson?.completed && !lesson?.quiz && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => markCompleteMutation.mutate()}
              isLoading={markCompleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              Mark as Complete ✓
            </Button>
          </div>
        )}

        {lesson?.completed && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
            <div className="text-center py-4 lg:py-6">
              <div className="text-4xl lg:text-6xl mb-4">🎉</div>
              <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2">Lesson Completed!</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">Great job! Ready for the next lesson?</p>
              <Button variant="primary" size="lg" onClick={() => navigate(-1)} className="w-full sm:w-auto">
                Continue Learning →
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LessonDetailPage;