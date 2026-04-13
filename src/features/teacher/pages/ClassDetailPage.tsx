import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useToast } from '../../../shared/hooks/useToast';
import { Modal } from '../../../shared/ui/Modal';
import { TeacherNav } from '../components/TeacherNav';
import { api } from '../../../services/api';

interface ClassData {
  id: string;
  name: string;
  subject: string;
  code: string;
  students: number;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

interface Update {
  id: string;
  message: string;
  createdAt: string;
}

export const ClassDetailPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { classId } = useParams();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', fileName: '' });
  const [newUpdate, setNewUpdate] = useState('');
  const [activeTab, setActiveTab] = useState<'notes' | 'updates' | 'tests'>('notes');

  useEffect(() => {
    setClassData({ id: classId || 'class-1', name: 'Mathematics - Section A', subject: 'Mathematics', code: 'CLS-MA123', students: 25, createdAt: new Date().toISOString() });
    api.teacher.listNotes(classId || 'class-1').then((data) => setNotes(data.map((note) => ({ id: note.legacyId ?? note._id, title: note.title, content: note.content, fileName: note.fileName, createdAt: note.createdAt }))));
    api.teacher.listUpdates(classId || 'class-1').then((data) => setUpdates(data.map((update) => ({ id: update.legacyId ?? update._id, message: update.message, createdAt: update.createdAt }))));
  }, [classId]);

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      fileName: newNote.fileName || undefined,
      createdAt: new Date().toISOString(),
    };

    api.teacher.addNote(classId || 'class-1', newNote.title, newNote.content, newNote.fileName || undefined).then(() => setNotes([note, ...notes]));
    setShowNoteModal(false);
    setNewNote({ title: '', content: '', fileName: '' });
    toast.success('Note added successfully!');
  };

  const handleAddUpdate = () => {
    if (!newUpdate.trim()) {
      toast.error('Please enter an update message');
      return;
    }

    const update: Update = {
      id: Date.now().toString(),
      message: newUpdate,
      createdAt: new Date().toISOString(),
    };

    api.teacher.addUpdate(classId || 'class-1', newUpdate).then(() => setUpdates([update, ...updates]));
    setShowUpdateModal(false);
    setNewUpdate('');
    toast.success('Update posted successfully!');
  };

  const deleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      toast.success('Note deleted');
    }
  };

  const deleteUpdate = (id: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      const updatedUpdates = updates.filter(u => u.id !== id);
      setUpdates(updatedUpdates);
      toast.success('Update deleted');
    }
  };

  const copyClassCode = () => {
    if (classData) {
      navigator.clipboard.writeText(classData.code);
      toast.success('Class code copied to clipboard!');
    }
  };

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No class data available.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Left Navigation */}
      <TeacherNav />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">{classData.name}</h1>
            <p className="text-gray-600">{classData.subject}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/teacher/classes')}>
            ← Back to Classes
          </Button>
        </div>
      </motion.div>

      {/* Class Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Class Code</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-mono font-bold text-primary">{classData.code}</p>
                <button
                  onClick={copyClassCode}
                  className="text-secondary hover:text-primary transition-smooth"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Students</p>
              <p className="text-2xl font-bold text-primary">{classData.students}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Students
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'notes'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            📚 Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'updates'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            📢 Updates ({updates.length})
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'tests'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            🧪 Tests
          </button>
        </div>
      </Card>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Study Notes</h2>
            <Button variant="primary" onClick={() => setShowNoteModal(true)}>
              + Add Note
            </Button>
          </div>

          {notes.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-primary mb-2">No Notes Yet</h3>
              <p className="text-gray-600 mb-6">Share study materials with your students</p>
              <Button variant="primary" onClick={() => setShowNoteModal(true)}>
                + Add First Note
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-2">{note.title}</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                    {note.fileName && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📎</span>
                          <span className="text-sm font-medium text-primary">{note.fileName}</span>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 text-xs text-gray-500">
                      Posted {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Class Updates</h2>
            <Button variant="primary" onClick={() => setShowUpdateModal(true)}>
              + Post Update
            </Button>
          </div>

          {updates.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-primary mb-2">No Updates Yet</h3>
              <p className="text-gray-600 mb-6">Post announcements and updates for your class</p>
              <Button variant="primary" onClick={() => setShowUpdateModal(true)}>
                + Post First Update
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-800">{update.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(update.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUpdate(update.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Assigned Tests</h2>
            <Button variant="primary" onClick={() => navigate('/teacher/create-test')}>
              + Create Test
            </Button>
          </div>

          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-xl font-bold text-primary mb-2">Tests for this class</h3>
            <p className="text-gray-600 mb-6">
              Create tests and assign them to this class from the Create Test page
            </p>
            <Button variant="primary" onClick={() => navigate('/teacher/create-test')}>
              Create Test
            </Button>
          </Card>
        </div>
      )}

      {/* Add Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Study Note"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g., Chapter 5 - Quadratic Equations"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Content
            </label>
            <textarea
              placeholder="Enter note content, formulas, key points..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              rows={6}
            />
          </div>
          <Input
            label="Attachment Name (Optional)"
            placeholder="e.g., chapter5_notes.pdf"
            value={newNote.fileName}
            onChange={(e) => setNewNote({ ...newNote, fileName: e.target.value })}
          />
          <p className="text-xs text-gray-500">
            💡 In a real app, you would upload actual files. For now, just enter the file name.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddNote}>
              Add Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Update Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Post Class Update"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Update Message
            </label>
            <textarea
              placeholder="e.g., Test scheduled for next Monday. Please prepare chapters 1-5."
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              rows={4}
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUpdate}>
              Post Update
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default ClassDetailPage;
