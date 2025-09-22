# TravelMate.ai Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern productivity tools like Notion and Linear, combined with conversational interfaces like ChatGPT, to create a clean, functional AI trip planning experience.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 220 85% 55% (vibrant blue for CTAs and active states)
- Background: 45 25% 97% (warm off-white)
- Surface: 0 0% 100% (pure white for cards)
- Text Primary: 220 15% 15% (dark charcoal)
- Text Secondary: 220 10% 45% (medium gray)

**Dark Mode:**
- Primary: 220 85% 65% (slightly lighter blue)
- Background: 220 15% 10% (dark blue-gray)
- Surface: 220 10% 15% (elevated dark surface)
- Text Primary: 220 5% 90% (light gray)
- Text Secondary: 220 5% 65% (medium light gray)

### B. Typography
- **Primary**: Inter (Google Fonts) - for body text, chat interface
- **Headings**: Poppins (Google Fonts) - for trip titles, section headers
- **Sizes**: text-sm to text-lg range, with text-xl for main headings

### C. Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px)  
- Section spacing: p-6, m-6 (24px)
- Large spacing: p-8, m-8 (32px)

### D. Component Library

**Header**: Clean minimal header with TravelMate.ai logo (left-aligned), height h-16

**Two-Panel Layout**:
- Chat Interface: 65% width on desktop, full width on mobile
- Itinerary Panel: 35% width on desktop, slides up on mobile

**Chat Interface**:
- Message bubbles with rounded corners (rounded-2xl)
- User messages: Primary blue background, white text, right-aligned
- AI messages: Surface background, primary text, left-aligned
- Input field: Rounded input with send button and microphone placeholder icon

**Itinerary Display**:
- Trip title card with clean typography
- Day cards with subtle borders and hover states
- Activity items with time stamps and descriptions
- Smooth scrolling behavior

**Interactive Elements**:
- Buttons: Primary style with blue background, outline variants with blurred backgrounds when over images
- Hover states: Subtle scale/shadow transitions
- Focus states: Blue outline for accessibility

### E. Visual Hierarchy
- Use consistent spacing (2, 4, 6, 8) for rhythm
- Leverage font weights (400, 500, 600) for emphasis
- Apply subtle shadows for depth (shadow-sm, shadow-md)
- Maintain generous whitespace for clarity

### F. Responsive Behavior
- Desktop: Side-by-side panels
- Tablet: Collapsible itinerary panel
- Mobile: Stacked layout with slide-up itinerary

## Images
No large hero image required. The interface relies on the clean two-panel layout with the TravelMate.ai logo as the primary brand element. Consider small destination thumbnail images within itinerary items if needed, sourced from travel APIs.