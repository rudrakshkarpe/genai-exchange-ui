import { z } from "zod";

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(["user", "ai"]),
  content: z.string(),
  timestamp: z.date(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Activity Schema
export const activitySchema = z.object({
  id: z.string(),
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export type Activity = z.infer<typeof activitySchema>;

// Day Schema
export const daySchema = z.object({
  id: z.string(),
  dayNumber: z.number(),
  title: z.string(),
  activities: z.array(activitySchema),
});

export type Day = z.infer<typeof daySchema>;

// Itinerary Schema
export const itinerarySchema = z.object({
  id: z.string(),
  title: z.string(),
  destination: z.string(),
  dates: z.string(),
  days: z.array(daySchema),
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
