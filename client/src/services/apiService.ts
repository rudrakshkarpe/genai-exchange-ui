// File: apiService.ts
// Handles API communication with the Trip Planner backend

import { v4 as uuidv4 } from 'uuid';
// No need for pako import as we're using backend's noCompress parameter

// Base URL of the backend service
const API_BASE_URL = "http://localhost:8080";
// const API_BASE_URL = "https://fastapi-app-683449264474.europe-west1.run.app";

// Session storage key
const SESSION_KEY = "trip_planner_session";

// Flag to use the backup direct API approach if sessions are failing
let USE_DIRECT_API = false;

interface Session {
  appName: string;
  userId: string;
  sessionId: string;
}

/**
 * Utility function to handle potentially binary or encoded responses
 * @param blob The blob containing response data
 * @returns Promise resolving to the response data as a string
 */
const handleResponseData = async (blob: Blob): Promise<string> => {
  try {
    console.log("Processing response data, size:", blob.size, "type:", blob.type);
    // Convert blob to text
    const text = await blob.text();
    
    // Check if text contains binary data markers (common in improperly decoded gzip)
    if (text.includes('�') || text.charCodeAt(0) === 0x1f || text.charCodeAt(1) === 0x8b) {
      console.log("Response appears to contain binary data - this may indicate compression issues");
      // In this case, we can't properly decode it without the pako library
      throw new Error("Response contains binary data that cannot be processed");
    }
    
    return text;
  } catch (error) {
    console.error("Failed to process response data:", error);
    throw error;
  }
};

/**
 * Creates or retrieves a session for the current user
 */
