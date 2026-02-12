'use client';

export function TypingIndicator() {
  return (
    <div className="flex gap-4 mb-6">
      <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
        <div className="flex gap-1">
          <span
            className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
      <div className="flex-1 max-w-[80%] rounded-2xl px-4 py-3 bg-neutral-100 dark:bg-neutral-900/50">
        <p className="text-sm text-muted-foreground">Thinking...</p>
      </div>
    </div>
  );
}
