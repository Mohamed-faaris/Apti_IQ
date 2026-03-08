import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { SkeletonCard } from '../../../shared/ui/Skeleton';
import { LearningNav } from '../components/LearningNav';

const ChaptersPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: chapters, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CHAPTERS, id],
    queryFn: () => api.chapters.getBySubject(id!),
  });

  const { data: subjects } = useQuery({
    queryKey: [QUERY_KEYS.SUBJECTS],
    queryFn: api.subjects.getAll,
  });

  const currentSubject = subjects?.find(s => s.id === id);
  const completedChapters = chapters?.filter(c => c.progress === 100).length || 0;
  const totalChapters = chapters?.length || 0;
  const inProgressChapter = chapters?.find(c => c.progress > 0 && c.progress < 100);

  const getStatusBadge = (progress: number) => {
    if (progress === 0) return <Badge variant="default">Not Started</Badge>;
    if (progress === 100) return <Badge variant="success">Completed</Badge>;
    return <Badge variant="warning">In Progress</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation - hidden on mobile */}
      <div className="hidden lg:block">
        <LearningNav currentSubjectId={id} />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 lg:space-y-8 px-4 lg:px-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              {currentSubject?.name || 'Chapters'}
            </h1>
            <p className="text-sm lg:text-base text-gray-600">{currentSubject?.description}</p>
          </div>
          <Link to="/subjects">
            <Button variant="outline" className="w-full sm:w-auto">← Back to Subjects</Button>
          </Link>
        </div>

        {/* Progress Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-primary mb-2">Chapter Progress</h3>
              <p className="text-sm lg:text-base text-gray-600">
                {completedChapters} of {totalChapters} chapters completed
              </p>
            </div>
            {inProgressChapter && (
              <Link to={`/chapters/${inProgressChapter.id}/lessons`} className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">Resume Chapter</Button>
              </Link>
            )}
          </div>
        </Card>
        
        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {chapters?.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/chapters/${chapter.id}/lessons`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs lg:text-sm font-medium text-gray-500">Chapter {chapter.order}</span>
                        {getStatusBadge(chapter.progress)}
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold text-primary">{chapter.name}</h2>
                    </div>
                    {chapter.progress === 100 && <span className="text-2xl lg:text-3xl">✅</span>}
                  </div>
                  
                  <p className="text-sm lg:text-base text-gray-600 mb-4">{chapter.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-gray-500">{chapter.lessonsCount} lessons</span>
                      <span className="text-secondary font-medium">{chapter.progress}% complete</span>
                    </div>
                    
                    <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${chapter.progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                        className="bg-secondary h-full rounded-full"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChaptersPage;
