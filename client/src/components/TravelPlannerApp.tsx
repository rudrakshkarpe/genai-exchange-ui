import { useTravelContext } from "../context/TravelContext";
import Header from "./Header";
import ChatInterface from "./ChatInterface";
import ItineraryDisplay from "./ItineraryDisplay";
import { sendMessage, parseAIResponse, resetSession } from "../services/apiService";
import { Button } from "./ui/button";

export default function TravelPlannerApp() {
  const { state, addMessage, setLoading, updateItinerary, refreshSession } = useTravelContext();
  
  // Function to handle session reset
  const handleSessionReset = async () => {
    try {
      // Use the refreshSession function from context
      await refreshSession();
    } catch (error) {
      console.error("Error resetting session:", error);
    }
  };
  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({
      type: "user",
      content
    });

    // Set loading state for AI response
    setLoading(true);
    
    try {
      // Send message to backend API
      const response = await sendMessage(content);
      
      // Parse the response from the AI
      const { text, itinerary } = parseAIResponse(response);
      
      // Add AI response to chat
      addMessage({
        type: "ai", 
        content: text
      });
        // If we received itinerary data, update the itinerary
      if (itinerary) {
        updateItinerary(itinerary);
      }
    } catch (error) {
      console.error("Error sending message to backend:", error);
        // Add detailed error message
      console.error("Error details:", error);
      let errorMessage = "I'm sorry, I encountered an error while processing your request. Please try again later.";
      
      if (error instanceof Error) {
        // Include some details from the error in the message
        errorMessage = `I'm sorry, I encountered an error while processing your request: ${error.message.substring(0, 100)}... Please try again later.`;
      }
      
      addMessage({
        type: "ai",
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onResetSession={handleSessionReset} />
        {!state.sessionInitialized ? (        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-muted-foreground">Initializing your travel session...</p>
            <p className="text-sm text-muted-foreground max-w-md text-center">
              Connecting to the Trip Planner backend. If this takes more than a few seconds, there might be a connection issue.
            </p>
            <Button 
              variant="outline" 
              onClick={handleSessionReset}
              className="mt-4"
            >
              Reset Session
            </Button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}