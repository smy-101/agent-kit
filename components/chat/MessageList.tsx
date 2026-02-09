'use client';

import { useEffect, useRef, memo } from 'react';
import type { UIMessage } from '@ai-sdk/react';
import { MessageBubble } from './MessageBubble';

type Props = {
  messages: UIMessage[];
  onRetry?: (messageId: string) => void;
};

export const MessageList = memo(function MessageList({ messages, onRetry }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      role="log" 
      aria-live="polite" 
      aria-label="Chat messages"
      className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              <h1 className="relative text-6xl font-bold mb-2 font-serif bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent">
                Welcome
              </h1>
            </div>
            <p className="text-xl text-foreground/80 leading-relaxed max-w-md">
              Ask me anything. I respond with <span className="text-accent font-semibold">beautifully formatted markdown</span> and thoughtful insights.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-foreground/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Ready to assist
              </span>
              <span className="text-foreground/30">•</span>
              <span>Premium AI chat experience</span>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onRetry={message.role === 'assistant' ? onRetry : undefined}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});
