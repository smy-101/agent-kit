'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';
import { extractCodeFromPre, getTextContent } from './utils/react-node-utils';

// Dynamic imports for code splitting
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: true,
  loading: () => <div className="animate-pulse bg-code-bg rounded h-4 w-full mb-2" />
});

// Start loading plugins immediately at module level to avoid waterfall
const loadPlugins = (() => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let pluginsPromise: Promise<{
    remarkGfm: any;
    rehypeHighlight: any;
  }> | null = null;

  return () => {
    if (!pluginsPromise) {
      pluginsPromise = Promise.all([
        import('remark-gfm'),
        import('rehype-highlight')
      ]).then(([remarkGfm, rehypeHighlight]) => ({
        remarkGfm: remarkGfm.default,
        rehypeHighlight: rehypeHighlight.default
      }));
    }
    return pluginsPromise;
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
})();

type Props = {
  content: string;
};

// Configure DOMPurify for markdown content
const purifyConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'a', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div'],
  ALLOWED_ATTR: ['href', 'class', 'rel', 'target', 'aria-label', 'role', 'aria-live'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
  FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick']
};

export function MarkdownRenderer({ content }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [plugins, setPlugins] = useState<Awaited<ReturnType<typeof loadPlugins>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load plugins immediately on mount
  useEffect(() => {
    loadPlugins().then((loadedPlugins) => {
      setPlugins(loadedPlugins);
      setIsLoading(false);
    });
  }, []);

  // Memoize sanitized content
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, purifyConfig);
  }, [content]);

  const handleCopyCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setCopyStatus('success');
    } catch (error) {
      console.error('Failed to copy code:', error);
      setCopyStatus('error');
    }
  }, []);

  useEffect(() => {
    if (copyStatus === 'success' || copyStatus === 'error') {
      const timeoutId = setTimeout(() => {
        setCopiedCode(null);
        setCopyStatus('idle');
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [copyStatus]);

  if (isLoading || !plugins) {
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
            const codeString = extractCodeFromPre(children);

            return (
              <div className="relative group">
                <pre className="relative">{children}</pre>
                <button
                  onClick={() => handleCopyCode(codeString)}
                  aria-label={`Copy code to clipboard${copyStatus === 'success' ? ' - copied' : ''}`}
                  aria-describedby="copy-status"
                  className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium bg-accent text-background focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  {copiedCode === codeString ? 'Copied!' : 'Copy'}
                </button>
                <span
                  id="copy-status"
                  role="status"
                  aria-live="polite"
                  className="sr-only"
                >
                  {copyStatus === 'success' ? 'Code copied to clipboard' : copyStatus === 'error' ? 'Failed to copy code' : ''}
                </span>
              </div>
            );
          },
          code({ className, children, ...props }: { className?: string; children?: React.ReactNode }) {
            const content = getTextContent(children);

            return (
              <code className={className} {...props}>
                {content}
              </code>
            );
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}
