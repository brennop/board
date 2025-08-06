import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NoteContentProps {
  isEditing: boolean;
  localContent: string;
  textareaRef: React.RefObject<HTMLTextAreaElement> | null;
  onContentChange: (value: string) => void;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export const NoteContent = ({ 
  isEditing, 
  localContent, 
  textareaRef, 
  onContentChange, 
  onStartEditing, 
  onStopEditing, 
  onKeyDown 
}: NoteContentProps) => {
  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        className="w-full h-full bg-transparent resize-none border-none outline-none text-sm p-1 font-mono"
        value={localContent}
        placeholder="Type your note..."
        onChange={(event) => onContentChange(event.target.value)}
        onBlur={onStopEditing}
        onKeyDown={onKeyDown}
      />
    );
  }

  return (
    <div
      className="w-full h-full cursor-auto overflow-auto prose prose-sm prose-serif max-w-none pt-0 p-2 font-serif"
      onDoubleClick={onStartEditing}
    >
      {localContent.trim() ? (
        <Markdown remarkPlugins={[remarkGfm]}>{localContent}</Markdown>
      ) : (
        <span className="text-gray-400">Double click to edit...</span>
      )}
    </div>
  );
};
