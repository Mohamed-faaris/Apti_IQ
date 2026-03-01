import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';

type TournamentFilter = 'all' | 'world' | 'country' | 'region' | 'state' | 'company' | 'college';
type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed';

const TournamentsPage = () => {
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = useState<TournamentFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: tournaments, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TOURNAMENTS, levelFilter, statusFilter],
    queryFn: () => api.tournaments.getAll(levelFilter, statusFilter),
  });

  const getOrganizerIcon = (type: string) => {
    const icons = {
      world: '🌍',
      country: '🇮🇳',
      region: '🗺️',
      state: '📍',
      company: '🏢',
      college: '🎓',
    };
    return icons[type as keyof typeof icons] || '🏆';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-700 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      case 'expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTournaments = tournaments?.filter(t => {
    if (levelFilter !== 'all' && t.organizerType !== levelFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">🏆 Tournaments</h1>
            <p className="text-gray-600">
              Compete globally, earn prizes, and showcase your skills
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/tournaments/my-tournaments')}>
            My Tournaments
          </Button>
        </div>
      </motion.div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-1">24</p>
              <p className="text-sm text-gray-600">Active Tournaments</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-1">5</p>
              <p className="text-sm text-gray-600">Registered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600 mb-1">$50K+</p>
              <p className="text-sm text-gray-600">Total Prize Pool</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600 mb-1">12K+</p>
              <p className="text-sm text-gray-600">Participants</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="space-y-4">
            {/* Level Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Tournament Level</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Levels', icon: '🌟' },
                  { value: 'world', label: 'World', icon: '🌍' },
                  { value: 'country', label: 'Country', icon: '🇮🇳' },
                  { value: 'region', label: 'Region', icon: '🗺️' },
                  { value: 'state', label: 'State', icon: '📍' },
                  { value: 'company', label: 'Company', icon: '🏢' },
                  { value: 'college', label: 'College', icon: '🎓' },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={levelFilter === filter.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setLevelFilter(filter.value as TournamentFilter)}
                  >
                    {filter.icon} {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Status</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'ongoing', label: 'Ongoing' },
                  { value: 'completed', label: 'Completed' },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={statusFilter === filter.value ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(filter.value as StatusFilter)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tournaments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded" />
              </Card>
            ))
          ) : filteredTournaments && filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card hover className="h-full flex flex-col">
                  {/* Tournament Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{getOrganizerIcon(tournament.organizerType)}</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {tournament.organizerType}
                        </p>
                        <p className="text-sm font-medium text-gray-700">{tournament.organizer}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                      {tournament.status}
                    </div>
                  </div>

                  {/* Tournament Name */}
                  <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                    {tournament.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {tournament.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(tournament.level)}`}>
                      {tournament.level}
                    </span>
                    {tournament.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span className="text-gray-700 font-medium">{tournament.prizePool}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span className="text-gray-700">
                        {tournament.participants}
                        {tournament.maxParticipants && `/${tournament.maxParticipants}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span className="text-gray-700">{tournament.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>❓</span>
                      <span className="text-gray-700">{tournament.questionsCount} Qs</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-600 mb-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {tournament.status === 'upcoming' && (
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>Register by: {new Date(tournament.registrationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {tournament.isRegistered ? (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                      </Button>
                    ) : tournament.status === 'upcoming' ? (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => navigate(`/tournaments/${tournament.id}/register`)}
                      >
                        Register Now
                      </Button>
                    ) : tournament.status === 'ongoing' ? (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => navigate(`/tournaments/${tournament.id}/register`)}
                      >
                        Join Now
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/tournaments/${tournament.id}/results`)}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-xl text-gray-600 mb-2">No tournaments found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </Card>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Prizes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">🎁 Featured Prizes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🥇', title: 'Cash Prizes', desc: 'Win up to $10,000 in top tournaments' },
            { icon: '🏆', title: 'Exclusive Badges', desc: 'Earn rare badges for your profile' },
            { icon: '💼', title: 'Job Opportunities', desc: 'Get noticed by top companies' },
          ].map((item, i) => (
            <Card key={i} hover className="text-center">
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TournamentsPage;
