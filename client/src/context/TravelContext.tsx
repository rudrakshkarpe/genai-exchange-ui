import { createContext, useContext, useState, ReactNode } from 'react';
import { type ChatMessage, type Itinerary } from '@shared/schema';

interface TravelContextType {
  messages: ChatMessage[];
  itinerary: Itinerary | undefined;
  isLoading: boolean;
  addMessage: (message: ChatMessage) => void;
  updateItinerary: (itinerary: Itinerary | undefined) => void;
  setLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

interface TravelProviderProps {
  children: ReactNode;
}

export function TravelProvider({ children }: TravelProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateItinerary = (newItinerary: Itinerary | undefined) => {
    setItinerary(newItinerary);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Mock API call - replace with real backend integration later
  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI response based on user input
    const generateMockResponse = (userContent: string) => {
      if (userContent.toLowerCase().includes('kerala')) {
        const mockItinerary: Itinerary = {
          id: 'kerala-trip',
          title: '5-Day Adventure in Kerala',
          destination: 'Kerala, India',
          dates: 'March 15-20, 2024',
          days: [
            {
              id: 'day-1',
              dayNumber: 1,
              title: 'Arrival in Kochi',
              activities: [
                {
                  id: 'activity-1',
                  time: '9:00 AM',
                  title: 'Airport Transfer & Check-in',
                  description: 'Arrive at Cochin International Airport and transfer to your hotel'
                },
                {
                  id: 'activity-2',
                  time: '11:00 AM',
                  title: 'Explore Fort Kochi',
                  description: 'Walk through historic streets and visit Chinese fishing nets'
                },
                {
                  id: 'activity-3',
                  time: '1:00 PM',
                  title: 'Traditional Kerala Lunch',
                  description: 'Enjoy authentic cuisine at a local restaurant'
                }
              ]
            },
            {
              id: 'day-2',
              dayNumber: 2,
              title: 'Backwaters Experience',
              activities: [
                {
                  id: 'activity-4',
                  time: '8:00 AM',
                  title: 'Drive to Alleppey',
                  description: 'Scenic drive through Kerala countryside'
                },
                {
                  id: 'activity-5',
                  time: '10:00 AM',
                  title: 'Houseboat Cruise',
                  description: 'Full day backwater experience with traditional lunch'
                }
              ]
            }
          ]
        };
        return {
          response: "Perfect choice! Kerala is absolutely magical with its backwaters and spice gardens. I've created a wonderful 5-day itinerary that includes serene houseboat experiences, authentic cuisine, and cultural immersion. Your adventure includes Fort Kochi's colonial charm, peaceful backwater cruises, and traditional Kerala experiences.",
          itinerary: mockItinerary
        };
      } else if (userContent.toLowerCase().includes('paris')) {
        const parisItinerary: Itinerary = {
          id: 'paris-trip',
          title: 'Romantic Paris Weekend',
          destination: 'Paris, France',
          dates: 'April 12-14, 2024',
          days: [
            {
              id: 'day-1',
              dayNumber: 1,
              title: 'Classic Parisian Romance',
              activities: [
                {
                  id: 'activity-1',
                  time: '10:00 AM',
                  title: 'Eiffel Tower Visit',
                  description: 'Start your romantic getaway with iconic tower views'
                },
                {
                  id: 'activity-2',
                  time: '12:30 PM',
                  title: 'Seine River Lunch Cruise',
                  description: 'Romantic lunch while cruising past Paris landmarks'
                },
                {
                  id: 'activity-3',
                  time: '7:00 PM',
                  title: 'Dinner at Le Jules Verne',
                  description: 'Michelin-starred dining in the Eiffel Tower'
                }
              ]
            }
          ]
        };
        return {
          response: "How romantic! Paris is absolutely perfect for an anniversary celebration. I've crafted an intimate 2-day experience featuring the city's most romantic spots, Michelin-starred dining, and scenic walks along the Seine. This itinerary captures the essence of Parisian romance!",
          itinerary: parisItinerary
        };
      } else {
        return {
          response: "That sounds like an amazing adventure! I'd love to help you plan the perfect trip. Could you tell me more about your destination, travel dates, and what kind of experiences you're most excited about? I'll create a personalized itinerary just for you!",
          itinerary: undefined
        };
      }
    };

    const mockResponse = generateMockResponse(content);
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: mockResponse.response,
      timestamp: new Date()
    };

    addMessage(aiMessage);
    if (mockResponse.itinerary) {
      updateItinerary(mockResponse.itinerary);
    }
    setLoading(false);
  };

  const value = {
    messages,
    itinerary,
    isLoading,
    addMessage,
    updateItinerary,
    setLoading,
    sendMessage
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}

export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
};