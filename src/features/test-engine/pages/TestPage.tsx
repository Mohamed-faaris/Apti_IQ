import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { useTestStore } from '../store/testStore';
import { useToast } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { MAX_VIOLATIONS } from '../../../shared/constants';
import { ViolationModal } from '../components/ViolationModal';

const getScreenSignature = (): string => {
  try {
    interface ExtendedScreen extends Screen {
      availLeft?: number;
      availTop?: number;
      left?: number;
      top?: number;
    }
    const extendedScreen = screen as ExtendedScreen;
    const left = extendedScreen.availLeft ?? extendedScreen.left ?? 0;
    const top = extendedScreen.availTop ?? extendedScreen.top ?? 0;
    const width = screen.width ?? 0;
    const height = screen.height ?? 0;
    return `${left},${top},${width},${height}`;
  } catch {
    return '0,0,0,0';
  }
};

// Extend Document and HTMLElement interfaces for vendor prefixes
declare global {
  interface Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

const TestPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [violationModal, setViolationModal] = useState<{
    isOpen: boolean;
    type: string;
  }>({ isOpen: false, type: '' });

  // Refs to prevent stale closures in event handlers
  const isProcessingViolation = useRef(false);
  const isSubmitting = useRef(false);
  const isModalOpen = useRef(false); // mirrors violationModal.isOpen without stale closure
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());

  const {
    session,
    startTest,
    setAnswer,
    toggleMarkForReview,
    incrementViolations,
    endTest,
  } = useTestStore();

  const { data: test, isLoading, error } = useQuery({
    queryKey: ['test', 'mock-1'],
    queryFn: () => api.tests.getById('mock-1'),
    enabled: !session,
  });

  // Fullscreen management with vendor prefixes
  const enterFullscreen = useCallback(() => {
    // Always attempt to enter fullscreen – caller is responsible for checking necessity
    console.log('Requesting fullscreen...');
    const element = document.documentElement;

    // Try different vendor prefixes
    const requestFullscreen =
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;

    if (requestFullscreen) {
      requestFullscreen.call(element)
        .then(() => {
          console.log('✅ Fullscreen activated');
        })
        .catch((err) => {
          console.warn('⚠️ Fullscreen request failed (may need user gesture):', err.message);
        });
    } else {
      console.error('❌ No fullscreen method available');
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (fullscreenElement) {
      console.log('Exiting fullscreen...');

      const exitMethod =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;

      if (exitMethod) {
        await exitMethod.call(document).catch((err) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  }, []);

  // Handle test submission - FIXED with useCallback
  const handleSubmit = useCallback(async () => {
    if (!session || !test || isSubmitting.current) return;

    try {
      isSubmitting.current = true;

      // Exit fullscreen before submitting
      await exitFullscreen();

      const result = await api.tests.submit(session.testId, session.answers);
      endTest();
      navigate(`/test/${result.id}/results`);
    } catch (error) {
      console.error('Test submission error:', error);
      toast.error('Failed to submit test');
      isSubmitting.current = false;
    }
  }, [session, test, exitFullscreen, endTest, navigate, toast]);

  // Initialize test session
  useEffect(() => {
    if (test && !session) {
      console.log('Starting test session...', { testId: test.id });
      startTest(test.id);

      // Check if we came from the instructions page with fullscreen active
      const shouldBeFullscreen = sessionStorage.getItem('testFullscreenActive') === 'true';
      
      // Give browser time to settle after navigation
      setTimeout(() => {
        const isInFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );

        if (isInFullscreen) {
          console.log('✅ Fullscreen is active');
          // Clear the flag since we're now in fullscreen
          sessionStorage.removeItem('testFullscreenActive');
        } else if (shouldBeFullscreen) {
          console.log('⚠️ Expected fullscreen but not active - may have been blocked during navigation');
          console.log('Fullscreen monitoring will track violations if user exits');
          // Clear the flag
          sessionStorage.removeItem('testFullscreenActive');
        } else {
          console.log('⚠️ Not in fullscreen - user may have denied permission');
          console.log('Fullscreen violations will be tracked if user exits during test');
        }
      }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, session]);

  // NOTE: We don't need unmount cleanup for fullscreen because:
  // 1. handleSubmit already exits fullscreen before navigation
  // 2. React StrictMode in development causes cleanup to run immediately
  // 3. Browser automatically exits fullscreen when navigating away
  // 4. Having cleanup here causes fullscreen to exit prematurely

  // Keep isModalOpen ref in sync with React state on every render
  isModalOpen.current = violationModal.isOpen;

  // Monitor and maintain fullscreen during test
  // NOTE: violationModal.isOpen is intentionally NOT in the deps array —
  // we read it via isModalOpen.current ref to avoid stale closures and
  // prevent the listener from being re-registered on every modal toggle.
  useEffect(() => {
    if (!session) return;

    // Add a small delay before starting fullscreen monitoring
    // This prevents false violations during initial page load/navigation
    const startMonitoringDelay = setTimeout(() => {
      console.log('🔍 Starting fullscreen monitoring');
      
      const handleFullscreenChange = () => {
        const isInFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );

        console.log('Fullscreen change detected. In fullscreen:', isInFullscreen);

        // Use ref values — never stale, even inside a long-lived event handler
        if (
          !isInFullscreen &&
          !isModalOpen.current &&
          !isSubmitting.current &&
          !isProcessingViolation.current
        ) {
          console.log('User exited fullscreen – triggering violation');
          isProcessingViolation.current = true;
          incrementViolations();
          setViolationModal({ isOpen: true, type: 'fullscreen-exit' });
        }
      };

      // Listen to all fullscreen change events
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);

      // Store cleanup function
      return () => {
        console.log('🛑 Stopping fullscreen monitoring');
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      };
    }, 1000); // Wait 1 second before starting monitoring

    return () => {
      clearTimeout(startMonitoringDelay);
    };
   
  }, [session, incrementViolations]);

  // Mark current question as visited
  useEffect(() => {
    if (test && session) {
      const questionId = test.questions[currentQuestion]?.id;
      if (questionId) {
        // defer the update to avoid React warning about synchronous
        // setState inside an effect
        setTimeout(() => {
          setVisitedQuestions((prev) => {
            const copy = new Set(prev);
            copy.add(questionId);
            return copy;
          });
        }, 0);
      }
    }
  }, [currentQuestion, test, session]);

  // Anti-cheat and timer management - SIMPLIFIED
  useEffect(() => {
    if (!session) return;

    // Prevent accidental page close/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Your test is in progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Prevent back button during test
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      toast.warning('Navigation is disabled during the test');
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Anti-cheat: Tab switch detection
    const handleVisibilityChange = () => {
      // Don't trigger violation if modal is open or already processing
      if (document.hidden && !isProcessingViolation.current && !isSubmitting.current && !isModalOpen.current) {
        isProcessingViolation.current = true;
        incrementViolations();
        setViolationModal({ isOpen: true, type: 'tab-switch' });
      }
    };

    // Anti-cheat: Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      // Don't trigger violation if modal is open or already processing
      if (!isProcessingViolation.current && !isSubmitting.current && !isModalOpen.current) {
        isProcessingViolation.current = true;
        incrementViolations();
        setViolationModal({ isOpen: true, type: 'right-click' });
      }
    };

    // Anti-cheat: Screen change detection (SIMPLIFIED - 5 second interval)
    const handleScreenChange = () => {
      // Don't trigger violation if modal is open or already processing
      if (!session || isProcessingViolation.current || isSubmitting.current || isModalOpen.current) return;
      isProcessingViolation.current = true;
      incrementViolations();
      setViolationModal({ isOpen: true, type: 'screen-change' });
    };

    // Disable copy-paste
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    // Screen change polling - REDUCED frequency to 5 seconds
    let lastScreenSignature = getScreenSignature();
    const screenCheckInterval = setInterval(() => {
      const currentSignature = getScreenSignature();
      if (currentSignature !== lastScreenSignature) {
        handleScreenChange();
        lastScreenSignature = currentSignature;
      }
    }, 5000); // Changed from 1000ms to 5000ms

    return () => {
      clearInterval(timer);
      clearInterval(screenCheckInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
   
  }, [session, incrementViolations, toast, handleSubmit]);

  // Auto-submit on max violations
  useEffect(() => {
    if (session && session.violations >= MAX_VIOLATIONS) {
      toast.error('Maximum violations reached. Test auto-submitted.');
      handleSubmit();
    }
  }, [session, handleSubmit, toast]);

  // Handle violation modal continue
  const handleViolationContinue = () => {
    setViolationModal({ isOpen: false, type: '' });
    // Reset processing flag after a delay to prevent immediate re-trigger
    setTimeout(() => {
      isProcessingViolation.current = false;
    }, 2000);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswer(questionId, answerIndex);
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswer(questionId, -1);
  };

  const getQuestionState = (questionId: string) => {
    if (!session) return 'not-visited';
    if (test?.questions[currentQuestion]?.id === questionId) return 'current';
    if (session.markedForReview.has(questionId)) return 'marked';
    if (session.answers[questionId] !== undefined && session.answers[questionId] !== -1) return 'answered';
    if (visitedQuestions.has(questionId)) return 'visited';
    return 'not-visited';
  };

  const getQuestionStateColor = (state: string) => {
    switch (state) {
      case 'current': return 'bg-primary text-white';
      case 'answered': return 'bg-green-500 text-white';
      case 'marked': return 'bg-yellow-500 text-white';
      case 'visited': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Test</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </Card>
      </div>
    );
  }

  if (isLoading || !test || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card>
          <h2 className="text-2xl font-bold text-primary mb-4">Loading Test...</h2>
          <p className="text-gray-600">Please wait while we prepare your test.</p>
        </Card>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 300;
  const totalQuestions = test.questions.length;
  const answeredCount = Object.values(session.answers).filter(a => a !== -1 && a !== undefined).length;

  return (
    <>
      {/* Violation Modal - Renders OVER fullscreen */}
      <ViolationModal
        isOpen={violationModal.isOpen}
        violationType={violationModal.type}
        currentViolations={session.violations}
        onContinue={handleViolationContinue}
        onReenterFullscreen={
          violationModal.type === 'fullscreen-exit' ? enterFullscreen : undefined
        }
      />

      {/* Full Screen Test Interface */}
      <div className="min-h-screen test-background flex flex-col">
        {/* TOP CONTROL BAR */}
        <div className="bg-[#FFFBF0] border-b-4 border-[#D4A574] shadow-lg sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-primary">{test.name}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {totalQuestions}
                </p>
              </div>

              <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${isTimeCritical ? 'bg-red-100 border-2 border-red-500' : 'bg-blue-50 border-2 border-blue-200'
                }`}>
                <span className="text-3xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Time Remaining</p>
                  <p className={`text-3xl font-bold ${isTimeCritical ? 'text-red-600' : 'text-primary'}`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-xs text-gray-600">Violations</p>
                    <p className="text-lg font-bold text-orange-600">
                      {session.violations}/{MAX_VIOLATIONS}
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  className="shadow-md"
                >
                  Submit Test
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 container mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* CENTER: QUESTION & OPTIONS AREA */}
            <div className="col-span-9 flex items-center justify-center">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-3xl"
              >
                <Card className="notebook-paper notebook-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="default" className="text-sm">
                          Question {currentQuestion + 1}
                        </Badge>
                        {question.subject && (
                          <Badge variant="secondary" className="text-sm">
                            {question.subject}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-2xl font-medium text-primary leading-relaxed">
                        {question.text}
                      </h2>
                    </div>
                    {session.markedForReview.has(question.id) && (
                      <Badge variant="warning" className="ml-4">🚩 Marked</Badge>
                    )}
                  </div>

                  {/* OPTIONS SECTION */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => {
                      const isSelected = session.answers[question.id] === index;
                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all border-2 ${isSelected
                              ? 'bg-secondary text-white border-secondary shadow-md'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                            }`}
                          onClick={() => handleAnswerSelect(question.id, index)}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(question.id, index)}
                            className="w-5 h-5 flex-shrink-0"
                          />
                          <span className="flex-1 text-lg">{option}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-100">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => toggleMarkForReview(question.id)}
                      >
                        {session.markedForReview.has(question.id) ? '🚩 Unmark' : '🚩 Mark for Review'}
                      </Button>
                      {session.answers[question.id] !== undefined && session.answers[question.id] !== -1 && (
                        <Button
                          variant="outline"
                          onClick={() => handleClearAnswer(question.id)}
                        >
                          Clear Answer
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                      >
                        ← Previous
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
                        disabled={currentQuestion === totalQuestions - 1}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* RIGHT: COMPACT QUESTION NAVIGATION */}
            <div className="col-span-3">
              <Card className="sticky top-24 notebook-paper notebook-shadow">
                <h3 className="font-bold text-primary mb-3 text-sm">Questions</h3>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="text-xl font-bold text-green-600">{answeredCount}</p>
                      <p className="text-gray-600">Answered</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-yellow-600">{session.markedForReview.size}</p>
                      <p className="text-gray-600">Marked</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mb-4">
                  {test.questions.map((q, index) => {
                    const state = getQuestionState(q.id);
                    const colorClass = getQuestionStateColor(state);
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-full aspect-square rounded-md flex items-center justify-center font-bold text-xs transition-all hover:scale-105 ${colorClass}`}
                        title={`Question ${index + 1} - ${state}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span>Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                    <span>Not Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;
