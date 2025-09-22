import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, type ApiResponse, type Itinerary } from "@shared/schema";

// Intelligent travel assistant that generates realistic responses
class TravelAssistant {
  private extractTravelInfo(message: string) {
    const lowerMessage = message.toLowerCase();
    
    // Extract destinations
    const destinations = [];
    const commonDestinations = [
      'kerala', 'paris', 'tokyo', 'london', 'rome', 'bali', 'thailand', 
      'japan', 'italy', 'france', 'india', 'spain', 'greece', 'portugal',
      'new york', 'california', 'hawaii', 'iceland', 'norway', 'switzerland'
    ];
    
    for (const dest of commonDestinations) {
      if (lowerMessage.includes(dest)) {
        destinations.push(dest);
      }
    }
    
    // Extract duration
    const durationMatch = lowerMessage.match(/(\d+)[\s-]?(day|days|week|weeks)/);
    let duration = 3; // default
    if (durationMatch) {
      const num = parseInt(durationMatch[1]);
      const unit = durationMatch[2];
      duration = unit.includes('week') ? num * 7 : num;
    }
    
    // Extract interests
    const interests = [];
    const interestKeywords = {
      'cultural': ['culture', 'history', 'museum', 'art', 'heritage'],
      'adventure': ['adventure', 'hiking', 'trekking', 'outdoor', 'active'],
      'relaxation': ['relax', 'spa', 'beach', 'peaceful', 'quiet'],
      'food': ['food', 'cuisine', 'restaurant', 'culinary', 'local food'],
      'nature': ['nature', 'scenic', 'landscape', 'wildlife', 'parks'],
      'nightlife': ['nightlife', 'bars', 'clubs', 'entertainment'],
      'romantic': ['romantic', 'honeymoon', 'anniversary', 'couple']
    };
    
    for (const [category, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        interests.push(category);
      }
    }
    
    return { destinations, duration, interests };
  }
  
  private generateItinerary(destination: string, duration: number, interests: string[]): Itinerary {
    const destinationData = this.getDestinationData(destination);
    const itinerary: Itinerary = {
      id: `trip-${Date.now()}`,
      title: `${duration}-Day ${destinationData.title}`,
      destination: destinationData.location,
      dates: this.generateDates(duration),
      days: []
    };
    
    for (let i = 1; i <= Math.min(duration, 7); i++) {
      const dayActivities = this.generateDayActivities(destination, i, interests);
      itinerary.days.push({
        id: `day-${i}`,
        dayNumber: i,
        title: dayActivities.title,
        activities: dayActivities.activities
      });
    }
    
    return itinerary;
  }
  
  private getDestinationData(destination: string) {
    const destinations = {
      'kerala': { title: 'Adventure in Kerala', location: 'Kerala, India' },
      'paris': { title: 'Romantic Paris Getaway', location: 'Paris, France' },
      'tokyo': { title: 'Tokyo Discovery', location: 'Tokyo, Japan' },
      'bali': { title: 'Bali Paradise', location: 'Bali, Indonesia' },
      'london': { title: 'London Explorer', location: 'London, England' },
      'rome': { title: 'Roman Adventure', location: 'Rome, Italy' },
      'thailand': { title: 'Thailand Journey', location: 'Thailand' },
      'iceland': { title: 'Iceland Adventure', location: 'Iceland' }
    };
    
    return destinations[destination as keyof typeof destinations] || 
           { title: 'Amazing Journey', location: destination };
  }
  
