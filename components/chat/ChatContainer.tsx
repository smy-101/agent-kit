'use client';

import { useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatContainer() {
  const { messages, sendMessage } = useChat();

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ text });
  }, [sendMessage]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold font-serif">
            AI Chat
          </h1>
        </div>
      </header>

      <MessageList messages={messages} />

      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}
