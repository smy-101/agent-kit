'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';

type Props = {
  onSubmit: (text: string) => void;
};

export function ChatInput({ onSubmit }: Props) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [input, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = newHeight >= 200 ? 'auto' : 'hidden';
      }
    };
    adjustHeight();
  }, [input]);

  return (
    <div className="border-t border-border bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="w-full resize-none rounded-2xl border border-border bg-code-bg px-5 py-4 pr-14 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 transition-all duration-200"
            style={{ minHeight: '56px', maxHeight: '200px', fontFamily: 'var(--font-inter)' }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
              input.trim() ? 'bg-accent text-background' : 'bg-border text-background'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-xs text-center mt-2 text-foreground/50">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
