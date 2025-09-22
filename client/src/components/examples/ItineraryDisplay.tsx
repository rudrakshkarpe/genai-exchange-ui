import ItineraryDisplay from '../ItineraryDisplay';
import { type Itinerary } from '@shared/schema';

export default function ItineraryDisplayExample() {
  // Mock itinerary for demonstration  
  const mockItinerary: Itinerary = {
    id: 'kerala-trip',
    title: '5-Day Adventure in Kerala',
    destination: 'Kerala, India',
    dates: 'March 15-20, 2024',
    days: [
      {
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
            description: 'Walk through the historic streets and visit the famous Chinese fishing nets'
          },
          {
            id: 'activity-3',
            time: '1:00 PM', 
            title: 'Traditional Kerala Lunch',
            description: 'Enjoy authentic Keralan cuisine at a local restaurant'
          }
        ]
      },
      {
        id: 'day-2',
        dayNumber: 2,
        title: 'Backwaters Experience',
        activities: [
          {
            id: 'activity-4',
            time: '8:00 AM',
            title: 'Drive to Alleppey',
            description: 'Scenic drive through Kerala countryside to the backwater capital'
          },
          {
            id: 'activity-5',
            time: '10:00 AM',
            title: 'Houseboat Cruise',
            description: 'Full day houseboat experience through the serene backwaters with traditional lunch on board'
          }
        ]
      }
    ]
  };

  return (
    <div className="h-96 border rounded-lg">
      <ItineraryDisplay itinerary={mockItinerary} />
    </div>
  );
}