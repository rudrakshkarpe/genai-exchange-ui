import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, type ApiResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for sending messages
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatRequestSchema.parse(req.body);
      
      // Mock API response - replace with real AI backend integration
      const response: ApiResponse = {
        chat_response: "This is a mock response from the backend. In the real app, this would connect to an AI service.",
        itinerary_data: undefined
      };
      
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
