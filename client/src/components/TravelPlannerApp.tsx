import { useTravelContext } from "../context/TravelContext";
import Header from "./Header";
import ChatInterface from "./ChatInterface";
import ItineraryDisplay from "./ItineraryDisplay";

export default function TravelPlannerApp() {
  const { state, addMessage, setLoading } = useTravelContext();

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({
      type: "user",
      content
    });

    // Simulate loading for AI response (in real app, this would be an API call)
    setLoading(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add AI response
    addMessage({
      type: "ai", 
      content: `I'd love to help you plan that trip! I'm working on creating a personalized itinerary based on "${content}". In a real implementation, this would connect to our AI backend to generate detailed travel recommendations.`
    });
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface - 65% width on desktop */}
        <div className="flex-1 lg:w-[65%] flex flex-col border-r border-card-border bg-background">
          <ChatInterface 
            messages={state.messages}
            onSendMessage={handleSendMessage}
            isLoading={state.isLoading}
          />
        </div>
        
        {/* Itinerary Display - 35% width on desktop */}
        <div className="hidden lg:block lg:w-[35%] bg-card">
          <ItineraryDisplay itinerary={state.itinerary} />
        </div>
      </div>
      
      {/* Mobile Itinerary - Show below chat on mobile */}
      <div className="lg:hidden border-t border-card-border bg-card max-h-64 overflow-y-auto">
        <ItineraryDisplay itinerary={state.itinerary} />
      </div>
    </div>
  );
}