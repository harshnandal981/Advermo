# Space Rental Marketplace - Copilot Instructions

## Project Overview
Modern, investor-ready MVP prototype for a space rental marketplace (workspaces, studios, venues, meeting rooms, event halls, co-living spaces).

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- React Hook Form
- Zustand for state management

## Design Guidelines
- Modern startup-grade design
- Color scheme: Indigo/Electric Blue/Purple primary, Neon Cyan/Green accent
- Light and dark mode support
- Responsive design (desktop + mobile)
- Soft shadows, rounded cards
- Smooth animations and micro-interactions

## Code Standards
- Use TypeScript strict mode
- Follow Next.js 14 app router conventions
- Component-first architecture
- Reusable UI components in components/ directory
- Keep business logic in lib/ utilities
- Type definitions in types/ directory

## Project Structure
```
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Landing page
│   ├── spaces/            # Space listing & details
│   │   ├── page.tsx       # Listings with filters
│   │   └── [id]/page.tsx  # Space details
│   └── host/              # Host dashboard & onboarding
│       ├── page.tsx       # Dashboard
│       └── new/page.tsx   # Add new listing
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, WhyUs, Metrics, FeaturedSpaces
│   ├── ui/                # Button, SpaceCard
│   └── providers/         # ThemeProvider
├── lib/
│   ├── data.ts            # Dummy space data
│   ├── store.ts           # Zustand store for theme
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/                # Static assets
```

## Features Implemented
✅ Landing page with hero, search, filters, stats
✅ Featured spaces section
✅ Why Us section with problem/solution/revenue model
✅ Metrics section with growth indicators
✅ Spaces listing page with advanced filters
✅ Filter by: price, type, capacity, amenities
✅ Sort by: price, rating, popularity
✅ Space details page with image gallery
✅ Amenities display, host profile
✅ Calendar UI mock, map mock
✅ Booking interface (UI only)
✅ Host dashboard with metrics
✅ Host onboarding multi-step form
✅ Light/Dark mode with localStorage persistence
✅ Fully responsive design
✅ Modern animations and transitions

## Running the Project
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Next Steps for Production
- Integrate real authentication (Firebase/Auth0)
- Add payment processing (Stripe/Razorpay)
- Implement real booking calendar
- Add review & rating system
- Host verification process
- Image upload functionality
- Real-time notifications
- Advanced search with map integration
