'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';
import type { UIMessage } from '@ai-sdk/react';

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollRef}>
      <div className="max-w-3xl mx-auto py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <h1 className="text-3xl font-semibold mb-2">How can I help you today?</h1>
            <p className="text-muted-foreground">Start a conversation with me.</p>
          </div>
        ) : (
          messages.map((message) => {
            // Extract tool calls from the message
            const toolCalls = message.parts
              .filter((part): part is Extract<typeof part, { type: string }> =>
                part.type.startsWith('tool-')
              )
              .map((part) => {
                const toolName = part.type.replace('tool-', '');
                return {
                  toolName,
                  toolCallId: `tool-${message.id}-${toolName}`,
                  args: (part as any).args || (part as any).toolArgs || {},
                  result: (part as any).result,
                };
              });

            // Extract text content
            const textParts = message.parts
              .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
              .map((part) => part.text)
              .join('\n');

            return (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={textParts}
                toolCalls={toolCalls.length > 0 ? toolCalls : undefined}
              />
            );
          })
        )}

        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
