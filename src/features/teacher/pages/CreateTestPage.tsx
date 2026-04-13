import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/hooks/useToast';
import { TeacherNav } from '../components/TeacherNav';
import { api } from '../../../services/api';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export const CreateTestPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [testInfo, setTestInfo] = useState({
    title: '',
    subject: '',
    duration: '',
    totalMarks: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isScheduled: false,
    classId: '',
  });
  const [classes, setClasses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');

  useEffect(() => {
    api.teacher.listClasses('demo-teacher').then((data) => {
      setClasses(data.map((cls) => ({ id: cls.legacyId ?? cls._id, name: cls.name, subject: cls.subject, code: cls.code, students: cls.students, createdAt: cls.createdAt })));
    });
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), text: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: Date.now().toString(),
      };
      const index = questions.findIndex(q => q.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, newQuestion);
      setQuestions(newQuestions);
      toast.success('Question duplicated!');
    }
  };

  const parseBulkQuestions = () => {
    try {
      const lines = bulkText.trim().split('\n').filter(line => line.trim());
      const newQuestions: Question[] = [];
      
      let currentQuestion: any = null;
      let options: string[] = [];
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check if it's a question line (starts with Q followed by number and dot)
        if (/^Q\d+\./.test(trimmedLine)) {
          // Save previous question if exists
          if (currentQuestion && options.length === 4) {
            newQuestions.push({ id: Date.now().toString(), text: currentQuestion.text, options: options, correctAnswer: currentQuestion.correctAnswer });
          }
          
          // Start new question
          currentQuestion = {
            text: trimmedLine.replace(/^Q\d+\.\s*/, '').replace(/\?$/, '').trim() + '?',
            correctAnswer: 0,
          };
          options = [];
        }
        // Check if it's an option line (starts with A., B., C., or D.)
        else if (/^[A-D]\./.test(trimmedLine)) {
          const optionText = trimmedLine.substring(2).trim();
          options.push(optionText);
        }
        // Check if it's the correct answer line
        else if (/^Correct:\s*[A-D]/i.test(trimmedLine)) {
          const correctLetter = trimmedLine.match(/^Correct:\s*([A-D])/i)?.[1].toUpperCase();
          if (correctLetter) {
            currentQuestion.correctAnswer = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
          }
        }
      }
      
      // Don't forget the last question
      if (currentQuestion && options.length === 4) {
        newQuestions.push({ id: Date.now().toString(), text: currentQuestion.text, options: options, correctAnswer: currentQuestion.correctAnswer });
      }

      if (newQuestions.length > 0) {
        setQuestions([...questions, ...newQuestions]);
        setBulkText('');
        setShowBulkImport(false);
        toast.success(`Added ${newQuestions.length} questions!`);
      } else {
        toast.error('No valid questions found. Check the format.');
      }
    } catch (error) {
      toast.error('Error parsing questions. Please check the format.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            const newQuestions = data.map((q: any) => ({
              id: Date.now().toString(),
              text: q.text || q.question || '',
              options: q.options || [],
              correctAnswer: q.correctAnswer || 0,
            }));
            setQuestions([...questions, ...newQuestions]);
            toast.success(`Imported ${newQuestions.length} questions!`);
          }
        } else if (file.name.endsWith('.csv')) {
          setBulkText(content);
          setShowBulkImport(true);
        }
      } catch (error) {
        toast.error('Error reading file. Please check the format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const generateTestCode = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const randomLetters = (count: number) =>
      Array.from({ length: count }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    
    const randomNumbers = (count: number) =>
      Array.from({ length: count }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    
    return `${randomLetters(3)}-${randomNumbers(3)}-${randomLetters(3)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate class selection
    if (!testInfo.classId) {
      toast.error('Please select a class to assign this test');
      return;
    }
    
    // Validate scheduling if enabled
    if (testInfo.isScheduled) {
      if (!testInfo.startDate || !testInfo.startTime || !testInfo.endDate || !testInfo.endTime) {
        toast.error('Please fill in all scheduling fields');
        return;
      }
      
      const startDateTime = new Date(`${testInfo.startDate}T${testInfo.startTime}`);
      const endDateTime = new Date(`${testInfo.endDate}T${testInfo.endTime}`);
      
      if (startDateTime >= endDateTime) {
        toast.error('End date/time must be after start date/time');
        return;
      }
      
      if (startDateTime < new Date()) {
        toast.error('Start date/time cannot be in the past');
        return;
      }
    }
    
    const testCode = generateTestCode();
    
    api.teacher.createTest({
      classId: testInfo.classId,
      code: testCode,
      title: testInfo.title,
      subject: testInfo.subject,
      duration: testInfo.duration,
      totalMarks: testInfo.totalMarks,
      startDate: testInfo.startDate || undefined,
      startTime: testInfo.startTime || undefined,
      endDate: testInfo.endDate || undefined,
      endTime: testInfo.endTime || undefined,
      isScheduled: testInfo.isScheduled,
      status: testInfo.isScheduled ? 'scheduled' : 'active',
      questions,
    }).then(() => {
      toast.success(`Test created! Code: ${testCode}`);
    });
    
    // Show code in alert for easy copying
    setTimeout(() => {
      const scheduleInfo = testInfo.isScheduled 
        ? `\n\n📅 Scheduled: ${testInfo.startDate} ${testInfo.startTime} to ${testInfo.endDate} ${testInfo.endTime}\n\n⏰ Students can only access this test during the scheduled time.`
        : '';
      
      alert(`✅ Test Created Successfully!\n\n📋 Test Code: ${testCode}${scheduleInfo}\n\n👥 Share this code with your students so they can join and take the test.\n\n💡 Students will enter this code on the test page to access your test.`);
      navigate('/teacher/dashboard');
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation */}
      <TeacherNav />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-1 sm:mb-2">🧪 Create Test for Students</h1>
        <p className="text-xs sm:text-sm text-gray-600">Design a test and get a shareable code for your students</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Test Info */}
        <Card>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">Test Information</h2>
          
          {/* Class Selection */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
            <label className="block text-xs sm:text-sm font-medium text-primary mb-2">
              Assign to Class <span className="text-red-500">*</span>
            </label>
            {classes.length === 0 ? (
              <div className="text-center py-3 sm:py-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">You haven't created any classes yet</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/teacher/classes')}
                >
                  Create a Class First
                </Button>
              </div>
            ) : (
              <>
                <select
                  value={testInfo.classId}
                  onChange={(e) => setTestInfo({ ...testInfo, classId: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="">Select a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subject} ({cls.code})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Only students who have joined this class can access this test
                </p>
              </>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Test Title"
              placeholder="e.g., Algebra Mid-term Test"
              value={testInfo.title}
              onChange={(e) => setTestInfo({ ...testInfo, title: e.target.value })}
              required
            />
            <Input
              label="Subject"
              placeholder="e.g., Mathematics"
              value={testInfo.subject}
              onChange={(e) => setTestInfo({ ...testInfo, subject: e.target.value })}
              required
            />
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="e.g., 60"
              value={testInfo.duration}
              onChange={(e) => setTestInfo({ ...testInfo, duration: e.target.value })}
              required
            />
            <Input
              label="Total Marks"
              type="number"
              placeholder="e.g., 100"
              value={testInfo.totalMarks}
              onChange={(e) => setTestInfo({ ...testInfo, totalMarks: e.target.value })}
              required
            />
          </div>
        </Card>

        {/* Scheduling */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <input
              type="checkbox"
              id="schedule-test"
              checked={testInfo.isScheduled}
              onChange={(e) => setTestInfo({ ...testInfo, isScheduled: e.target.checked })}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300"
            />
            <label htmlFor="schedule-test" className="text-base sm:text-lg lg:text-xl font-bold text-primary cursor-pointer">
              📅 Schedule Test (Optional)
            </label>
          </div>
          
          {testInfo.isScheduled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 sm:space-y-4"
            >
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Set a time window when students can access this test. The test will only be available during this period.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={testInfo.startDate}
                    onChange={(e) => setTestInfo({ ...testInfo, startDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required={testInfo.isScheduled}
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={testInfo.startTime}
                    onChange={(e) => setTestInfo({ ...testInfo, startTime: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required={testInfo.isScheduled}
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={testInfo.endDate}
                    onChange={(e) => setTestInfo({ ...testInfo, endDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required={testInfo.isScheduled}
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={testInfo.endTime}
                    onChange={(e) => setTestInfo({ ...testInfo, endTime: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required={testInfo.isScheduled}
                  />
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-white rounded-lg border border-blue-300">
                <p className="text-xs sm:text-sm text-gray-700">
                  💡 <span className="font-medium">Note:</span> Students will only be able to access this test between the scheduled start and end times. Outside this window, the test will be unavailable.
                </p>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Questions */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary">Questions ({questions.length})</h2>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
                + Add One
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowBulkImport(!showBulkImport)}
              >
                📋 Bulk Import
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json,.csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth">
                  📁 Upload File
                </span>
              </label>
            </div>
          </div>

          {/* Bulk Import Section */}
          {showBulkImport && (
            <Card className="bg-blue-50 border-2 border-blue-200">
              <h3 className="font-bold text-primary mb-2">📋 Bulk Import Questions</h3>
              <div className="text-xs text-gray-600 mb-3 space-y-1">
                <p className="font-semibold">Format Guide:</p>
                <pre className="bg-white p-2 rounded border border-gray-300 text-xs overflow-x-auto">
{`Q1. Your question here?
A. Option one
B. Option two
C. Option three
D. Option four
Correct: A

Q2. Another question?
A. First option
B. Second option
C. Third option
D. Fourth option
Correct: B`}
                </pre>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Each question must have exactly 4 options (A, B, C, D) and specify the correct answer
                </p>
              </div>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste your questions here using the format above..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-mono"
                rows={10}
              />
              <div className="flex gap-2 mt-3">
                <Button type="button" variant="primary" size="sm" onClick={parseBulkQuestions}>
                  Import Questions
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setShowBulkImport(false);
                    setBulkText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-primary">Question {qIndex + 1}</h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateQuestion(question.id)}
                      title="Duplicate this question"
                    >
                      📋
                    </Button>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </div>

                <textarea
                  placeholder="Enter question text..."
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  rows={2}
                  required
                />

                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Options:</p>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => updateQuestion(question.id, 'correctAnswer', oIndex)}
                        className="w-4 h-4"
                      />
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(question.id, oIndex, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-500">Select the correct answer</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Test
            </Button>
          </div>
        </Card>
      </form>
      </div>
    </div>
  );
};

export default CreateTestPage;
