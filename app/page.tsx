'use client';

import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';

export default function Chat() {
  return (
    <ChatErrorBoundary>
      <ChatContainer />
    </ChatErrorBoundary>
  );
}
