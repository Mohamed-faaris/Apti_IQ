import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { Modal } from '../../../shared/ui/Modal';
import { useToast } from '../../../shared/hooks/useToast';
import { useAuthStore } from '../../auth/store/authStore';

interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  joinedAt: string;
  status: 'active' | 'blocked';
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'fill';
}

interface Topic {
  id: string;
  name: string;
  category: string;
  questionsCount: number;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'questions' | 'topics' | 'analytics' | 'announcements' | 'settings'>('overview');
  
  // Students
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  
  // Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionFilter, setQuestionFilter] = useState({ topic: 'all', difficulty: 'all', type: 'all' });
  
  // Topics
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  
  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  
  // Settings
  const [settings, setSettings] = useState({
    platformName: 'AptIQ',
    maintenanceMode: false,
    newRegistrations: true,
  });

  useEffect(() => {
    setStudents([]);
    setTopics([]);
    setQuestions([]);
    setAnnouncements([]);
  }, []);

  const getStats = () => {
    const totalStudents = students.length;
    const totalQuestions = questions.length;
    const totalTopics = topics.length;
    const activeToday = Math.floor(totalStudents * 0.6);
    
    return { totalStudents, totalQuestions, totalTopics, activeToday };
  };

  const stats = getStats();

  // Student handlers
  const handleBlockStudent = (id: string) => {
    if (confirm('Block this student?')) {
      setStudents(students.map(s => s.id === id ? { ...s, status: 'blocked' } : s));
      toast.success('Student blocked');
    }
  };

