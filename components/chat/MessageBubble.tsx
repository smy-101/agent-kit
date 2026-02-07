'use client';

import { memo } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { UIMessage } from '@ai-sdk/react';

type Props = {
  message: UIMessage;
};

export const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
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
    </div>
  );
});
