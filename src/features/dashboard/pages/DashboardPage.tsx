import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { StatCard } from '../../../shared/ui/StatCard';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { SkeletonCard } from '../../../shared/ui/Skeleton';
import { Badge } from '../../../shared/ui/Badge';
import { DashboardNav } from '../components/DashboardNav';

import type { DashboardStats } from '../../../shared/types';

const ActivityIcon = ({ type }: { type: string }) => {
  const icons = {
    test: '📝',
    lesson: '📖',
    achievement: '🏆',
  };
  return <span className="text-2xl">{icons[type as keyof typeof icons] || '📌'}</span>;
};

const getRelativeTime = (timestamp: string) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return past.toLocaleDateString();
};

// Smart recommendation engine
const getRecommendation = (stats: DashboardStats | undefined) => {
  const weakestSubject = stats?.weakestSubject || 'Verbal Ability';
  const accuracy = stats?.accuracy || 0;
  const streak = stats?.currentStreak || 0;
  const totalTests = stats?.totalTests || 0;

  // Priority 1: Maintain streak
  if (streak > 0 && streak < 30) {
    return {
      type: 'streak',
      title: `Keep your ${streak}-day streak alive`,
      description: 'Practice for 10 minutes today to maintain momentum',
      action: 'Quick Practice',
      actionUrl: '/subjects',
      icon: '🔥',
      urgency: 'high',
    };
  }

  // Priority 2: Improve weakness
  if (accuracy < 75) {
    return {
      type: 'improvement',
      title: `Improve ${weakestSubject}`,
      description: `You're at 62% accuracy. Complete 3 lessons to reach mastery.`,
      action: `Practice ${weakestSubject}`,
      actionUrl: '/subjects',
      icon: '📚',
      urgency: 'medium',
    };
  }

  // Priority 3: Take test
  if (totalTests < 5) {
    return {
      type: 'test',
      title: 'Take your next test',
      description: 'Build confidence with regular practice tests',
      action: 'Start Test',
      actionUrl: '/test',
      icon: '🎯',
      urgency: 'medium',
    };
  }

  // Default: General improvement
  return {
    type: 'general',
    title: 'Continue your progress',
    description: 'You\'re doing great! Keep practicing to improve further.',
    action: 'Start Learning',
    actionUrl: '/subjects',
    icon: '✨',
    urgency: 'low',
  };
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: api.dashboard.getStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        <SkeletonCard />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Unable to load dashboard</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    );
  }

  const hasActivity = stats?.recentActivity && stats.recentActivity.length > 0;
  const hasBadges = stats?.badges && stats.badges.length > 0;
  const hasStreak = (stats?.currentStreak || 0) > 0;
  const recommendation = getRecommendation(stats);
  
  // Calculate user rank percentile (mock for now)
  const userPercentile = 18;

  return (
    <div className="flex gap-8">
      {/* Left Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 space-y-10">
      {/* Header - Calm, disciplined tone */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-600 mt-2">Your daily improvement starts here</p>
      </motion.div>

      {/* 🎯 STRATEGIC SECTION 1: SMART RECOMMENDATION (Behavior Engine) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`border-l-4 ${
          recommendation.urgency === 'high' ? 'border-orange-500 bg-orange-50/30' :
          recommendation.urgency === 'medium' ? 'border-blue-500 bg-blue-50/30' :
          'border-green-500 bg-green-50/30'
        }`}>
          <div className="flex items-start gap-4">
            <div className="text-5xl flex-shrink-0">{recommendation.icon}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Recommended For You
                  </p>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {recommendation.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {recommendation.description}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(recommendation.actionUrl)}
                className="shadow-md"
              >
                {recommendation.action} →
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 🎯 STRATEGIC SECTION 2: PERFORMANCE SNAPSHOT (Tier-based hierarchy) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Performance Snapshot</h2>
          {userPercentile && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-secondary font-medium"
            >
              ⭐ Top {userPercentile}% this week
            </motion.p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tier 1: Streak - Emotional anchor with protective messaging */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Card hover className="border-2 border-orange-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl font-bold text-primary mb-2"
                    >
                      {hasStreak ? stats?.currentStreak : 0}
                      <span className="text-xl text-gray-600"> days</span>
                    </motion.p>
                    {hasStreak && (
                      <p className="text-xs text-orange-600 font-medium">
                        🔥 Keep it alive today
                      </p>
                    )}
                  </div>
                  <span className="text-4xl">🔥</span>
                </div>
              </Card>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-transparent rounded-lg -z-10 opacity-40" />
            </div>
          </motion.div>

          {/* Tier 1: Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <StatCard
              title="Accuracy"
              value={`${stats?.accuracy || 0}%`}
              icon="🎯"
              trend="up"
              trendValue="+3.2%"
            />
          </motion.div>

          {/* Tier 2: Total Tests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              title="Tests Completed"
              value={stats?.totalTests || 0}
              icon="📝"
            />
          </motion.div>

          {/* Tier 2: Improvement Opportunity (not "weakness") */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Improvement Focus</p>
                  <p className="text-xl font-bold text-primary mb-2">
                    {stats?.weakestSubject || 'N/A'}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-accent">62%</span>
                    <span className="text-xs text-gray-600">3 lessons to mastery</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '62%' }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="bg-accent h-2 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-3xl">📚</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 🎯 NEW SECTION: AREAS TO IMPROVE (Based on Test Performance) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-primary mb-4">📊 Areas to Improve</h2>
        <p className="text-sm text-gray-600 mb-6">Based on your recent test performance</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weak Subject 1 */}
          <Card className="border-l-4 border-red-400">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚠️</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary">Verbal Ability</h3>
                  <Badge variant="danger">45% Accuracy</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  You struggled with Reading Comprehension and Vocabulary questions in your last 3 tests.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Reading Comprehension</span>
                    <span className="text-red-600 font-medium">40%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Vocabulary</span>
                    <span className="text-red-600 font-medium">42%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Grammar</span>
                    <span className="text-orange-600 font-medium">53%</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/subjects/3/chapters')}
                  className="w-full"
                >
                  Study Verbal Ability →
                </Button>
              </div>
            </div>
          </Card>

          {/* Weak Subject 2 */}
          <Card className="border-l-4 border-orange-400">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📉</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary">Logical Reasoning</h3>
                  <Badge variant="warning">58% Accuracy</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Puzzles and Syllogisms need more practice. Focus on pattern recognition.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Puzzles</span>
                    <span className="text-orange-600 font-medium">52%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Syllogisms</span>
                    <span className="text-orange-600 font-medium">55%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Coding-Decoding</span>
                    <span className="text-green-600 font-medium">68%</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/subjects/2/chapters')}
                  className="w-full"
                >
                  Study Logical Reasoning →
                </Button>
              </div>
            </div>
          </Card>

          {/* Strong Subject - Encouragement */}
          <Card className="border-l-4 border-green-400">
            <div className="flex items-start gap-4">
              <div className="text-4xl">✅</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary">Data Interpretation</h3>
                  <Badge variant="success">85% Accuracy</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Excellent work! You're mastering charts and graphs. Keep it up!
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Tables</span>
                    <span className="text-green-600 font-medium">88%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Bar Charts</span>
                    <span className="text-green-600 font-medium">85%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Pie Charts</span>
                    <span className="text-green-600 font-medium">82%</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/subjects/4/chapters')}
                  className="w-full"
                >
                  Continue Practicing →
                </Button>
              </div>
            </div>
          </Card>

          {/* Study Plan Recommendation */}
          <Card className="border-l-4 border-blue-400 bg-blue-50/30">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📝</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary mb-2">Recommended Study Plan</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Based on your performance, here's your personalized study schedule:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <span className="text-xl">1️⃣</span>
                    <div className="flex-1">
                      <p className="font-medium text-primary text-sm">Week 1-2: Verbal Ability</p>
                      <p className="text-xs text-gray-600">Focus on Reading Comprehension (2 lessons/day)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <span className="text-xl">2️⃣</span>
                    <div className="flex-1">
                      <p className="font-medium text-primary text-sm">Week 3: Logical Reasoning</p>
                      <p className="text-xs text-gray-600">Practice Puzzles and Syllogisms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <span className="text-xl">3️⃣</span>
                    <div className="flex-1">
                      <p className="font-medium text-primary text-sm">Week 4: Full Mock Tests</p>
                      <p className="text-xs text-gray-600">Test your improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* 🎯 STRATEGIC SECTION 3: PROGRESS & RECOGNITION (Habit Loop Reward) */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Achievements - Gamification with forward motivation */}
        <Card>
          <h2 className="text-xl font-semibold text-primary mb-6">Your Progress</h2>
          
          {hasBadges ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {stats?.badges.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-smooth cursor-pointer group"
                    title={badge.description}
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {badge.icon}
                    </div>
                    <p className="text-xs font-medium text-primary">{badge.name}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Next achievement - Forward motivation */}
              {stats.badges.length < 5 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold text-primary">Next Milestone</p>
                      <p className="text-sm text-gray-700">
                        Complete <strong>3 more tests</strong> to unlock <strong>Week Warrior</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🏆</p>
              <p className="text-gray-700 font-medium mb-2">Start your journey</p>
              <p className="text-sm text-gray-600 mb-6">
                Complete your first test to earn your first achievement
              </p>
              <Button variant="primary" onClick={() => navigate('/test')}>
                Take First Test
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Activity - Optional exploration */}
        <Card>
          <h2 className="text-xl font-semibold text-primary mb-6">Recent Activity</h2>
          
          {hasActivity ? (
            <div className="space-y-3">
              <AnimatePresence>
                {stats?.recentActivity.slice(0, 4).map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-smooth cursor-pointer group"
                    onClick={() => {
                      if (activity.type === 'test') navigate('/test');
                      if (activity.type === 'lesson') navigate('/subjects');
                    }}
                  >
                    <div className="flex-shrink-0">
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm group-hover:text-secondary transition-smooth">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                    {activity.score && (
                      <Badge variant="success" size="sm">{activity.score}%</Badge>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-gray-700 font-medium mb-2">No activity yet</p>
              <p className="text-sm text-gray-600 mb-6">
                Your learning journey starts here
              </p>
              <Button variant="secondary" onClick={() => navigate('/subjects')}>
                Start Learning
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
    </div>
  );
};
