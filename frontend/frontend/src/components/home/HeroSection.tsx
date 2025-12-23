import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Manage risk, arrange
                <span className="text-accent"> insurance solutions</span>{" "}
                tailored to customers' needs
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Professional insurance agency and consultancy services with our
                trusted business partners
              </p>
              <p className="text-lg md:text-xl font-semibold text-accent italic">
                "Protecting Dreams and Preserving Wealth"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg"
                asChild>
                <Link to="/quotes">
                  Get a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-4 text-lg"
                asChild>
                <Link to="/consultancy">Book Consultation</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <div className="text-sm opacity-90">14+ Years Experience</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div className="text-sm opacity-90">1000+ Clients Served</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div className="text-sm opacity-90">
                  99% Client Satisfaction
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-accent/20 rounded-full w-96 h-96 flex items-center justify-center">
                <Shield className="h-48 w-48 text-accent opacity-50" />
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">IRA</div>
                <div className="text-sm">Licensed</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-foreground text-primary p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
