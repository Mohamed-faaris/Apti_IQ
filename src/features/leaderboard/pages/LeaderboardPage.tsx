import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../services/api';
import { socketService } from '../../../services/socket';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import type { LeaderboardEntry, FilterType } from '../../../shared/types';

const LeaderboardPage = () => {
  const [filter, setFilter] = useState<FilterType>('national');
  const [liveData, setLiveData] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedRank, setHighlightedRank] = useState<number | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.LEADERBOARD, filter],
    queryFn: () => api.leaderboard.get(),
  });

  // Initialize live data from query result
  const displayData = liveData.length > 0 ? liveData : (initialData || []);

  // Filter by search query
  const filteredData = displayData.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    socketService.connect();

    const handleUpdate = (data: unknown) => {
      setLiveData(data as LeaderboardEntry[]);
    };

    socketService.on('leaderboard:update', handleUpdate);

    return () => {
      socketService.off('leaderboard:update', handleUpdate);
      socketService.disconnect();
    };
  }, []);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank <= 10) return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
    if (rank <= 50) return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    return 'bg-gray-200 text-gray-700';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-blue-600';
    if (accuracy >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const scrollToRank = (rank: number) => {
    setHighlightedRank(rank);
    setTimeout(() => setHighlightedRank(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-600">Compete with the best minds across the nation</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filter === 'national' ? 'primary' : 'outline'}
              onClick={() => setFilter('national')}
              className="flex items-center gap-2"
            >
              <span>🇮🇳</span> National
            </Button>
            <Button
              variant={filter === 'college' ? 'primary' : 'outline'}
              onClick={() => setFilter('college')}
              className="flex items-center gap-2"
            >
              <span>🎓</span> My College
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1">{displayData.length}</p>
              <p className="text-sm text-gray-600">Total Participants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary mb-1">
                {displayData[0]?.score || 0}
              </p>
              <p className="text-sm text-gray-600">Top Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent mb-1">
                {Math.round(displayData.reduce((acc, e) => acc + e.accuracy, 0) / displayData.length) || 0}%
              </p>
              <p className="text-sm text-gray-600">Avg Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1">
                {Math.round(displayData.reduce((acc, e) => acc + e.testsCompleted, 0) / displayData.length) || 0}
              </p>
              <p className="text-sm text-gray-600">Avg Tests</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* User's Rank Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">📍 Your Rank</h2>
        {(() => {
          const userData = displayData.find((entry) => entry.userId === 'demo-user') || displayData[0];
          if (!userData) {
            return null;
          }

          return (
            <Card className="border-4 border-secondary bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {getMedalIcon(userData.rank) ? (
                      <div className="text-8xl">{getMedalIcon(userData.rank)}</div>
                    ) : (
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${getRankBadgeColor(userData.rank)}`}>
                        #{userData.rank}
                      </div>
                    )}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      Your Rank
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2">
                    {userData.rank <= 3 && (
                      <Badge variant="success" className="text-xs">
                        🏆 Podium Position!
                      </Badge>
                    )}
                    {userData.rank > 3 && userData.rank <= 10 && (
                      <Badge variant="primary" className="text-xs">
                        ⭐ Elite Performer
                      </Badge>
                    )}
                    {userData.rank > 10 && userData.rank <= 50 && (
                      <Badge variant="secondary" className="text-xs">
                        💪 Strong Performance
                      </Badge>
                    )}
                    {userData.rank > 50 && (
                      <Badge variant="default" className="text-xs">
                        📈 Keep Climbing!
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{userData.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
                    <span>🎓</span>
                    <span>{userData.college}</span>
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Score</p>
                      <p className="text-2xl font-bold text-secondary">{userData.score}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Tests</p>
                      <p className="text-2xl font-bold text-primary">{userData.testsCompleted}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Accuracy</p>
                      <p className={`text-2xl font-bold ${getAccuracyColor(userData.accuracy)}`}>
                        {userData.accuracy}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rank Progress */}
                <div className="flex-shrink-0 text-center">
                  <div className="bg-white rounded-lg p-4 min-w-[200px]">
                    <p className="text-xs text-gray-600 mb-2">Rank Progress</p>
                    {userData.rank > 1 ? (
                      <>
                        <p className="text-sm text-gray-700 mb-2">
                        <span className="font-bold text-green-600">↑ 0</span> positions this week
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Next rank:</span>
                            <span className="font-bold text-primary">#{userData.rank - 1}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Points needed:</span>
                            <span className="font-bold text-secondary">
                              {displayData[userData.rank - 2]?.score - userData.score || 0}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="mt-3 w-full"
                          onClick={() => window.location.href = '/test'}
                        >
                          Take Test →
                        </Button>
                      </>
                    ) : (
                      <div className="py-4">
                        <p className="text-2xl mb-2">👑</p>
                        <p className="text-sm font-bold text-yellow-600">
                          You're #1!
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Keep practicing to maintain your position
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })()}
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search by name or college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Quick Jump */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-primary">Quick Jump:</span>
            <Button variant="outline" size="sm" onClick={() => scrollToRank(1)}>
              Top 3
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToRank(10)}>
              Top 10
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToRank(50)}>
              Top 50
            </Button>
            <Button variant="outline" size="sm" onClick={() => scrollToRank(100)}>
              Top 100
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Full Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">📊 Complete Rankings</h2>
            <Badge variant="secondary">
              {filteredData.length} {filteredData.length === 1 ? 'Result' : 'Results'}
            </Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 font-bold text-primary">Rank</th>
                  <th className="text-left py-4 px-4 font-bold text-primary">Participant</th>
                  <th className="text-left py-4 px-4 font-bold text-primary">College</th>
                  <th className="text-center py-4 px-4 font-bold text-primary">Score</th>
                  <th className="text-center py-4 px-4 font-bold text-primary">Tests</th>
                  <th className="text-center py-4 px-4 font-bold text-primary">Accuracy</th>
                  <th className="text-center py-4 px-4 font-bold text-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredData.map((entry, index) => (
                    <motion.tr
                      key={entry.userId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        backgroundColor: highlightedRank === entry.rank ? '#FEF3C7' : 'transparent'
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all ${
                        entry.rank <= 3 ? 'bg-yellow-50/30' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getMedalIcon(entry.rank) ? (
                            <span className="text-3xl">{getMedalIcon(entry.rank)}</span>
                          ) : (
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${getRankBadgeColor(entry.rank)}`}>
                              {entry.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {entry.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-primary">{entry.name}</p>
                            {entry.rank <= 10 && (
                              <span className="text-xs text-purple-600 font-medium">⭐ Top Performer</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎓</span>
                          <span className="text-gray-700">{entry.college}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="secondary" className="text-base font-bold">
                          {entry.score}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <span>📝</span>
                          <span className="font-medium">{entry.testsCompleted}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-lg font-bold ${getAccuracyColor(entry.accuracy)}`}>
                            {entry.accuracy}%
                          </span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${entry.accuracy}%` }}
                              transition={{ duration: 0.5, delay: index * 0.02 }}
                              className={`h-2 rounded-full ${
                                entry.accuracy >= 90 ? 'bg-green-500' :
                                entry.accuracy >= 75 ? 'bg-blue-500' :
                                entry.accuracy >= 60 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {entry.rank <= 3 && (
                          <Badge variant="success" className="text-xs">
                            🏆 Podium
                          </Badge>
                        )}
                        {entry.rank > 3 && entry.rank <= 10 && (
                          <Badge variant="primary" className="text-xs">
                            ⭐ Elite
                          </Badge>
                        )}
                        {entry.rank > 10 && entry.rank <= 50 && (
                          <Badge variant="secondary" className="text-xs">
                            💪 Strong
                          </Badge>
                        )}
                        {entry.rank > 50 && (
                          <Badge variant="default" className="text-xs">
                            📈 Rising
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-600 font-medium">No results found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <p className="text-lg font-bold text-primary mb-2">
            Want to climb the ranks?
          </p>
          <p className="text-gray-600 mb-4">
            Complete more tests and improve your accuracy to reach the top!
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/test'}>
            Take a Test Now →
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
