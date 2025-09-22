import ChatMessage from '../ChatMessage';
import { type ChatMessage as ChatMessageType } from '@shared/schema';

export default function ChatMessageExample() {
  const userMessage: ChatMessageType = {
    id: '1',
    type: 'user',
    content: 'I want to plan a 5-day trip to Kerala, India. I love nature, local food, and cultural experiences.',
    timestamp: new Date()
  };

  const aiMessage: ChatMessageType = {
    id: '2',
    type: 'ai',
    content: 'What a wonderful choice! Kerala is absolutely magical with its backwaters, spice gardens, and rich culture. I\'ve created a perfect 5-day itinerary that includes serene houseboat experiences, authentic Keralan cuisine, and cultural immersion in historic Kochi.',
    timestamp: new Date()
  };

  return (
    <div className="space-y-4 p-4">
      <ChatMessage message={userMessage} />
      <ChatMessage message={aiMessage} />
    </div>
  );
}