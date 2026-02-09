'use client';

import { memo, useCallback } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RotateCw } from 'lucide-react';
import type { UIMessage } from '@ai-sdk/react';

type Props = {
  message: UIMessage;
  onRetry?: (messageId: string) => void;
  regeneratingMessageId?: string | null;
};

export const MessageBubble = memo(function MessageBubble({ 
  message, 
  onRetry, 
  regeneratingMessageId
}: Props) {
  const isUser = message.role === 'user';
  const isRetrying = regeneratingMessageId === message.id;

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry(message.id);
    }
  }, [onRetry, message.id]);

  return (
    <div
      role="article"
      aria-label={`${isUser ? 'Your message' : 'AI response'}`}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out`}
    >
      <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${
        isUser
          ? 'bg-user-bubble text-user-text'
          : 'bg-ai-bubble text-ai-text border border-border'
      }`}>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return (
                <div key={`${message.id}-${i}`} className="prose prose-sm max-w-none">
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{part.text}</p>
                  ) : (
                    <MarkdownRenderer content={part.text} />
                  )}
                </div>
              );
            case 'tool-weather':
            case 'tool-convertFahrenheitToCelsius':
              return (
                <div
                  key={`${message.id}-${i}`}
                  className="mt-2 p-4 rounded-lg bg-code-bg border border-accent"
                  role="region"
                  aria-label={part.type === 'tool-weather' ? 'Weather data' : 'Conversion result'}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2 text-accent">
                    {part.type === 'tool-weather' ? 'Weather Data' : 'Conversion Result'}
                  </div>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(part, null, 2)}
                  </pre>
                </div>
              );
            default:
              return null;
          }
        })}
        
        {!isUser && onRetry && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              aria-label="重新生成此消息"
              className="flex items-center gap-2 text-sm text-accent/70 hover:text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <RotateCw
                size={14}
                strokeWidth={2.5}
                className={`transition-transform duration-500 ${isRetrying ? 'animate-spin' : 'group-hover/btn:rotate-180'}`}
              />
              <span className="font-medium">{isRetrying ? '重新生成中...' : '重新生成'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
