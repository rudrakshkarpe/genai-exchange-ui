import DayCard from '../DayCard';
import { type Day } from '@shared/schema';

export default function DayCardExample() {
  const mockDay: Day = {
    id: 'day-1',
    dayNumber: 1,
    title: 'Arrival in Kochi',
    activities: [
      {
        id: 'activity-1',
        time: '9:00 AM',
        title: 'Airport Transfer & Check-in',
        description: 'Arrive at Cochin International Airport and transfer to your hotel in Fort Kochi'
      },
      {
        id: 'activity-2',
        time: '11:00 AM',
        title: 'Explore Fort Kochi',
        description: 'Walk through the historic streets, visit the famous Chinese fishing nets, and explore colonial architecture'
      },
      {
        id: 'activity-3',
        time: '1:00 PM',
        title: 'Traditional Kerala Lunch',
        description: 'Enjoy authentic Keralan cuisine at a local restaurant'
      },
      {
        id: 'activity-4',
        time: '3:00 PM',
        title: 'Mattancherry Palace',
        description: 'Visit the Dutch Palace and learn about Kerala\'s royal history'
      }
    ]
  };

  return (
    <div className="p-4">
      <DayCard day={mockDay} />
    </div>
  );
}