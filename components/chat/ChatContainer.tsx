'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageList } from './MessageList';
import { ChatInput, ChatInputRef } from './ChatInput';

export function ChatContainer() {
  const { messages, sendMessage, setMessages } = useChat();
  const inputRef = useRef<ChatInputRef>(null);
  const [isPending, startTransition] = useTransition();
  const [contextEnabled, setContextEnabled] = useState(true);

  const handleSubmit = useCallback((text: string) => {
    if (contextEnabled) {
      sendMessage({ text });
    } else {
      startTransition(() => {
        const systemMessages = messages.filter(m => m.role === 'system');
        setMessages(systemMessages);
      });
      sendMessage({ text });
    }
  }, [sendMessage, contextEnabled, messages, setMessages]);

  const handleNewTopic = useCallback(() => {
    startTransition(() => {
      setMessages([]);
    });
    inputRef.current?.focus();
  }, [setMessages]);

  const toggleContext = useCallback(() => {
    setContextEnabled(prev => !prev);
  }, []);

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

      <ChatInput 
        onSubmit={handleSubmit} 
        ref={inputRef}
        contextEnabled={contextEnabled}
        onToggleContext={toggleContext}
        onNewTopic={handleNewTopic}
        isClearing={isPending}
      />
    </div>
  );
}
