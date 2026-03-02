import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/hooks/useToast';
import { mockApi } from '../../../services/mockApi';
import type { Subject, Chapter } from '../../../shared/types';

interface TestType {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: string;
  questions: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const TestSelectionPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [testCode, setTestCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await mockApi.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadChapters = async (subjectId: string) => {
    try {
      setLoading(true);
      const data = await mockApi.getChapters(subjectId);
      setChapters(data);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const testTypes: TestType[] = [
    {
      id: 'practice',
      name: 'Practice Test',
      icon: '📝',
      description: 'Quick practice with 15 questions',
      duration: '20 minutes',
      questions: '15 questions',
      difficulty: 'Easy',
    },
    {
      id: 'mock',
      name: 'Mock Test',
      icon: '🎯',
      description: 'Full-length test with all subjects',
      duration: '60 minutes',
      questions: '50 questions',
      difficulty: 'Medium',
    },
    {
      id: 'advanced',
      name: 'Advanced Test',
      icon: '🚀',
      description: 'Challenging test for experts',
      duration: '90 minutes',
      questions: '75 questions',
      difficulty: 'Hard',
    },
  ];

  const handleSelectTest = (typeId: string) => {
    setSelectedType(typeId);
    setShowCodeInput(false);
    setShowSubjectSelection(true);
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedChapters([]);
    loadChapters(subjectId);
  };

  const toggleChapter = (chapterId: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map(c => c.id));
  };

  const clearChapterSelection = () => {
    setSelectedChapters([]);
  };

  const handleJoinWithCode = () => {
    if (!testCode.trim()) {
      toast.error('Please enter a test code');
      return;
    }

    // Validate test code format (e.g., ABC-123-XYZ)
    const codePattern = /^[A-Z]{3}-\d{3}-[A-Z]{3}$/;
    if (!codePattern.test(testCode.toUpperCase())) {
      toast.error('Invalid test code format. Use format: ABC-123-XYZ');
      return;
    }

    // Store test code in session storage
    sessionStorage.setItem('testCode', testCode.toUpperCase());
    toast.success('Test code validated! Proceeding to instructions...');
    
    setTimeout(() => {
      navigate('/test/instructions');
    }, 1000);
  };

  const handleProceed = () => {
    if (!selectedType) {
      toast.error('Please select a test type');
      return;
    }

    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    if (selectedChapters.length === 0) {
      toast.error('Please select at least one chapter/topic');
      return;
    }

    // Store selected test configuration
    sessionStorage.setItem('testType', selectedType);
    sessionStorage.setItem('testSubject', selectedSubject);
    sessionStorage.setItem('testChapters', JSON.stringify(selectedChapters));
    
    navigate('/test/instructions');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Select Test Type
            </h1>
            <p className="text-gray-600">
              Choose a test type or join with a code
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            ← Back
          </Button>
        </div>
      </motion.div>

      {/* Join with Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎓</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-primary mb-1">
                Join Teacher's Test
              </h2>
              <p className="text-sm text-gray-600">
                Your professor shared a test code? Enter it here to take their assigned test
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowCodeInput(!showCodeInput)}
            >
              {showCodeInput ? 'Cancel' : 'Enter Code'}
            </Button>
          </div>

          {showCodeInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-purple-200"
            >
              <div className="flex gap-3">
                <Input
                  placeholder="Enter test code (e.g., ABC-123-XYZ)"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button variant="primary" onClick={handleJoinWithCode}>
                  Join Test →
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Test codes are provided by your teacher/professor
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 font-medium">OR PRACTICE ON YOUR OWN</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Test Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-2">
          Self-Practice Tests
        </h2>
        <p className="text-gray-600 mb-4">
          Choose a test type and customize your practice session
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {testTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedType === type.id
                    ? 'border-2 border-secondary bg-secondary/5'
                    : 'border border-gray-200'
                }`}
                onClick={() => handleSelectTest(type.id)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{type.icon}</div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {type.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                      <span className="text-gray-600">⏱️ Duration:</span>
                      <span className="font-medium text-primary">
                        {type.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                      <span className="text-gray-600">📝 Questions:</span>
                      <span className="font-medium text-primary">
                        {type.questions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                      <span className="text-gray-600">🎚️ Difficulty:</span>
                      <span
                        className={`font-medium ${
                          type.difficulty === 'Easy'
                            ? 'text-green-600'
                            : type.difficulty === 'Medium'
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {type.difficulty}
                      </span>
                    </div>
                  </div>

                  {selectedType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4"
                    >
                      <div className="w-8 h-8 mx-auto bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">✓</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subject Selection */}
      {showSubjectSelection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-primary mb-4">
              📚 Select Subject
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedSubject === subject.id
                      ? 'bg-secondary text-white border-2 border-secondary'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{subject.icon}</div>
                  <p className={`font-bold mb-1 ${selectedSubject === subject.id ? 'text-white' : 'text-primary'}`}>
                    {subject.name}
                  </p>
                  <p className={`text-xs ${selectedSubject === subject.id ? 'text-white/80' : 'text-gray-600'}`}>
                    {subject.chaptersCount} chapters
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Chapter Selection */}
      {selectedSubject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary">
                📖 Select Topics/Chapters
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllChapters}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearChapterSelection}>
                  Clear
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading chapters...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-3">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    onClick={() => toggleChapter(chapter.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedChapters.includes(chapter.id)
                        ? 'bg-green-100 border-green-500'
                        : 'bg-white border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedChapters.includes(chapter.id)
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedChapters.includes(chapter.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-primary text-sm">{chapter.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{chapter.lessonsCount} lessons</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedChapters.length > 0 && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-green-600">{selectedChapters.length}</span> chapter(s) selected
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Proceed Button */}
      {selectedType && selectedSubject && selectedChapters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary mb-1">Ready to start?</h3>
                <p className="text-sm text-gray-600">
                  {testTypes.find((t) => t.id === selectedType)?.name} •{' '}
                  {subjects.find((s) => s.id === selectedSubject)?.name} •{' '}
                  {selectedChapters.length} chapter(s)
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={handleProceed}>
                Continue to Instructions →
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TestSelectionPage;
