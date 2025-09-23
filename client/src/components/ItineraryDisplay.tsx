import { type Itinerary } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Navigation } from "lucide-react";
import DayCard from "./DayCard";

interface ItineraryDisplayProps {
  itinerary?: Itinerary;
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  if (!itinerary) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Your Itinerary Will Appear Here
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start chatting about your travel plans and watch your personalized itinerary come to life
          </p>
        </div>
      </div>
    );
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startFormatted} - ${endFormatted}`;
    } catch {
      return `${startDate} - ${endDate}`;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Trip Header */}
      <div className="p-6 border-b border-card-border bg-card">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold text-card-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {itinerary.trip_name}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange(itinerary.start_date, itinerary.end_date)}</span>
              <span>•</span>
              <Navigation className="w-4 h-4" />
              <span>{itinerary.origin} → {itinerary.destination}</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Days List */}
      <div className="p-6 space-y-4">
        {itinerary.days.length > 0 ? (
          itinerary.days.map((day) => (
            <DayCard key={day.day_number} day={day} />
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No days planned yet</p>
          </div>
        )}
      </div>
    </div>
  );
}