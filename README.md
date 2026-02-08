# Advermo - Advertising Space Marketplace

> **Airbnb for Ad Spaces** | Investor-Ready MVP Prototype

A high-fidelity prototype marketplace connecting brands with venue owners for real-world advertising placements. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Advermo Banner](https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop)

## 🎯 Project Overview

Advermo is an investor-focused MVP demonstrating a scalable platform for discovering and booking advertising spaces in high-traffic physical venues across India.

### The Concept

**"Offline advertising meets modern marketplace"**

Brands struggle to find and book physical ad placements with verified footfall data. Venue owners have unused wall space, screens, and surfaces. Advermo bridges this gap with transparent pricing, verified metrics, and instant booking.

## ✨ Features

### For Advertisers
- 🔍 **Smart Search** - Filter by footfall, demographics, venue type, and ad format
- 📊 **Verified Metrics** - Daily footfall and monthly impression data
- 💰 **CPM-Based Pricing** - Transparent cost-per-thousand-impressions
- 📍 **Location Discovery** - Find ad spots across major Indian cities
- ⭐ **Ratings & Reviews** - Verified campaign performance data

### For Venue Owners
- 💵 **Monetize Space** - Turn walls, screens, and surfaces into revenue
- 📝 **Easy Onboarding** - Multi-step listing flow with metrics input
- 📊 **Campaign Dashboard** - Track active campaigns and earnings
- 📈 **Analytics** - Monitor impressions and campaign performance
- ✅ **Verification Badge** - Build trust with verified footfall data

### Platform Features
- 🌓 **Light/Dark Mode** with localStorage persistence
- 📱 **Fully Responsive** design for mobile and desktop
- 🎨 **Modern UI/UX** with smooth animations
- ⚡ **Fast Performance** powered by Next.js 14
- 🎯 **Investor-Ready** presentation and metrics

## 🏢 Sample Use Cases

1. **D2C Food Brand** renting café table tents to reach young professionals during breakfast rush
2. **Gym Supplement Company** booking wall posters in premium fitness centers
3. **EdTech Startup** targeting college cafeteria screens for student reach
4. **SaaS Platform** placing counter branding in co-working spaces for B2B exposure
5. **E-commerce Brand** securing mall digital screens during festival season

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Image Carousel**: Embla Carousel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/harshnandal981/Advermo.git
cd Advermo
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with theme
│   ├── page.tsx           # Landing page
│   ├── spaces/            # Ad space listings & details
│   │   ├── page.tsx       # Listings with filters
│   │   └── [id]/page.tsx  # Ad space details
│   └── host/              # Venue owner dashboard
│       ├── page.tsx       # Dashboard with metrics
│       └── new/page.tsx   # List new ad spot
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, WhyUs, Metrics, Featured
│   ├── ui/                # Reusable UI components
│   └── providers/         # Theme provider
├── lib/
│   ├── data.ts            # Sample ad space data
│   ├── store.ts           # Zustand store (theme)
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/                # Static assets
```

## 🎨 Ad Space Types

The platform supports diverse advertising formats:

- **Poster Walls** - Traditional print ads (4x6 ft, 8x4 ft)
- **Digital Screens** - Dynamic content displays (43", 55", large format)
- **Table Tents** - Countertop placements in cafés/restaurants
- **Counter Branding** - Reception/POS area visibility
- **Menu Inserts** - High-engagement during ordering
- **Outdoor Billboards** - Large format external displays

## 📊 Investor Highlights

### Market Opportunity
- 💰 **$10B+ hyperlocal advertising market** in India
- 📈 **30% YoY growth** in offline-to-online ad transition
- 🎯 **SMB & D2C brands** need measurable offline reach
- 🏙️ **Tier 1 & 2 cities** expanding rapidly

### Revenue Model
- 💵 **10-15% commission** per campaign booking
- 💎 **Premium subscriptions** for featured venue listings
- ⭐ **Verified badge packages** for venue owners
- 📊 **Analytics upsell** for campaign performance tracking

### Traction (Mock Data for Prototype)
- 📍 **1,200+ active ad spots** across major cities
- 🏢 **100+ venue partners** (cafés, gyms, malls, colleges, transit)
- 👁️ **5M+ monthly impressions** aggregated
- 💰 **₹50L GMV generated** in mock campaigns

### Unit Economics
- **Average Campaign Value**: ₹15,000 - ₹50,000/month
- **Commission per Campaign**: ₹2,250 - ₹7,500
- **LTV:CAC Ratio**: 3:1 projected
- **Gross Margin**: 85%+ (marketplace model)

## 🌟 Sample Venues

Our prototype includes realistic data from:

- **CCD Coffee, Koramangala** - Digital screens in startup hub
- **Gold's Gym, Pune** - Wall posters targeting fitness enthusiasts
- **Phoenix Mall, Chennai** - Billboard with 20K daily footfall
- **IIT Delhi Cafeteria** - Table tents reaching 8K students daily
- **Delhi Metro, Rajiv Chowk** - Platform ads with 50K impressions
- **Social Café, Hauz Khas** - Menu inserts for affluent millennials
- **WeWork BKC, Mumbai** - Counter branding for B2B audience

## 🔐 Authentication (UI Only)

Currently displays UI mockups for:
- Login/Signup flows
- Social authentication
- User roles (Advertiser/Venue Owner)

*Backend integration pending for production*

## 🗺️ Roadmap

### Phase 1 (Current - MVP Prototype)
- ✅ Landing page with hero & metrics
- ✅ Ad space listings with advanced filters
- ✅ Ad space detail pages
- ✅ Venue owner dashboard
- ✅ Campaign-focused onboarding flow
- ✅ Light/Dark mode
- ✅ Responsive design

### Phase 2 (Production Preparation)
- ⏳ Real authentication (Firebase/Auth0)
- ⏳ Payment integration (Razorpay/Stripe)
- ⏳ Campaign calendar & booking system
- ⏳ Review & rating implementation
- ⏳ Venue verification workflow
- ⏳ Image upload & management

### Phase 3 (Scale & Growth)
- ⏳ Real-time campaign analytics
- ⏳ AI-powered recommendations
- ⏳ Multi-city expansion tools
- ⏳ Mobile app (React Native)
- ⏳ API for third-party integrations
- ⏳ Advanced reporting dashboard

## 🎯 Target Audience

### Advertisers
- D2C brands seeking offline reach
- Local businesses (restaurants, salons, retail)
- EdTech companies targeting students
- Fitness & wellness brands
- SaaS platforms (B2B)

### Venue Owners
- Café & restaurant chains
- Gym & fitness center networks
- Shopping malls
- Educational institutions
- Transit authorities
- Co-working spaces

## 📧 Contact

For investor inquiries:
- **Email**: invest@advermo.com
- **Pitch Deck**: [Request Access]
- **Demo**: [Schedule Call]

## 📄 License

This is a prototype project for demonstration and investor presentation purposes.

## 🙏 Acknowledgments

Built with modern web technologies:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set

---

**Built with ❤️ for the future of hyperlocal advertising**

*Connecting brands with audiences where they spend time, one venue at a time.*
