'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from '@ai-sdk/react';
import { MessageBubble } from './MessageBubble';

type Props = {
  messages: UIMessage[];
};

export function MessageList({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <h1 className="text-5xl font-semibold mb-4 font-serif text-accent">
              Welcome
            </h1>
            <p className="text-lg text-foreground/70">
              Ask me anything. I respond with beautifully formatted markdown.
            </p>
          </div>
        ) : (
          messages.map(message => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
