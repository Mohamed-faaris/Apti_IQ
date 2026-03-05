import { Link, useLocation } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';

export const TeacherNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/teacher/dashboard', label: 'Overview', icon: '📊' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 sticky top-20">
      <Card className="p-4">
        <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wide">
          Teacher Menu
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

        {/* Tips */}
        <div className="mt-6 p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <p className="text-xs text-gray-700">
            💡 <span className="font-medium">Tip:</span> Create classes first, then assign tests to them.
          </p>
        </div>
      </Card>
    </div>
  );
};