export const getOrCreateSession = async (): Promise<Session> => {
  // First check if we have an existing session in sessionStorage
  let existingSession = sessionStorage.getItem(SESSION_KEY);
  
  // If not in sessionStorage, try localStorage as a backup
  if (!existingSession) {
    try {
      existingSession = localStorage.getItem(SESSION_KEY);
      if (existingSession) {
        console.log("Found session in localStorage, copying to sessionStorage");
        sessionStorage.setItem(SESSION_KEY, existingSession);
      }
    } catch (storageError) {
      console.warn("Error accessing localStorage:", storageError);
    }
  }
  
  if (existingSession) {
    try {
      const session = JSON.parse(existingSession);
      console.log("Found existing session:", session.sessionId);
      
      // Verify the session still exists on the server
      const isValid = await checkSessionExists(session.appName, session.userId, session.sessionId);
      if (isValid) {
        console.log("Using existing session:", session.sessionId);
        return session;
      } else {
        console.log("Existing session no longer valid, creating new one");
        // Clear invalid session
        sessionStorage.removeItem(SESSION_KEY);
        try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
      }
    } catch (error) {
      console.error("Error parsing stored session:", error);
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
  
  // Create a new session - using exact values from test_run_endpoint.py
  const appName = "agents";
  const userId = "test-user"; // Using fixed user ID as in test script
  const sessionId = uuidv4();
  
  console.log(`Creating new session with appName=${appName}, userId=${userId}, sessionId=${sessionId}`);
  const session = { appName, userId, sessionId };
  
  try {
    // Prepare the session creation payload
    const payload = {
      appName,
      userId,
      sessionId,
      description: "Session created from TravelMate.ai UI"
    };
      console.log("Creating new session with payload:", payload);
    
    // Create session on the backend - use the exact format from test_run_endpoint.py
    const sessionUrl = `${API_BASE_URL}/apps/${appName}/users/${userId}/sessions`;
    console.log(`Creating session at URL: ${sessionUrl}`);
    
    const response = await fetch(sessionUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Session creation error details:", errorText);
      throw new Error(`Failed to create session: ${response.status} ${response.statusText}`);
    }

    // Try to get the response body for debugging
    let responseData;
    try {
      responseData = await response.json();
      console.log("Session creation response:", responseData);
    } catch (e) {
      console.log("No JSON response body from session creation");
    }    
    
    // Store the session in both sessionStorage (for current tab) and localStorage (for persistence)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    try {
      // Also store in localStorage for persistence across page reloads
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (storageError) {
      console.warn("Could not store session in localStorage:", storageError);
    }
    
    console.log("Created new session:", sessionId);
    return session;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Checks if a session exists on the server
 */
export const checkSessionExists = async (appName: string, userId: string, sessionId: string): Promise<boolean> => {
  try {
    console.log(`Checking if session exists: ${appName}/${userId}/${sessionId}`);
    
    // Log the exact URL we're using
    const sessionUrl = `${API_BASE_URL}/apps/${appName}/users/${userId}/sessions/${sessionId}`;
    console.log(`Checking session URL: ${sessionUrl}`);
    
    // First, try specific session endpoint - changed from GET to POST based on test_run_endpoint.py
    try {
      const payload = {
        appName,
        userId,
        sessionId
      };
      
      const response = await fetch(sessionUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        console.log(`Session ${sessionId} exists and is valid`);
        return true;
      } else {
        console.log(`Session check failed with status: ${response.status} ${response.statusText}`);
        
        // Try to get more details about the error
        try {
          const errorText = await response.text();
          console.log(`Session verification error details: ${errorText}`);
        } catch (e) {
          console.log("Could not read error details");
        }
      }
    } catch (specificError) {
      console.log("Error checking specific session:", specificError);
    }
    
    // If specific check fails, try to list all sessions and check if this one is included
    try {
      const listSessionsUrl = `${API_BASE_URL}/apps/${appName}/users/${userId}/sessions`;
      console.log(`Listing all sessions at URL: ${listSessionsUrl}`);
      
      // Changed from GET to POST based on test_run_endpoint.py
      const payload = {
        appName,
        userId
      };
      
      const response = await fetch(listSessionsUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // Get response as text first to handle potential encoding issues
        const responseText = await response.text();
        console.log("Raw sessions list response length:", responseText.length);
        
        let sessions;
        try {
          sessions = JSON.parse(responseText);
          console.log("All available sessions:", sessions);
        } catch (jsonError) {
          console.error("Error parsing sessions JSON:", jsonError);
          console.log("First 200 chars of sessions response:", responseText.substring(0, 200));
          return false;
        }
        
        // Check if our session is in the list
        if (Array.isArray(sessions)) {
          // If it's an array of sessions
          for (const session of sessions) {
            if (
              (session.sessionId && session.sessionId === sessionId) ||
              (session.id && session.id === sessionId)
            ) {
              console.log(`Session ${sessionId} found in sessions list`);
              return true;
            }
          }
        } else if (typeof sessions === 'object' && sessions !== null) {
          // It might be an object with different structure
          if (
            (sessions.sessionId && sessions.sessionId === sessionId) || 
            (sessions.id && sessions.id === sessionId) ||
            (sessions.sessions && Array.isArray(sessions.sessions) && 
             sessions.sessions.some((s: any) => 
               (s.sessionId === sessionId) || (s.id === sessionId)
             ))
          ) {
            console.log(`Session ${sessionId} found in sessions object`);
            return true;
          }
        }
        
        console.log(`Session ${sessionId} not found in available sessions`);
      }
    } catch (listError) {
      console.log("Error listing all sessions:", listError);
    }
    
    return false;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
};

/**
 * Sends a message to the AI backend and returns the response
 */
export const sendMessage = async (message: string): Promise<any> => {
  try {
    // If we're in direct API mode due to session failures, use that approach
    if (USE_DIRECT_API) {
      return sendMessageDirectApi(message);
    }
    
    try {
      // Get or create a session
      const session = await getOrCreateSession();
      
      // Construct payload for the /run endpoint
      const payload = {
        appName: session.appName,
        userId: session.userId,
        sessionId: session.sessionId,
        newMessage: {
          role: "user",
          parts: [
            {
              text: message
            }
          ]
        },
        streaming: false
      };

      console.log("Sending message to backend:", message);
      console.log("Using session:", session);
      
      // Send request to the /run endpoint
      console.log("Sending API request to:", `${API_BASE_URL}/run`);
      console.log("Request payload:", JSON.stringify(payload, null, 2));
      
      // Add a query parameter to bypass gzip compression - VERY IMPORTANT
      const runEndpointUrl = `${API_BASE_URL}/run?noCompress=true`;
      console.log("Using modified URL with compression bypass:", runEndpointUrl);
      
      const response = await fetch(runEndpointUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Skip the Accept-Encoding header to avoid getting compressed responses
        },
        body: JSON.stringify(payload)
      });

      console.log("Received response with status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Details:", errorText);
        console.error(`API request failed with status ${response.status} ${response.statusText}`);
        console.error("Request headers:", payload);
        
        // If the error is related to the session, we should try to create a new one
        if (response.status === 404 || response.status === 401) {
          console.log("Session-related error detected, will try with a new session");
          sessionStorage.removeItem(SESSION_KEY);
          try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      // Parse and return the response
      try {      
        // We're using ?noCompress=true so we shouldn't need to handle compression
        const contentEncoding = response.headers.get('Content-Encoding');
        console.log("Response Content-Encoding:", contentEncoding);
        
        // Get the response as text directly since we're using noCompress
        let responseText;
        try {
          responseText = await response.text();
          console.log("Response text length:", responseText.length);
          
          // Check if the response text has binary data markers
          if (responseText.includes('�') || 
              (responseText.length > 1 && responseText.charCodeAt(0) === 0x1f && responseText.charCodeAt(1) === 0x8b)) {
            console.log("Response appears to contain binary data despite noCompress parameter");
            // Return a fallback response if we detect binary data
            return [{
              content: "I'm processing your request. Please give me a moment to generate your travel plans."
            }];
          }
        } catch (textError) {
          console.error("Failed to get response as text:", textError);
          // Try as blob as a fallback
          const responseBlob = await response.blob();
          console.log("Response blob size:", responseBlob.size);
          console.log("Response blob type:", responseBlob.type);
          
          try {
            responseText = await responseBlob.text();
          } catch (blobError) {
            console.error("Failed to get blob as text:", blobError);
            // Return a fallback response if all else fails
            return [{
              content: "I'm processing your request. Please give me a moment to generate your travel plans."
            }];
          }
        }
        
        let data;
        try {
          // Try to parse as JSON directly
          data = JSON.parse(responseText);
          console.log("Successfully parsed response as JSON");
        } catch (jsonError) {
          console.error("Failed to parse as JSON:", jsonError);
          
          // If we still couldn't parse it even after using noCompress
          console.log("First 200 chars after processing:", responseText.substring(0, 200));
          
          // Check for binary data indicators
          if (responseText.includes('�')) {
            console.log("Response still appears to contain binary data");
            
            // Return a fallback response
            return [{
              content: "I'm working on your travel plans. The response format requires additional processing."
            }];
          } else {
            console.log("First 200 chars of response:", responseText.substring(0, 200));
            
            // Return generic fallback if we can't determine the format
            return [{
              content: "I'm processing your request. Please give me a moment to generate your travel plans."
            }];
          }
        }
        
        console.log("Received response from backend:", data);
        return data;
      } catch (parseError) {
        console.error("Error processing response:", parseError);
        
        // The backend reported a utf-8 decoding error, so we'll try to handle it differently
        // Return a simple response object with a message
        return [{
          content: "I'm processing your request. Please give me a moment to generate your travel plans."
        }];
      }
    } catch (sessionError) {
      console.error("Session-based API call failed, trying direct API approach:", sessionError);
      USE_DIRECT_API = true;
      return sendMessageDirectApi(message);
    }
  } catch (error) {
    console.error("All API approaches failed:", error);
    throw error;
  }
};

/**
 * Alternative method to send messages directly to the API without session management
 * This is used as a fallback if the session-based approach fails
 */
async function sendMessageDirectApi(message: string): Promise<any> {
  try {
    // Create payload for direct API call - exactly matching test script format
    const sessionId = "fallback-session-" + Date.now();
    const payload = {
      appName: "agents",
      userId: "test-user", // Use the same userId as the test script
      sessionId: sessionId,
      newMessage: {
        role: "user",
        parts: [{ text: message }]
      },
      streaming: false
    };
      
    console.log("Using direct API fallback approach");
    console.log("Direct API request payload:", JSON.stringify(payload, null, 2));
      
    // Add a query parameter to bypass gzip compression
    const directRunEndpointUrl = `${API_BASE_URL}/run?noCompress=true`;
    console.log("Using modified direct API URL with compression bypass:", directRunEndpointUrl);
    
    // Simple direct API call without proper session management
    const response = await fetch(directRunEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Skip the Accept-Encoding header to avoid getting compressed responses
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Direct API response status:", response.status);
      
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Direct API error details:", errorText);
      throw new Error(`Direct API call failed: ${response.status}`);
    }
    
    try {
      // We're using ?noCompress=true so we shouldn't need to handle compression
      const contentEncoding = response.headers.get('Content-Encoding');
      console.log("Direct API Response Content-Encoding:", contentEncoding);
      
      // Get the response as text directly
      let responseText;
      try {
        responseText = await response.text();
        console.log("Direct API Response text length:", responseText.length);
        
        // Check if the response text has binary data markers
        if (responseText.includes('�') || 
            (responseText.length > 1 && responseText.charCodeAt(0) === 0x1f && responseText.charCodeAt(1) === 0x8b)) {
          console.log("Direct API response appears to contain binary data despite noCompress parameter");
          // Return a fallback response if we detect binary data
          return [{
            content: "I'm processing your request. Please give me a moment to generate your travel plans."
          }];
        }
      } catch (textError) {
        console.error("Failed to get direct API response as text:", textError);
        // Return a fallback response
        return [{
          content: "I'm processing your request. Please give me a moment to generate your travel plans."
        }];
      }
        
      let data;
      try {
        // Try to parse as JSON directly
        data = JSON.parse(responseText);
        console.log("Successfully parsed direct API response as JSON");
      } catch (jsonError) {
        console.error("Error parsing direct API JSON:", jsonError);
        
        // If we still couldn't parse it even after using noCompress
        if (responseText.includes('�')) {
          console.log("Direct API response still appears to contain binary data");
          
          // Return a fallback response
          return [{
            content: "I'm working on your travel plans. The response format requires additional processing."
          }];
        } else {
          console.log("First 200 chars of direct API response:", responseText.substring(0, 200));
          
          // Return generic fallback
          return [{
            content: "I'm processing your request. Please give me a moment to generate your travel plans."
          }];
        }
      }
      
      console.log("Direct API response data:", data);
      return data;
    } catch (parseError) {
      console.error("Error processing direct API response:", parseError);
      
      // Return a simple response object with a message
      return [{
        content: "I'm processing your request. Please give me a moment to generate your travel plans."
      }];
    }
  } catch (error) {
    console.error("Direct API call failed:", error);
    throw error;
  }
}

/**
 * Resets the current session, forcing a new one to be created on the next API call
 */
export const resetSession = async (): Promise<void> => {
  console.log("Resetting session");
  
  // Clear any session from both storage types
  sessionStorage.removeItem(SESSION_KEY);
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (storageError) {
    console.warn("Error accessing localStorage during reset:", storageError);
  }
  
  // Reset direct API mode flag
  USE_DIRECT_API = false;
  
  try {
    // Create a new session immediately
    const session = await getOrCreateSession();
    console.log("Created new session during reset:", session);
    
    // Clear any state in memory that might be using the old session
    
    // If we made it here, the reset was successful
    return;
  } catch (error) {
    console.error("Error creating new session during reset:", error);
    throw error;
  }
};

/**
 * Parses AI response to extract text and potential itinerary data
 */
export const parseAIResponse = (responseData: any) => {
  try {
    console.log("Parsing API response:", typeof responseData);
    if (typeof responseData === 'object') {
      console.log("Response keys:", Object.keys(responseData));
    }
    
    // Safeguard: if the response is null or undefined, return a default message
    if (!responseData) {
      console.log("Received empty response data");
      return {
        text: "I'm ready to help you plan your trip! What destination are you interested in?",
        itinerary: null
      };
    }

    // For now, just extract the text from the first content event
    // In a production app, we would properly parse structured data
    let responseText = "";
    let itineraryData = null;
    
    // Handle non-array response by wrapping it in an array
    const dataToProcess = Array.isArray(responseData) ? responseData : [responseData];
    
    // Concatenate all text content from response events
    const textParts: string[] = [];
    
    for (const event of dataToProcess) {
      console.log("Processing response event:", event);
      
      // Direct text content in the event
      if (event.content && event.content.parts && Array.isArray(event.content.parts)) {
        for (const part of event.content.parts) {
            if (part.text && typeof part.text === 'string') {
            textParts.push(part.text.trim());
            }
        }
      }
      
      // Handle candidates array format
      if (event.candidates && Array.isArray(event.candidates)) {
        for (const candidate of event.candidates) {
          if (candidate.content) {
            if (typeof candidate.content === 'string' && candidate.content.trim()) {
              textParts.push(candidate.content.trim());
            } else if (candidate.content.parts && Array.isArray(candidate.content.parts)) {
              for (const part of candidate.content.parts) {
                if (part.text && typeof part.text === 'string') {
                  textParts.push(part.text.trim());
                }
              }
            }
          }
        }
      }
      
      // Handle nested candidates object format
      if (event.candidates && event.candidates.content) {
        if (typeof event.candidates.content === 'string') {
          textParts.push(event.candidates.content.trim());
        }
      }
      
      // Simple text format directly in the event
      if (event.text && typeof event.text === 'string') {
        textParts.push(event.text.trim());
      }
      
      // Handle parts array directly in the event
      if (event.parts && Array.isArray(event.parts)) {
        for (const part of event.parts) {
            if (part.text && typeof part.text === 'string') {
            textParts.push(part.text.trim());
            }
        }
      }
      
      // Try to extract potential itinerary JSON data from any text content
      try {
        let contentToSearch = "";
        if (event.content && typeof event.content === 'string') {
          contentToSearch = event.content;
        } else if (event.text && typeof event.text === 'string') {
          contentToSearch = event.text;
        }
        
        if (contentToSearch) {
          const jsonMatch = contentToSearch.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const potentialJson = JSON.parse(jsonMatch[0]);
            if (potentialJson.trip_name && potentialJson.days) {
              itineraryData = potentialJson;
            }
          }
        }
      } catch (jsonError) {
        console.log("Error parsing potential JSON in response:", jsonError);
      }
    }
    
    // Join all text parts into a single response
    responseText = textParts.join('\n\n');
    console.log("Extracted text parts:", textParts);
    
    if (!responseText) {
      console.warn("No text content found in response");
      responseText = "I'm working on your travel plans. What specific aspects of your trip would you like me to help with?";
    }
    
    return {
      text: responseText,
      itinerary: itineraryData
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      text: "I'm here to help you plan your trip! What destination are you thinking about?",
      itinerary: null
    };
  }
};