'use client';

import { useCallback, useRef, useEffect, startTransition } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageList } from './MessageList';
import { ChatInput, ChatInputRef } from './ChatInput';

export function ChatContainer() {
  const { messages, sendMessage, setMessages, status, stop, regenerate } = useChat();
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

  const regenerateRef = useRef(regenerate);
  useEffect(() => {
    regenerateRef.current = regenerate;
  }, [regenerate]);

  const handleRetry = useCallback((_messageId: string) => {
    regenerateRef.current();
  }, []);

  const isGenerating = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold font-serif">
            AI Chat
          </h1>
        </div>
      </header>

      <MessageList messages={messages} onRetry={handleRetry} />

      <ChatInput 
        onSubmit={handleSubmit} 
        onNewChat={handleNewChat} 
        status={status}
        onStop={stop}
        isGenerating={isGenerating}
        ref={inputRef} 
      />
    </div>
  );
}
