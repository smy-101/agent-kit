'use client';

import { useCallback, useRef, startTransition } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageList } from './MessageList';
import { ChatInput, ChatInputRef } from './ChatInput';

export function ChatContainer() {
  const { messages, sendMessage, setMessages } = useChat();
  const inputRef = useRef<ChatInputRef>(null);

  const handleSubmit = useCallback((text: string) => {
    sendMessage({ text });
  }, [sendMessage]);

  const handleNewChat = useCallback(() => {
    startTransition(() => {
      setMessages([]);
    });
    inputRef.current?.focus();
  }, [setMessages]);

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

      <ChatInput onSubmit={handleSubmit} onNewChat={handleNewChat} ref={inputRef} />
    </div>
  );
}
