import { Quote, Star } from "lucide-react";
import React from "react";
import { Ban, HeartPulse, MonitorSmartphone, Bus, Building2, Handshake, Factory, ShoppingBag, GraduationCap, Wheat, Plane, Bolt } from "lucide-react";

const ClientTrust = () => {
  const industries = [
  { name: "Banking", icon: Ban },
    { name: "Healthcare", icon: HeartPulse },
    { name: "Technology", icon: MonitorSmartphone },
    { name: "Transport", icon: Bus },
    { name: "Real Estate", icon: Building2 },
    { name: "NGOs", icon: Handshake },
    { name: "Manufacturing", icon: Factory },
    { name: "Retail", icon: ShoppingBag },
    { name: "Education", icon: GraduationCap },
    { name: "Agriculture", icon: Wheat },
    { name: "Tourism", icon: Plane },
    { name: "Energy", icon: Bolt }
  ];
  const testimonials = [
    {
      name: "Sarah Kimani",
      company: "Tech Startup CEO",
      content: "Galloways helped us secure comprehensive corporate insurance that protected our business during challenging times. Their expertise is unmatched.",
      rating: 5
    },
    {
      name: "David Ochieng",
      company: "Diaspora Client - UK",
      content: "As a Kenyan living in London, I needed insurance for my family back home. Galloways made the process seamless and gave me peace of mind.",
      rating: 5
    },
    {
      name: "Grace Wanjiku",
      company: "SME Owner",
      content: "From motor insurance to business cover, Galloways has been our trusted partner for over 5 years. Excellent service and competitive rates.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Client Trust Section
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Serving clients across industries locally & worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-accent" />
                <div className="flex ml-auto space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t pt-4">
                <div className="font-semibold text-primary">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Industry sectors */}
        <div className="bg-card p-8 rounded-lg">
          <h3 className="text-2xl font-semibold text-primary text-center mb-8">
            Industries We Serve
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {industries.map((industry, index) => (
              <div key={index} className="p-3 flex flex-col items-center">
                {React.createElement(industry.icon, { className: "h-14 w-14 text-accent mb-3" })}
                <div className="text-base font-semibold text-primary hover:text-accent transition-colors cursor-default">
                  {industry.name}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="text-lg font-semibold text-muted-foreground">Amongst many...</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">1000+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">14+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">99%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-muted-foreground">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientTrust;