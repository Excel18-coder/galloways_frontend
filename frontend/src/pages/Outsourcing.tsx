import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { outsourcingRequests } from "@/lib/api";
// API import disabled for build

const Outsourcing = () => {
  const [formData, setFormData] = useState({
    organization_name: "",
    core_functions: "",
    location: "",
    address: "",
    email: "",
    services: [] as string[],
    nature_of_outsourcing: "",
    budget_range: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const serviceOptions = [
    "Underwriting Support",
    "Claims Audit",
    "Claims Data Management",
    "Quotation Support",
    "Renewal Negotiation",
    "Policy Administration",
  ];

  const budgetRanges = [
    "KES 50,000 - 100,000",
    "KES 100,000 - 250,000",
    "KES 250,000 - 500,000",
    "KES 500,000 - 1,000,000",
    "KES 1,000,000+",
  ];

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.organization_name ||
      !formData.email ||
      formData.services.length === 0 ||
      !formData.budget_range
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Submit to backend API
      const result = await outsourcingRequests.createOutsourcingRequest({
        organization_name: formData.organization_name,
        core_functions: formData.core_functions,
        location: formData.location,
        address: formData.address,
        email: formData.email,
        services: formData.services,
        nature_of_outsourcing: formData.nature_of_outsourcing,
        budget_range: formData.budget_range,
      });
     

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Success",
          description:
            "Thank you for submitting your outsourcing request. Our consultants will contact you shortly.",
        });
      }
    } catch (error: unknown) {
      console.error("Outsourcing submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen">
        <Header />
        <main className="py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Card className="border-accent">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-primary mb-4">
                  Request Submitted Successfully!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for submitting your outsourcing request. Our
                  consultants will contact you shortly to discuss your
                  requirements in detail.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Submit Another Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Header />
      <main className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Insurance Services Outsourcing Questionnaire
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Partner with Galloways for comprehensive insurance outsourcing
              solutions. Fill out this questionnaire to help us understand your
              specific needs.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl">
                Organization & Service Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Organization Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary border-b border-accent pb-2">
                    Organization Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">
                        Organization Name *
                      </Label>
                      <Input
                        id="organizationName"
                        value={formData.organization_name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            organization_name: e.target.value,
                          }))
                        }
                        placeholder="Enter your organization name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor=" core_functions">Core Functions</Label>
                    <Textarea
                      id=" core_functions"
                      value={formData.core_functions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          core_functions: e.target.value,
                        }))
                      }
                      placeholder="Describe your organization's core functions and business activities"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">Postal/Physical Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Enter your full address"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="contact@yourorganization.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance Services Outsourcing */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary border-b border-accent pb-2">
                    Insurance Services Outsourcing
                  </h3>

                  <div className="space-y-4">
                    <Label>Types of Services to Outsource *</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {serviceOptions.map((service) => (
                        <div
                          key={service}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={service}
                            checked={formData.services.includes(service)}
                            onCheckedChange={(checked) =>
                              handleServiceChange(service, checked as boolean)
                            }
                          />
                          <Label htmlFor={service} className="text-sm">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Nature of Outsourcing *</Label>
                    <RadioGroup
                      value={formData.nature_of_outsourcing}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          nature_of_outsourcing: value,
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Full outsourcing" id="full" />
                        <Label htmlFor="full">Full outsourcing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Partial outsourcing"
                          id="partial"
                        />
                        <Label htmlFor="partial">Partial outsourcing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="On-demand support"
                          id="on-demand"
                        />
                        <Label htmlFor="on-demand">On-demand support</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary border-b border-accent pb-2">
                    Budget Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Budget Range (KES) *</Label>
                    <Select
                      value={formData.budget_range}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          budget_range: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    * Required fields. All information will be kept
                    confidential.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Outsourcing;
