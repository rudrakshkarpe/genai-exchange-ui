import { z } from "zod";

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(["user", "ai"]),
  content: z.string(),
  timestamp: z.date(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Event Types
export const flightEventSchema = z.object({
  type: z.literal("flight"),
  id: z.string(),
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
  flight_number: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const hotelEventSchema = z.object({
  type: z.literal("hotel"),
  id: z.string(),
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
  hotel_name: z.string().optional(),
  address: z.string().optional(),
});

export const attractionEventSchema = z.object({
  type: z.literal("attraction"),
  id: z.string(),
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
});

export const eventSchema = z.union([flightEventSchema, hotelEventSchema, attractionEventSchema]);

export type FlightEvent = z.infer<typeof flightEventSchema>;
export type HotelEvent = z.infer<typeof hotelEventSchema>;
export type AttractionEvent = z.infer<typeof attractionEventSchema>;
export type Event = z.infer<typeof eventSchema>;

// Itinerary Day Schema
export const itineraryDaySchema = z.object({
  day_number: z.number(),
  date: z.string(), // YYYY-MM-DD format
  events: z.array(eventSchema).default([]),
});

export type ItineraryDay = z.infer<typeof itineraryDaySchema>;

// Itinerary Schema
export const itinerarySchema = z.object({
  trip_name: z.string(),
  start_date: z.string(), // YYYY-MM-DD format
  end_date: z.string(), // YYYY-MM-DD format
  origin: z.string(),
  destination: z.string(),
  days: z.array(itineraryDaySchema).default([]),
});

export type Itinerary = z.infer<typeof itinerarySchema>;

// API Response Schema
export const apiResponseSchema = z.object({
  chat_response: z.string(),
  itinerary_data: itinerarySchema.optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Chat Request Schema
export const chatRequestSchema = z.object({
  message: z.string(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
