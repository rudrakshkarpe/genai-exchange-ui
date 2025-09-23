import { type Event } from "@shared/schema";
import { Clock, Plane, Hotel, MapPin } from "lucide-react";

interface EventCardProps {
  event: Event;
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case "flight":
      return <Plane className="w-4 h-4 text-accent-foreground" />;
    case "hotel":
      return <Hotel className="w-4 h-4 text-accent-foreground" />;
    case "attraction":
      return <MapPin className="w-4 h-4 text-accent-foreground" />;
    default:
      return <Clock className="w-4 h-4 text-accent-foreground" />;
  }
}

function getEventTypeLabel(eventType: string) {
  switch (eventType) {
    case "flight":
      return "Flight";
    case "hotel":
      return "Hotel";
    case "attraction":
      return "Attraction";
    default:
      return "Event";
  }
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div 
      className="flex gap-3 p-3 hover-elevate rounded-md border border-card-border bg-card"
      data-testid={`event-card-${event.id}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-1">
        {getEventIcon(event.type)}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {event.time}
          </span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {getEventTypeLabel(event.type)}
          </span>
        </div>
        
        <h4 className="font-medium text-card-foreground leading-snug">
          {event.title}
        </h4>
        
        {event.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        )}
        
        {/* Type-specific details */}
        {event.type === "flight" && (event.from || event.to || event.flight_number) && (
          <div className="text-xs text-muted-foreground">
            {event.flight_number && <span>Flight {event.flight_number}</span>}
            {event.from && event.to && (
              <span>{event.flight_number ? " • " : ""}{event.from} → {event.to}</span>
            )}
          </div>
        )}
        
        {event.type === "hotel" && (event.hotel_name || event.address) && (
          <div className="text-xs text-muted-foreground">
            {event.hotel_name && <div>{event.hotel_name}</div>}
            {event.address && <div>{event.address}</div>}
          </div>
        )}
        
        {event.type === "attraction" && (event.location || event.duration) && (
          <div className="text-xs text-muted-foreground">
            {event.location && <span>{event.location}</span>}
            {event.duration && <span>{event.location ? " • " : ""}{event.duration}</span>}
          </div>
        )}
      </div>
    </div>
  );
}