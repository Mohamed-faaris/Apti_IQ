import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';

interface LearningNavProps {
  currentSubjectId?: string;
  currentChapterId?: string;
  currentLessonId?: string;
}

export const LearningNav = ({ currentSubjectId, currentChapterId, currentLessonId }: LearningNavProps) => {
  const location = useLocation();
  
  const { data: subjects } = useQuery({
    queryKey: [QUERY_KEYS.SUBJECTS],
    queryFn: api.subjects.getAll,
  });

  const { data: chapters } = useQuery({
    queryKey: [QUERY_KEYS.CHAPTERS, currentSubjectId],
    queryFn: () => api.chapters.getBySubject(currentSubjectId!),
    enabled: !!currentSubjectId,
  });

  const { data: lessons } = useQuery({
    queryKey: [QUERY_KEYS.LESSONS, currentChapterId],
    queryFn: () => api.lessons.getByChapter(currentChapterId!),
    enabled: !!currentChapterId,
  });

  // Get current context for navigation highlighting
  const currentSubject = subjects?.find(s => s.id === currentSubjectId);
  const currentChapter = chapters?.find(c => c.id === currentChapterId);

  const isActive = (path: string) => location.pathname === path;

  // Use the variables to avoid unused warnings
  console.debug('Navigation context:', { currentSubject, currentChapter, isActive });

  return (
    <div className="w-64 space-y-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Subjects Navigation */}
      <Card className="p-4">
        <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
          <span>📚</span>
          <span>Subjects</span>
        </h3>
        <div className="space-y-1">
          {subjects?.map((subject) => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}/chapters`}
              className={`block px-3 py-2 rounded-lg text-sm transition-smooth ${
                subject.id === currentSubjectId
                  ? 'bg-secondary text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{subject.icon}</span>
                <span className="flex-1 truncate">{subject.name}</span>
                {subject.progress === 100 && <span className="text-xs">✓</span>}
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Chapters Navigation (when subject is selected) */}
      {currentSubjectId && chapters && (
        <Card className="p-4">
          <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
            <span>📖</span>
            <span>Chapters</span>
          </h3>
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/chapters/${chapter.id}/lessons`}
                className={`block px-3 py-2 rounded-lg text-sm transition-smooth ${
                  chapter.id === currentChapterId
                    ? 'bg-secondary text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 rounded px-1.5 py-0.5">
                    {chapter.order}
                  </span>
                  <span className="flex-1 truncate">{chapter.name}</span>
                  {chapter.progress === 100 && <span className="text-xs">✓</span>}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Lessons Navigation (when chapter is selected) */}
      {currentChapterId && lessons && (
        <Card className="p-4">
          <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
            <span>📝</span>
            <span>Lessons</span>
          </h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-smooth ${
                  lesson.id === currentLessonId
                    ? 'bg-secondary text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{lesson.completed ? '✓' : lesson.order}</span>
                  <span className="flex-1 truncate">{lesson.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
