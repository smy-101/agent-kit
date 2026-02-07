# Agent Kit - Agent Guidelines

This file contains essential information for agentic coding assistants working in this repository.

## Project Overview

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4
- **AI SDK**: Vercel AI SDK (@ai-sdk/react, @ai-sdk/openai) for chat with tool calling
- **Validation**: Zod v4 for schema validation
- **Runtime**: API routes use Node.js runtime for stability

## Commands

### Development
```bash
pnpm dev          # Start dev server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
```

### Code Quality
```bash
pnpm lint         # Run ESLint (no fix - use editor for auto-fix)
```

### Testing
No test framework is currently configured. When adding tests, follow these patterns:
- Use Vitest for unit tests (matches Next.js/TS ecosystem)
- Use Playwright for E2E tests
- Place tests adjacent to source files: `__tests__/` directory or `*.test.ts` suffix

## Code Style Guidelines

### Imports
1. **Order**: External packages → Internal modules → Type imports
   ```ts
   import { useChat } from '@ai-sdk/react';
   import { useState } from 'react';
   import type { Metadata } from 'next';
   import { myLocalUtil } from '@/lib/utils';
   ```
2. Use `import type` for type-only imports to enable tree-shaking
3. Use `@/*` path alias for all internal imports (configured in tsconfig.json)

### Component Structure
1. **Directives**: Place `'use client';` on the first line for client components
2. **Exports**: Use default exports for pages and main components
   ```ts
   export default function ComponentName() { ... }
   ```
3. **Props**: Define prop types inline with TypeScript types
   ```ts
   type Props = { name: string };
   export function Component({ name }: Props) { ... }
   ```

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `ChatInterface`)
- **Functions**: camelCase (`sendMessage`, `convertToModelMessages`)
- **Constants**: UPPER_SNAKE_CASE for truly immutable globals, camelCase for module-level constants
- **Types/Interfaces**: PascalCase, prefer `type` over `interface` except for extending
- **Files**: lowercase with hyphens for utilities, PascalCase for components if not co-located

### TypeScript Patterns
1. **Explicit returns**: Use explicit return types for public functions
   ```ts
   async function POST(req: Request): Promise<Response> { ... }
   ```
2. **Destructuring**: Use object destructuring for props and parameters
   ```ts
   const { messages, sendMessage } = useChat();
   execute: async ({ location, temperature }) => { ... }
   ```
3. **Const by default**: Use `const` unless reassignment is needed

### Error Handling
1. API routes should return appropriate Response objects with status codes
2. Use try-catch for async operations, especially external API calls
3. Tool functions should handle errors gracefully and return error objects

### Styling (Tailwind CSS v4)
1. Use `@theme inline` for custom CSS variables in globals.css
2. Support dark mode using `dark:` prefix and media queries
3. Avoid arbitrary values when Tailwind utilities exist
   ```tsx
   className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 border rounded"
   ```

### API Routes
1. Set `export const runtime = "nodejs";` for third-party API compatibility
2. Always validate request bodies with Zod schemas
3. Use `streamText` from AI SDK for streaming responses
4. Tool definitions use Zod for input validation:
   ```ts
   weather: tool({
     description: 'Get the weather in a location',
     inputSchema: z.object({
       location: z.string().describe('The location'),
     }),
     execute: async ({ location }) => { ... }
   })
   ```

### Environment Variables
- Use `.env.local` for local development (gitignored)
- Reference with `process.env.VAR_NAME`
- Define types in `.env.local.example` for documentation

## Key Patterns in This Codebase

### Chat Implementation
- Client uses `useChat` hook from `@ai-sdk/react`
- Server route streams responses using `streamText` and `toUIMessageStreamResponse()`
- Tools are defined server-side and called by the AI model
- Messages use `UIMessage` type from AI SDK

### State Management
- Use React hooks (`useState`) for local component state
- For global state, React Context is preferred (no Redux/Zustand currently)

### File Organization
```
app/
  api/          # API routes
  chat/         # Chat-specific pages (planned)
components/
  chat/         # Reusable chat components
lib/            # Utility functions (currently empty)
types/          # Shared type definitions (currently empty)
```

## Before Committing

1. Run `pnpm lint` and fix any errors
2. Test manually in dev server (`pnpm dev`)
3. Ensure environment variables are set appropriately
4. Check that all imports use `@/` alias for internal modules
