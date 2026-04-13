import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';

interface Test {
  id: string;
  code: string;
  title: string;
  subject: string;
  duration: string;
  totalMarks: string;
  questions: any[];
  isScheduled: boolean;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  status: string;
  classId: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  fileName?: string;
  createdAt: string;
}

interface Update {
  id: string;
  message: string;
  createdAt: string;
}

export const ClassTestsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { classId } = useParams();
  const [tests, setTests] = useState<Test[]>([]);
  const [className, setClassName] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [activeTab, setActiveTab] = useState<'tests' | 'notes' | 'updates'>('tests');

  useEffect(() => {
    loadTests();
    loadNotes();
    loadUpdates();
  }, [classId]);

  const loadTests = () => {
    setTests([]);
    setClassName('');
  };

  const loadNotes = () => {
    setNotes([]);
  };

  const loadUpdates = () => {
    setUpdates([]);
  };

  const isTestAvailable = (test: Test): boolean => {
    if (!test.isScheduled) return true;
    
    const now = new Date();
    const startDateTime = new Date(`${test.startDate}T${test.startTime}`);
    const endDateTime = new Date(`${test.endDate}T${test.endTime}`);
    
    return now >= startDateTime && now <= endDateTime;
  };

  const handleStartTest = (test: Test) => {
    if (!isTestAvailable(test)) {
      toast.error('This test is not available yet or has ended');
      return;
    }

    // Store test code in session storage
    sessionStorage.setItem('testCode', test.code);
    sessionStorage.setItem('testType', 'teacher');
    navigate('/test/instructions');
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
            <h1 className="text-4xl font-bold text-primary mb-2">
              📚 {className}
            </h1>
            <p className="text-gray-600">Class materials, updates, and tests</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/my-classes')}>
            ← Back to Classes
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Card>
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'tests'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            🧪 Tests ({tests.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'notes'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            📚 Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'updates'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            📢 Updates ({updates.length})
          </button>
        </div>
      </Card>

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <div>
      {tests.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-primary mb-2">No Tests Yet</h3>
          <p className="text-gray-600 mb-6">
            Your teacher hasn't assigned any tests to this class yet
          </p>
          <Button variant="outline" onClick={() => navigate('/my-classes')}>
            Back to Classes
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tests.map((test, index) => {
            const available = isTestAvailable(test);
            
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${!available ? 'opacity-60' : 'hover:shadow-lg'} transition-all`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-1">{test.title}</h3>
                      <p className="text-sm text-gray-600">{test.subject}</p>
                    </div>
                    {test.isScheduled && (
                      <Badge variant={available ? 'success' : 'warning'}>
                        {available ? 'Available' : 'Scheduled'}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">⏱️ Duration:</span>
                      <span className="font-medium text-primary">{test.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">📝 Questions:</span>
                      <span className="font-medium text-primary">{test.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">📊 Total Marks:</span>
                      <span className="font-medium text-primary">{test.totalMarks}</span>
                    </div>
                  </div>

                  {test.isScheduled && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">📅 Available:</p>
                      <p className="text-sm font-medium text-primary">
                        {new Date(test.startDate!).toLocaleDateString()} {test.startTime}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">to</p>
                      <p className="text-sm font-medium text-primary">
                        {new Date(test.endDate!).toLocaleDateString()} {test.endTime}
                      </p>
                    </div>
                  )}

                  <Button
                    variant={available ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleStartTest(test)}
                    disabled={!available}
                  >
                    {available ? 'Start Test →' : 'Not Available Yet'}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          {notes.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-primary mb-2">No Notes Yet</h3>
              <p className="text-gray-600">Your teacher hasn't shared any study notes yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <h3 className="text-xl font-bold text-primary mb-3">{note.title}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
                    {note.fileName && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📎</span>
                          <span className="text-sm font-medium text-primary">{note.fileName}</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 text-xs text-gray-500">
                      Posted {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Updates Tab */}
      {activeTab === 'updates' && (
        <div>
          {updates.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-primary mb-2">No Updates Yet</h3>
              <p className="text-gray-600">Your teacher hasn't posted any updates yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400">
                    <p className="text-gray-800 mb-2">{update.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(update.createdAt).toLocaleString()}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassTestsPage;
