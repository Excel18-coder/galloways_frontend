import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { diasporaService, paymentsService } from "@/lib/api";
import { Calendar, Clock, Globe, Heart, Home, Shield } from "lucide-react";
import { useState } from "react";

export default function Diaspora() {
  const [isPaying, setIsPaying] = useState(false);

  const loadPaystack = async () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as unknown as { PaystackPop?: unknown }).PaystackPop)
        return resolve();
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Paystack script"));
      document.body.appendChild(script);
    });
  };
  return (
    <div className="h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Serving Kenyans Abroad with Reliable Insurance Solutions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              No matter where you are in the world, we're here to protect your
              loved ones back home with comprehensive insurance coverage
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-3"
              onClick={() => {
                // Open WhatsApp with predefined message
                const phoneNumber =
                  import.meta.env.VITE_WHATSAPP_NUMBER || "+254720769993";
                const message = encodeURIComponent(
                  "Hello! I'm interested in diaspora insurance services. Could you please provide me with more information?"
                );
                window.open(
                  `https://wa.me/${phoneNumber}?text=${message}`,
                  "_blank"
                );
              }}>
              Talk to a Diaspora Advisor
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Comprehensive Services for Diaspora
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tailored insurance solutions designed specifically for Kenyans
                living abroad
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Family Health Cover",
                  description:
                    "Comprehensive medical insurance for your family members in Kenya, covering inpatient, outpatient, maternity, and emergency services.",
                  icon: <Heart className="w-8 h-8" />,
                  features: [
                    "Inpatient & Outpatient Cover",
                    "Maternity Benefits",
                    "Emergency Services",
                    "Specialist Consultations",
                    "Prescription Coverage",
                  ],
                },
                {
                  title: "Funeral & Life Policies",
                  description:
                    "Provide financial security and dignified farewell arrangements for your loved ones with our life and funeral insurance policies.",
                  icon: <Shield className="w-8 h-8" />,
                  features: [
                    "Life Insurance Coverage",
                    "Funeral Expense Cover",
                    "Burial Assistance",
                    "Repatriation Cover",
                    "Grief Support Services",
                  ],
                },
                {
                  title: "Property & Mortgage Cover",
                  description:
                    "Protect your investments in Kenya including homes, rental properties, and commercial buildings against various risks.",
                  icon: <Home className="w-8 h-8" />,
                  features: [
                    "Residential Property",
                    "Commercial Buildings",
                    "Mortgage Protection",
                    "Contents Insurance",
                    "Rental Income Protection",
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h4 className="text-lg font-bold mb-2">
                        About {service.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                      <ul className="list-disc pl-5 text-sm">
                        {service.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs text-primary">
                        Contact us for more details on {service.title} for
                        diaspora clients.
                      </p>
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Time Zone Booking */}
        {/* Diaspora Consultation Payment Section (PayPal) */}
        {/* Project-Based Consultation Button & Modal */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
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
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projName">Full Name</Label>
                    <Input
                      id="projName"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projEmail">Email</Label>
                    <Input
                      id="projEmail"
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
                    required
                    placeholder="e.g. +254712345678"
                  />
                </div>
                <div>
                  <Label htmlFor="projDesc">Project Description</Label>
                  <Textarea
                    id="projDesc"
                    required
                    placeholder="Describe your project needs"
                  />
                </div>
                <div>
                  <Label htmlFor="projDuration">Estimated Duration</Label>
                  <Input
                    id="projDuration"
                    required
                    placeholder="e.g. 3 months"
                  />
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Pricing subject to contractual agreement and duration. Our
                  team will get back to you with a tailored proposal.
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gold text-primary font-bold">
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
                        <Globe className="w-6 h-6 text-accent" />
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
                        <Home className="w-6 h-6 text-primary" />
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

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-accent/20">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">
                      Our Tagline
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      "Protecting Dreams and Preserving Wealth"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      All payments should be made to:{" "}
                      <span className="font-medium">
                        GALLOWAY INSURANCE AGENCIES
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Note:</strong> After making payment through any of the
                  above methods, please keep your transaction reference for
                  confirmation. International clients can use PayPal or bank
                  transfer options for convenient payments.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 rounded-xl shadow-lg border-2 border-primary">
              <h2 className="text-3xl font-bold mb-4 text-primary">
                Book a Diaspora Consultation – Pay via Paystack (KES)
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                KES <span className="font-bold text-gold">3,235</span> per hour.
                Consultation is activated after payment confirmation.
              </p>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsPaying(true);

                  try {
                    // Get form data
                    const formData = new FormData(e.target as HTMLFormElement);
                    const email =
                      formData.get("email")?.toString().trim() || "";
                    const fullName =
                      formData.get("fullName")?.toString().trim() || "";
                    const phone =
                      formData.get("phone")?.toString().trim() || "";
                    const country =
                      formData.get("country")?.toString().trim() || "";
                    const details =
                      formData.get("details")?.toString().trim() || "";
                    const amount = parseInt(
                      formData.get("amount")?.toString() || "3235"
                    );
                    const consultTime =
                      formData.get("consultTime")?.toString() || "";

                    // Validate required fields
                    if (
                      !email ||
                      !fullName ||
                      !phone ||
                      !country ||
                      !details ||
                      !consultTime
                    ) {
                      alert("Please fill in all required fields");
                      setIsPaying(false);
                      return;
                    }

                    // Format the date for backend
                    const formattedConsultTime = new Date(
                      consultTime
                    ).toISOString();

                    // Initialize payment directly after validation
                    await loadPaystack();

                    const publicKey =
                      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
                      "pk_test_dea6c2d0dce3fa2e9dbeacaed823a08d74cf3863";
                    const reference = `DIA-${Date.now()}`;
                    const currency = (
                      import.meta.env.VITE_PAYSTACK_CURRENCY || "KES"
                    ).toUpperCase();

                    type PaystackConfig = {
                      key: string;
                      email: string;
                      amount: number;
                      currency?: string;
                      ref: string;
                      callback: (response: { reference: string }) => void;
                      onClose?: () => void;
                    };

                    type PaystackPopType = {
                      setup: (config: PaystackConfig) => {
                        openIframe: () => void;
                      };
                    };

                    const paystackLib = (
                      window as unknown as { PaystackPop?: PaystackPopType }
                    ).PaystackPop;

                    if (!paystackLib) {
                      throw new Error("Paystack library not available");
                    }

                    // Create the handler with the properly defined callback function
                    const handler = paystackLib.setup({
                      key: publicKey,
                      email: email,
                      amount: Math.round(amount * 100),
                      currency,
                      ref: reference,
                      callback: async (response) => {
                        console.log("Paystack payment response:", response);

                        try {
                          // Create diaspora request first with correct field names
                          const diasporaRequestData = {
                            name: fullName,
                            email: email,
                            phone: phone,
                            country: country,
                            details: details,
                            consult_time: formattedConsultTime,
                            amount: amount,
                          };

                          console.log(
                            "📋 Creating diaspora request:",
                            diasporaRequestData
                          );
                          const diasporaResult =
                            await diasporaService.createRequest(
                              diasporaRequestData
                            );
                          console.log(
                            "📋 Diaspora request created:",
                            diasporaResult
                          );

                          // Create payment record
                          const paymentRecord = {
                            amount: amount,
                            currency: currency,
                            paymentMethod: "Paystack",
                            paymentProvider: "Paystack",
                            transactionId: response.reference,
                            reference: response.reference,
                            status: "COMPLETED",
                            customerEmail: email,
                            customerPhone: phone,
                            customerName: fullName,
                            description: `Paystack diaspora consultation - ${country}`,
                            diasporaRequestId: diasporaResult.data?.id,
                            metadata: {
                              country: country,
                              consultTime: consultTime,
                              serviceType: "diaspora-consultation",
                              paymentReference: response.reference,
                            },
                          };

                          console.log(
                            "💳 Creating payment record:",
                            paymentRecord
                          );
                          const paymentResult =
                            await paymentsService.createPayment(paymentRecord);
                          console.log(
                            "💳 Payment record created:",
                            paymentResult
                          );

                          alert(
                            "Payment successful! Your diaspora consultation has been booked."
                          );
                        } catch (error) {
                          console.error("Error processing payment:", error);
                          alert(
                            "Payment completed but there was an issue saving your booking. Please contact support."
                          );
                        } finally {
                          setIsPaying(false);
                        }
                      },
                      onClose: () => {
                        console.log("Payment window closed");
                        setIsPaying(false);
                      },
                    });

                    handler.openIframe();
                  } catch (error) {
                    console.error("Error processing form:", error);
                    alert("Failed to process your request. Please try again.");
                    setIsPaying(false);
                  }
                }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      placeholder="Your country of residence"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="details">Consultation Details *</Label>
                  <textarea
                    id="details"
                    name="details"
                    required
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Please describe what you'd like to discuss during the consultation"></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      defaultValue={3235}
                      min={3235}
                      step={3235}
                      readOnly
                      className="bg-muted/50"
                    />
                    <small className="text-muted-foreground">
                      Fixed: KES 3,235 for 1 hour. Enter multiples for more
                      hours.
                    </small>
                  </div>
                  <div>
                    <Label htmlFor="consultTime">
                      Preferred Consultation Time *
                    </Label>
                    <Input
                      id="consultTime"
                      name="consultTime"
                      type="datetime-local"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gold text-primary font-bold"
                  type="submit"
                  disabled={isPaying}>
                  {isPaying ? "Processing..." : "Pay & Book via Paystack"}
                </Button>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  After payment, you will receive a confirmation email and
                  access to the Online Meeting tab.
                </div>
              </form>
            </Card>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-8">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Flexible Scheduling</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We accommodate consultations across all time zones. Our
                    advisors are available 24/7 to serve our diaspora clients.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Global Reach</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Serving Kenyans in over 50 countries worldwide with
                    localized support and understanding of international
                    requirements.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-primary mr-3" />
                    <h3 className="font-semibold">Easy Rescheduling</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Need to change your appointment? No problem. Our flexible
                    system allows easy rescheduling to fit your busy lifestyle.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Diaspora Clients Choose Galloways
              </h2>
              <p className="text-muted-foreground">
                We understand the unique challenges faced by Kenyans living
                abroad
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "14+ Years Experience",
                  description:
                    "Extensive experience serving diaspora communities worldwide",
                },
                {
                  title: "Trusted Partners",
                  description:
                    "Working with Kenya's leading insurance underwriters",
                },
                {
                  title: "Local Expertise",
                  description:
                    "Deep understanding of Kenyan insurance market and regulations",
                },
                {
                  title: "24/7 Support",
                  description: "Round-the-clock support across all time zones",
                },
              ].map((benefit, index) => (
                <Card key={index} className="p-6 text-center">
                  <h3 className="font-semibold mb-3 text-primary">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="px-8 py-3"
                onClick={() => {
                  // Open WhatsApp with predefined message
                  const phoneNumber =
                    import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";
                  const message = encodeURIComponent(
                    "Hello! I would like to schedule a consultation with a diaspora advisor. Please let me know your availability."
                  );
                  window.open(
                    `https://wa.me/${phoneNumber}?text=${message}`,
                    "_blank"
                  );
                }}>
                Talk to a Diaspora Advisor
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
