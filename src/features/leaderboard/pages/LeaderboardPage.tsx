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

  const { data: initialData } = useQuery({
    queryKey: [QUERY_KEYS.LEADERBOARD, filter],
    queryFn: () => api.leaderboard.get(),
  });

  // Initialize live data from query result
  const displayData = liveData.length > 0 ? liveData : (initialData || []);

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Leaderboard</h1>
          <p className="text-gray-600 mt-2">Real-time rankings updated every 5 seconds</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={filter === 'national' ? 'primary' : 'outline'}
            onClick={() => setFilter('national')}
          >
            National
          </Button>
          <Button
            variant={filter === 'college' ? 'primary' : 'outline'}
            onClick={() => setFilter('college')}
          >
            My College
          </Button>
        </div>
      </div>

      {/* Top 3 */}
      <div className="grid md:grid-cols-3 gap-6">
        {displayData.slice(0, 3).map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="text-center">
                <div className="text-6xl mb-4">{getMedalIcon(entry.rank)}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{entry.name}</h3>
                <p className="text-gray-600 mb-4">{entry.college}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-bold text-secondary">{entry.score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tests:</span>
                    <span className="font-medium">{entry.testsCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">{entry.accuracy}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-primary">Rank</th>
                <th className="text-left py-3 px-4 font-bold text-primary">Name</th>
                <th className="text-left py-3 px-4 font-bold text-primary">College</th>
                <th className="text-right py-3 px-4 font-bold text-primary">Score</th>
                <th className="text-right py-3 px-4 font-bold text-primary">Tests</th>
                <th className="text-right py-3 px-4 font-bold text-primary">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {displayData.map((entry) => (
                  <motion.tr
                    key={entry.userId}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-smooth"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(entry.rank) && (
                          <span className="text-2xl">{getMedalIcon(entry.rank)}</span>
                        )}
                        <span className="font-bold text-primary">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{entry.name}</td>
                    <td className="py-4 px-4 text-gray-600">{entry.college}</td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant="secondary">{entry.score}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">{entry.testsCompleted}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={entry.accuracy >= 80 ? 'text-green-600 font-medium' : ''}>
                        {entry.accuracy}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
