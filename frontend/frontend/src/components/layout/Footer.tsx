import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Galloways</h3>
            <p className="text-sm opacity-90">
              Professional insurance agencies and consultancy services, managing
              risk and arranging insurance solutions tailored to customers'
              needs.
            </p>
            <p className="text-sm font-semibold text-accent italic">
              "Protecting Dreams and Preserving Wealth"
            </p>
            <div className="space-y-2 text-xs opacity-80">
              <p>
                <strong>Our Vision:</strong> To deliver exceptional insurance
                services by combining industry expertise, innovation, and
                integrity, ensuring every client receives the most suitable
                protection for their needs.
              </p>
              <p>
                <strong>Our Mission:</strong> To redefine the insurance
                experience through superior service, strong partnerships, and
                unwavering commitment to customer success.
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://x.com/gallowaysinsurance"
                target="_blank"
                rel="noopener noreferrer"
                title="X (formerly Twitter)">
                <Twitter className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              </a>
              <a
                href="https://facebook.com/gallowaysinsurance"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook">
                <Facebook className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              </a>
              <a
                href="https://instagram.com/gallowaysinsurance"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram">
                <Instagram className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              </a>
              <a
                href="https://linkedin.com/company/gallowaysinsurance"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn">
                <Linkedin className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              </a>
              <a href="mailto:Gallowayunderwritting@gmail.com" title="Email">
                <Mail className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm opacity-90 hover:text-accent transition-colors">
                  Insurance Products
                </Link>
              </li>
              <li>
                <Link
                  to="/claims"
                  className="text-sm opacity-90 hover:text-accent transition-colors">
                  Claims
                </Link>
              </li>
              <li>
                <Link
                  to="/diaspora"
                  className="text-sm opacity-90 hover:text-accent transition-colors">
                  Diaspora Services
                </Link>
              </li>
              <li>
                <Link
                  to="/consultancy"
                  className="text-sm opacity-90 hover:text-accent transition-colors">
                  Consultancy
                </Link>
              </li>
              <li>
                <Link
                  to="/quotes"
                  className="text-sm opacity-90 hover:text-accent transition-colors">
                  Get Quote
                </Link>
              </li>
              {/* <li><Link to="/downloads" className="text-sm opacity-90 hover:text-accent transition-colors">Forms & Downloads</Link></li> */}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-sm opacity-90">Health Insurance</li>
              <li className="text-sm opacity-90">Motor Insurance</li>
              <li className="text-sm opacity-90">Life Insurance</li>
              <li className="text-sm opacity-90">Property Insurance</li>
              <li className="text-sm opacity-90">Travel Insurance</li>
              <li className="text-sm opacity-90">Corporate Packages</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+254720769993 / +254758301346</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">underwriting@galloways.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">quotations@galloways.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">customerservice@galloways.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Claims@galloways.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@galloways.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Live Chat Widget */}
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white rounded-full shadow-lg flex items-center px-4 py-2 border border-primary">
              <span className="mr-2 text-primary font-semibold">Live Chat</span>
              <button
                className="bg-primary text-white rounded-full px-3 py-1 font-bold hover:bg-primary/90 focus:outline-none"
                onClick={() =>
                  window.open(
                    "https://wa.me/254720769993?text=Hello%20Galloways%20Insurance%20Agency%20-%20I%20need%20assistance",
                    "_blank"
                  )
                }>
                WhatsApp Chat
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="text-sm opacity-90">
              © 2025 Galloways Insurance Agencies & Consultancy Services. All
              rights reserved.
            </div>
            <div className="text-sm opacity-90 md:ml-4">
              Licensed by Insurance Regulatory Authority (IRA) Kenya
            </div>
            <div className="text-sm opacity-90 md:ml-4">
              Powered by <span className="font-bold tracking-wide">CIPHER</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
