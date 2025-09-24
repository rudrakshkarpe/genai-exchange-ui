import logoUrl from "@assets/TravelMate.ai Logo _1758536903515.png";
import { Button } from "./ui/button";
import { resetSession } from "../services/apiService";
import { RefreshCcw } from "lucide-react";

interface HeaderProps {
  onResetSession?: () => Promise<void>;
}

export default function Header({ onResetSession }: HeaderProps) {
  const handleResetClick = async () => {
    if (onResetSession) {
      await onResetSession();
    } else {
      // Default implementation if no callback is provided
      try {
        await resetSession();
        alert("Session has been reset. You might need to reload the page for changes to take effect.");
      } catch (error) {
        console.error("Error resetting session:", error);
        alert("Failed to reset session. Please try reloading the page.");
      }
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-card-border">
      <div className="flex items-center">
        <img 
          src={logoUrl} 
          alt="TravelMate.ai" 
          className="h-80"
          data-testid="img-logo"
        />
      </div>
      
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetClick}
          title="Reset Session"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset Session
        </Button>
      </div>
    </header>
  );
}