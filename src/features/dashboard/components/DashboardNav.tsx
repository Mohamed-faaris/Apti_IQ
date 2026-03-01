import { Link, useLocation } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';

export const DashboardNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/progress', label: 'Progress', icon: '📈' },
    { path: '/subjects', label: 'Learn', icon: '📚' },
    { path: '/test', label: 'Tests', icon: '📝' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 sticky top-20">
      <Card className="p-4">
        <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wide">
          Quick Navigation
        </h3>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-smooth ${
                isActive(item.path)
                  ? 'bg-secondary text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};
