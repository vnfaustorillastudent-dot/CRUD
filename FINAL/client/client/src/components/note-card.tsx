import { Note } from '@/lib/store';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Image as ImageIcon, Video as VideoIcon, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function NoteCard({ note, onEdit, onDelete, readOnly = false }: NoteCardProps) {
  const hasMedia = note.media.length > 0;
  const firstImage = note.media.find(m => m.type === 'image');
  const mediaCount = note.media.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="break-inside-avoid mb-4"
    >
      <Card className="group hover:shadow-md transition-shadow duration-300 border-border/60 bg-card/50 overflow-hidden relative">
        {note.sharedBy && (
          <div className="absolute top-3 right-3 z-10">
             <Tooltip>
               <TooltipTrigger>
                 <Avatar className="w-6 h-6 border border-background shadow-sm">
                   <AvatarImage src={note.sharedByAvatar} />
                   <AvatarFallback>{note.sharedBy[0]}</AvatarFallback>
                 </Avatar>
               </TooltipTrigger>
               <TooltipContent>
                 <p className="text-xs">Shared by {note.sharedBy}</p>
               </TooltipContent>
             </Tooltip>
          </div>
        )}

        {firstImage && (
          <div className="h-40 w-full overflow-hidden relative">
            <img 
              src={firstImage.url} 
              alt={note.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {mediaCount > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                +{mediaCount - 1}
              </div>
            )}
          </div>
        )}
        
        <CardHeader className={`p-4 ${firstImage ? 'pt-4' : ''}`}>
          <h3 className="font-semibold text-lg leading-tight tracking-tight pr-6">{note.title || "Untitled Note"}</h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-sm line-clamp-3 whitespace-pre-line">
            {note.content}
          </p>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            {note.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
            {note.sharedBy && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" /> Shared
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-muted-foreground">
          <div className="flex items-center text-xs gap-1">
            <Calendar className="w-3 h-3" />
            {format(note.updatedAt, 'MMM d')}
          </div>
          
          {!readOnly && onEdit && onDelete && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:text-primary" 
                onClick={() => onEdit(note)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:text-destructive" 
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}