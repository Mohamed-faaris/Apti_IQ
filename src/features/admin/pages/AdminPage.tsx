import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { StatCard } from '../../../shared/ui/StatCard';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'violations' | 'analytics'>('questions');

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,234" icon="👥" />
        <StatCard title="Total Questions" value="5,678" icon="❓" />
        <StatCard title="Tests Today" value="89" icon="📝" />
        <StatCard title="Violations" value="12" icon="⚠️" />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200">
        {['questions', 'violations', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'questions' | 'violations' | 'analytics')}
            className={`px-6 py-3 font-medium capitalize transition-smooth ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary -mb-0.5'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Question Bank</h2>
              <div className="flex gap-3">
                <Button variant="outline">Import CSV</Button>
                <Button variant="primary">Add Question</Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Input placeholder="Search questions..." />
              <select className="px-4 py-2 border rounded-lg">
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>Logical Reasoning</option>
                <option>Verbal Ability</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>All Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <Button variant="secondary">Apply Filters</Button>
            </div>

            {/* Question List */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="primary">Mathematics</Badge>
                        <Badge variant="secondary">Medium</Badge>
                      </div>
                      <p className="text-primary font-medium mb-2">
                        What is the value of x in the equation 2x + 5 = 15?
                      </p>
                      <p className="text-sm text-gray-600">4 options • Created 2 days ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bulk Upload */}
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-4">Bulk Upload</h2>
            <p className="text-gray-600 mb-4">Upload questions in CSV format</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">📄 Drag and drop CSV file here</p>
              <Button variant="outline">Choose File</Button>
              <p className="text-xs text-gray-500 mt-4">Mock upload (not functional)</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Violations Tab */}
      {activeTab === 'violations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-6">Violation Logs</h2>
            <div className="space-y-3">
              {[
                { user: 'John Doe', type: 'Tab Switch', test: 'Mock Test 1', time: '2 hours ago' },
                { user: 'Jane Smith', type: 'Fullscreen Exit', test: 'Mock Test 2', time: '3 hours ago' },
                { user: 'Bob Johnson', type: 'Right Click', test: 'Mock Test 1', time: '5 hours ago' },
              ].map((violation, i) => (
                <div key={i} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">{violation.user}</p>
                      <p className="text-sm text-gray-600">
                        {violation.type} • {violation.test}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="danger">{violation.type}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{violation.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card>
            <h3 className="text-xl font-bold text-primary mb-4">Platform Usage</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Active Users</span>
                <span className="text-2xl font-bold text-primary">456</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tests Taken Today</span>
                <span className="text-2xl font-bold text-primary">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Session Time</span>
                <span className="text-2xl font-bold text-primary">45m</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-primary mb-4">Question Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Questions</span>
                <span className="text-2xl font-bold text-primary">5,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Difficulty</span>
                <span className="text-2xl font-bold text-primary">Medium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="text-2xl font-bold text-primary">73%</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPage;
