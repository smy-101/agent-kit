'use client';

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Send, Plus, Square } from 'lucide-react';

export type ChatInputRef = {
  focus: () => void;
};

type Props = {
  onSubmit: (text: string) => void;
  onNewChat?: () => void;
  status?: 'submitted' | 'streaming' | 'ready' | 'error';
  onStop?: () => void;
  isGenerating?: boolean;
};

export const ChatInput = forwardRef<ChatInputRef, Props>(function ChatInput({ onSubmit, onNewChat, onStop, isGenerating = false }, ref) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus()
  }));

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const currentValue = textareaRef.current?.value.trim();
    if (currentValue) {
      onSubmit(currentValue);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        // Focus back on input after send
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
    }
  }, [onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = newHeight >= 200 ? 'auto' : 'hidden';
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  return (
    <div className="border-t border-border bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {(onNewChat !== undefined || isGenerating) && (
          <div className={`flex mb-2 ${isGenerating ? 'justify-center' : 'justify-end'}`}>
            {isGenerating ? (
              <button
                onClick={onStop}
                aria-label="停止生成"
                className="group relative flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-accent text-background text-sm font-medium shadow-lg shadow-accent/20 hover:shadow-accent/30 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none transition-all duration-200"
              >
                <span className="absolute inset-0 rounded-xl bg-accent/20 animate-ping" />
                <span className="relative flex items-center gap-2">
                  <Square size={15} strokeWidth={2.5} className="animate-pulse" />
                  <span>停止生成</span>
                </span>
              </button>
            ) : onNewChat !== undefined ? (
              <button
                onClick={onNewChat}
                aria-label="开始新对话"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-accent hover:bg-accent/10 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:outline-none transition-all duration-200 text-sm font-medium"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>新话题</span>
              </button>
            ) : null}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            aria-label="Message input"
            aria-describedby="input-help"
            rows={1}
            className="w-full resize-none rounded-2xl border border-border/60 bg-code-bg/50 backdrop-blur-sm px-5 py-4 pr-14 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 focus:bg-code-bg disabled:opacity-50 transition-all duration-300 shadow-sm hover:border-border/80"
            style={{ minHeight: '56px', maxHeight: '200px', fontFamily: 'var(--font-inter)' }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label={input.trim() ? 'Send message' : 'Cannot send empty message'}
            className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 ${
              input.trim() ? 'bg-accent text-background' : 'bg-border text-background'
            }`}
          >
            <Send size={20} />
            <span className="sr-only">Send</span>
          </button>
        </form>
        <p id="input-help" className="text-xs text-center mt-2 text-foreground/50">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
});
