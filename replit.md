# TravelMate.ai - AI Trip Planner

## Overview

TravelMate.ai is a modern AI-powered trip planning application that provides users with personalized travel itineraries through a conversational chat interface. The application features a clean, two-panel layout where users interact with an AI assistant in real-time to plan their trips, with generated itineraries displayed dynamically alongside the conversation.

The MVP focuses on creating an intuitive chat experience where travelers can describe their dream trips and receive detailed, organized itinerary recommendations. The application is built with modern web technologies and follows a mobile-first responsive design approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for application state, with TanStack Query for server state management
- **UI Framework**: Custom design system built on Radix UI primitives with Tailwind CSS
- **Component Library**: Shadcn/ui components following a design system inspired by Notion and Linear

### Design System
- **Color Scheme**: Dual-mode design (light/dark) with warm off-white backgrounds and vibrant blue accents
- **Typography**: Inter for body text and Poppins for headings
- **Layout**: Two-panel desktop layout (65% chat interface, 35% itinerary display) with mobile-responsive collapsible panels
- **Spacing**: Consistent Tailwind spacing units (2, 4, 6, 8) for unified visual rhythm

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints with JSON communication
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage for MVP with plans for database persistence

### Data Models
- **Chat Messages**: User and AI message objects with timestamps and unique IDs
- **Itinerary Structure**: Trip objects containing day-by-day breakdowns with typed events (flights, hotels, attractions)
- **Event Types**: Strongly typed event system supporting flights, accommodations, and activities with specific metadata

### Authentication & Security
- Currently uses session-based storage for conversation persistence
- Prepared for future integration with authentication providers
- CORS and security middleware configured for production deployment

### Mobile Experience
- Responsive design with mobile-first approach
- Touch-friendly interface with appropriate sizing for mobile interactions
- Collapsible layout that prioritizes chat interface on mobile devices

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle with automatic migrations and type generation
- **Deployment**: Replit hosting with integrated development environment

### UI & Design
- **Component Library**: Radix UI for accessible, unstyled component primitives
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Inter, Poppins) for typography

### Development Tools
- **Build Tool**: Vite with React plugin and TypeScript support
- **Code Quality**: ESLint and TypeScript for code consistency
- **Package Management**: npm with lockfile for reproducible builds

### Future AI Integration
- Architecture prepared for AI service integration (OpenAI, Anthropic, etc.)
- Mock responses currently implemented for frontend development
- API structure designed to accommodate real-time streaming responses

### Additional Libraries
- **Date Handling**: date-fns for consistent date formatting and manipulation
- **Form Management**: React Hook Form with Zod validation schemas
- **Carousel**: Embla Carousel for potential image galleries in itineraries
- **Utility**: clsx and class-variance-authority for conditional styling