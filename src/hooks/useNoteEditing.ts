import { useState, useEffect, useRef } from 'react';

interface UseNoteEditingProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

export const useNoteEditing = ({ initialContent, onContentChange }: UseNoteEditingProps) => {
  const [localContent, setLocalContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local content when external content changes (from other users)
  useEffect(() => {
    setLocalContent(initialContent);
  }, [initialContent]);

  const startEditing = () => {
    if (!isEditing) {
      setIsEditing(true);
      // Use setTimeout to ensure the textarea is rendered before selecting
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 0);
    }
  };

  const stopEditing = () => {
    setIsEditing(false);
    // Only commit if content actually changed
    if (localContent !== initialContent) {
      onContentChange(localContent);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  return {
    localContent,
    setLocalContent,
    isEditing,
    textareaRef,
    startEditing,
    stopEditing,
    handleKeyDown,
  };
};