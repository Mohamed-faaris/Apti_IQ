import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Badge } from '../../../shared/ui/Badge';
import { DashboardNav } from '../../dashboard/components/DashboardNav';
import { useState } from 'react';

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
  progress?: number;
  total?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Streak {
  type: string;
  current: number;
  longest: number;
  icon: string;
  description: string;
}

const BadgesStreaksPage = () => {
  const [activeTab, setActiveTab] = useState<'badges' | 'streaks'>('badges');

  // Mock badges data
  const badges: BadgeItem[] = [
    { id: '1', name: 'First Steps', icon: '🎯', description: 'Complete your first test', earnedAt: '2024-01-15', rarity: 'common' },
    { id: '2', name: 'Quick Learner', icon: '⚡', description: 'Complete 5 lessons in one day', earnedAt: '2024-01-20', rarity: 'rare' },
    { id: '3', name: 'Perfect Score', icon: '💯', description: 'Score 100% on any test', earnedAt: '2024-02-01', rarity: 'epic' },
    { id: '4', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak', earnedAt: '2024-02-10', rarity: 'rare' },
    { id: '5', name: 'Math Master', icon: '📐', description: 'Complete all Math chapters', rarity: 'legendary', progress: 8, total: 10 },
    { id: '6', name: 'Speed Demon', icon: '🚀', description: 'Complete a test in under 30 minutes', rarity: 'epic', progress: 1, total: 1 },
    { id: '7', name: 'Consistent', icon: '📅', description: 'Study for 30 days straight', rarity: 'legendary', progress: 15, total: 30 },
    { id: '8', name: 'Top 10', icon: '🏆', description: 'Reach top 10 on leaderboard', rarity: 'epic', progress: 0, total: 1 },
    { id: '9', name: 'Night Owl', icon: '🦉', description: 'Complete 10 tests after 10 PM', earnedAt: '2024-02-15', rarity: 'rare' },
    { id: '10', name: 'Early Bird', icon: '🌅', description: 'Complete 10 tests before 8 AM', rarity: 'rare', progress: 3, total: 10 },
  ];

  // Mock streaks data
  const streaks: Streak[] = [
    { type: 'Daily Login', current: 15, longest: 23, icon: '📅', description: 'Days logged in consecutively' },
    { type: 'Test Streak', current: 7, longest: 12, icon: '🎯', description: 'Days with at least one test completed' },
    { type: 'Lesson Streak', current: 10, longest: 18, icon: '📚', description: 'Days with at least one lesson completed' },
    { type: 'Perfect Score Streak', current: 3, longest: 5, icon: '💯', description: 'Consecutive tests with 90%+ score' },
  ];

  const earnedBadges = badges.filter(b => b.earnedAt);
  const lockedBadges = badges.filter(b => !b.earnedAt);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation - Hidden on mobile, shown in hamburger menu */}
      <div className="hidden lg:block">
        <DashboardNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">🏆 Badges & Streaks</h1>
        <p className="text-xs sm:text-sm text-gray-600">Track your achievements and maintain your streaks</p>
      </motion.div>

      {/* Tabs */}
      <Card>
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'badges'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            🎖️ Badges ({earnedBadges.length}/{badges.length})
          </button>
          <button
            onClick={() => setActiveTab('streaks')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'streaks'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            🔥 Streaks
          </button>
        </div>
      </Card>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <>
          {/* Earned Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <h2 className="text-2xl font-bold text-primary mb-4">✨ Earned Badges</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 ${getRarityBorder(badge.rarity)} bg-white hover:shadow-lg transition-all cursor-pointer`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{badge.icon}</div>
                      <h3 className="font-bold text-primary mb-1">{badge.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                      <Badge variant="success" className="text-xs">
                        {new Date(badge.earnedAt!).toLocaleDateString()}
                      </Badge>
                      <div className={`mt-2 text-xs font-medium px-2 py-1 rounded ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity.toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Locked Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-50">
              <h2 className="text-2xl font-bold text-primary mb-4">🔒 Locked Badges</h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lockedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 ${getRarityBorder(badge.rarity)} bg-white opacity-60 hover:opacity-80 transition-all`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2 grayscale">{badge.icon}</div>
                      <h3 className="font-bold text-gray-700 mb-1">{badge.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                      {badge.progress !== undefined && badge.total !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                              className="bg-secondary h-2 rounded-full transition-all"
                              style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">
                            {badge.progress}/{badge.total}
                          </p>
                        </div>
                      )}
                      <div className={`mt-2 text-xs font-medium px-2 py-1 rounded ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity.toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </>
      )}

      {/* Streaks Tab */}
      {activeTab === 'streaks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {streaks.map((streak, index) => (
              <motion.div
                key={streak.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{streak.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-1">{streak.type}</h3>
                      <p className="text-sm text-gray-600 mb-4">{streak.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-3xl font-bold text-orange-600">{streak.current}</p>
                          <p className="text-xs text-gray-600 mt-1">Current Streak</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-3xl font-bold text-purple-600">{streak.longest}</p>
                          <p className="text-xs text-gray-600 mt-1">Longest Streak</p>
                        </div>
                      </div>

                      {streak.current > 0 && (
                        <div className="mt-4 p-2 bg-white rounded-lg">
                          <p className="text-xs text-gray-700">
                            🔥 Keep it up! You're on a {streak.current}-day streak!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Streak Tips */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-primary mb-4">💡 Streak Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span>Log in daily to maintain your login streak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span>Complete at least one test or lesson each day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span>Streaks reset at midnight in your local timezone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span>Longer streaks unlock special badges and rewards</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default BadgesStreaksPage;
