import { Award, Users, Clock, CheckCircle } from "lucide-react";

const ExpertTeam = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Meet Our Expert Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Led by industry professionals with decades of experience in insurance and risk management
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">
                    William Sialuma Analo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Principal Consultant & Managing Director
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>Chartered Insurance Diploma by the Chartered Insurance Institute of London by qualifications.</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>Certified claim specialist and certified specialist in insurance commercial contract wording by the Chartered Insurance Institute of London.</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>14+ Years Industry Experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>Certified Risk Management Specialist</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="bg-accent/10 p-3 rounded-full w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Clients Served</div>
              </div>
              <div className="text-center p-4">
                <div className="bg-accent/10 p-3 rounded-full w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center p-4">
                <div className="bg-accent/10 p-3 rounded-full w-fit mx-auto mb-3">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary">IRA</div>
                <div className="text-sm text-muted-foreground">Licensed Agency</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-8 rounded-2xl">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-primary">
                Why Choose Our Expertise?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Professional Qualifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Certified by international insurance institutes with proven track record
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Local Market Knowledge</h4>
                    <p className="text-sm text-muted-foreground">
                      Deep understanding of Kenyan insurance market and regulatory environment
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Personalized Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Tailored insurance solutions designed to meet your specific needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Global Perspective</h4>
                    <p className="text-sm text-muted-foreground">
                      Serving clients locally and worldwide with international best practices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertTeam;