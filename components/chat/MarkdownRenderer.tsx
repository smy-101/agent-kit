'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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
          pre({ children }: { children?: React.ReactNode }) {
            // Extract text content from code block
            const extractCodeFromPre = (node: React.ReactNode): string => {
              if (typeof node === 'string') return node;
              if (Array.isArray(node)) return node.map(extractCodeFromPre).join('');
              if (node && typeof node === 'object' && 'props' in node) {
                const element = node as React.ReactElement & { props?: { children?: React.ReactNode } };
                // If it's a code element, extract its children
                if (element.type === 'code') {
                  return extractCodeFromPre(element.props?.children || '');
                }
                return extractCodeFromPre(element.props?.children || '');
              }
              return '';
            };

            const codeString = extractCodeFromPre(children);

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
          code({ className, children, ...props }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            // Extract text content safely from React nodes
            const getCodeContent = (node: React.ReactNode): string => {
              if (typeof node === 'string') return node;
              if (typeof node === 'number') return String(node);
              if (Array.isArray(node)) return node.map(getCodeContent).join('');
              if (node && typeof node === 'object' && 'props' in node) {
                const element = node as React.ReactElement & { props?: { children?: React.ReactNode } };
                return getCodeContent(element.props?.children);
              }
              return '';
            };

            const content = getCodeContent(children);

            return (
              <code className={className} {...props}>
                {content}
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
