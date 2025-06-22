
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange, disabled = false }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+Enter to execute (passed up through a custom event)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      // Dispatch custom event that parent can listen to
      const executeEvent = new CustomEvent('executeQuery');
      document.dispatchEvent(executeEvent);
    }
    
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Enter your SQL query here..."
        className="min-h-[200px] font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:text-gray-100 dark:placeholder-gray-400 resize-none"
        style={{
          lineHeight: '1.5',
          tabSize: 2
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Use Ctrl+Enter to execute</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
};

export default QueryEditor;
