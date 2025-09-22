import ChatInterface from '../ChatInterface';
import { type ChatMessage } from '@shared/schema';

export default function ChatInterfaceExample() {
  // Mock messages for demonstration
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'user',
      content: 'I want to plan a romantic weekend getaway to Paris for my anniversary.',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      type: 'ai',
      content: 'How romantic! Paris is perfect for an anniversary celebration. I\'ll create a beautiful 2-day itinerary featuring intimate restaurants, scenic walks along the Seine, and iconic landmarks. What\'s your budget range and are there any specific experiences you\'d love to include?',
      timestamp: new Date(Date.now() - 240000)
    }
  ];

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // In real app, this would send to backend
  };

  return (
    <div className="h-96">
      <ChatInterface 
        messages={mockMessages} 
        onSendMessage={handleSendMessage}
        isLoading={false}
      />
    </div>
  );
}