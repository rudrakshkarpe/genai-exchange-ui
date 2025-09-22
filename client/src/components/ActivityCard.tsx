import { type Activity } from "@shared/schema";
import { Clock } from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div 
      className="flex gap-3 p-3 hover-elevate rounded-md border border-card-border bg-card"
      data-testid={`activity-card-${activity.id}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-1">
        <Clock className="w-4 h-4 text-accent-foreground" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {activity.time}
          </span>
        </div>
        
        <h4 className="font-medium text-card-foreground leading-snug">
          {activity.title}
        </h4>
        
        {activity.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activity.description}
          </p>
        )}
      </div>
    </div>
  );
}