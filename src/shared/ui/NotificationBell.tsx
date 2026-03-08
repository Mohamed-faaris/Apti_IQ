import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../features/auth/store/authStore';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  timestamp: Date;
  read: boolean;
  icon: string;
}

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  // Mock notifications based on user role
  useEffect(() => {
    const mockNotifications: Notification[] = user?.role === 'teacher' 
      ? [
          {
            id: '1',
            title: 'New Student Enrolled',
            message: 'John Doe has joined your Mathematics class',
            type: 'info',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            read: false,
            icon: '👤',
          },
          {
            id: '2',
            title: 'Test Submitted',
            message: '15 students completed the Algebra Quiz',
            type: 'success',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            read: false,
            icon: '📝',
          },
          {
            id: '3',
            title: 'Class Reminder',
            message: 'Physics class starts in 1 hour',
            type: 'warning',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            read: true,
            icon: '⏰',
          },
        ]
      : [
          {
            id: '1',
            title: 'New Badge Earned!',
            message: 'You earned the "Quick Learner" badge',
            type: 'achievement',
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            read: false,
            icon: '🏅',
          },
          {
            id: '2',
            title: 'Test Available',
            message: 'New Algebra test is now available',
            type: 'info',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            read: false,
            icon: '📋',
          },
          {
            id: '3',
            title: 'Streak Milestone',
            message: '7-day learning streak! Keep it up!',
            type: 'success',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            read: true,
            icon: '🔥',
          },
          {
            id: '4',
            title: 'Tournament Starting',
            message: 'Math Championship begins tomorrow',
            type: 'warning',
            timestamp: new Date(Date.now() - 1000 * 60 * 180),
            read: true,
            icon: '🏆',
          },
        ];
    
    setNotifications(mockNotifications);
  }, [user?.role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-primary hover:text-secondary transition-smooth rounded-lg hover:bg-gray-100"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-secondary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-smooth ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl flex-shrink-0">{notification.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-primary text-sm">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button className="text-sm text-secondary hover:underline font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
