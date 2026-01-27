import { Space } from "@/types";

export const spaces: Space[] = [
  {
    id: "1",
    name: "Modern Creative Studio",
    description: "A bright and spacious creative studio perfect for photoshoots, video production, and creative sessions. Features include professional lighting, white cyclorama wall, and prop storage.",
    type: "studio",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    price: 2500,
    priceUnit: "hour",
    capacity: 15,
    rating: 4.8,
    reviewCount: 124,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Parking", "Professional Lighting", "Sound System", "Kitchen"],
    host: {
      id: "h1",
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 4.9,
      verified: true
    },
    availability: true,
    featured: true
  },
  {
    id: "2",
    name: "Downtown Co-Working Space",
    description: "Premium co-working space in the heart of the business district. Perfect for freelancers, startups, and remote teams. Includes high-speed internet, meeting rooms, and coffee bar.",
    type: "workspace",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    price: 500,
    priceUnit: "day",
    capacity: 50,
    rating: 4.6,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Parking", "Coffee", "Meeting Rooms", "Printer"],
    host: {
      id: "h2",
      name: "Rahul Verma",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 4.7,
      verified: true
    },
    availability: true,
    featured: true
  },
  {
    id: "3",
    name: "Luxury Event Hall",
    description: "Elegant event hall suitable for weddings, corporate events, and large gatherings. Features stunning chandeliers, stage setup, and professional catering facilities.",
    type: "event",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    price: 150000,
    priceUnit: "day",
    capacity: 300,
    rating: 4.9,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f29da8ae39?w=800",
      "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Parking", "Catering", "Sound System", "Stage", "Projector"],
    host: {
      id: "h3",
      name: "Anjali Patel",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5.0,
      verified: true
    },
    availability: true,
    featured: true
  },
  {
    id: "4",
    name: "Boutique Co-Living Space",
    description: "Modern co-living apartment with private bedrooms and shared common areas. Perfect for young professionals and students. Fully furnished with amenities.",
    type: "stay",
    location: "Powai, Mumbai",
    city: "Mumbai",
    price: 25000,
    priceUnit: "month",
    capacity: 6,
    rating: 4.5,
    reviewCount: 67,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Parking", "Kitchen", "Laundry", "Gym", "Security"],
    host: {
      id: "h4",
      name: "Vikram Singh",
      avatar: "https://i.pravatar.cc/150?img=8",
      rating: 4.6,
      verified: true
    },
    availability: true,
    featured: false
  },
  {
    id: "5",
    name: "Tech Conference Room",
    description: "State-of-the-art conference room equipped with the latest technology. Ideal for meetings, presentations, and workshops. Seats up to 25 people comfortably.",
    type: "workspace",
    location: "Cyber City, Gurgaon",
    city: "Gurgaon",
    price: 3000,
    priceUnit: "hour",
    capacity: 25,
    rating: 4.7,
    reviewCount: 92,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Parking", "Projector", "Whiteboard", "Video Conferencing", "Coffee"],
    host: {
      id: "h5",
      name: "Sneha Reddy",
      avatar: "https://i.pravatar.cc/150?img=9",
      rating: 4.8,
      verified: true
    },
    availability: true,
    featured: true
  },
  {
    id: "6",
    name: "Rooftop Event Space",
    description: "Stunning rooftop venue with panoramic city views. Perfect for cocktail parties, product launches, and intimate gatherings. Features ambient lighting and bar setup.",
    type: "event",
    location: "Juhu, Mumbai",
    city: "Mumbai",
    price: 75000,
    priceUnit: "day",
    capacity: 100,
    rating: 4.9,
    reviewCount: 143,
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
    ],
    amenities: ["Wi-Fi", "Parking", "Bar", "Sound System", "Outdoor Seating", "Catering Kitchen"],
    host: {
      id: "h6",
      name: "Arjun Mehta",
      avatar: "https://i.pravatar.cc/150?img=13",
      rating: 4.9,
      verified: true
    },
    availability: true,
    featured: true
  },
  {
    id: "7",
    name: "Music Recording Studio",
    description: "Professional recording studio with high-end equipment and soundproofing. Includes mixing console, multiple microphones, and instrument collection.",
    type: "studio",
    location: "Versova, Mumbai",
    city: "Mumbai",
    price: 4000,
    priceUnit: "hour",
    capacity: 8,
    rating: 4.8,
    reviewCount: 78,
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800",
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800",
      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Parking", "Professional Equipment", "Instruments", "Soundproof"],
    host: {
      id: "h7",
      name: "DJ Rohan",
      avatar: "https://i.pravatar.cc/150?img=14",
      rating: 4.9,
      verified: true
    },
    availability: true,
    featured: false
  },
  {
    id: "8",
    name: "Quiet Study Space",
    description: "Peaceful and focused study environment for students and professionals. Features individual desks, power outlets, and a library atmosphere.",
    type: "workspace",
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    price: 200,
    priceUnit: "day",
    capacity: 30,
    rating: 4.4,
    reviewCount: 54,
    images: [
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"
    ],
    amenities: ["Wi-Fi", "AC", "Coffee", "Silent Zone", "Lockers", "Printer"],
    host: {
      id: "h8",
      name: "Meera Iyer",
      avatar: "https://i.pravatar.cc/150?img=10",
      rating: 4.5,
      verified: true
    },
    availability: true,
    featured: false
  }
];

export const amenitiesList = [
  "Wi-Fi",
  "AC",
  "Parking",
  "Projector",
  "Coffee",
  "Kitchen",
  "Sound System",
  "Whiteboard",
  "Video Conferencing",
  "Printer",
  "Professional Lighting",
  "Stage",
  "Catering",
  "Security",
  "Gym",
  "Laundry"
];