  private generateDates(duration: number): string {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 30); // 30 days from now
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration - 1);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${startDate.getFullYear()}`;
  }
  
  private generateDayActivities(destination: string, dayNumber: number, interests: string[]) {
    const activityTemplates = {
      kerala: {
        1: {
          title: 'Arrival in Kochi',
          activities: [
            { time: '9:00 AM', title: 'Airport Transfer', description: 'Arrive and transfer to Fort Kochi hotel' },
            { time: '11:00 AM', title: 'Fort Kochi Walking Tour', description: 'Explore colonial architecture and Chinese fishing nets' },
            { time: '1:00 PM', title: 'Traditional Kerala Lunch', description: 'Savor authentic spices and flavors' },
            { time: '3:00 PM', title: 'Mattancherry Palace', description: 'Discover Kerala\'s royal history' }
          ]
        },
        2: {
          title: 'Backwater Bliss',
          activities: [
            { time: '8:00 AM', title: 'Drive to Alleppey', description: 'Scenic journey through spice plantations' },
            { time: '10:00 AM', title: 'Houseboat Experience', description: 'Full day cruise through serene backwaters' },
            { time: '1:00 PM', title: 'Traditional Lunch on Board', description: 'Fresh seafood and local specialties' }
          ]
        }
      },
      paris: {
        1: {
          title: 'Classic Parisian Charm',
          activities: [
            { time: '9:00 AM', title: 'Eiffel Tower', description: 'Start with the iconic symbol of Paris' },
            { time: '11:30 AM', title: 'Seine River Cruise', description: 'Romantic boat ride past landmarks' },
            { time: '2:00 PM', title: 'Lunch at Café de Flore', description: 'Historic café in Saint-Germain' },
            { time: '4:00 PM', title: 'Louvre Museum', description: 'World\'s most famous art collection' }
          ]
        },
        2: {
          title: 'Montmartre & Romance',
          activities: [
            { time: '10:00 AM', title: 'Sacré-Cœur Basilica', description: 'Stunning views over Paris' },
            { time: '12:00 PM', title: 'Montmartre Village', description: 'Artists\' quarter and cobblestone streets' },
            { time: '7:00 PM', title: 'Dinner at Le Procope', description: 'Historic restaurant with French cuisine' }
          ]
        }
      }
    };
    
    const defaultDay = {
      title: `Day ${dayNumber} Exploration`,
      activities: [
        { time: '9:00 AM', title: 'Morning Discovery', description: 'Explore local attractions and culture' },
        { time: '12:00 PM', title: 'Local Cuisine', description: 'Taste authentic regional specialties' },
        { time: '3:00 PM', title: 'Afternoon Adventure', description: 'Immerse in unique local experiences' },
        { time: '6:00 PM', title: 'Evening Relaxation', description: 'Unwind and enjoy the local atmosphere' }
      ]
    };
    
    const destTemplates = activityTemplates[destination as keyof typeof activityTemplates];
    const dayTemplate = destTemplates?.[dayNumber as keyof typeof destTemplates] || defaultDay;
    
    return {
      title: dayTemplate.title,
      activities: dayTemplate.activities.map((activity, index) => ({
        id: `activity-${dayNumber}-${index + 1}`,
        time: activity.time,
        title: activity.title,
        description: activity.description
      }))
    };
  }
  
  public processMessage(message: string): ApiResponse {
    const { destinations, duration, interests } = this.extractTravelInfo(message);
    
    // If no destination found, ask for more info
    if (destinations.length === 0) {
      return {
        chat_response: "I'd love to help you plan an amazing trip! To create the perfect itinerary, could you tell me more about your destination, how long you'd like to travel, and what kind of experiences interest you most? For example, are you drawn to cultural sites, outdoor adventures, culinary experiences, or relaxing getaways?"
      };
    }
    
    // Generate itinerary for the first destination found
    const destination = destinations[0];
    const itinerary = this.generateItinerary(destination, duration, interests);
    
    const interestText = interests.length > 0 ? 
      ` focusing on ${interests.join(', ')}` : '';
    
    const response = `Perfect choice! I've crafted a wonderful ${duration}-day itinerary for ${itinerary.destination}${interestText}. This adventure includes carefully selected experiences that capture the essence of this incredible destination. Each day is designed to immerse you in the local culture, stunning sights, and unforgettable moments. Your journey will be both enriching and perfectly paced!`;
    
    return {
      chat_response: response,
      itinerary_data: itinerary
    };
  }
}

const travelAssistant = new TravelAssistant();

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced chat endpoint with intelligent travel planning
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatRequestSchema.parse(req.body);
      
      // Process message with travel assistant
      const response = travelAssistant.processMessage(message);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      res.json(response);
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ 
        error: "Sorry, I'm having trouble processing your request. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
