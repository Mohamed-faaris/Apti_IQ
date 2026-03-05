import { Link, useLocation } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { useState } from 'react';

export const DashboardNav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/badges', label: 'Badges & Streaks', icon: '🏅' },
    { path: '/tournaments', label: 'Tournaments', icon: '🏆' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] bg-secondary text-white p-4 rounded-full shadow-2xl hover:bg-secondary/90 transition-all active:scale-95 border-2 border-white"
        aria-label="Toggle menu"
        style={{ boxShadow: '0 10px 40px rgba(139, 69, 19, 0.3)' }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-auto w-64 lg:w-64 z-[95]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Card className="p-4 h-full lg:h-auto overflow-y-auto">
          <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wide">
            Quick Navigation
          </h3>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
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
          <div className="mt-6 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-700">
              💡 <span className="font-medium">Tip:</span> Maintain your daily streak by practicing regularly!
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
