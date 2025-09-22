import ActivityCard from '../ActivityCard';
import { type Activity } from '@shared/schema';

export default function ActivityCardExample() {
  const mockActivity: Activity = {
    id: '1',
    time: '9:00 AM',
    title: 'Explore Fort Kochi',
    description: 'Discover the historic Portuguese and Dutch colonial architecture, visit the iconic Chinese fishing nets, and explore the vibrant local markets.'
  };

  return (
    <div className="p-4">
      <ActivityCard activity={mockActivity} />
    </div>
  );
}