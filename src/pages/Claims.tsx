import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Phone, Mail, FileText, CheckCircle, Upload } from "lucide-react";
import {
  Shield,
  Car,
  FileText as FileTextIcon,
  Home,
  Briefcase,
  Users,
  HeartPulse,
  PiggyBank,
  Wrench,
  UserCheck,
} from "lucide-react";
import { toast } from "../hooks/use-toast";
import { claimsService } from "../lib/api";
import { getDownloadUrl } from "../lib/assets";

const claimIcons = {
  "Machinery Breakdown / Extr. Damage": (
    <Wrench className="inline-block mr-2 text-accent" />
  ),
  "Windscreen & Window Damage Claim Form": (
    <Car className="inline-block mr-2 text-accent" />
  ),
  "Personal Accident Claim Form": (
    <UserCheck className="inline-block mr-2 text-accent" />
  ),
  "Motor Entertainment System Claim Form": (
    <Car className="inline-block mr-2 text-accent" />
  ),
  "Motor Theft Claim Form": <Car className="inline-block mr-2 text-accent" />,
  "Public Liability (Third-Party) Claim Form": (
    <Shield className="inline-block mr-2 text-accent" />
  ),
  "Fidelity Guarantee Claim Form": (
    <PiggyBank className="inline-block mr-2 text-accent" />
  ),
  "Workmen's Compensation Accident Claim Form": (
    <Users className="inline-block mr-2 text-accent" />
  ),
  "Claim Documentation Guide 2012": (
    <FileTextIcon className="inline-block mr-2 text-accent" />
  ),
  "Motor Vehicle Accident Claims": (
    <Car className="inline-block mr-2 text-accent" />
  ),
  "Motor Vehicle Theft Claims": (
    <Car className="inline-block mr-2 text-accent" />
  ),
  "Motorcycle Accident Claims": (
    <Car className="inline-block mr-2 text-accent" />
  ),
  "Motorcycle Theft Claims": <Car className="inline-block mr-2 text-accent" />,
  "Windscreen Claims": <Car className="inline-block mr-2 text-accent" />,
  "Burglary / Fire / Micro Insurance Claims": (
    <Home className="inline-block mr-2 text-accent" />
  ),
  "Fidelity Guarantee Claims": (
    <PiggyBank className="inline-block mr-2 text-accent" />
  ),
  "Agency Model Claims": (
    <Briefcase className="inline-block mr-2 text-accent" />
  ),
  "Personal Accident Claims": (
    <UserCheck className="inline-block mr-2 text-accent" />
  ),
  "WIBA Claims": <Users className="inline-block mr-2 text-accent" />,
  "Livestock Claims": <UserCheck className="inline-block mr-2 text-accent" />,
  "Credit Life Claims": (
    <HeartPulse className="inline-block mr-2 text-accent" />
  ),
};

