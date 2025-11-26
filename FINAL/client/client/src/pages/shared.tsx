import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { Layout } from '@/components/layout';
import { NoteCard } from '@/components/note-card';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function SharedPage() {
  const [_, setLocation] = useLocation();
  const { user, sharedNotes, isLoading } = useStore();
  const [search, setSearch] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return null;

  const filteredNotes = sharedNotes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
    (note.sharedBy && note.sharedBy.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tight flex items-center gap-2">
              <Users className="w-8 h-8 text-muted-foreground" />
              Shared with Me
            </h2>
            <p className="text-muted-foreground">
              Notes shared by your team and friends
            </p>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shared notes..."
              className="pl-9 bg-card border-border/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/10">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <Users className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No shared notes</h3>
            <p className="max-w-sm mt-1">
              When someone shares a note with you, it will appear here.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  readOnly={true}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}