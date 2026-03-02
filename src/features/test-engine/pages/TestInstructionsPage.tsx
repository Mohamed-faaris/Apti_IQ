import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { Badge } from "../../../shared/ui/Badge";
import { MAX_VIOLATIONS } from "../../../shared/constants";

const TestInstructionsPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [testInfo, setTestInfo] = useState<{ 
    type?: string; 
    code?: string;
    subject?: string;
    chapters?: string[];
  }>({});

  // Get test info from session storage
  useState(() => {
    const testType = sessionStorage.getItem('testType');
    const testCode = sessionStorage.getItem('testCode');
    const testSubject = sessionStorage.getItem('testSubject');
    const testChapters = sessionStorage.getItem('testChapters');
    
    setTestInfo({ 
      type: testType || undefined, 
      code: testCode || undefined,
      subject: testSubject || undefined,
      chapters: testChapters ? JSON.parse(testChapters) : undefined
    });
  });

  const getTestTitle = () => {
    if (testInfo.code) {
      return `Teacher's Test (Code: ${testInfo.code})`;
    }
    
    let title = '';
    switch (testInfo.type) {
      case 'practice':
        title = 'Practice Test';
        break;
      case 'mock':
        title = 'Mock Test';
        break;
      case 'advanced':
        title = 'Advanced Test';
        break;
      default:
        title = 'Aptitude Test';
    }
    
    if (testInfo.subject) {
      const subjectNames: Record<string, string> = {
        '1': 'Mathematics',
        '2': 'Logical Reasoning',
        '3': 'Verbal Ability',
        '4': 'Data Interpretation'
      };
      title += ` - ${subjectNames[testInfo.subject] || 'Subject'}`;
    }
    
    return title;
  };

  const rules = [
    {
      icon: "⏱️",
      title: "Time Limit",
      description: "60 minutes to complete all questions",
    },
    {
      icon: "🖥️",
      title: "Fullscreen Required",
      description: "Test must be taken in fullscreen mode",
    },
    {
      icon: "🚫",
      title: "No Tab Switching",
      description: "Switching tabs will be recorded as a violation",
    },
    {
      icon: "🖱️",
      title: "No Right-Click",
      description: "Right-click is disabled during the test",
    },
    {
      icon: "🖥️",
      title: "No Screen Switching",
      description: "Switching monitors will be recorded",
    },
  ];

  const violations = [
    {
      icon: "⚠️",
      title: "Violation System",
      description: `You are allowed ${MAX_VIOLATIONS} violations maximum`,
    },
    {
      icon: "🔔",
      title: "Violation Warning",
      description: "Each violation will show a warning popup",
    },
    {
      icon: "🔄",
      title: "Continue Option",
      description: "You can continue after each violation (if under limit)",
    },
    {
      icon: "🛑",
      title: "Auto-Submit",
      description: `Test will auto-submit after ${MAX_VIOLATIONS} violations`,
    },
  ];

  const handleStartTest = async () => {
    console.log('=== START TEST BUTTON CLICKED ===');
    console.log('Fullscreen API available:', !!document.fullscreenEnabled);
    console.log('Currently in fullscreen:', !!document.fullscreenElement);
    
    // Check if fullscreen is supported
    if (!document.fullscreenEnabled) {
      console.error('❌ Fullscreen API not supported by browser');
      alert('Your browser does not support fullscreen mode. The test will continue in normal mode.');
      navigate('/test/active');
      return;
    }

    try {
      console.log('Attempting to request fullscreen...');
      
      // Request fullscreen with explicit element
      const element = document.documentElement;
      
      // Try modern API first
      if (element.requestFullscreen) {
        console.log('Using standard requestFullscreen');
        await element.requestFullscreen();
      } 
      // Fallback for Safari
      else if (element.webkitRequestFullscreen) {
        console.log('Using webkit prefix');
        await element.webkitRequestFullscreen();
      }
      // Fallback for older Firefox
      else if (element.mozRequestFullScreen) {
        console.log('Using moz prefix');
        await element.mozRequestFullScreen();
      }
      // Fallback for IE/Edge
      else if (element.msRequestFullscreen) {
        console.log('Using ms prefix');
        await element.msRequestFullscreen();
      } else {
        throw new Error('No fullscreen method available');
      }
      
      console.log('✅ Fullscreen request sent successfully');
      
      // Wait longer to ensure fullscreen is fully active before navigation
      // This prevents the browser from exiting fullscreen during navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Fullscreen element after delay:', !!document.fullscreenElement);
      
      // Store fullscreen state in sessionStorage to help TestPage know it should be in fullscreen
      sessionStorage.setItem('testFullscreenActive', 'true');
      
      // Navigate to test
      navigate('/test/active');
      
    } catch (err) {
      console.error('❌ Fullscreen request failed:', err);
      const error = err as Error;
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Show user-friendly error with more details
      const errorMsg = `Fullscreen activation failed.\n\nReason: ${error.message}\n\nPlease:\n1. Check browser permissions (click lock icon in address bar)\n2. Allow fullscreen for this site\n3. Try refreshing the page\n\nThe test will continue in normal mode.`;
      alert(errorMsg);
      
      // Navigate anyway
      navigate('/test/active');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              {getTestTitle()}
            </h1>
            <p className="text-gray-600">
              Please read carefully before starting
            </p>
            {testInfo.chapters && testInfo.chapters.length > 0 && (
              <p className="text-sm text-secondary mt-1">
                📚 {testInfo.chapters.length} chapter(s) selected for this test
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate("/test")}>
            ← Back
          </Button>
        </div>
      </motion.div>

      {/* Test Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📋</span>
            <h2 className="text-2xl font-bold text-primary">Test Rules</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl flex-shrink-0">{rule.icon}</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">{rule.title}</h3>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Violation System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-orange-200 bg-orange-50/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-2xl font-bold text-primary">
              Violation System
            </h2>
            <Badge variant="warning" className="ml-auto">
              Max {MAX_VIOLATIONS} Violations
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {violations.map((violation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-white rounded-lg"
              >
                <span className="text-2xl flex-shrink-0">{violation.icon}</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">
                    {violation.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {violation.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Important Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-blue-50/30 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-bold text-primary mb-2">Important Notes</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>All test data is tracked and used for analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>
                    Your performance will be recorded and visible in your
                    analytics dashboard
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>Violations are tracked to ensure test integrity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>
                    You can mark questions for review and return to them later
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>Test will auto-submit when time expires</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Agreement and Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-gray-700 font-medium">
                I have read and understood all the instructions and rules
              </span>
            </label>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTest}
              disabled={!agreed}
              className="ml-4"
            >
              Start Test →
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default TestInstructionsPage;
