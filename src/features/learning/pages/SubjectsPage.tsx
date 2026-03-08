import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { SkeletonCard } from '../../../shared/ui/Skeleton';

const SubjectsPage = () => {
  const { data: subjects, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SUBJECTS],
    queryFn: api.subjects.getAll,
  });

  // Find subject with progress (for Continue Learning banner)
  const inProgressSubject = subjects?.find(s => s.progress > 0 && s.progress < 100);

  const getStatusBadge = (progress: number) => {
    if (progress === 0) return <Badge variant="default">Not Started</Badge>;
    if (progress === 100) return <Badge variant="success">Completed</Badge>;
    return <Badge variant="warning">In Progress</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 px-4 lg:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">Learn</h1>
          <p className="text-sm lg:text-base text-gray-600">Master aptitude skills with structured learning paths</p>
        </div>
      </div>
      
      {/* Continue Learning Banner */}
      {inProgressSubject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-2 border-secondary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 lg:gap-4 flex-1">
                <div className="text-4xl lg:text-5xl">{inProgressSubject.icon}</div>
                <div className="flex-1">
                  <p className="text-xs lg:text-sm text-gray-600 mb-1">Continue Learning</p>
                  <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2">
                    {inProgressSubject.name}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600">
                    {inProgressSubject.progress}% complete • {inProgressSubject.chaptersCount} chapters
                  </p>
                </div>
              </div>
              <Link to={`/subjects/${inProgressSubject.id}/chapters`} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Resume →
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Subject Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {subjects?.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={`/subjects/${subject.id}/chapters`}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl lg:text-5xl">{subject.icon}</div>
                  {getStatusBadge(subject.progress)}
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-primary mb-2">{subject.name}</h2>
                <p className="text-sm lg:text-base text-gray-600 mb-4">{subject.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <span className="text-gray-500">{subject.chaptersCount} chapters</span>
                    <span className="text-secondary font-medium">{subject.progress}% complete</span>
                  </div>
                  
                  <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
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
  );
};

export default SubjectsPage;
