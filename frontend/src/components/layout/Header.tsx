import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { getMainLogoUrl } from "../../lib/assets";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Claims", href: "/claims" },
  // Pension tab removed
  { name: "Diaspora", href: "/diaspora" },
  { name: "Consultancy", href: "/consultancy" },
  { name: "Quotes", href: "/quotes" },
  { name: "Outsourcing", href: "/outsourcing" },
  // Downloads tab removed
  ];

  return (
  <header className="bg-background border-b shadow-sm sticky top-0 z-50">
      {/* Top bar removed for contact migration */}

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center py-2 md:py-3">
          <Link to="/" className="flex items-center space-x-2" style={{ alignItems: 'center' }}>
            <img
              src={getMainLogoUrl()}
              alt="Galloways Logo"
              className="h-14 w-14 md:h-20 md:w-20 object-cover rounded-full mr-3 drop-shadow-lg bg-transparent border-2 border-white"
              style={{ background: 'transparent', mixBlendMode: 'multiply', marginBottom: '0.5rem' }}
            />
            <div className="hidden lg:block text-lg md:text-xl font-bold text-primary whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '16rem' }}>
              Galloways Insurance Agencies & Consultancy Services
            </div>
            <div className="block lg:hidden text-base font-bold text-primary">
              Galloways Insurance Agencies & Consultancy Services
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 md:space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-accent transition-colors font-medium text-sm md:text-base"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 md:space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/quotes">Get Quote</Link>
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" asChild>
              <Link to="/consultancy">Book Consultation</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md border border-gray-200 bg-white/80 shadow-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background">
            <nav className="py-2 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-foreground hover:text-accent transition-colors text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 space-y-2">
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/quotes">Get Quote</Link>
                </Button>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" asChild>
                  <Link to="/consultancy">Book Consultation</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
