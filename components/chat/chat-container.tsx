'use client';

import { useChat } from '@ai-sdk/react';
import { ChatMessageList } from './chat-message-list';
import { ChatInput } from './chat-input';
import { DefaultChatTransport } from 'ai';

interface ChatContainerProps {
  apiRoute: string;
}

export function ChatContainer({ apiRoute }: ChatContainerProps) {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: apiRoute,
    }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-full">
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        onSend={handleSend}
        onStop={stop}
        isLoading={isLoading}
        placeholder="Type your message..."
      />
    </div>
  );
}
