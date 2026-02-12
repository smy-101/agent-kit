import { ChatContainer } from '@/components/chat/chat-container';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <ChatContainer apiRoute="/api/chat" />
    </div>
  );
}
