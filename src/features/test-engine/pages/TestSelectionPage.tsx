import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { useToast } from '../../../shared/hooks/useToast';
import { api } from '../../../services/api';
import type { Subject, Chapter } from '../../../shared/types';

interface TestType {
  id: string;
  name: string;
  icon: string;
  description: string;
  quote: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  testsCount: number;
}

const TestSelectionPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const subjectSectionRef = useRef<HTMLDivElement>(null);
  const companySectionRef = useRef<HTMLDivElement>(null);
  const proceedSectionRef = useRef<HTMLDivElement>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [showCompanySelection, setShowCompanySelection] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
    loadCompanies();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await api.subjects.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadCompanies = async () => {
    // Mock company data
    const mockCompanies: Company[] = [
      { id: '1', name: 'Google', logo: '🔍', testsCount: 45 },
      { id: '2', name: 'Microsoft', logo: '🪟', testsCount: 38 },
      { id: '3', name: 'Amazon', logo: '📦', testsCount: 52 },
      { id: '4', name: 'Apple', logo: '🍎', testsCount: 31 },
      { id: '5', name: 'Meta', logo: '👥', testsCount: 29 },
      { id: '6', name: 'Netflix', logo: '🎬', testsCount: 22 },
      { id: '7', name: 'Tesla', logo: '⚡', testsCount: 18 },
      { id: '8', name: 'IBM', logo: '💼', testsCount: 35 },
      { id: '9', name: 'Oracle', logo: '🔴', testsCount: 27 },
      { id: '10', name: 'Adobe', logo: '🎨', testsCount: 24 },
      { id: '11', name: 'Salesforce', logo: '☁️', testsCount: 20 },
      { id: '12', name: 'Intel', logo: '🔷', testsCount: 26 },
    ];
    setCompanies(mockCompanies);
  };

  const loadChapters = async (subjectId: string) => {
    try {
      setLoading(true);
      const data = await api.chapters.getBySubject(subjectId);
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
      description: 'Practice selected subjects and lessons',
      quote: '"Practice is the hardest part of learning, and training is the essence of transformation." - Ann Voskamp',
    },
    {
      id: 'mock',
      name: 'Mock Test',
      icon: '🎯',
      description: 'Real questions asked by different companies',
      quote: '"Success is where preparation and opportunity meet." - Bobby Unser',
    },
    {
      id: 'advanced',
      name: 'Advanced Test',
      icon: '🚀',
      description: 'Comprehensive test covering all concepts',
      quote: '"The expert in anything was once a beginner who refused to give up." - Anonymous',
    },
  ];

  const handleSelectTest = (typeId: string) => {
    setSelectedType(typeId);
    
    // Reset selections
    setShowSubjectSelection(false);
    setShowCompanySelection(false);
    setSelectedSubject(null);
    setSelectedChapters([]);
    setSelectedCompany(null);
    
    if (typeId === 'practice') {
      // Practice test: show subject selection
      setShowSubjectSelection(true);
      setTimeout(() => {
        subjectSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (typeId === 'mock') {
      // Mock test: show company selection
      setShowCompanySelection(true);
      setTimeout(() => {
        companySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (typeId === 'advanced') {
      // Advanced test: scroll to proceed button
      setTimeout(() => {
        proceedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    // Advanced test: just set the type, show proceed button at bottom
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

  const handleProceed = () => {
    if (!selectedType) {
      toast.error('Please select a test type');
      return;
    }

    if (selectedType === 'practice') {
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
    } else if (selectedType === 'mock') {
      if (!selectedCompany) {
        toast.error('Please select a company');
        return;
      }
      // Store selected test configuration
      sessionStorage.setItem('testType', selectedType);
      sessionStorage.setItem('testCompany', selectedCompany);
    } else if (selectedType === 'advanced') {
      // Store test type for advanced test
      sessionStorage.setItem('testType', selectedType);
    }
    
    navigate('/test/instructions');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 space-y-4 sm:space-y-6 lg:space-y-8 pb-6 sm:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
              Select Test Type
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Choose a test type or join with a code
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="self-start sm:self-auto text-xs sm:text-sm">
            ← Back
          </Button>
        </div>
      </motion.div>

      {/* Join with Code Section - Redirect to Classes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl lg:text-4xl">🎓</span>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1">
                Take Teacher's Test
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Join a class first to access tests assigned by your teacher
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/my-classes')}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              Go to My Classes →
            </Button>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-purple-200">
            <p className="text-xs text-gray-600">
              💡 <span className="font-medium">How it works:</span> Get a class code from your teacher → Join the class → Access tests assigned to that class
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium text-center px-2">OR PRACTICE ON YOUR OWN</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Test Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
          Self-Practice Tests
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          Choose a test type and customize your practice session
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {testTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg active:scale-95 ${
                  selectedType === type.id
                    ? 'border-2 border-secondary bg-secondary/5'
                    : 'border border-gray-200'
                }`}
                onClick={() => handleSelectTest(type.id)}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">{type.icon}</div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-1 sm:mb-2">
                    {type.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    {type.description}
                  </p>

                  <div className="p-2.5 sm:p-3 lg:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <p className="text-xs italic text-gray-700 leading-relaxed">
                      {type.quote}
                    </p>
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

      {/* Subject Selection - Only for Practice Test */}
      {showSubjectSelection && selectedType === 'practice' && (
        <motion.div
          ref={subjectSectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 sm:mb-4">
              📚 Select Subject
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className={`p-2.5 sm:p-3 lg:p-4 rounded-lg cursor-pointer transition-all hover:shadow-md active:scale-95 ${
                    selectedSubject === subject.id
                      ? 'bg-secondary text-white border-2 border-secondary'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2">{subject.icon}</div>
                  <p className={`font-bold mb-0.5 sm:mb-1 text-xs sm:text-sm lg:text-base ${selectedSubject === subject.id ? 'text-white' : 'text-primary'}`}>
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

      {/* Chapter Selection - Only for Practice Test */}
      {selectedSubject && selectedType === 'practice' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
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
                <p className="text-sm sm:text-base text-gray-600 mt-2">Loading chapters...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    onClick={() => toggleChapter(chapter.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 active:scale-95 ${
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

      {/* Company Selection - Only for Mock Test */}
      {showCompanySelection && selectedType === 'mock' && (
        <motion.div
          ref={companySectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
              🏢 Select Company
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Choose a company to practice their previous test questions
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all hover:shadow-md active:scale-95 ${
                    selectedCompany === company.id
                      ? 'bg-secondary text-white border-2 border-secondary'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{company.logo}</div>
                  <p className={`font-bold mb-1 text-sm sm:text-base ${selectedCompany === company.id ? 'text-white' : 'text-primary'}`}>
                    {company.name}
                  </p>
                  <p className={`text-xs ${selectedCompany === company.id ? 'text-white/80' : 'text-gray-600'}`}>
                    {company.testsCount} questions
                  </p>
                </div>
              ))}
            </div>
            
            {selectedCompany && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-orange-300">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-orange-600">
                    {companies.find(c => c.id === selectedCompany)?.name}
                  </span> selected
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Proceed Button */}
      {((selectedType === 'practice' && selectedSubject && selectedChapters.length > 0) ||
        (selectedType === 'mock' && selectedCompany) ||
        (selectedType === 'advanced')) && (
        <motion.div
          ref={proceedSectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-primary mb-1">Ready to start?</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {testTypes.find((t) => t.id === selectedType)?.name}
                  {selectedType === 'practice' && (
                    <>
                      {' • '}
                      {subjects.find((s) => s.id === selectedSubject)?.name}
                      {' • '}
                      {selectedChapters.length} chapter(s)
                    </>
                  )}
                  {selectedType === 'mock' && (
                    <>
                      {' • '}
                      {companies.find((c) => c.id === selectedCompany)?.name}
                    </>
                  )}
                  {selectedType === 'advanced' && (
                    <> • All concepts covered</>
                  )}
                </p>
              </div>
              <Button variant="primary" size="lg" onClick={handleProceed} className="w-full sm:w-auto">
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
