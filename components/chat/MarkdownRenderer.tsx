'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';

// Dynamic imports for code splitting
const ReactMarkdown = dynamic(() => import('react-markdown'), { 
  ssr: true,
  loading: () => <div className="animate-pulse bg-code-bg rounded h-4 w-full mb-2" />
});

const loadPlugins = async () => {
  const [remarkGfm, rehypeHighlight] = await Promise.all([
    import('remark-gfm'),
    import('rehype-highlight')
  ]);
  return { 
    remarkGfm: remarkGfm.default, 
    rehypeHighlight: rehypeHighlight.default 
  };
};

type Props = {
  content: string;
};

export function MarkdownRenderer({ content }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [plugins, setPlugins] = useState<Awaited<ReturnType<typeof loadPlugins>> | null>(null);

  // Load plugins only when needed
  useEffect(() => {
    loadPlugins().then(setPlugins);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopiedCode(null);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [copiedCode]);

  if (!plugins) {
    return (
      <div className="markdown-content">
        <div className="animate-pulse bg-code-bg rounded h-4 w-full mb-2" />
        <div className="animate-pulse bg-code-bg rounded h-4 w-3/4 mb-2" />
        <div className="animate-pulse bg-code-bg rounded h-4 w-1/2" />
      </div>
    );
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[plugins.remarkGfm]}
        rehypePlugins={[plugins.rehypeHighlight]}
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
                  aria-live="polite"
                  aria-label={copiedCode === codeString ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                  className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium bg-accent text-background"
                >
                  {copiedCode === codeString ? 'Copied!' : 'Copy'}
                </button>
              </div>
            );
          },
          code: ({ className, children }) => {
            const content = typeof children === 'string' ? children : String(children);
            const sanitizedContent = DOMPurify.sanitize(content, {
              ALLOWED_TAGS: [],
              ALLOWED_ATTR: []
            });
            
            return (
              <code 
                className={className}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
