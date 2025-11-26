import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

// Types
export type Note = {
  id: string;
  title: string;
  content: string;
  media: { type: 'image' | 'video', url: string }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  sharedBy?: string;
  sharedByAvatar?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

interface StoreContextType {
  user: User | null;
  notes: Note[];
  sharedNotes: Note[];
  login: (email: string) => Promise<void>;
  logout: () => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Mock Data
const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Ideas 2025',
    content: '1. AI-powered plant waterer\n2. Social network for hamsters\n3. VR meditation app',
    media: [],
    tags: ['ideas', 'work'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Grocery List',
    content: 'Milk, Eggs, Bread, Avocados (if ripe), Hot sauce',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['personal'],
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Meeting Notes: Design Sync',
    content: 'We need to update the color palette to be more "gen-z friendly". More gradients, less borders.',
    media: [],
    tags: ['work', 'meeting'],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: '4',
    title: 'Recipe: Spicy Pasta',
    content: 'Boil water. Add salt. Cook pasta. Mix with chili oil and garlic. Top with parmesan.',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['food'],
    createdAt: new Date(Date.now() - 200000000),
    updatedAt: new Date(Date.now() - 200000000),
  }
];

const MOCK_SHARED_NOTES: Note[] = [
  {
    id: 's1',
    title: 'Q3 Roadmap',
    content: 'Focus on performance improvements and new user onboarding flows.',
    media: [],
    tags: ['work', 'roadmap'],
    createdAt: new Date(Date.now() - 400000000),
    updatedAt: new Date(Date.now() - 400000000),
    sharedBy: 'Sarah Chen',
    sharedByAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 's2',
    title: 'Vacation Plan: Japan',
    content: 'Kyoto itinerary:\n- Fushimi Inari\n- Bamboo Forest\n- Kinkaku-ji',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000' }],
    tags: ['travel', 'shared'],
    createdAt: new Date(Date.now() - 500000000),
    updatedAt: new Date(Date.now() - 500000000),
    sharedBy: 'Mike Ross',
    sharedByAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  }
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [sharedNotes, setSharedNotes] = useState<Note[]>(MOCK_SHARED_NOTES);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate initial auth check
  useEffect(() => {
    setTimeout(() => {
      // Check local storage or just default to not logged in for demo
      const savedUser = localStorage.getItem('mock_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: 'user_123',
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setIsLoading(false);
    toast({
      title: "Welcome back!",
      description: "Successfully signed in via Supabase Auth (Mock).",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
    toast({
      title: "Signed out",
      description: "See you next time!",
    });
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    toast({ title: "Note created" });
  };

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...noteData, updatedAt: new Date() } : n));
    toast({ title: "Note updated" });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    toast({ 
      title: "Note deleted", 
      variant: "destructive" 
    });
  };

  return (
    <StoreContext.Provider value={{ user, notes, sharedNotes, login, logout, addNote, updateNote, deleteNote, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}