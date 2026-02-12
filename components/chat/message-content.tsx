'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { node, className, children, ...rest } = props;
            // Determine if inline by checking if there's a language class
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !language && !className;

            return !isInline && language ? (
              <div className="relative group">
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={language}
                  PreTag="div"
                  className="syntax-highlighter"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
                <button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted px-2 py-1 rounded text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(String(children));
                  }}
                >
                  Copy
                </button>
              </div>
            ) : (
              <code className={className} {...rest}>
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
