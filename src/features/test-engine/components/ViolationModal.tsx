import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { MAX_VIOLATIONS } from '../../../shared/constants';

interface ViolationModalProps {
  isOpen: boolean;
  violationType: string;
  currentViolations: number;
  onContinue: () => void;
  /** Called synchronously inside the Continue button click to re-enter fullscreen
   *  while still within the browser's trusted user-gesture context. */
  onReenterFullscreen?: () => void;
}

export const ViolationModal = ({
  isOpen,
  violationType,
  currentViolations,
  onContinue,
  onReenterFullscreen,
}: ViolationModalProps) => {
  const violationMessages: Record<string, { title: string; description: string; icon: string }> = {
    'tab-switch': {
      title: 'Tab Switch Detected',
      description: 'Switching tabs is not allowed during the test',
      icon: '🚫',
    },
    'window-blur': {
      title: 'Window Switch Detected',
      description: 'Switching windows is not allowed during the test',
      icon: '🪟',
    },
    'screen-change': {
      title: 'Screen Change Detected',
      description: 'Switching monitors is not allowed during the test',
      icon: '🖥️',
    },
    'right-click': {
      title: 'Right-Click Detected',
      description: 'Right-click is disabled during the test',
      icon: '🖱️',
    },
    'fullscreen-exit': {
      title: 'Fullscreen Exit Detected',
      description: 'You must remain in fullscreen mode',
      icon: '⛔',
    },
  };

  const message = violationMessages[violationType] || {
    title: 'Violation Detected',
    description: 'This action is not allowed during the test',
    icon: '⚠️',
  };

  const remainingViolations = MAX_VIOLATIONS - currentViolations;
  const isLastViolation = remainingViolations === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          />

          {/* Modal */}
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <Card className="border-4 border-orange-500 bg-white shadow-2xl">
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="text-7xl mb-4"
                  >
                    {message.icon}
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-primary mb-3">
                    {message.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 text-lg">
                    {message.description}
                  </p>

                  {/* Violation Count */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Badge variant="warning" className="text-lg px-4 py-2">
                        Violation {currentViolations}/{MAX_VIOLATIONS}
                      </Badge>
                    </div>
                    {!isLastViolation ? (
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-orange-600">
                          {remainingViolations} {remainingViolations === 1 ? 'violation' : 'violations'}
                        </span>{' '}
                        remaining before auto-submit
                      </p>
                    ) : (
                      <p className="text-sm font-bold text-red-600">
                        ⚠️ This was your final violation. Test will be submitted.
                      </p>
                    )}
                  </div>

                  {/* Warning Message */}
                  {!isLastViolation && remainingViolations <= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-6"
                    >
                      <p className="text-sm font-bold text-red-600">
                        ⚠️ Final Warning: One more violation will auto-submit your test!
                      </p>
                    </motion.div>
                  )}

                  {/* Continue Button */}
                  {!isLastViolation && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Re-enter fullscreen synchronously here (still inside the
                        // user-gesture handler) before calling onContinue.
                        if (onReenterFullscreen) {
                          onReenterFullscreen();
                        }
                        onContinue();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      className="w-full"
                    >
                      Continue Test →
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
