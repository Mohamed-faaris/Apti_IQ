import { create } from 'zustand';
import type { TestSession } from '../../../shared/types';

interface TestState {
  session: TestSession | null;
  startTest: (testId: string) => void;
  setAnswer: (questionId: string, answer: number) => void;
  toggleMarkForReview: (questionId: string) => void;
  incrementViolations: () => void;
  setFullscreen: (isFullscreen: boolean) => void;
  endTest: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  session: null,
  
  startTest: (testId) => set({
    session: {
      testId,
      startTime: Date.now(),
      answers: {},
      markedForReview: new Set<string>(),
      violations: 0,
      isFullscreen: true,
    },
  }),

  setAnswer: (questionId, answer) => set((state) => {
    if (!state.session) return state;
    return {
      session: {
        ...state.session,
        answers: { ...state.session.answers, [questionId]: answer },
      },
    };
  }),

  toggleMarkForReview: (questionId) => set((state) => {
    if (!state.session) return state;
    const marked = new Set(state.session.markedForReview);
    if (marked.has(questionId)) {
      marked.delete(questionId);
    } else {
      marked.add(questionId);
    }
    // Create new session object to trigger re-render
    return {
      session: { 
        ...state.session, 
        markedForReview: marked,
      },
    };
  }),

  incrementViolations: () => set((state) => {
    if (!state.session) return state;
    return {
      session: { ...state.session, violations: state.session.violations + 1 },
    };
  }),

  setFullscreen: (isFullscreen) => set((state) => {
    if (!state.session) return state;
    return {
      session: { ...state.session, isFullscreen },
    };
  }),

  endTest: () => set({ session: null }),
}));
