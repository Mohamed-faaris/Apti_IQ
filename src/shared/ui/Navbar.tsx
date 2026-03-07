import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../features/auth/store/authStore';
import { Button } from './Button';

export const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => `
    text-primary hover:text-secondary transition-smooth relative pb-1
    ${isActive(path) ? 'font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary' : ''}
  `;

  const mobileNavLinkClass = (path: string) => `
    block px-4 py-3 text-primary hover:bg-gray-100 transition-smooth rounded-lg
    ${isActive(path) ? 'font-bold bg-secondary/10' : ''}
  `;

  return (
    <nav className="bg-[#FEFDFB] shadow-sm sticky top-0 z-30 border-b border-[#E5DDD0]">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
            <img src="/logo.svg" alt="AptIQ Logo" className="h-8 sm:h-9 lg:h-11" />
          </Link>

          {/* Center: Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-6 text-base">
              {user?.role === 'teacher' ? (
                <>
                  <Link to="/teacher/dashboard" className={navLinkClass('/teacher/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/teacher/classes" className={navLinkClass('/teacher/classes')}>
                    My Classes
                  </Link>
                  <Link to="/teacher/create-test" className={navLinkClass('/teacher/create-test')}>
                    Create Test
                  </Link>
                  <Link to="/teacher/students" className={navLinkClass('/teacher/students')}>
                    Students
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/my-classes" className={navLinkClass('/my-classes')}>
                    My Classes
                  </Link>
                  <Link to="/subjects" className={navLinkClass('/subjects')}>
                    Learn
                  </Link>
                  <Link to="/test" className={navLinkClass('/test')}>
                    Tests
                  </Link>
                  <Link to="/progress" className={navLinkClass('/progress')}>
                    Progress
                  </Link>
                  <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                    Leaderboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className={navLinkClass('/admin')}>
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          )}

          {/* Right: User Menu or Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Desktop User Dropdown */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-primary hover:text-secondary transition-smooth text-base"
                  >
                    <span className="font-medium">{user?.name}</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-base text-primary hover:bg-gray-100 transition-smooth"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-base text-primary hover:bg-gray-100 transition-smooth"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-primary hover:text-secondary transition-smooth"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {user?.role === 'teacher' ? (
                <>
                  <Link
                    to="/teacher/dashboard"
                    className={mobileNavLinkClass('/teacher/dashboard')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/teacher/classes"
                    className={mobileNavLinkClass('/teacher/classes')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📚 My Classes
                  </Link>
                  <Link
                    to="/teacher/create-test"
                    className={mobileNavLinkClass('/teacher/create-test')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ✏️ Create Test
                  </Link>
                  <Link
                    to="/teacher/students"
                    className={mobileNavLinkClass('/teacher/students')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👥 Students
                  </Link>
                  
                  {/* Dashboard Sub-menu */}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Dashboard Menu
                    </div>
                    <Link
                      to="/teacher/test-results"
                      className={mobileNavLinkClass('/teacher/test-results')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📋 Test Results
                    </Link>
                    <Link
                      to="/teacher/notes"
                      className={mobileNavLinkClass('/teacher/notes')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📝 Notes & Updates
                    </Link>
                    <Link
                      to="/teacher/analytics"
                      className={mobileNavLinkClass('/teacher/analytics')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📈 Student Analytics
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={mobileNavLinkClass('/dashboard')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/my-classes"
                    className={mobileNavLinkClass('/my-classes')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📚 My Classes
                  </Link>
                  <Link
                    to="/subjects"
                    className={mobileNavLinkClass('/subjects')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📖 Learn
                  </Link>
                  <Link
                    to="/test"
                    className={mobileNavLinkClass('/test')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📝 Tests
                  </Link>
                  <Link
                    to="/progress"
                    className={mobileNavLinkClass('/progress')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📈 Progress
                  </Link>
                  <Link
                    to="/leaderboard"
                    className={mobileNavLinkClass('/leaderboard')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👑 Leaderboard
                  </Link>
                  
                  {/* Admin Link for Admin Users */}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={mobileNavLinkClass('/admin')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🛡️ Admin Panel
                    </Link>
                  )}
                  
                  {/* Dashboard Sub-menu */}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Dashboard Menu
                    </div>
                    <Link
                      to="/analytics"
                      className={mobileNavLinkClass('/analytics')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      📈 Analytics
                    </Link>
                    <Link
                      to="/badges"
                      className={mobileNavLinkClass('/badges')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🏅 Badges & Streaks
                    </Link>
                    <Link
                      to="/tournaments"
                      className={mobileNavLinkClass('/tournaments')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🏆 Tournaments
                    </Link>
                  </div>
                </>
              )}
              
              {/* Mobile User Menu */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-600">
                  Signed in as <span className="font-medium text-primary">{user?.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-primary hover:bg-gray-100 transition-smooth rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-primary hover:bg-gray-100 transition-smooth rounded-lg"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
