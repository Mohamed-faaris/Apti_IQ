import { LEADERBOARD_UPDATE_INTERVAL } from '../shared/constants';
import type { LeaderboardEntry } from '../shared/types';

class SocketService {
  private mockInterval: number | null = null;
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  connect() {
    // Mock socket connection
    console.log('Socket connected (mocked)');
    this.startMockUpdates();
  }

  disconnect() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    console.log('Socket disconnected (mocked)');
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  emit(event: string, data: unknown) {
    console.log(`Socket emit (mocked): ${event}`, data);
  }

  private startMockUpdates() {
    // Simulate leaderboard updates every 5 seconds
    this.mockInterval = setInterval(() => {
      const mockUpdate: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        userId: `user-${i + 1}`,
        name: `Student ${i + 1}`,
        college: i % 3 === 0 ? 'MIT' : i % 3 === 1 ? 'Stanford' : 'Harvard',
        score: 1000 - i * 50 + Math.floor(Math.random() * 20),
        testsCompleted: 20 - i,
        accuracy: 95 - i * 2 + Math.floor(Math.random() * 3),
      }));

      this.trigger('leaderboard:update', mockUpdate);
    }, LEADERBOARD_UPDATE_INTERVAL);
  }

  private trigger(event: string, data: unknown) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }
}

export const socketService = new SocketService();
