import { useTravelContext } from "../context/TravelContext";
import Header from "./Header";
import ChatInterface from "./ChatInterface";
import ItineraryDisplay from "./ItineraryDisplay";

export default function TravelPlannerApp() {
  const { messages, itinerary, isLoading, sendMessage } = useTravelContext();

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface - 65% width on desktop */}
        <div className="flex-1 lg:w-[65%] flex flex-col border-r border-card-border bg-background">
          <ChatInterface 
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
        
        {/* Itinerary Display - 35% width on desktop */}
        <div className="hidden lg:block lg:w-[35%] bg-card">
          <ItineraryDisplay itinerary={itinerary} />
        </div>
      </div>
      
      {/* Mobile Itinerary - Show below chat on mobile */}
      <div className="lg:hidden border-t border-card-border bg-card max-h-64 overflow-y-auto">
        <ItineraryDisplay itinerary={itinerary} />
      </div>
    </div>
  );
}