export default function Claims() {
  const [formData, setFormData] = useState({
    policy_number: "",
    claim_type: "",
    incident_date: "",
    estimated_loss: "",
    description: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !formData.policy_number ||
    !formData.claim_type ||
    !formData.description
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
    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append each file individually to create an array
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        formDataToSend.append("supporting_documents", file);
      });
    }

    console.log("📋 Submitting claim to API...");
    const result = await claimsService.createClaim(formDataToSend);

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "Success",
        description:
          result.message ||
          "Your claim has been submitted successfully. We'll contact you soon with updates.",
      });
    } else {
      throw new Error(result.message || "Failed to submit claim");
    }
  } catch (error: any) {
    console.error("Claim submission error:", error);
    toast({
      title: "Error",
      description:
        error.message || "Failed to submit claim. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  if (isSubmitted) {
    return (
      <div className="h-screen bg-background">
        <Header />
        <main className="pt-20 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Card className="p-8 border-green-200">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Claim Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your claim has been received and is being processed. You'll
                receive email updates on the status.
              </p>
              <Button onClick={() => window.location.reload()}>
                Submit Another Claim
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Fast and Transparent Claims with Galloways
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Experience hassle-free claims processing with our streamlined
              system and dedicated support team
            </p>
          </div>
        </section>

        {/* Claims Process */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Simple 4-Step Claims Process
              </h2>
              <p className="text-muted-foreground">
                Follow these easy steps to submit your claim
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-16">
              {[
                {
                  step: 1,
                  title: "Report Incident",
                  description:
                    "Contact us immediately after the incident occurs",
                  icon: <Phone className="w-8 h-8" />,
                },
                {
                  step: 2,
                  title: "Submit Documents",
                  description:
                    "Upload required documents through our secure portal",
                  icon: <Upload className="w-8 h-8" />,
                },
                {
                  step: 3,
                  title: "Assessment",
                  description: "Our experts review and assess your claim",
                  icon: <FileText className="w-8 h-8" />,
                },
                {
                  step: 4,
                  title: "Settlement",
                  description: "Receive your settlement once approved",
                  icon: <CheckCircle className="w-8 h-8" />,
                },
              ].map((step, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Claims Form */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Submit Your Claim Online
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below to start your claim process
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="policy_number">Policy Number *</Label>
                    <Input
                      id="policy_number"
                      name="policy_number"
                      value={formData.policy_number}
                      onChange={handleInputChange}
                      placeholder="Enter your policy number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="claim_type">Claim Type *</Label>
                    <select
                      id="claim_type"
                      name="claim_type"
                      value={formData.claim_type}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                      aria-label="Claim Type"
                    >
                      <option value="">Select claim type</option>
                      <option value="Motor">Motor</option>
                      <option value="Health">Health</option>
                      <option value="Property">Property</option>
                      <option value="Travel">Travel</option>
                      <option value="Life">Life</option>
                      <option value="Public liability">Public liability</option>
                      <option value="Fidelity guarantee">
                        Fidelity guarantee
                      </option>
                      <option value="Worksmen compensation accident">
                        Worksmen compensation accident
                      </option>
                      <option value="Windscreen and window damage">
                        Windscreen and window damage
                      </option>
                      <option value="Motor entertainment">
                        Motor entertainment
                      </option>
                      <option value="Motor theft">Motor theft</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="incident_date">Date of Incident</Label>
                    <Input
                      id="incident_date"
                      name="incident_date"
                      value={formData.incident_date}
                      onChange={handleInputChange}
                      type="date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated_loss">
                      Estimated Loss Amount
                    </Label>
                    <Input
                      id="estimated_loss"
                      name="estimated_loss"
                      value={formData.estimated_loss}
                      onChange={handleInputChange}
                      placeholder="Enter amount in KES"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Incident Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please describe what happened in detail..."
                    className="min-h-32"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="documents">Upload Supporting Documents</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop files here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                    </p>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        document.getElementById("documents")?.click()
                      }
                    >
                      Select Files
                    </Button>
                    {files && files.length > 0 && (
                      <div className="mt-4 text-sm text-left">
                        <p className="font-medium">Selected files:</p>
                        {Array.from(files).map((file, index) => (
                          <p key={index} className="text-muted-foreground">
                            • {file.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    {isLoading ? "Submitting..." : "Submit Claim"}
                  </Button>
                  <Button variant="outline" size="lg" type="button">
                    Download PDF Form
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>

        {/* Claims Downloads & Requirements Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Claims Downloads & Requirements
            </h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">
              Download the appropriate claim form and review the required
              documents before submission to ensure faster processing.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Motor Vehicle Accident Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Motor Vehicle Accident Claims"]}Motor Vehicle
                  Accident Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Original Police Abstract</li>
                  <li>Copy of Driver's License</li>
                  <li>Copy of Log Book</li>
                  <li>Proposal Form</li>
                  <li>Valuation Report</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Motor Vehicle Theft Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Motor Vehicle Theft Claims"]}Motor Vehicle Theft
                  Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Copy of Log Book</li>
                  <li>Original Police Abstract</li>
                  <li>Copy of Driver's License</li>
                  <li>Statement by Insured/Driver</li>
                  <li>Proposal Form</li>
                  <li>Valuation Report</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Motorcycle Accident Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Motorcycle Accident Claims"]}Motorcycle Accident
                  Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Police Abstract</li>
                  <li>Photos of Damaged Motorcycle</li>
                  <li>Repair Estimate</li>
                  <li>Copy of Driving License</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Motorcycle Theft Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Motorcycle Theft Claims"]}Motorcycle Theft Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Police Abstract</li>
                  <li>Statement by Insured & Rider</li>
                  <li>Copy of Log Book</li>
                  <li>Purchase Receipt</li>
                  <li>Copy of Rider's License</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Windscreen Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Windscreen Claims"]}Windscreen Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Photo of Broken Windscreen</li>
                  <li>ETR Receipt</li>
                  <li>Valuation Report</li>
                  <li>Photo of Replaced Windscreen</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Burglary / Fire / Micro Insurance Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Burglary / Fire / Micro Insurance Claims"]}
                  Burglary / Fire / Micro Insurance Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Police Abstract</li>
                  <li>Invoice/Quotation/Receipts of Stolen Items</li>
                  <li>Inventory of Damaged/Stolen Items</li>
                  <li>Proposal Form</li>
                  <li>Written Statement by Insured/Witness</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Fidelity Guarantee Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Fidelity Guarantee Claims"]}Fidelity Guarantee
                  Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Employment Details of Staff Involved</li>
                  <li>Internal Security Report</li>
                  <li>Internal Audit Report</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Agency Model Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Agency Model Claims"]}Agency Model Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Police Abstract</li>
                  <li>Proposal Form Copy</li>
                  <li>Sales Records</li>
                  <li>Statement Explaining Loss</li>
                  <li>Inventory of Stolen Items</li>
                  <li>Invoices/Quotations/Receipts of Items</li>
                  <li>Ledger of Lost Money (if applicable)</li>
                  <li>Staff Employment Details (if theft case)</li>
                  <li>Bank Statement</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Personal Accident Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Personal Accident Claims"]}Personal Accident
                  Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Doctor-Stamped Medical Report (Page 4)</li>
                  <li>Police Abstract (if Road Traffic Accident)</li>
                  <li>Medical Bills</li>
                  <li>Statements (Insured/Witness)</li>
                  <li>Sick-Off Sheets (for Disability Claims)</li>
                  <li>Payslips (3 months before accident)</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* WIBA Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["WIBA Claims"]}WIBA Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Original DOSH 1 Form</li>
                  <li>Medical Bills + Report</li>
                  <li>Sick-Off Sheets</li>
                  <li>Appointment Letter of Claimant</li>
                  <li>ID Copy of Claimant</li>
                  <li>Health & Safety Committee Report</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Livestock Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Livestock Claims"]}Livestock Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Veterinary Certificate of Loss</li>
                  <li>Photos of Dead Animal</li>
                  <li>Postmortem Report</li>
                  <li>Sale Agreement (if salvage sold)</li>
                  <li>Claim PDF Voucher</li>
                  <li>Risk Note</li>
                </ul>
              </div>
              {/* Credit Life Claims */}
              <div className="p-6 bg-card rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">
                  {claimIcons["Credit Life Claims"]}Credit Life Claims
                </h3>
                <div className="font-semibold mb-2">Required Attachments:</div>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Death Certificate / Medical Report (for Disability)</li>
                  <li>Burial Permit</li>
                  <li>Loan Application Form</li>
                  <li>Loan Appraisal Form</li>
                  <li>Bank Loan Statement</li>
                  <li>Offer Letter</li>
                  <li>ID Copy of Claimant</li>
                  <li>Police Abstract (if accident/murder/assault case)</li>
                  <li>Claim PDF Voucher</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* General Claim Forms Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">General Claim Forms</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Machinery Breakdown / Extr. Damage"]}Machinery
                Breakdown / Extr. Damage
              </h4>
              <a
                href={getDownloadUrl(
                  "Machinery_Breakdown_Extr_Damage-Claim_Form.pdf"
                )}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                <FileTextIcon className="inline-block mr-2 text-accent" />
                Claim Form- Damage or Loss (Amended)
              </h4>
              <a
                href={getDownloadUrl(
                  "Claim_Forms_-_Damage_or_Loss-amended.pdf"
                )}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                <Car className="inline-block mr-2 text-accent" />
                Claim Form Motor (Amended)
              </h4>
              <a
                href={getDownloadUrl("Claim_Form_Motor_-_Amended.pdf")}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Windscreen & Window Damage Claim Form"]}Windscreen
                & Window Damage Claim Form
              </h4>
              <a
                href={getDownloadUrl(
                  "Windscreen & window damage claim form.pdf"
                )}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Personal Accident Claim Form"]}Personal Accident
                Claim Form
              </h4>
              <a
                href={getDownloadUrl("Personal_Accident_Claim_Form.pdf")}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Motor Entertainment System Claim Form"]}Motor
                Entertainment System Claim Form
              </h4>
              <a
                href={getDownloadUrl(
                  "Motor_Entertainment_System_Claim_Form.pdf"
                )}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Motor Theft Claim Form"]}Motor Theft Claim Form
              </h4>
              <a
                href={getDownloadUrl("Motor Theft Claim Form.pdf")}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Public Liability (Third-Party) Claim Form"]}Public
                Liability (Third-Party) Claim Form
              </h4>
              <a
                href={getDownloadUrl(
                  "Public_Liability_(THIRDPARTY)_Claim_Form.pdf"
                )}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Fidelity Guarantee Claim Form"]}Fidelity Guarantee
                Claim Form
              </h4>
              <a
                href={getDownloadUrl("Fidelity_Guarantee_Claim_Forms.pdf")}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Workmen's Compensation Accident Claim Form"]}
                Workmen's Compensation Accident Claim Form
              </h4>
              <a
                href={getDownloadUrl(
                  "Workmen's_Compenstion_Accident_Claim_Form_-_amended.pdf"
                )}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download Form
              </a>
            </div>
            <div className="p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {claimIcons["Claim Documentation Guide 2012"]}Claim
                Documentation Guide 2012
              </h4>
              <a
                href={getDownloadUrl("claim_documentation_guide.pdf")}
                className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                download
              >
                📄 Download PDF
              </a>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Need Help with Your Claim?
              </h2>
              <p className="text-muted-foreground">
                Our claims support team is here to assist you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-primary mr-3" />
                  <h3 className="font-semibold">Phone Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our claims specialists
                </p>
                <p className="font-semibold mb-2">
                  +254720769993/+254758301346
                </p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 8:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 2:00 PM
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-primary mr-3" />
                  <h3 className="font-semibold">Email Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Send us your queries via email
                </p>
                <p className="font-semibold mb-2">gallowaysclaims@gmail.com</p>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 2-4 hours during business hours
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What Our Clients Say
              </h2>
              <p className="text-muted-foreground">
                Real experiences from satisfied customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Wanjiku",
                  role: "Motor Insurance Client",
                  testimonial:
                    "My claim was processed within 48 hours. Exceptional service and support throughout the process.",
                  rating: 5,
                },
                {
                  name: "John Kimani",
                  role: "Health Insurance Client",
                  testimonial:
                    "Galloways made my medical claim so easy. The online portal is user-friendly and efficient.",
                  rating: 5,
                },
                {
                  name: "Grace Muthoni",
                  role: "Property Insurance Client",
                  testimonial:
                    "Professional and transparent claims handling. They kept me informed at every step.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
