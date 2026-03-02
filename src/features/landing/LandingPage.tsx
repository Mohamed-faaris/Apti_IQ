import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { ThreeBackground } from '../../shared/ui/ThreeBackground';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <ThreeBackground variant="both" color="#E74C3C" particleCount={2500} />
      {/* Hero Section - Notebook Theme with 3D Animation */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Animated Notebook Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Notebook Pages */}
          <motion.div
            className="absolute top-20 right-10"
            animate={{
              y: [0, -20, 0],
              rotateY: [0, 15, 0],
              rotateX: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            <div className="relative w-48 h-64 bg-[#FFFEF7] rounded-lg shadow-2xl border-l-4 border-[#FFB6C1]"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E8DCC4 31px, #E8DCC4 32px)',
                backgroundSize: '100% 32px',
              }}
            >
              {/* Hole punches */}
              <div className="absolute left-2 top-8 w-3 h-3 rounded-full bg-white border-2 border-gray-300 shadow-inner" />
              <div className="absolute left-2 top-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300 shadow-inner" />
              <div className="absolute left-2 bottom-8 w-3 h-3 rounded-full bg-white border-2 border-gray-300 shadow-inner" />
              
              {/* Handwritten text effect */}
              <div className="p-6 pl-10 text-gray-600 text-sm font-handwriting">
                <div className="mb-2">Learn</div>
                <div className="mb-2">Practice</div>
                <div className="mb-2">Excel</div>
              </div>
            </div>
          </motion.div>

          {/* Floating Pencil */}
          <motion.div
            className="absolute bottom-32 left-10"
            animate={{
              y: [0, 15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="w-40 h-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full shadow-lg relative transform -rotate-45">
              <div className="absolute right-0 w-6 h-8 bg-gradient-to-r from-amber-800 to-amber-700 rounded-r-full" />
              <div className="absolute right-6 w-4 h-8 bg-gray-800 rounded-r-sm" />
              <div className="absolute left-0 w-8 h-8 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full" />
            </div>
          </motion.div>

          {/* Floating Sticky Note */}
          <motion.div
            className="absolute top-1/3 left-1/4"
            animate={{
              y: [0, -10, 0],
              rotateZ: [-2, 2, -2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-lg transform rotate-6 relative">
              <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-400/30" />
              <div className="p-4 text-xs text-gray-700 font-handwriting">
                <div className="mb-1">✓ Study</div>
                <div className="mb-1">✓ Test</div>
                <div>✓ Rank</div>
              </div>
            </div>
          </motion.div>

          {/* 3D Stacked Books */}
          <motion.div
            className="absolute bottom-20 right-20"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative">
              {/* Book 1 */}
              <motion.div
                className="w-32 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-sm shadow-lg mb-1"
                animate={{
                  rotateY: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Book 2 */}
              <motion.div
                className="w-32 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-sm shadow-lg mb-1"
                animate={{
                  rotateY: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              {/* Book 3 */}
              <motion.div
                className="w-32 h-8 bg-gradient-to-r from-pink-600 to-pink-700 rounded-sm shadow-lg"
                animate={{
                  rotateY: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl text-center"
        >
          {/* Main Heading with Notebook Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#2C3E50] mb-4 relative">
              <span className="relative inline-block">
                Learn. Test. Rank.
                {/* Underline effect like notebook */}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#E74C3C]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Master aptitude tests with our comprehensive learning platform. 
            Study like you're writing in your favorite notebook.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex gap-3 sm:gap-4 justify-center flex-wrap mb-12 sm:mb-16 px-4"
          >
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="primary" size="lg" className="shadow-xl bg-[#2C3E50] hover:bg-[#34495E]">
                  Start Learning 📚
                </Button>
              </motion.div>
            </Link>
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="lg" className="shadow-lg border-2 border-[#2C3E50] text-[#2C3E50]">
                  Sign In
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Notebook-style Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: "📖", title: "Study Smart", desc: "Structured lessons in notebook format" },
              { icon: "✍️", title: "Practice Daily", desc: "Write your success story" },
              { icon: "🏆", title: "Track Progress", desc: "See your growth over time" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div 
                  className="bg-[#FFFEF7] rounded-lg p-6 shadow-lg border-l-4 border-[#FFB6C1] relative"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E8DCC4 31px, #E8DCC4 32px)',
                    backgroundSize: '100% 32px',
                    backgroundPosition: '0 8px',
                  }}
                >
                  {/* Hole punch */}
                  <div className="absolute left-2 top-6 w-2 h-2 rounded-full bg-white border border-gray-300 shadow-inner" />
                  
                  <div className="ml-4">
                    <div className="text-5xl mb-3">{item.icon}</div>
                    <h3 className="text-xl font-bold text-[#2C3E50] mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-primary mb-4">
          Why Choose AptIQ?
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          A complete platform for students to learn and practice, and for teachers to conduct professional assessments
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📚', title: 'Comprehensive Learning', desc: 'Structured lessons covering all aptitude topics for self-paced learning' },
            { icon: '⚡', title: 'Real-Time Testing', desc: 'Practice with timed tests and instant feedback' },
            { icon: '🏆', title: 'Live Leaderboard', desc: 'Compete with peers and track your ranking' },
            { icon: '📊', title: 'Analytics Dashboard', desc: 'Detailed insights into performance for students and teachers' },
            { icon: '🛡️', title: 'Anti-Cheat System', desc: 'Fair testing environment with violation tracking' },
            { icon: '👨‍🏫', title: 'Teacher Tools', desc: 'Professors can create and conduct tests for their students' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* For Students and Teachers */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* For Students */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-3xl font-bold text-primary mb-4">For Students</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Learn aptitude concepts through structured lessons</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Practice with customizable self-tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Join teacher-assigned tests using codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Track your progress and compete on leaderboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Get detailed analytics on your performance</span>
                </li>
              </ul>
              <Link to="/register">
                <Button variant="primary" className="w-full mt-6">
                  Start Learning
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* For Teachers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h3 className="text-3xl font-bold text-primary mb-4">For Teachers</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Create custom tests for your students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Generate unique test codes for easy distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Monitor student performance in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Grade assignments and track class progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Access comprehensive analytics for your class</span>
                </li>
              </ul>
              <Link to="/register">
                <Button variant="secondary" className="w-full mt-6">
                  Register as Teacher
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { step: '1', title: 'Sign Up & Choose Your Path', desc: 'Create your account and select subjects you want to master' },
            { step: '2', title: 'Learn & Practice', desc: 'Go through structured lessons and practice quizzes' },
            { step: '3', title: 'Take Tests & Compete', desc: 'Test your skills and climb the leaderboard' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-primary mb-6">
            Ready to Excel?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students improving their aptitude skills
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">Start Learning Now</Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2026 AptIQ. All rights reserved.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
