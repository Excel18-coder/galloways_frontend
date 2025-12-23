import BrochureDownload from "@/components/forms/BrochureDownload";
import ConsultationBookingForm from "@/components/forms/ConsultationBookingForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  consultationsService,
  paymentsService,
  type ConsultType,
} from "@/lib/api";
import {
  BookOpen,
  Building,
  FileCheck,
  Heart,
  Landmark,
  Monitor,
  Shield,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function Consultancy() {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const { toast } = useToast();
  const [openServiceIdx, setOpenServiceIdx] = useState<number | null>(null);

  const handleMPesaPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPaymentLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const paymentData = {
        full_name: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        amount: parseInt(formData.get("amount") as string) || 2000,
        consult_type: formData.get("consultType") as string,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
      };
      if (
        !paymentData.phone ||
        !paymentData.full_name ||
        !paymentData.date ||
        !paymentData.time
      ) {
        throw new Error("Please fill in all required fields");
      }
      const phoneRegex = /^(\+254|0)?7\d{8}$/;
      if (!phoneRegex.test(paymentData.phone)) {
        throw new Error(
          "Please enter a valid Kenyan phone number (format: +254712345678 or 0712345678)"
        );
      }
      // Create consultation record first
      console.log("📋 Creating consultation record...", paymentData);
      const consultationData = {
        full_name: paymentData.full_name,
        phone: paymentData.phone,
        email: (formData.get("email") as string) || "", // Add email field, fallback to empty string if not provided
        organization: (formData.get("organization") as string) || "", // Add organization field, fallback to empty string if not provided
        consult_type: "General Consultation" as ConsultType,
        preferred_date: paymentData.date,
        preferred_time: paymentData.time,
        consultationDate: paymentData.date, // Required field for ConsultationData
        consultationTime: paymentData.time, // Required field for ConsultationData
        message: `M-PESA consultation booking - Amount: KES ${paymentData.amount}`,
        status: "PENDING",
      };

      console.log("📋 Sending consultation data to API:", consultationData);
      const consultationResult = await consultationsService.createConsultation(
        consultationData
      );
      console.log("📋 Consultation API response:", consultationResult);

      if (!consultationResult.success) {
        throw new Error(
          consultationResult.message || "Failed to create consultation record"
        );
      }

      // Create payment record for M-PESA
      const paymentRecord = {
        amount: paymentData.amount,
        currency: "KES",
        paymentMethod: "M-PESA",
        paymentProvider: "Safaricom",
        transactionId: `MPESA-${Date.now()}`,
        reference: `CONS-${consultationResult.data?.id || Date.now()}`,
        status: "PENDING",
        customerEmail: (formData.get("email") as string) || "",
        customerPhone: paymentData.phone,
        customerName: paymentData.full_name,
        description: `M-PESA consultation booking - ${paymentData.consult_type}`,
        consultationId: consultationResult.data?.id,
        metadata: {
          consultationType: paymentData.consult_type,
          date: paymentData.date,
          time: paymentData.time,
          serviceType: "consultation",
        },
      };

      console.log("💳 Creating payment record:", paymentRecord);
      const paymentResult = await paymentsService.createPayment(paymentRecord);
      console.log("💳 Payment record created:", paymentResult);

      // Simulate M-PESA payment (replace with actual M-PESA integration)
      toast({
        title: "M-PESA Payment Initiated",
        description: `Payment request sent to ${paymentData.phone}. Please check your phone and enter your M-PESA PIN to complete the payment.`,
      });

      setTimeout(async () => {
        // Update payment status to completed after simulated success
        if (paymentResult.success && paymentResult.data?.id) {
          try {
            await paymentsService.processPayment(
              paymentResult.data.id.toString(),
              {
                status: "COMPLETED",
                transactionId: `MPESA-SUCCESS-${Date.now()}`,
                completedAt: new Date().toISOString(),
              }
            );
            console.log("💳 Payment status updated to COMPLETED");
          } catch (error) {
            console.error("Failed to update payment status:", error);
          }
        }

        toast({
          title: "Payment Successful!",
          description:
            "Your consultation has been booked. You'll receive a confirmation SMS with booking details.",
        });
      }, 10000);
    } catch (error: unknown) {
      console.error("M-PESA payment error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process M-PESA payment. Please try again.";
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleProjectConsultationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const projectData = {
        full_name: formData.get("projName") as string,
        phone: formData.get("projPhone") as string,
        email: (formData.get("projEmail") as string) || "",
        organization: (formData.get("projOrganization") as string) || "",
        consult_type: "General Consultation" as ConsultType,
        preferred_date: new Date().toISOString().split("T")[0],
        preferred_time: new Date().toTimeString().split(" ")[0],
        consultationDate: new Date().toISOString().split("T")[0], // Required field
        consultationTime: new Date().toTimeString().split(" ")[0], // Required field
        message: formData.get("projDesc") as string,
        status: "PENDING",
      };

      console.log("📋 Submitting project consultation to API...", projectData);
      const result = await consultationsService.createConsultation(projectData);

      if (result.success) {
        toast({
          title: "Project Consultation Request Submitted",
          description:
            result.message ||
            "We'll review your project requirements and get back to you with a customized proposal within 2 business days.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(
          result.message || "Failed to submit consultation request"
        );
      }
    } catch (error: unknown) {
      console.error("Project consultation submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit consultation request. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const serviceDetails = [
    {
      title: "Risk Assessment",
      details: (
        <div>
          <h2 className="text-xl font-bold mb-2">Risk Assessment</h2>
          <ul className="list-disc ml-6 mb-2">
            <li>Comprehensive evaluation of business and personal risks</li>
            <li>Enterprise risk analysis and vulnerability assessment</li>
            <li>Actionable mitigation strategies</li>
          </ul>
          <h3 className="font-semibold mb-1">Benefits:</h3>
          <ul className="list-disc ml-6">
            <li>Identify exposures before they become losses</li>
            <li>Tailored recommendations for your unique needs</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Corporate Structuring",
      details: (
        <div>
          <h2 className="text-xl font-bold mb-2">Corporate Structuring</h2>
          <ul className="list-disc ml-6 mb-2">
            <li>Optimize insurance coverage for businesses</li>
            <li>Cost management and policy structuring</li>
            <li>Benefits design for staff and stakeholders</li>
          </ul>
          <h3 className="font-semibold mb-1">Why Choose Us?</h3>
          <ul className="list-disc ml-6">
            <li>Expert guidance on policy selection</li>
            <li>Maximize value for your insurance spend</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Claims Audits",
      details: (
        <div>
          <h2 className="text-xl font-bold mb-2">Claims Audits</h2>
          <ul className="list-disc ml-6 mb-2">
            <li>Review and analysis of claims settlements</li>
            <li>Process improvement and documentation audit</li>
          </ul>
          <h3 className="font-semibold mb-1">Key Points:</h3>
          <ul className="list-disc ml-6">
            <li>Ensure fair settlements</li>
            <li>Identify areas for improvement</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Policy Reviews",
      details: (
        <div>
          <h2 className="text-xl font-bold mb-2">Policy Reviews</h2>
          <ul className="list-disc ml-6 mb-2">
            <li>Coverage gap analysis and policy comparison</li>
            <li>Cost-benefit analysis and renewal strategy</li>
          </ul>
          <h3 className="font-semibold mb-1">Why Review?</h3>
          <ul className="list-disc ml-6">
            <li>Identify gaps and overlaps</li>
            <li>Optimize your insurance portfolio</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Workshops & Training",
      details: (
        <div>
          <h2 className="text-xl font-bold mb-2">Workshops & Training</h2>
          <ul className="list-disc ml-6 mb-2">
            <li>Insurance literacy and claims management</li>
            <li>Risk awareness and best practices</li>
          </ul>
          <h3 className="font-semibold mb-1">Who Should Attend?</h3>
          <ul className="list-disc ml-6">
            <li>Individuals and organizations seeking insurance knowledge</li>
            <li>Staff training for compliance and efficiency</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Online Training",
      details: (
        <div>
          <h2 className="text-xl font-bold mb-2">Online Training</h2>
          <ul className="list-disc ml-6 mb-2">
            <li>Self-paced learning and interactive modules</li>
            <li>Certification programs and resource library</li>
          </ul>
          <h3 className="font-semibold mb-1">Advantages:</h3>
          <ul className="list-disc ml-6">
            <li>Flexible access from anywhere</li>
            <li>Up-to-date content from industry experts</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Expert Insurance Advisory with Galloways
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Professional consultancy services to help you navigate complex
              insurance landscapes and optimize your coverage strategy
            </p>
            <div className="mb-6">
              <span className="inline-block bg-accent text-primary font-semibold px-4 py-2 rounded shadow">
                <strong>
                  Now Offering Insurance Product Awareness Inhouse & Online
                </strong>
              </span>
            </div>
            <div className="mt-6 space-y-4 text-base text-muted-foreground">
              <p>
                With over 12 years experience on credit file underwriting for a
                leading reputable bank, Equity Bank K Ltd.
              </p>
              <ul className="list-disc ml-6">
                <li>
                  Advising on the correct insurance devices on the offer letter
                  sanction conditions for all facilities, i.e. asset finance,
                  project finance, trade finance, mortgages, business loans,
                  corporate loans.
                </li>
                <li>
                  Handling the insurance renewals on the bank loan book and bank
                  assets.
                </li>
                <li>
                  Handling insurance technical inquiries from the bank's legal
                  and risk department including credit analysts.
                </li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary" className="px-8 py-3">
                    Book Consultation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <ConsultationBookingForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Comprehensive Consultancy Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Leverage our 14+ years of expertise to make informed insurance
                decisions
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Risk Assessment",
                  description:
                    "Comprehensive evaluation of your business or personal risks with detailed recommendations for mitigation strategies.",
                  icon: <Shield className="w-8 h-8" />,
                  features: [
                    "Enterprise Risk Analysis",
                    "Personal Risk Profiling",
                    "Vulnerability Assessment",
                    "Mitigation Strategies",
                  ],
                },
                {
                  title: "Corporate Structuring",
                  description:
                    "Strategic insurance structuring for businesses to optimize coverage while managing costs effectively.",
                  icon: <TrendingUp className="w-8 h-8" />,
                  features: [
                    "Coverage Optimization",
                    "Cost Management",
                    "Policy Structuring",
                    "Benefits Design",
                  ],
                },
                {
                  title: "Claims Audits",
                  description:
                    "Professional claims auditing services to ensure fair settlements and identify improvement opportunities.",
                  icon: <FileCheck className="w-8 h-8" />,
                  features: [
                    "Claims Review",
                    "Settlement Analysis",
                    "Process Improvement",
                    "Documentation Audit",
                  ],
                },
                {
                  title: "Policy Reviews",
                  description:
                    "Thorough analysis of existing insurance policies to identify gaps, overlaps, and optimization opportunities.",
                  icon: <FileCheck className="w-8 h-8" />,
                  features: [
                    "Coverage Gap Analysis",
                    "Policy Comparison",
                    "Cost-Benefit Analysis",
                    "Renewal Strategy",
                  ],
                },
                {
                  title: "Workshops & Training",
                  description:
                    "Educational workshops and training sessions for individuals and organizations on insurance best practices.",
                  icon: <Users className="w-8 h-8" />,
                  features: [
                    "Insurance Literacy",
                    "Claims Management",
                    "Risk Awareness",
                    "Best Practices",
                  ],
                },
                {
                  title: "Online Training",
                  description:
                    "Flexible online training programs covering various aspects of insurance and risk management.",
                  icon: <Monitor className="w-8 h-8" />,
                  features: [
                    "Self-Paced Learning",
                    "Interactive Modules",
                    "Certification Programs",
                    "Resource Library",
                  ],
                },
              ].map((service, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <div className="text-primary">{service.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Dialog
                    open={openServiceIdx === index}
                    onOpenChange={(open) =>
                      setOpenServiceIdx(open ? index : null)
                    }>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        aria-label={`Learn more about ${service.title}`}>
                        Learn More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg animate-fade-in">
                      {serviceDetails[index].details}
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>

            {/* Financial Services & Banking */}
            <h3 className="text-2xl font-bold text-center mb-8">
              Financial Services & Banking
            </h3>
            <Card className="p-6 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    Credit File Insurance Underwriting & De-risking
                  </h4>
                  <p className="text-muted-foreground">
                    Comprehensive insurance solutions for all banking financial
                    products
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  "Asset Finance",
                  "Trade Finance",
                  "Project Finance",
                  "Mortgage Finance",
                  "Business Loans",
                  "Corporate Loans",
                  "Revolving Fund Loans",
                  "Cash Cover Loans",
                  "Bank Guarantee Loans",
                  "Overdraft Loans",
                  "Working Capital Loans",
                  "Import Based Asset Finance",
                  "SME Loans (Lower, Medium & Upper)",
                  "Agricultural Loans",
                ].map((product, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs mr-1 mb-1">
                    {product}
                  </Badge>
                ))}
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Ensuring underwriting thresholds meet cover scope, terms &
                  conditions
                </li>
              </ul>
            </Card>

            {/* NGOs Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8">
                NGOs & Development Organizations
              </h3>
              <Card className="p-6 mb-8">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        Insurance Risk Mitigation on Target Social Segments
                      </h4>
                      <p className="text-muted-foreground">
                        Tailored insurance solutions aligned with NGO core
                        strategies, innovation and objectives
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        category: "Education NGOs",
                        icon: <BookOpen className="w-4 h-4" />,
                      },
                      {
                        category: "Agricultural NGOs",
                        icon: <Building className="w-4 h-4" />,
                      },
                      {
                        category: "Health NGOs",
                        icon: <Heart className="w-4 h-4" />,
                      },
                      {
                        category: "Social Change NGOs",
                        icon: <Users className="w-4 h-4" />,
                      },
                      {
                        category: "Technical Support NGOs",
                        icon: <Monitor className="w-4 h-4" />,
                      },
                      {
                        category: "Youth NGOs",
                        icon: <Users className="w-4 h-4" />,
                      },
                      {
                        category: "Business International NGOs",
                        icon: <Building className="w-4 h-4" />,
                      },
                      {
                        category: "Advocacy NGOs",
                        icon: <Shield className="w-4 h-4" />,
                      },
                      {
                        category: "Natural Environment NGOs",
                        icon: <Building className="w-4 h-4" />,
                      },
                      {
                        category: "Human Rights Campaigns",
                        icon: <Shield className="w-4 h-4" />,
                      },
                      {
                        category: "Development Projects NGOs",
                        icon: <Building className="w-4 h-4" />,
                      },
                      {
                        category: "Asset Management NGOs",
                        icon: <TrendingUp className="w-4 h-4" />,
                      },
                    ].map((ngo, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-primary">{ngo.icon}</div>
                          <h5 className="font-medium text-sm">
                            {ngo.category}
                          </h5>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Other Industries Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  industry: "Healthcare",
                  icon: <Heart className="w-6 h-6" />,
                  specialties: [
                    "Medical Malpractice",
                    "Equipment Cover",
                    "Patient Data Protection",
                    "Business Interruption",
                  ],
                },
                {
                  industry: "Technology",
                  icon: <Monitor className="w-6 h-6" />,
                  specialties: [
                    "Cyber Liability",
                    "Errors & Omissions",
                    "Intellectual Property",
                    "Data Breach Coverage",
                  ],
                },
                {
                  industry: "Transport & Logistics",
                  icon: <Truck className="w-6 h-6" />,
                  specialties: [
                    "Fleet Insurance",
                    "Cargo Coverage",
                    "Transit Insurance",
                    "Third Party Liability",
                  ],
                },
                {
                  industry: "Real Estate",
                  icon: <Building className="w-6 h-6" />,
                  specialties: [
                    "Property Development",
                    "Construction Insurance",
                    "Professional Indemnity",
                    "Public Liability",
                  ],
                },
                {
                  industry: "Manufacturing",
                  icon: <Building className="w-6 h-6" />,
                  specialties: [
                    "Industrial All Risks",
                    "Product Liability",
                    "Business Interruption",
                    "Equipment Breakdown",
                  ],
                },
                {
                  industry: "Education",
                  icon: <BookOpen className="w-6 h-6" />,
                  specialties: [
                    "Student Insurance",
                    "Professional Indemnity",
                    "Public Liability",
                    "Campus Protection",
                  ],
                },
              ].map((industry, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                      <div className="text-primary">{industry.icon}</div>
                    </div>
                    <h3 className="font-semibold text-sm">
                      {industry.industry}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {industry.specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs mr-1 mb-1">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 mt-4 border-gold text-gold font-bold">
                Request Project-Based Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Project-Based Consultation Request
              </h3>
              <form
                className="space-y-4"
                onSubmit={handleProjectConsultationSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projName">Full Name</Label>
                    <Input
                      id="projName"
                      name="projName"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projEmail">Email</Label>
                    <Input
                      id="projEmail"
                      name="projEmail"
                      type="email"
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="projPhone">Phone</Label>
                  <Input
                    id="projPhone"
                    name="projPhone"
                    required
                    placeholder="e.g. +254712345678"
                  />
                </div>
                <div>
                  <Label htmlFor="projDesc">Project Description</Label>
                  <Textarea
                    id="projDesc"
                    name="projDesc"
                    required
                    placeholder="Describe your project needs, current challenges, objectives, and expected outcomes"
                  />
                </div>
                <div>
                  <Label htmlFor="projDuration">Estimated Duration</Label>
                  <Input
                    id="projDuration"
                    name="projDuration"
                    required
                    placeholder="e.g. 3 months"
                  />
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Pricing subject to contractual agreement and project scope.
                  Our team will get back to you with a tailored proposal
                  including timeline, deliverables, and investment requirements.
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gold text-primary font-bold"
                  type="submit">
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payment Information Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 rounded-xl shadow-lg border-2 border-primary/20">
              <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                Alternative Payment Methods
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* M-PESA Paybill */}
                <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/30 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-accent/20 p-2 rounded-lg mr-3">
                        <Monitor className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-primary">
                          M-PESA Paybill
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Recommended
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 bg-card p-4 rounded-lg">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm font-medium text-muted-foreground">
                        Paybill Number
                      </span>
                      <span className="text-lg font-bold font-mono text-primary">
                        880100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Account Number
                      </span>
                      <span className="text-lg font-bold font-mono text-primary">
                        203282
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-xs text-center font-medium">
                      GALLOWAY INSURANCE AGENCIES
                    </p>
                  </div>
                </Card>

                {/* M-PESA Buy Goods (Till) */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-primary/20 p-2 rounded-lg mr-3">
                        <Landmark className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-primary">
                          M-PESA Buy Goods
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Till Number
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 bg-card p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Till Number
                      </span>
                      <span className="text-lg font-bold font-mono text-primary">
                        6203056
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-center font-medium">
                      GALLOWAY INSURANCE AGENCIES
                    </p>
                  </div>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Note:</strong> After making payment through any of the
                  above methods, please keep your transaction reference for
                  confirmation. You can also proceed with the automated M-PESA
                  STK Push below for instant payment processing.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 rounded-xl shadow-lg border-2 border-primary">
              <h2 className="text-3xl font-bold mb-4 text-primary">
                Book a Local Consultation – Pay via M-PESA (KES)
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                KES <span className="font-bold text-gold">2,000</span> per hour.
                Payment must be completed to confirm booking.
              </p>
              <form className="space-y-6" onSubmit={handleMPesaPayment}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (M-PESA)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      required
                      placeholder="e.g. +254712345678"
                      pattern="^(\+254|0)?7\d{8}$"
                      title="Please enter a valid Kenyan mobile number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (KES)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    defaultValue={2000}
                    min={2000}
                    step={2000}
                    readOnly
                    className="bg-muted/50"
                  />
                  <small className="text-muted-foreground">
                    Fixed: 2,000 KES for 1 hour. Enter multiples for more hours.
                  </small>
                </div>
                <div>
                  <Label htmlFor="consultType">
                    Preferred Consultation Type
                  </Label>
                  <select
                    id="consultType"
                    name="consultType"
                    title="Select consultation type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required>
                    <option value="">Select type</option>
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required />
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gold text-primary font-bold"
                  type="submit"
                  disabled={isPaymentLoading}>
                  {isPaymentLoading
                    ? "Processing M-PESA Payment..."
                    : "Pay & Book via M-PESA"}
                </Button>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Secure M-PESA payment processing. After payment, you will
                  receive a booking confirmation via SMS/email with your
                  consultation details.
                </div>
              </form>
            </Card>
            <div className="mt-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Optimize Your Insurance Strategy?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Let our expert consultants help you navigate the complex world
                of insurance and risk management
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8 py-3">
                      Book Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <ConsultationBookingForm />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="px-8 py-3">
                      Download Brochure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <BrochureDownload />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
