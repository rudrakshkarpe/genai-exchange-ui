import { type Day } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityCard from "./ActivityCard";

interface DayCardProps {
  day: Day;
}

export default function DayCard({ day }: DayCardProps) {
  return (
    <Card className="mb-4" data-testid={`day-card-${day.id}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Day {day.dayNumber}: {day.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {day.activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </CardContent>
    </Card>
  );
}