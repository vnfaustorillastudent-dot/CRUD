import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useStore, Note } from '@/lib/store';
import { Layout } from '@/components/layout';
import { NoteCard } from '@/components/note-card';
import { NoteEditor } from '@/components/note-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [_, setLocation] = useLocation();
  const { user, notes, deleteNote, isLoading } = useStore();
  const [search, setSearch] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  // Listen for global "new note" event from sidebar
  useEffect(() => {
    const handleOpenNew = () => {
      setEditingNote(null);
      setIsEditorOpen(true);
    };
    window.addEventListener('open-new-note', handleOpenNew);
    return () => window.removeEventListener('open-new-note', handleOpenNew);
  }, []);

  if (isLoading || !user) return null;

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tight">My Notes</h2>
            <p className="text-muted-foreground">
              {notes.length} notes • Synced with Supabase
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-9 bg-card border-border/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => { setEditingNote(null); setIsEditorOpen(true); }}
              className="shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" /> New Note
            </Button>
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No notes found</h3>
            <p className="max-w-sm mt-1 mb-4">
              {search ? "Try adjusting your search terms." : "Create your first note to get started!"}
            </p>
            {!search && (
              <Button onClick={() => setIsEditorOpen(true)}>Create Note</Button>
            )}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onEdit={handleEdit}
                  onDelete={deleteNote}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <NoteEditor 
          open={isEditorOpen} 
          onOpenChange={setIsEditorOpen} 
          noteToEdit={editingNote}
        />
      </div>
    </Layout>
  );
}