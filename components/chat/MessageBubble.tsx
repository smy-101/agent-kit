'use client';

import { memo } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { UIMessage } from '@ai-sdk/react';

type Props = {
  message: UIMessage;
};

export const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div 
      role="article"
      aria-label={`${isSystem ? 'System message' : isUser ? 'Your message' : 'AI response'}`}
      className={`flex ${isSystem ? 'justify-center' : isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {isSystem ? (
        <div className="max-w-[85%] rounded-xl px-5 py-3 border shadow-sm bg-system-bubble text-system-text border-system-border">
          {message.parts.map((part, i) => {
            if (part.type === 'text') {
              return (
                <div key={`${message.id}-${i}`} className="prose prose-sm max-w-none">
                  <p className="text-sm font-medium">{part.text}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
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
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id && 
         prevProps.message.role === nextProps.message.role;
});
