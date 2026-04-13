import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { Input } from '../../../shared/ui/Input';
import { Modal } from '../../../shared/ui/Modal';
import { useToast } from '../../../shared/hooks/useToast';
import { TeacherNav } from '../components/TeacherNav';

interface Note {
  id: string;
  title: string;
  content: string;
  classId: string;
  className: string;
  date: string;
  type: 'note' | 'update' | 'announcement';
  priority: 'high' | 'medium' | 'low';
  attachments?: string[];
}

export const NotesPage = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'note' | 'update' | 'announcement'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    classId: '',
    type: 'note' as 'note' | 'update' | 'announcement',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  useEffect(() => {
    setClasses([]);
    setNotes([]);
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || note.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenCreate = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      classId: '',
      type: 'note',
      priority: 'medium',
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      classId: note.classId,
      type: note.type,
      priority: note.priority,
    });
    setShowCreateModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId) {
      toast.error('Please select a class');
      return;
    }

    const selectedClass = classes.find(c => c.id === formData.classId);
    
    if (editingNote) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? {
              ...note,
              ...formData,
              className: selectedClass?.name || 'Unknown Class',
            }
          : note
      );
      setNotes(updatedNotes);
      toast.success('Note updated successfully!');
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...formData,
        className: selectedClass?.name || 'Unknown Class',
        date: new Date().toISOString().split('T')[0],
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      toast.success('Note created successfully!');
    }
    
    setShowCreateModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      toast.success('Note deleted successfully!');
    }
  };

  const handleShare = (note: Note) => {
    // In a real app, this would send notifications to students
    toast.success(`Shared with ${note.className}!`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return '📝';
      case 'update': return '🔔';
      case 'announcement': return '📢';
      default: return '📌';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'note': return <Badge variant="primary">Note</Badge>;
      case 'update': return <Badge variant="success">Update</Badge>;
      case 'announcement': return <Badge variant="warning">Announcement</Badge>;
      default: return <Badge variant="default">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="danger" size="sm">High Priority</Badge>;
      case 'medium': return <Badge variant="warning" size="sm">Medium</Badge>;
      case 'low': return <Badge variant="default" size="sm">Low</Badge>;
      default: return null;
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-1 sm:mb-2">
                📝 Notes & Updates
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Share notes, updates, and announcements with your classes</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              + Create New
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search notes, updates, or announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={filterType === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'note' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('note')}
              >
                📝 Notes
              </Button>
              <Button
                variant={filterType === 'update' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('update')}
              >
                🔔 Updates
              </Button>
              <Button
                variant={filterType === 'announcement' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('announcement')}
              >
                📢 Announcements
              </Button>
            </div>
          </div>
        </Card>

        {/* Notes List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="cursor-pointer">
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl flex-shrink-0">{getTypeIcon(note.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-primary mb-1">{note.title}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {getTypeBadge(note.type)}
                          {getPriorityBadge(note.priority)}
                          <span className="text-xs text-gray-500">{note.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2">{note.content}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-200">
                      <Badge variant="secondary" size="sm">📚 {note.className}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(note)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShare(note)}>
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(note.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-lg text-gray-600 mb-2">No notes or updates found</p>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first note to share with your classes'}
            </p>
            <Button variant="primary" onClick={handleOpenCreate}>
              Create Your First Note
            </Button>
          </Card>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingNote ? 'Edit Note/Update' : 'Create New Note/Update'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class <span className="text-red-500">*</span>
              </label>
              {classes.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">No classes available</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => window.location.href = '/teacher/classes'}
                  >
                    Create a Class First
                  </Button>
                </div>
              ) : (
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="">Choose a class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subject}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'note' })}
                  className={`px-3 py-2 rounded-lg border-2 transition-smooth text-sm ${
                    formData.type === 'note'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  📝 Note
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'update' })}
                  className={`px-3 py-2 rounded-lg border-2 transition-smooth text-sm ${
                    formData.type === 'update'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  🔔 Update
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'announcement' })}
                  className={`px-3 py-2 rounded-lg border-2 transition-smooth text-sm ${
                    formData.type === 'announcement'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  📢 Announcement
                </button>
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'low' })}
                  className={`px-3 py-2 rounded-lg border-2 transition-smooth text-sm ${
                    formData.priority === 'low'
                      ? 'border-gray-500 bg-gray-50 text-gray-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'medium' })}
                  className={`px-3 py-2 rounded-lg border-2 transition-smooth text-sm ${
                    formData.priority === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'high' })}
                  className={`px-3 py-2 rounded-lg border-2 transition-smooth text-sm ${
                    formData.priority === 'high'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  High
                </button>
              </div>
            </div>

            {/* Title */}
            <Input
              label="Title"
              placeholder="Enter a clear title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note, update, or announcement here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                rows={6}
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingNote ? 'Update' : 'Create'} & Share
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default NotesPage;
