import { Compass, Sparkles, Target } from "lucide-react";

const VisionMission = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-accent/10 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Our Commitment to Excellence
          </h2>
          <p className="text-lg text-muted-foreground italic">
            "Protecting Dreams and Preserving Wealth"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Vision Card */}
          <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-accent/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground leading-relaxed text-base">
                To deliver exceptional insurance services by combining industry
                expertise, innovation, and integrity, ensuring every client
                receives the most suitable protection for their needs.
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground leading-relaxed text-base">
                To redefine the insurance experience through superior service,
                strong partnerships, and unwavering commitment to customer
                success.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values - Optional decorative element */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4 max-w-4xl">
            {[
              "Integrity",
              "Excellence",
              "Innovation",
              "Customer Focus",
              "Partnership",
              "Professionalism",
              "Teamwork",
            ].map((value) => (
              <div
                key={value}
                className="px-4 py-2 bg-card border border-accent/30 rounded-full text-sm font-medium text-primary hover:bg-accent/10 transition-colors">
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