  const handleUnblockStudent = (id: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: 'active' } : s));
    toast.success('Student unblocked');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Delete this student? This cannot be undone.')) {
      setStudents(students.filter(s => s.id !== id));
      toast.success('Student deleted');
    }
  };

  // Question handlers
  const handleSaveQuestion = (question: Partial<Question>) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? { ...editingQuestion, ...question } : q));
      toast.success('Question updated');
    } else {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: question.text || '',
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer || 0,
        topic: question.topic || '',
        difficulty: question.difficulty || 'medium',
        type: question.type || 'mcq',
      };
      setQuestions([...questions, newQuestion]);
      toast.success('Question added');
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
      toast.success('Question deleted');
    }
  };

  // Topic handlers
  const handleSaveTopic = (topic: Partial<Topic>) => {
    if (editingTopic) {
      setTopics(topics.map(t => t.id === editingTopic.id ? { ...editingTopic, ...topic } : t));
      toast.success('Topic updated');
    } else {
      const newTopic: Topic = {
        id: Date.now().toString(),
        name: topic.name || '',
        category: topic.category || '',
        questionsCount: 0,
      };
      setTopics([...topics, newTopic]);
      toast.success('Topic added');
    }
    setShowTopicModal(false);
    setEditingTopic(null);
  };

  const handleDeleteTopic = (id: string) => {
    if (confirm('Delete this topic?')) {
      setTopics(topics.filter(t => t.id !== id));
      toast.success('Topic deleted');
    }
  };

  // Announcement handler
  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      toast.error('Please fill in all fields');
      return;
    }
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', message: '' });
    toast.success('Announcement posted');
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredQuestions = questions.filter(q => {
    const matchesTopic = questionFilter.topic === 'all' || q.topic === questionFilter.topic;
    const matchesDifficulty = questionFilter.difficulty === 'all' || q.difficulty === questionFilter.difficulty;
    const matchesType = questionFilter.type === 'all' || q.type === questionFilter.type;
    return matchesTopic && matchesDifficulty && matchesType;
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Enhanced Visibility */}
      <div className="w-64 bg-primary text-white fixed h-full overflow-y-auto shadow-elevated">
        <div className="p-6 border-b border-gray-600">
          <h1 className="text-2xl font-bold text-warning">AptIQ Admin</h1>
          <p className="text-sm text-gray-300 mt-1">Management Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👤' },
            { id: 'questions', label: 'Question Bank', icon: '❓' },
            { id: 'topics', label: 'Topic Management', icon: '📚' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'announcements', label: 'Announcements', icon: '📢' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                activeSection === item.id
                  ? 'bg-white text-primary font-bold shadow-xl scale-105 border-l-4 border-warning'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md hover:scale-102 border-l-4 border-transparent'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 bg-background">
        {/* Top Navbar - Enhanced Contrast */}
        <div className="bg-white shadow-md border-b-2 border-paperLines px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-primary">
            {activeSection === 'overview' && '📊 Dashboard Overview'}
            {activeSection === 'users' && '👤 User Management'}
            {activeSection === 'questions' && '❓ Question Bank'}
            {activeSection === 'topics' && '📚 Topic Management'}
            {activeSection === 'analytics' && '📈 Analytics'}
            {activeSection === 'announcements' && '📢 Announcements'}
            {activeSection === 'settings' && '⚙️ Settings'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Welcome, <span className="text-primary font-bold">{user?.name}</span></span>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards - Notebook Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 notebook-shadow hover:shadow-elevated transition-smooth">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Students</p>
                      <p className="text-4xl font-bold mt-2 text-primary">{stats.totalStudents}</p>
                    </div>
                    <div className="text-5xl opacity-70">👥</div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 notebook-shadow hover:shadow-elevated transition-smooth">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Questions</p>
                      <p className="text-4xl font-bold mt-2 text-primary">{stats.totalQuestions}</p>
                    </div>
                    <div className="text-5xl opacity-70">❓</div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 notebook-shadow hover:shadow-elevated transition-smooth">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Topics</p>
                      <p className="text-4xl font-bold mt-2 text-primary">{stats.totalTopics}</p>
                    </div>
                    <div className="text-5xl opacity-70">📚</div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 notebook-shadow hover:shadow-elevated transition-smooth">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Active Today</p>
                      <p className="text-4xl font-bold mt-2 text-primary">{stats.activeToday}</p>
                    </div>
                    <div className="text-5xl opacity-70">🔥</div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="notebook-shadow">
                <h3 className="text-xl font-bold text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="primary" onClick={() => setActiveSection('questions')}>
                    + Add Question
                  </Button>
                  <Button variant="secondary" onClick={() => setActiveSection('topics')}>
                    + Add Topic
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection('users')}>
                    View Users
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection('announcements')}>
                    Post Notice
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="notebook-shadow">
                <h3 className="text-xl font-bold text-primary mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: '👤', text: 'New student registered: Alice Williams', time: '5 min ago', color: 'bg-blue-50 border-blue-200' },
                    { icon: '❓', text: 'Question added to Algebra topic', time: '15 min ago', color: 'bg-green-50 border-green-200' },
                    { icon: '📢', text: 'Announcement posted: New Features', time: '1 hour ago', color: 'bg-purple-50 border-purple-200' },
                    { icon: '📚', text: 'Topic created: Data Structures', time: '2 hours ago', color: 'bg-orange-50 border-orange-200' },
                  ].map((activity, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${activity.color} hover:shadow-md transition-smooth`}>
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-primary font-medium">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* User Management Section */}
          {activeSection === 'users' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="notebook-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-primary">Registered Students</h3>
                  <Input placeholder="Search by name or email..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-64" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-primary">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">College</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Joined Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-paperLines">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-blue-50/30 transition-smooth">
                          <td className="px-4 py-3 text-sm text-primary font-medium">{student.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.college}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(student.joinedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant={student.status === 'active' ? 'success' : 'danger'}>{student.status}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => toast.info('View feature coming soon')}>View</Button>
                              {student.status === 'active' ? (
                                <Button variant="outline" size="sm" onClick={() => handleBlockStudent(student.id)}>Block</Button>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => handleUnblockStudent(student.id)}>Unblock</Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(student.id)} className="text-accent hover:bg-red-50">Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Question Bank Section */}
          {activeSection === 'questions' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#2C3E50]">Question Bank</h3>
                  <Button variant="primary" onClick={() => { setEditingQuestion(null); setShowQuestionModal(true); }}>+ Add New Question</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <select value={questionFilter.topic} onChange={(e) => setQuestionFilter({ ...questionFilter, topic: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                    <option value="all">All Topics</option>
                    {topics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                  <select value={questionFilter.difficulty} onChange={(e) => setQuestionFilter({ ...questionFilter, difficulty: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                    <option value="all">All Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <select value={questionFilter.type} onChange={(e) => setQuestionFilter({ ...questionFilter, type: e.target.value })} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                    <option value="all">All Types</option>
                    <option value="mcq">MCQ</option>
                    <option value="fill">Fill in the Blank</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="primary">{question.topic}</Badge>
                            <Badge variant={question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'}>{question.difficulty}</Badge>
                            <Badge variant="secondary">{question.type.toUpperCase()}</Badge>
                          </div>
                          <p className="text-gray-800 font-medium mb-2">{question.text}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            {question.options.map((opt, i) => (
                              <div key={i} className={`${i === question.correctAnswer ? 'text-green-600 font-medium' : ''}`}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingQuestion(question); setShowQuestionModal(true); }}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)} className="text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Topic Management Section */}
          {activeSection === 'topics' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="notebook-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-primary">Topic Management</h3>
                  <Button variant="primary" onClick={() => { setEditingTopic(null); setShowTopicModal(true); }}>+ Add New Topic</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((topic) => (
                    <Card key={topic.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 hover:shadow-elevated transition-smooth">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-primary text-lg">{topic.name}</h4>
                          <p className="text-sm text-gray-600">{topic.category}</p>
                        </div>
                        <Badge variant="primary">{topic.questionsCount} Qs</Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => { setEditingTopic(topic); setShowTopicModal(true); }}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteTopic(topic.id)} className="text-accent">Delete</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="notebook-shadow">
                  <h4 className="font-semibold text-primary mb-4">New Signups (Weekly)</h4>
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-12">{day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6">
                           <div className="bg-warning h-6 rounded-full flex items-center justify-end pr-2 transition-smooth" style={{ width: '0%' }}>
                             <span className="text-xs font-medium text-primary">0</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="notebook-shadow">
                  <h4 className="font-semibold text-primary mb-4">Most Attempted Topics</h4>
                  <div className="space-y-3">
                    {topics.slice(0, 5).map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                        <span className="text-sm text-primary font-medium">{topic.name}</span>
                        <Badge variant="primary">0 attempts</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="notebook-shadow">
                  <h4 className="font-semibold text-primary mb-4">Average Score by Topic</h4>
                  <div className="space-y-3">
                    {topics.slice(0, 5).map((topic) => (
                      <div key={topic.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-primary">{topic.name}</span>
                          <span className="text-sm font-medium text-primary">0%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-success h-2 rounded-full transition-smooth" style={{ width: '0%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Announcements Section */}
          {activeSection === 'announcements' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="notebook-shadow">
                <h3 className="text-xl font-bold text-primary mb-4">Post New Announcement</h3>
                <div className="space-y-4">
                  <Input label="Title" placeholder="Announcement title..." value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Message</label>
                    <textarea placeholder="Announcement message..." value={newAnnouncement.message} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} className="w-full px-4 py-2 border border-paperLines rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-paper" rows={4} />
                  </div>
                  <Button variant="primary" onClick={handlePostAnnouncement}>Post Announcement</Button>
                </div>
              </Card>
              <Card className="notebook-shadow">
                <h3 className="text-xl font-bold text-primary mb-4">Previous Announcements</h3>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-smooth">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-primary">{announcement.title}</h4>
                        <span className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{announcement.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="notebook-shadow">
                <h3 className="text-xl font-bold text-primary mb-6">Platform Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Platform Name</label>
                    <Input value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-primary">Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Disable access for all users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-warning"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-primary">New Registrations</p>
                      <p className="text-sm text-gray-600">Allow new users to register</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.newRegistrations} onChange={(e) => setSettings({ ...settings, newRegistrations: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                    </label>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <p className="font-medium text-primary mb-2">Admin Password</p>
                    <Button variant="outline" onClick={() => toast.info('Password change feature coming soon')}>Change Password</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal isOpen={showQuestionModal} onClose={() => { setShowQuestionModal(false); setEditingQuestion(null); }} question={editingQuestion} topics={topics} onSave={handleSaveQuestion} />

      {/* Topic Modal */}
      <TopicModal isOpen={showTopicModal} onClose={() => { setShowTopicModal(false); setEditingTopic(null); }} topic={editingTopic} onSave={handleSaveTopic} />
    </div>
  );
};

// Question Modal Component
const QuestionModal = ({ isOpen, onClose, question, topics, onSave }: any) => {
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    topic: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'mcq' as 'mcq' | 'fill',
  });

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        topic: '',
        difficulty: 'medium',
        type: 'mcq',
      });
    }
  }, [question]);

  const handleSubmit = () => {
    if (!formData.text || !formData.topic) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={question ? 'Edit Question' : 'Add New Question'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Question Text *</label>
          <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className="w-full px-4 py-2 border border-paperLines rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-paper" rows={3} placeholder="Enter question text..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {formData.options.map((opt, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-primary mb-2">Option {String.fromCharCode(65 + i)}</label>
              <Input value={opt} onChange={(e) => { const newOptions = [...formData.options]; newOptions[i] = e.target.value; setFormData({ ...formData, options: newOptions }); }} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Correct Answer *</label>
          <select value={formData.correctAnswer} onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-paperLines rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-paper">
            {formData.options.map((_, i) => (
              <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Topic *</label>
            <select value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="w-full px-4 py-2 border border-paperLines rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-paper">
              <option value="">Select Topic</option>
              {topics.map((t: any) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Difficulty</label>
            <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })} className="w-full px-4 py-2 border border-paperLines rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-paper">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-4 py-2 border border-paperLines rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-paper">
              <option value="mcq">MCQ</option>
              <option value="fill">Fill in the Blank</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{question ? 'Update' : 'Add'} Question</Button>
        </div>
      </div>
    </Modal>
  );
};

// Topic Modal Component
const TopicModal = ({ isOpen, onClose, topic, onSave }: any) => {
  const [formData, setFormData] = useState({ name: '', category: '' });

  useEffect(() => {
    if (topic) {
      setFormData({ name: topic.name, category: topic.category });
    } else {
      setFormData({ name: '', category: '' });
    }
  }, [topic]);

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      alert('Please fill in all fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={topic ? 'Edit Topic' : 'Add New Topic'}>
      <div className="space-y-4">
        <Input label="Topic Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Number Systems" />
        <Input label="Category *" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Mathematics" />
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{topic ? 'Update' : 'Add'} Topic</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminPage;
