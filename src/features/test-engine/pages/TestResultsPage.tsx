import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { StatCard } from '../../../shared/ui/StatCard';
import { Badge } from '../../../shared/ui/Badge';

const TestResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const { data: result } = useQuery({
    queryKey: ['test-result', id],
    queryFn: () => api.tests.getResult(id!),
  });

  const { data: test } = useQuery({
    queryKey: ['test', result?.testId],
    queryFn: () => api.tests.getById(result!.testId),
    enabled: !!result,
  });

  // Show/hide scroll to bottom button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show button if not at bottom and page is scrollable
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!result || !test) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className="fixed bottom-24 right-8 z-50 bg-secondary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
          title="Scroll to Bottom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      )}

      {/* Scroll to Top Button */}
      {!showScrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
          title="Scroll to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-primary mb-4">Test Completed!</h1>
        <p className="text-xl text-gray-600">Here's how you performed</p>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Score"
          value={`${result.score.toFixed(1)}%`}
          icon="🎯"
          trend={result.score >= 70 ? 'up' : 'down'}
        />
        <StatCard
          title="Correct Answers"
          value={`${result.correctAnswers}/${result.totalQuestions}`}
          icon="✅"
        />
        <StatCard
          title="Time Taken"
          value={`${result.timeTaken} min`}
          icon="⏱️"
        />
        <StatCard
          title="Accuracy"
          value={`${((result.correctAnswers / result.totalQuestions) * 100).toFixed(0)}%`}
          icon="📊"
        />
      </div>

      {/* Subject Breakdown */}
      <Card>
        <h2 className="text-2xl font-bold text-primary mb-6">Subject Breakdown</h2>
        <div className="space-y-4">
          {result.subjectBreakdown.map((subject) => (
            <div key={subject.subject}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-primary">{subject.subject}</span>
                <span className="text-gray-600">
                  {subject.correct}/{subject.total} ({subject.accuracy.toFixed(0)}%)
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.accuracy}%` }}
                  transition={{ duration: 1 }}
                  className={`h-3 rounded-full ${
                    subject.accuracy >= 70 ? 'bg-green-500' : 'bg-accent'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Question Review */}
      <Card>
        <h2 className="text-2xl font-bold text-primary mb-6">Question Review</h2>
        <div className="space-y-6">
          {test.questions.map((question, index) => {
            const userAnswer = result.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="font-medium text-primary">
                    {index + 1}. {question.text}
                  </p>
                  <Badge variant={isCorrect ? 'success' : 'danger'}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={`p-3 rounded ${
                        oIndex === question.correctAnswer
                          ? 'bg-green-200 font-medium'
                          : oIndex === userAnswer && !isCorrect
                          ? 'bg-red-200'
                          : 'bg-white'
                      }`}
                    >
                      {option}
                      {oIndex === question.correctAnswer && ' ✓'}
                      {oIndex === userAnswer && !isCorrect && ' ✗'}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="text-sm text-gray-700 bg-white p-3 rounded">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Link to="/analytics">
          <Button variant="secondary">View Analytics</Button>
        </Link>
        <Link to="/test">
          <Button variant="primary">Take Another Test</Button>
        </Link>
      </div>
    </div>
  );
};

export default TestResultsPage;
