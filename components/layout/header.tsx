"use client";

import Link from "next/link";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Advermo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/spaces" className="text-sm font-medium hover:text-primary transition-colors">
            Explore Ad Spaces
          </Link>
          <Link href="/host" className="text-sm font-medium hover:text-primary transition-colors">
            List Your Venue
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            Why Advermo
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/spaces" className="text-sm font-medium hover:text-primary transition-colors">
              Explore Ad Spaces
            </Link>
            <Link href="/host" className="text-sm font-medium hover:text-primary transition-colors">
              List Your Venue
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Why Advermo
            </Link>
            <div className="flex space-x-2 pt-2">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
