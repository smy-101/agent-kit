'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageContent } from './message-content';
import { Badge } from '@/components/ui/badge';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  toolCalls?: Array<{
    toolName: string;
    toolCallId: string;
    args: unknown;
    result?: unknown;
  }>;
}

export function ChatMessage({ role, content, toolCalls }: ChatMessageProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return null;
  }

  return (
    <div
      className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={
            isUser
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex-1 max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-50 dark:bg-blue-950/50 text-foreground'
            : 'bg-neutral-100 dark:bg-neutral-900/50 text-foreground'
        }`}
      >
        {content && <MessageContent content={content} />}

        {toolCalls && toolCalls.length > 0 && (
          <div className="mt-3 space-y-2">
            {toolCalls.map((toolCall, index) => (
              <div key={index} className="border border-border rounded-lg p-3 bg-muted/50">
                <Badge variant="secondary" className="mb-2">
                  {toolCall.toolName}
                </Badge>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(toolCall.args, null, 2)}
                </pre>
                {toolCall.result !== undefined && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Result:</p>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(toolCall.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
