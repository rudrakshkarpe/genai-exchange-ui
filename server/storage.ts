import { type ChatMessage, type Itinerary, type ApiResponse } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for TravelMate chat and itinerary data
export interface IStorage {
  saveConversation(messages: ChatMessage[]): Promise<string>;
  getConversation(id: string): Promise<ChatMessage[] | undefined>;
  saveItinerary(itinerary: Itinerary): Promise<void>;
  getItinerary(id: string): Promise<Itinerary | undefined>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, ChatMessage[]>;
  private itineraries: Map<string, Itinerary>;

  constructor() {
    this.conversations = new Map();
    this.itineraries = new Map();
  }

  async saveConversation(messages: ChatMessage[]): Promise<string> {
    const id = randomUUID();
    this.conversations.set(id, messages);
    return id;
  }

  async getConversation(id: string): Promise<ChatMessage[] | undefined> {
    return this.conversations.get(id);
  }

  async saveItinerary(itinerary: Itinerary): Promise<void> {
    this.itineraries.set(itinerary.id, itinerary);
  }

  async getItinerary(id: string): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }
}

export const storage = new MemStorage();
