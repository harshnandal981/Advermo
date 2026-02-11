"use client";

import Link from "next/link";
import { Moon, Sun, Menu, User, LogOut, LayoutDashboard, Calendar, Heart } from "lucide-react";
import { useTheme } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "@/components/auth/auth-modal";
import FavoritesBadge from "@/components/favorites/favorites-badge";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleSignIn = () => {
    setAuthView('login');
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    setAuthView('signup');
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setUserMenuOpen(false);
  };

  return (
    <>
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
            {session?.user.role === 'brand' && (
              <Link href="/bookings" className="text-sm font-medium hover:text-primary transition-colors">
                My Bookings
              </Link>
            )}
            {session?.user.role === 'venue' && (
              <>
                <Link href="/host" className="text-sm font-medium hover:text-primary transition-colors">
                  My Dashboard
                </Link>
                <Link href="/host/bookings" className="text-sm font-medium hover:text-primary transition-colors">
                  Manage Bookings
                </Link>
              </>
            )}
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Why Advermo
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {session?.user.role === 'brand' && <FavoritesBadge />}
            
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
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{session.user.name}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-background border rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        <p className="text-xs text-primary mt-1 capitalize">{session.user.role}</p>
                      </div>
                      {session.user.role === 'brand' && (
                        <Link
                          href="/bookings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      )}
                      {session.user.role === 'venue' && (
                        <>
                          <Link
                            href="/host"
                            className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            href="/host/bookings"
                            className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Manage Bookings</span>
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors text-red-600 dark:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={handleSignIn}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={handleGetStarted}>Get Started</Button>
                </>
              )}
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
              {session?.user.role === 'brand' && (
                <>
                  <Link href="/favorites" className="text-sm font-medium hover:text-primary transition-colors">
                    My Favorites
                  </Link>
                  <Link href="/bookings" className="text-sm font-medium hover:text-primary transition-colors">
                    My Bookings
                  </Link>
                </>
              )}
              {session?.user.role === 'venue' && (
                <>
                  <Link href="/host" className="text-sm font-medium hover:text-primary transition-colors">
                    My Dashboard
                  </Link>
                  <Link href="/host/bookings" className="text-sm font-medium hover:text-primary transition-colors">
                    Manage Bookings
                  </Link>
                </>
              )}
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                Why Advermo
              </Link>
              {session ? (
                <>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{session.user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={handleSignIn}>
                    Sign In
                  </Button>
                  <Button size="sm" className="flex-1" onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultView={authView}
      />
    </>
  );
}
