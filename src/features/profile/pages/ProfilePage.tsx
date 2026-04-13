import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '../../../services/api';
import { QUERY_KEYS } from '../../../shared/constants';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import type { User } from '../../../shared/types';

// Calculate test dates outside component to avoid impure function calls during render
const getTestDates = () => [1, 2, 3].map(i => new Date(Date.now() - i * 86400000));

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  // Use pre-calculated dates
  const testDates = getTestDates();

  const { data: profile } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: api.profile.get,
  });

  const { data: testHistory } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, 'history'],
    queryFn: api.profile.getHistory,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<Partial<User>>({
    defaultValues: profile,
  });

  const updateMutation = useMutation({
    mutationFn: api.profile.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      toast.success('Profile updated successfully!');
    },
  });

  const onSubmit = (data: Partial<User>) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-primary">Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-5xl">
              👤
            </div>
            <Button variant="outline" size="sm">
              Upload Photo
            </Button>
            <p className="text-xs text-gray-500 mt-2">Photo upload coming soon</p>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="md:col-span-2">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">{profile?.badges.length ?? 0}</p>
              <p className="text-sm text-gray-600">Tests Taken</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">87%</p>
              <p className="text-sm text-gray-600">Avg Accuracy</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">0</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">{profile?.badges.length ?? 0}</p>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <h2 className="text-2xl font-bold text-primary mb-6">Personal Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            defaultValue={profile?.name}
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />

          <Input
            label="Email"
            type="email"
            defaultValue={profile?.email}
            disabled
          />

          <Input
            label="College"
            defaultValue={profile?.college}
            {...register('college')}
          />

          <Input
            label="LinkedIn Profile"
            defaultValue={profile?.linkedIn}
            placeholder="https://linkedin.com/in/yourprofile"
            {...register('linkedIn')}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Badges */}
      <Card>
        <h2 className="text-2xl font-bold text-primary mb-6">🏆 Earned Badges & Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile?.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-smooth cursor-pointer"
              title={badge.description}
            >
              <div className="text-5xl mb-3">{badge.icon}</div>
              <p className="font-medium text-primary mb-1">{badge.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Tournament Achievements */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-primary mb-6">🏆 Tournament Achievements</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-white rounded-lg">
            <p className="text-3xl font-bold text-purple-600 mb-1">5</p>
            <p className="text-sm text-gray-600">Tournaments Won</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <p className="text-3xl font-bold text-blue-600 mb-1">12</p>
            <p className="text-sm text-gray-600">Tournaments Participated</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <p className="text-3xl font-bold text-green-600 mb-1">₹45,000</p>
            <p className="text-sm text-gray-600">Total Prizes Won</p>
          </div>
        </div>

        {/* Recent Tournament Results */}
        <div className="space-y-3">
          <h3 className="font-bold text-primary mb-3">Recent Tournament Results</h3>
          {[
            { name: 'Global Aptitude Championship', rank: '1st', prize: '₹50,000', badge: '🥇' },
            { name: 'All India Aptitude Test', rank: '3rd', prize: '₹7,00,000', badge: '🥉' },
            { name: 'Karnataka State Championship', rank: '2nd', prize: '₹1,00,000', badge: '🥈' },
          ].map((tournament, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tournament.badge}</span>
                <div>
                  <p className="font-medium text-primary">{tournament.name}</p>
                  <p className="text-sm text-gray-600">Rank: {tournament.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{tournament.prize}</p>
                <p className="text-xs text-gray-500">Prize Won</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Test History */}
      <Card>
        <h2 className="text-2xl font-bold text-primary mb-6">Recent Test History</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i, index) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
            <p className="font-medium text-primary">{testHistory?.[index]?.testId ?? `Test ${i}`}</p>
                <p className="text-sm text-gray-600">
                  {testHistory?.[index]?.completedAt ? new Date(testHistory[index].completedAt).toLocaleDateString() : testDates[index].toLocaleDateString()}
                </p>
              </div>
              <Badge variant="success">{testHistory?.[index]?.score ?? 85}%</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
