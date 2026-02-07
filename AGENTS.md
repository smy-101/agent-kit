# Agent Kit - Agent Guidelines

This file contains essential information for agentic coding assistants working in this repository.

## Project Overview

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with custom theme
- **AI SDK**: Vercel AI SDK (@ai-sdk/react, @ai-sdk/openai) for chat with tool calling
- **Validation**: Zod v4 for schema validation
- **Security**: DOMPurify for XSS prevention
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
pnpm type-check   # Run TypeScript type checking
```

### Testing
No test framework is currently configured. When adding tests, follow these patterns:
- Use Vitest for unit tests (matches Next.js/TS ecosystem)
- Use Playwright for E2E tests
- Place tests adjacent to source files: `__tests__/` directory or `*.test.ts` suffix

## Design Philosophy

### Editorial Luxury Aesthetic
This application follows an **Editorial Luxury** design direction:
- **Typography**: Cormorant Garamond (serif) for headings, Inter for body, JetBrains Mono for code
- **Colors**: Muted gold/amber accent (#B45309 light, #F59E0B dark) with WCAG AA compliance
- **Spacing**: Generous whitespace, refined margins
- **Feel**: Sophisticated, elegant, magazine-like quality

**Anti-patterns to avoid:**
- Generic fonts (Inter, Roboto, Arial - use only for body text)
- Purple gradients on white (cliché AI aesthetic)
- Tight spacing or cramped layouts
- Harsh, saturated colors

## Code Style Guidelines

### Imports
1. **Order**: External packages → Internal modules → Type imports
   ```ts
   import { useChat } from '@ai-sdk/react';
   import { useState, useCallback } from 'react';
   import type { Metadata } from 'next';
   import { myLocalUtil } from '@/components/chat/ChatInput';
   ```
2. Use `import type` for type-only imports to enable tree-shaking
3. Use `@/*` path alias for all internal imports (configured in tsconfig.json)

### Component Structure
1. **Directives**: Place `'use client';` on the first line for client components
2. **Exports**: Use default exports for pages, named exports for components
   ```ts
   // pages
   export default function Chat() { ... }
   
   // components
   export function ChatContainer() { ... }
   export const MessageBubble = memo(...);
   ```
3. **Props**: Define prop types inline with TypeScript types
   ```ts
   type Props = { name: string };
   export function Component({ name }: Props) { ... }
   ```

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `ChatInterface`)
- **Functions**: camelCase (`sendMessage`, `convertToModelMessages`)
- **Constants**: UPPER_SNAKE_CASE for truly immutable globals, camelCase for module-level
- **Types/Interfaces**: PascalCase, prefer `type` over `interface` except for extending
- **Files**: PascalCase for components (`ChatContainer.tsx`), lowercase for utilities

### React Performance Patterns

1. **useCallback for stable references**:
   ```ts
   const handleSubmit = useCallback((text: string) => {
     sendMessage({ text });
   }, [sendMessage]);
   ```

2. **React.memo for expensive renders**:
   ```ts
   export const MessageBubble = memo(function MessageBubble({ message }: Props) {
     // ...
   });
   ```

3. **Dynamic imports for code splitting**:
   ```ts
   const ReactMarkdown = dynamic(() => import('react-markdown'), {
     loading: () => <Skeleton />
   });
   ```

4. **useRef for values that don't need re-renders**:
   ```ts
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   // Read from ref.current instead of state in callbacks
   ```

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
1. **Always use Error Boundaries** for client components that might fail
2. **API routes should return appropriate Response objects with status codes**
3. **Use try-catch for async operations**, especially external API calls
4. **Validate requests with Zod** before processing:
   ```ts
   const RequestSchema = z.object({ messages: z.array(...) });
   const { messages } = RequestSchema.parse(await req.json());
   ```

### Security Best Practices
1. **Sanitize all user-generated content** with DOMPurify:
   ```ts
   import DOMPurify from 'dompurify';
   const sanitized = DOMPurify.sanitize(content, {
     ALLOWED_TAGS: [],
     ALLOWED_ATTR: []
   });
   ```
2. **Never expose API keys** to client-side code
3. **Use environment variables** for sensitive configuration
4. **Validate all inputs** with Zod schemas

### Accessibility (A11y) Requirements
**All components MUST be WCAG 2.1 AA compliant:**

1. **ARIA labels** on all interactive elements:
   ```ts
   <textarea aria-label="Message input" aria-describedby="input-help" />
   <button aria-label="Send message" />
   ```

2. **Color contrast** minimum 4.5:1 for normal text, 3:1 for large text
3. **Keyboard navigation** fully functional
4. **Focus management** - return focus after actions
5. **Semantic HTML** - proper use of headings, landmarks, roles
6. **Screen reader support** - aria-live for dynamic content

### Styling (Tailwind CSS v4)
1. **Use CSS variables via Tailwind classes**, not inline styles:
   ```tsx
   // ✅ Good
   className="bg-accent text-foreground"
   
   // ❌ Bad
   style={{ backgroundColor: 'var(--accent)' }}
   ```

2. **Support dark mode** using CSS variables, not `dark:` prefix
3. **Avoid arbitrary values** when Tailwind utilities exist
4. **Use opacity modifier** for color variations:
   ```tsx
   className="text-foreground/70"  // 70% opacity
   ```

### API Routes
1. **Set runtime**: `export const runtime = "nodejs";` for third-party API compatibility
2. **Validate request bodies** with Zod schemas
3. **Use streamText** from AI SDK for streaming responses
4. **Tool definitions** use Zod for input validation:
   ```ts
   weather: tool({
     description: 'Get the weather in a location',
     inputSchema: z.object({
       location: z.string().describe('The location'),
     }),
     execute: async ({ location }) => { ... }
   })
   ```
5. **Add error handling** with try-catch and proper status codes

## Key Patterns in This Codebase

### Chat Implementation
- Client uses `useChat` hook from `@ai-sdk/react`
- Server route streams responses using `streamText`
- Tools are defined server-side and called by the AI model
- Messages use `UIMessage` type from AI SDK
- Markdown rendered dynamically with code splitting

### State Management
- Use React hooks (`useState`) for local component state
- Use `useCallback` for stable function references
- Use `useRef` for DOM nodes and non-reactive values
- No global state management (Redux/Zustand) currently needed

### Performance Optimizations Implemented
1. **Code Splitting**: Markdown plugins loaded dynamically
2. **Memoization**: MessageBubble and MessageList use React.memo
3. **Stable Callbacks**: useCallback for event handlers
4. **Lazy Loading**: Heavy components use next/dynamic
5. **Font Optimization**: next/font for optimal font loading

### File Organization
```
app/
  api/          # API routes
    chat/       # Chat streaming endpoint
  layout.tsx    # Root layout with fonts + skip link
  page.tsx      # Main chat page
  globals.css   # Global styles + theme variables
components/
  chat/
    ChatContainer.tsx      # Main orchestrator
    ChatInput.tsx          # Input with focus management
    MessageList.tsx        # Scrollable message list (memoized)
    MessageBubble.tsx      # Individual message (memoized)
    MarkdownRenderer.tsx   # Dynamic markdown + sanitization
    ChatErrorBoundary.tsx  # Error boundary
tailwind.config.ts         # Tailwind theme with CSS variables
PERFORMANCE.md            # Performance optimization guide
README.md                 # User-facing documentation
```

## Before Committing

1. ✅ Run `pnpm lint` and fix any errors
2. ✅ Test manually in dev server (`pnpm dev`)
3. ✅ Ensure environment variables are set appropriately
4. ✅ Check that all imports use `@/` alias for internal modules
5. ✅ Verify accessibility with keyboard navigation
6. ✅ Check color contrast for any new colors
7. ✅ Test error scenarios (e.g., API failures)
8. ✅ Verify dark mode works correctly

## Design Reference

### Typography Scale
- **H1**: 2.25rem (36px) - Cormorant Garamond 600
- **H2**: 1.875rem (30px) - Cormorant Garamond 600
- **H3**: 1.5rem (24px) - Cormorant Garamond 600
- **Body**: 1rem (16px) - Inter 400
- **Small**: 0.875rem (14px) - Inter 400

### Color Palette (Light Mode)
```css
--background: #FAF9F6;   /* Cream */
--foreground: #2C2C2C;   /* Charcoal */
--accent: #B45309;       /* Amber (WCAG AA) */
--border: #E5E5E5;       /* Light gray */
--code-bg: #F5F5F3;      /* Off-white */
```

### Color Palette (Dark Mode)
```css
--background: #1A1A18;   /* Deep charcoal */
--foreground: #E8E6E3;   /* Off-white */
--accent: #F59E0B;       /* Warm amber (WCAG AA) */
--border: #3A3A38;       /* Dark gray */
--code-bg: #252523;      /* Dark gray */
```

### Spacing System
- Message padding: `p-6` (1.5rem)
- Gap between messages: `mb-4` (1rem)
- Input padding: `px-5 py-4`
- Max content width: `max-w-4xl` (56rem)

## Common Issues & Solutions

### Issue: Markdown not rendering
- **Check**: Are plugins loaded? (look for `!plugins` condition)
- **Solution**: Ensure dynamic imports are resolving correctly

### Issue: Scrollbar appears when content is short
- **Check**: `overflow-y` setting in ChatInput
- **Solution**: Should be `'hidden'` when height < 200px, `'auto'` when >= 200px

### Issue: Focus not returning after send
- **Check**: ChatInput has `forwardRef`
- **Check**: handleSubmit calls `textareaRef.current?.focus()`
- **Solution**: Ensure ref is properly forwarded

### Issue: Color contrast failing
- **Check**: Use WebAIM Contrast Checker
- **Solution**: Adjust color values in globals.css until 4.5:1 minimum

### Issue: Bundle size too large
- **Check**: Run `pnpm build --profile`
- **Solution**: Use dynamic imports for heavy dependencies

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [React Best Practices](/.opencode/skills/react-best-practices/SKILL.md)
- [Frontend Design Guide](/.opencode/skills/frontend-design/SKILL.md)
- [Performance Guide](./PERFORMANCE.md)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
