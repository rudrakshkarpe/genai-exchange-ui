import { type ItineraryDay } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventCard from "./EventCard";
import { Calendar } from "lucide-react";

interface DayCardProps {
  day: ItineraryDay;
}

export default function DayCard({ day }: DayCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="mb-4" data-testid={`day-card-${day.day_number}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Day {day.day_number}
          <span className="text-sm font-normal text-muted-foreground">
            • {formatDate(day.date)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {day.events.length > 0 ? (
          day.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground p-3 text-center border border-dashed border-card-border rounded-md">
            No events scheduled for this day
          </p>
        )}
      </CardContent>
    </Card>
  );
}