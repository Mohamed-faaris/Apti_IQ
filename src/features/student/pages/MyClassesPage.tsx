import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { Modal } from '../../../shared/ui/Modal';
import { api } from '../../../services/api';

interface StudentClass {
  id: string;
  name: string;
  subject: string;
  code: string;
  teacherName: string;
  joinedAt: string;
  testsAvailable: number;
}

export const MyClassesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = () => {
    api.teacher.listClasses('demo-teacher').then((data) => {
      setClasses(data.map((cls) => ({ id: cls.legacyId ?? cls._id, name: cls.name, subject: cls.subject, code: cls.code, teacherName: 'Prof. Smith', joinedAt: cls.createdAt, testsAvailable: 1 } as StudentClass)));
    });
  };

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      toast.error('Please enter a class code');
      return;
    }

    // Validate class code format (e.g., CLS-AB123)
    const codePattern = /^CLS-[A-Z]{2}\d{3}$/;
    if (!codePattern.test(classCode.toUpperCase())) {
      toast.error('Invalid class code format');
      return;
    }

    // Check if already joined
    if (classes.some(c => c.code === classCode.toUpperCase())) {
      toast.error('You have already joined this class');
      return;
    }

    const newClass: StudentClass = {
      id: Date.now().toString(),
      name: 'Sample Class',
      subject: 'Mathematics',
      code: classCode.toUpperCase(),
      teacherName: 'Prof. Smith',
      joinedAt: new Date().toISOString(),
      testsAvailable: 0,
    };

    setClasses([...classes, newClass]);
    setShowJoinModal(false);
    setClassCode('');
    
    toast.success('Successfully joined class!');
  };

  const leaveClass = (id: string) => {
    if (confirm('Are you sure you want to leave this class? You will lose access to all tests in this class.')) {
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      toast.success('Left class successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">📚 My Classes</h1>
            <p className="text-gray-600">Classes you've joined and their tests</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back
            </Button>
            <Button variant="primary" onClick={() => setShowJoinModal(true)}>
              + Join Class
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="font-bold text-primary mb-2">About Classes</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Get the class code from your teacher/professor</li>
              <li>• Join a class to access tests assigned by your teacher</li>
              <li>• You can only take tests through classes you've joined</li>
              <li>• Practice tests are still available without joining a class</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-primary mb-2">No Classes Yet</h3>
          <p className="text-gray-600 mb-6">Join your first class using the code from your teacher</p>
          <Button variant="primary" onClick={() => setShowJoinModal(true)}>
            + Join a Class
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-1">{classItem.name}</h3>
                    <p className="text-sm text-gray-600">{classItem.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">👨‍🏫 {classItem.teacherName}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="success">{classItem.testsAvailable} tests</Badge>
                    {(classItem as any).notesCount > 0 && (
                      <Badge variant="primary">{(classItem as any).notesCount} notes</Badge>
                    )}
                    {(classItem as any).updatesCount > 0 && (
                      <Badge variant="warning">{(classItem as any).updatesCount} updates</Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Class Code:</p>
                  <p className="font-mono font-bold text-primary">{classItem.code}</p>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Joined {new Date(classItem.joinedAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/classes/${classItem.id}/tests`)}
                  >
                    Open Class
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => leaveClass(classItem.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Leave
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Join Class Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join a Class"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Enter the class code provided by your teacher to join their class and access assigned tests.
            </p>
            <Input
              label="Class Code"
              placeholder="e.g., CLS-AB123"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Class codes are provided by your teacher/professor
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleJoinClass}>
              Join Class
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyClassesPage;
