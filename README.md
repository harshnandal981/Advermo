# SpaceHub - Space Rental Marketplace

> **Modern, Investor-Ready MVP Prototype**

A high-fidelity prototype for a space rental marketplace connecting space seekers with verified hosts. Built with Next.js 14, TypeScript, and Tailwind CSS.

![SpaceHub Banner](https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop)

## 🎯 Project Overview

SpaceHub is an investor-focused MVP prototype demonstrating a scalable platform for listing and booking rentable spaces including:

- 🏢 **Workspaces** - Co-working spaces, offices, meeting rooms
- 🎭 **Event Halls** - Venues for weddings, parties, conferences
- 🎨 **Studios** - Photography, recording, creative spaces
- 🏠 **Co-Living** - Shared accommodation for professionals

## ✨ Features

### For Guests
- 🔍 Advanced search with filters (price, type, capacity, amenities)
- 📍 Location-based space discovery
- ⭐ Ratings and reviews system (UI)
- 📅 Availability calendar (UI mock)
- 💳 Secure booking interface

### For Hosts
- 📝 Multi-step onboarding flow
- 📊 Dashboard with metrics and analytics
- 💰 Revenue tracking
- 📨 Booking request management
- 📸 Photo gallery management

### Design Features
- 🌓 **Light/Dark Mode** with persistence
- 📱 **Fully Responsive** design
- 🎨 **Modern UI** with smooth animations
- ⚡ **Fast Performance** with Next.js 14
- 🎯 **Investor-Ready** presentation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand
- **Forms**: React Hook Form
- **Image Carousel**: Embla Carousel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open your browser**
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
│   ├── spaces/            # Space listing & details
│   └── host/              # Host dashboard & onboarding
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, WhyUs, Metrics
│   ├── ui/                # Reusable UI components
│   └── providers/         # Theme provider
├── lib/
│   ├── data.ts            # Dummy data for spaces
│   ├── store.ts           # Zustand store (theme)
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/                # Static assets
```

## 🎨 Color Palette

- **Primary**: Indigo/Purple (`#8B5CF6`)
- **Accent**: Neon Cyan (`#00D9FF`)
- **Background**: 
  - Light: `#FFFFFF`
  - Dark: `#0A0A0F` (true dark)

## 📊 Investor Highlights

### Market Opportunity
- 💰 **$50B+** global flexible space market
- 📈 **Growing demand** for remote work & event spaces
- 🌍 **Expanding** to 100+ cities

### Revenue Model
- 💵 **10-15% commission** per booking
- 💎 **Premium host subscriptions**
- ⭐ **Featured listing packages**

### Traction (Mock Data)
- 📍 500+ active listings
- 🌆 50+ cities covered
- 📖 10,000+ bookings completed
- 💰 ₹2.5 Cr GMV generated

## 🔐 Authentication (UI Only)

Currently displays UI for:
- Login/Signup modals
- Social authentication (Google)
- User roles (Guest/Host)

*Backend integration pending for production*

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Landing page
- ✅ Space listings with filters
- ✅ Space details page
- ✅ Host dashboard
- ✅ Light/Dark mode

### Phase 2 (Next)
- ⏳ Real authentication (Firebase/Auth0)
- ⏳ Payment integration (Stripe/Razorpay)
- ⏳ Real-time booking calendar
- ⏳ Review & rating system
- ⏳ Host verification

### Phase 3 (Future)
- ⏳ Mobile app (React Native)
- ⏳ Advanced analytics
- ⏳ AI-powered recommendations
- ⏳ Multi-language support

## 📧 Contact

For investor inquiries:
- **Email**: invest@spacehub.com
- **Pitch Deck**: [Download PDF]

## 📄 License

This is a prototype project for demonstration purposes.

---

**Built with ❤️ for investors and space enthusiasts**
