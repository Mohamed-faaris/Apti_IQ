import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { Input } from '../../../shared/ui/Input';
import { TeacherNav } from '../components/TeacherNav';
import { api } from '../../../services/api';

interface TestResult {
  id: string;
  testName: string;
  className: string;
  totalStudents: number;
  completed: number;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  date: string;
  status: 'active' | 'completed' | 'scheduled';
}

export const TeacherTestResultsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'scheduled'>('all');
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    api.teacher.listTests('class-1').then((tests) => {
      setResults(tests.map((test, index) => ({
        id: test.legacyId ?? test._id,
        testName: test.title,
        className: 'Mathematics - Section A',
        totalStudents: 25,
        completed: index === 0 ? 23 : 0,
        avgScore: index === 0 ? 78 : 0,
        highestScore: index === 0 ? 95 : 0,
        lowestScore: index === 0 ? 52 : 0,
        date: test.createdAt,
        status: test.status,
      })));
    });
  }, []);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="warning">Active</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'scheduled': return <Badge variant="primary">Scheduled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Left Navigation */}
      <TeacherNav />

      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 px-3 sm:px-4 lg:px-0 pb-20 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-1 sm:mb-2">
            📋 Test Results
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">View and analyze test results from all your classes</p>
        </motion.div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by test name or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === 'scheduled' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('scheduled')}
              >
                Scheduled
              </Button>
            </div>
          </div>
        </Card>

        {/* Test Results List */}
        <div className="space-y-3 sm:space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-primary">{result.testName}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{result.className}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    <span className="text-xs sm:text-sm text-gray-600">{result.date}</span>
                  </div>
                </div>

                {result.status !== 'scheduled' && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                      <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg sm:text-xl font-bold text-primary">{result.completed}/{result.totalStudents}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg sm:text-xl font-bold text-blue-600">{result.avgScore}%</p>
                        <p className="text-xs text-gray-600">Avg Score</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                        <p className="text-lg sm:text-xl font-bold text-green-600">{result.highestScore}%</p>
                        <p className="text-xs text-gray-600">Highest</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                        <p className="text-lg sm:text-xl font-bold text-red-600">{result.lowestScore}%</p>
                        <p className="text-xs text-gray-600">Lowest</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="primary" size="sm" className="flex-1">
                        View Detailed Results
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Download Report
                      </Button>
                    </div>
                  </>
                )}

                {result.status === 'scheduled' && (
                  <div className="text-center py-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Test scheduled for {result.date}</p>
                    <p className="text-xs text-gray-500 mt-1">{result.totalStudents} students enrolled</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-lg text-gray-600 mb-2">No test results yet</p>
            <p className="text-sm text-gray-500">Create and assign tests to see results here.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherTestResultsPage;
