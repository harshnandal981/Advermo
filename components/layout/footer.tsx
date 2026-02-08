import Link from "next/link";
import { Mail, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Advermo
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover & rent ad placements in high-traffic venues. From cafés to malls, reach your audience where they spend time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/spaces" className="hover:text-primary transition-colors">
                  Explore Ad Spaces
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-primary transition-colors">
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/spaces?type=cafe" className="hover:text-primary transition-colors">
                  Cafés & Coffee Shops
                </Link>
              </li>
              <li>
                <Link href="/spaces?type=gym" className="hover:text-primary transition-colors">
                  Gyms & Fitness
                </Link>
              </li>
              <li>
                <Link href="/spaces?type=mall" className="hover:text-primary transition-colors">
                  Shopping Malls
                </Link>
              </li>
              <li>
                <Link href="/spaces?type=college" className="hover:text-primary transition-colors">
                  Colleges & Campuses
                </Link>
              </li>
            </ul>
          </div>

          {/* Investor Info */}
          <div>
            <h3 className="font-semibold mb-4">For Investors</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <Link href="/pitch" className="hover:text-primary transition-colors">
                  Pitch Deck
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:invest@advermo.com" className="hover:text-primary transition-colors">
                  invest@advermo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Advermo. All rights reserved. Investor MVP Prototype</p>
        </div>
      </div>
    </footer>
  );
}
