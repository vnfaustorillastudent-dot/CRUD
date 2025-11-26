import { useState, useEffect } from 'react';
import { useStore, Note } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Video, X, Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteToEdit?: Note | null;
}

export function NoteEditor({ open, onOpenChange, noteToEdit }: NoteEditorProps) {
  const { addNote, updateNote } = useStore();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ type: 'image' | 'video', url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setMedia(noteToEdit.media);
      } else {
        setTitle('');
        setContent('');
        setMedia([]);
      }
    }
  }, [open, noteToEdit]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    if (noteToEdit) {
      updateNote(noteToEdit.id, { title, content, media });
    } else {
      addNote({ title, content, media, tags: [] });
    }
    onOpenChange(false);
  };

  const handleFileUpload = (type: 'image' | 'video') => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const mockUrl = type === 'image' 
        ? `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500&random=${Date.now()}`
        : 'https://media.w3.org/2010/05/sintel/trailer_400p.mp4'; // Sample video
      
      setMedia(prev => [...prev, { type, url: mockUrl }]);
      setIsUploading(false);
      toast({
        title: "Upload Complete",
        description: `Mock ${type} uploaded to Supabase Storage`,
      });
    }, 1500);
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>{noteToEdit ? 'Edit Note' : 'Create Note'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Start typing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none border-none shadow-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50 font-sans"
            />
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {media.map((item, i) => (
                <div key={i} className="relative group rounded-md overflow-hidden border border-border">
                  {item.type === 'image' ? (
                    <img src={item.url} alt="attachment" className="w-full h-32 object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-32 object-cover bg-black" />
                  )}
                  <button 
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/50">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFileUpload('image')}
              disabled={isUploading}
              className="text-muted-foreground hover:text-primary"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
              Add Image
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFileUpload('video')}
              disabled={isUploading}
              className="text-muted-foreground hover:text-primary"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4 mr-2" />}
              Add Video
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title && !content}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}