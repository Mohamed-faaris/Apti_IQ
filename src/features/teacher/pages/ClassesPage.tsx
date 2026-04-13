import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { Modal } from '../../../shared/ui/Modal';
import { TeacherNav } from '../components/TeacherNav';
import { api } from '../../../services/api';

interface Class {
  id: string;
  name: string;
  subject: string;
  code: string;
  students: number;
  createdAt: string;
}

export const ClassesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', subject: '' });

  useEffect(() => {
    api.teacher.listClasses('demo-teacher').then((data) => {
      setClasses(data.map((cls) => ({
        id: cls.legacyId ?? cls._id,
        name: cls.name,
        subject: cls.subject,
        code: cls.code,
        students: cls.students,
        createdAt: cls.createdAt,
      })));
    });
  }, []);

  const generateClassCode = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const randomLetters = (count: number) =>
      Array.from({ length: count }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    
    const randomNumbers = (count: number) =>
      Array.from({ length: count }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    
    return `CLS-${randomLetters(2)}${randomNumbers(3)}`;
  };

  const handleCreateClass = () => {
    if (!newClass.name.trim() || !newClass.subject.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const classCode = generateClassCode();
    api.teacher.createClass('demo-teacher', newClass.name, newClass.subject, classCode).then(() => {
      setClasses([...classes, { id: classCode, name: newClass.name, subject: newClass.subject, code: classCode, students: 0, createdAt: new Date().toISOString() }]);
    });
    setShowCreateModal(false);
    setNewClass({ name: '', subject: '' });
    
    toast.success(`Class created! Code: ${classCode}`);
    setTimeout(() => {
      alert(`✅ Class Created Successfully!\n\n📋 Class Code: ${classCode}\n\n👥 Share this code with your students so they can join your class.\n\n💡 Students must join a class before they can access your tests.`);
    }, 500);
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Class code copied to clipboard!');
  };

  const deleteClass = (id: string) => {
    if (confirm('Are you sure you want to delete this class? Students will lose access to tests assigned to this class.')) {
      api.teacher.deleteClass(id).then(() => setClasses(classes.filter(c => c.id !== id)));
      toast.success('Class deleted successfully');
    }
  };

  return (
    <div className="flex gap-8">
      {/* Left Navigation */}
      <TeacherNav />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">👥 My Classes</h1>
            <p className="text-gray-600">Manage your classes and students</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>
              ← Back
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              + Create Class
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="font-bold text-primary mb-2">How Classes Work</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Create classes for different subjects or batches</li>
              <li>• Share the class code with your students</li>
              <li>• Students must join a class to access your tests</li>
              <li>• Assign tests to specific classes when creating them</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-primary mb-2">No Classes Yet</h3>
          <p className="text-gray-600 mb-6">Create your first class to get started</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            + Create First Class
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
                  </div>
                  <Badge variant="primary">{classItem.students} students</Badge>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 mb-1">Class Code:</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-primary">{classItem.code}</p>
                    <button
                      onClick={() => copyClassCode(classItem.code)}
                      className="text-secondary hover:text-primary transition-smooth"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Created {new Date(classItem.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/teacher/classes/${classItem.id}`)}
                  >
                    Manage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteClass(classItem.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Class"
      >
        <div className="space-y-4">
          <Input
            label="Class Name"
            placeholder="e.g., Mathematics - Batch A"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          />
          <Input
            label="Subject"
            placeholder="e.g., Mathematics"
            value={newClass.subject}
            onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateClass}>
              Create Class
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default ClassesPage;
