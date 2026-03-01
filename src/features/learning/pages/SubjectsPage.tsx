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
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">Learn</h1>
      
      {/* Continue Learning Banner */}
      {inProgressSubject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-2 border-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Continue Learning</p>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {inProgressSubject.name}
                </h3>
                <p className="text-gray-600">
                  {inProgressSubject.progress}% complete • {inProgressSubject.chaptersCount} chapters
                </p>
              </div>
              <Link to={`/subjects/${inProgressSubject.id}/chapters`}>
                <Button variant="primary" size="lg">
                  Resume →
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Subject Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="text-5xl">{subject.icon}</div>
                  {getStatusBadge(subject.progress)}
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">{subject.name}</h2>
                <p className="text-gray-600 mb-4">{subject.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
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
