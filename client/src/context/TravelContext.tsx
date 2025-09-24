import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { type ChatMessage, type Itinerary } from "@shared/schema";
import { getOrCreateSession, resetSession } from "../services/apiService";

interface TravelState {
  messages: ChatMessage[];
  itinerary?: Itinerary;
  isLoading: boolean;
  sessionInitialized: boolean;
}

interface TravelContextType {
  state: TravelState;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  updateItinerary: (itinerary: Itinerary) => void;
  setLoading: (loading: boolean) => void;
  refreshSession: () => Promise<void>;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

// Sample hardcoded itinerary for design review
const sampleItinerary: Itinerary = {
  trip_name: "Kerala Backwaters & Hills Adventure",
  start_date: "2024-01-15",
  end_date: "2024-01-20",
  origin: "Kochi",
  destination: "Kerala, India",
  days: [
    {
      day_number: 1,
      date: "2024-01-15",
      events: [
        {
          type: "flight",
          id: "flight-1",
          time: "10:30 AM",
          title: "Arrival in Kochi",
          description: "Flight from Mumbai to Kochi International Airport",
          flight_number: "AI 681",
          from: "Mumbai (BOM)",
          to: "Kochi (COK)"
        },
        {
          type: "hotel",
          id: "hotel-1",
          time: "2:00 PM",
          title: "Check-in at Hotel",
          description: "Luxury waterfront hotel with traditional Kerala architecture",
          hotel_name: "Taj Malabar Resort & Spa",
          address: "Willingdon Island, Kochi"
        },
        {
          type: "attraction",
          id: "attraction-1",
          time: "4:00 PM",
          title: "Fort Kochi Walking Tour",
          description: "Explore the historic Portuguese and Dutch colonial architecture",
          location: "Fort Kochi",
          duration: "2 hours"
        }
      ]
    },
    {
      day_number: 2,
      date: "2024-01-16",
      events: [
        {
          type: "attraction",
          id: "attraction-2",
          time: "8:00 AM",
          title: "Backwater Cruise",
          description: "Traditional houseboat cruise through Kerala's famous backwaters",
          location: "Alleppey Backwaters",
          duration: "Full day"
        },
        {
          type: "attraction",
          id: "attraction-3",
          time: "1:00 PM",
          title: "Traditional Kerala Lunch",
          description: "Authentic meal served on banana leaf aboard the houseboat",
          location: "Houseboat",
          duration: "1 hour"
        }
      ]
    },
    {
      day_number: 3,
      date: "2024-01-17",
      events: [
        {
          type: "attraction",
          id: "attraction-4",
          time: "9:00 AM",
          title: "Munnar Hill Station",
          description: "Drive to the picturesque tea plantations of Munnar",
          location: "Munnar",
          duration: "3 hours drive"
        },
        {
          type: "hotel",
          id: "hotel-2",
          time: "1:00 PM",
          title: "Check-in Mountain Resort",
          description: "Eco-friendly resort surrounded by tea gardens",
          hotel_name: "Tea Valley Resort",
          address: "Munnar Hills, Kerala"
        },
        {
          type: "attraction",
          id: "attraction-5",
          time: "3:30 PM",
          title: "Tea Plantation Visit",
          description: "Learn about tea processing and enjoy fresh mountain air",
          location: "Kolukkumalai Tea Estate",
          duration: "2 hours"
        }
      ]
    },
    {
      day_number: 4,
      date: "2024-01-18",
      events: [
        {
          type: "attraction",
          id: "attraction-6",
          time: "6:00 AM",
          title: "Sunrise at Echo Point",
          description: "Watch the spectacular sunrise over the Western Ghats",
          location: "Echo Point, Munnar",
          duration: "2 hours"
        },
        {
          type: "attraction",
          id: "attraction-7",
          time: "11:00 AM",
          title: "Eravikulam National Park",
          description: "Wildlife sanctuary home to the endangered Nilgiri Tahr",
          location: "Eravikulam National Park",
          duration: "3 hours"
        },
        {
          type: "attraction",
          id: "attraction-8",
          time: "4:00 PM",
          title: "Spice Garden Tour",
          description: "Explore aromatic spice plantations and learn about cultivation",
          location: "Munnar Spice Gardens",
          duration: "1.5 hours"
        }
      ]
    },
    {
      day_number: 5,
      date: "2024-01-19",
      events: [
        {
          type: "attraction",
          id: "attraction-9",
          time: "10:00 AM",
          title: "Return to Kochi",
          description: "Scenic drive back to Kochi with stops at viewpoints",
          location: "Munnar to Kochi",
          duration: "4 hours"
        },
        {
          type: "attraction",
          id: "attraction-10",
          time: "3:00 PM",
          title: "Kerala Kathakali Performance",
          description: "Traditional dance performance showcasing Kerala's cultural heritage",
          location: "Kerala Kathakali Centre, Kochi",
          duration: "1 hour"
        },
        {
          type: "attraction",
          id: "attraction-11",
          time: "6:00 PM",
          title: "Sunset at Marine Drive",
          description: "Relaxing evening walk along Kochi's waterfront promenade",
          location: "Marine Drive, Kochi",
          duration: "1 hour"
        }
      ]
    },
    {
      day_number: 6,
      date: "2024-01-20",
      events: [
        {
          type: "flight",
          id: "flight-2",
          time: "2:15 PM",
          title: "Departure from Kochi",
          description: "Return flight to Mumbai",
          flight_number: "AI 684",
          from: "Kochi (COK)",
          to: "Mumbai (BOM)"
        }
      ]
    }
  ]
};

export function TravelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TravelState>({
    messages: [
      {
        id: "welcome-1",
        type: "ai",
        content: "Welcome to TravelMate AI! I'm here to help you plan the perfect trip. Tell me about your dream destination, travel dates, or any specific interests you have, and I'll create a personalized itinerary just for you.",
        timestamp: new Date()
      }
    ],
    // Initialize with sample itinerary for design review
    itinerary: sampleItinerary,
    isLoading: false,
    sessionInitialized: false,
  });  // Initialize the session when the component mounts
  useEffect(() => {
    const initSession = async () => {
      // Add the initialization message
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-init-${Date.now()}`,
            type: "ai",
            content: "Connecting to AI backend...",
            timestamp: new Date()
          }
        ],
      }));
      
      try {
        // Get or create a session with specific logging
        const session = await getOrCreateSession();
        console.log("Session initialized with ID:", session.sessionId);
        
        // Update messages with success indicator and mark initialized
        setState(prev => {
          // Filter out initialization message
          const filteredMessages = prev.messages.filter(msg => !msg.id.includes('msg-init-'));
          
          return {
            ...prev,
            sessionInitialized: true,
            messages: filteredMessages,
          };
        });
      } catch (error) {
        console.error("Failed to initialize session:", error);
        
        // Show error message and mark as initialized after a delay
        setTimeout(() => {
          setState(prev => {
            // Filter out initialization message
            const filteredMessages = prev.messages.filter(msg => !msg.id.includes('msg-init-'));
            
            return {
              ...prev,
              sessionInitialized: true,
              messages: [
                ...filteredMessages,
                {
                  id: `msg-error-${Date.now()}`,
                  type: "ai",
                  content: "There was an issue connecting to the AI backend. Some features may not work correctly. You can try resetting your session using the button in the header.",
                  timestamp: new Date()
                }
              ],
            };
          });
        }, 3000);
      }
    };    
    initSession();
    
    // Set up a periodic session check every 5 minutes
    const sessionCheckInterval = setInterval(async () => {
      try {
        console.log("Performing periodic session verification");
        // This will verify if the session is still valid
        await getOrCreateSession();
      } catch (error) {
        console.error("Error during periodic session check:", error);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(sessionCheckInterval);
  }, []);

  const addMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const updateItinerary = (itinerary: Itinerary) => {
    setState(prev => ({
      ...prev,
      itinerary,
    }));
  };
  const setLoading = (loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  };
  
  const refreshSession = async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      sessionInitialized: false,
    }));
    
    try {
      // Reset the session
      await resetSession();
      
      // Clear messages and set a new welcome message
      setState(prev => ({
        ...prev,
        sessionInitialized: true,
        isLoading: false,
        messages: [
          {
            id: `welcome-${Date.now()}`,
            type: "ai",
            content: "Session has been reset. Welcome back to TravelMate AI! I'm ready to help you plan a new trip.",
            timestamp: new Date()
          }
        ]
      }));
    } catch (error) {
      console.error("Error refreshing session:", error);
      
      // Still mark as initialized but show error
      setState(prev => ({
        ...prev,
        sessionInitialized: true,
        isLoading: false,
        messages: [
          ...prev.messages,
          {
            id: `error-${Date.now()}`,
            type: "ai",
            content: "There was an error refreshing your session. Please try reloading the page.",
            timestamp: new Date()
          }
        ]
      }));
    }
  };

  const value: TravelContextType = {
    state,
    addMessage,
    updateItinerary,
    setLoading,
    refreshSession
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error("useTravelContext must be used within a TravelProvider");
  }
  return context;
}