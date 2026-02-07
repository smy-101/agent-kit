'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useState } from 'react';

type Props = {
  content: string;
};

export function MarkdownRenderer({ content }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => {
            const codeString = typeof children === 'string' 
              ? children 
              : React.Children.toArray(children).join('');
            
            return (
              <div className="relative group">
                <pre className="relative">{children}</pre>
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium bg-accent text-background"
                >
                  {copiedCode === codeString ? 'Copied!' : 'Copy'}
                </button>
              </div>
            );
          },
          code: ({ className, children }) => {
            return (
              <code className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
