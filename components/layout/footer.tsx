import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Advermo
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect. Advertise. Grow.
            </p>
            <p className="text-xs text-muted-foreground">
              Premium advertising spaces marketplace connecting brands with perfect venues.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://twitter.com/advermo"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/advermo"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/advermo"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/spaces" className="hover:text-primary transition-colors">
                  For Brands
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-primary transition-colors">
                  For Venue Owners
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/spaces" className="hover:text-primary transition-colors">
                  Browse Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Advermo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
