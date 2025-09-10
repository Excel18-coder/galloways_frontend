import React, { useState } from "react";
import Header from "../components/layout/Header";
import { quotesService } from "../lib/api";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

import { toast } from "../hooks/use-toast";
import {
  Shield,
  Home,
  Building2,
  Car,
  Briefcase,
  Users,
  UserCheck,
  FileText,
  HeartPulse,
  Layers,
  Plane,
  PiggyBank,
  Coins,
  Hammer,
  Wrench,
  MonitorSmartphone,
  CheckCircle,
  Upload,
  Phone,
  Mail,
  MessageSquare,
  FileDown,
} from "lucide-react";
import { productFields } from "./QuotesInputData";

const insuranceIcons = {
  "Burglary / Theft Insurance": (
    <Shield className="inline-block mr-2 text-accent" />
  ),
  "All Risks Insurance": <Home className="inline-block mr-2 text-accent" />,
  "Fire & Perils Proposal Form": (
    <Building2 className="inline-block mr-2 text-accent" />
  ),
  "Political Violence & Terrorism (PVT)": (
    <Shield className="inline-block mr-2 text-accent" />
  ),
  "Domestic Package (Write-Up Wording)": (
    <Home className="inline-block mr-2 text-accent" />
  ),
  "Motor Proposal Form": <Car className="inline-block mr-2 text-accent" />,
  "Motor Trade Proposal": <Car className="inline-block mr-2 text-accent" />,
  "Carriers’ Legal Liability Insurance": (
    <Briefcase className="inline-block mr-2 text-accent" />
  ),
  "Goods in Transit Proposal Form": (
    <Briefcase className="inline-block mr-2 text-accent" />
  ),
  "Work Injury Benefits (WIBA)": (
    <Users className="inline-block mr-2 text-accent" />
  ),
  "Employer’s Liability": <Users className="inline-block mr-2 text-accent" />,
  "Public Liability": <UserCheck className="inline-block mr-2 text-accent" />,
  "Contractual Liability Proposal Form": (
    <FileText className="inline-block mr-2 text-accent" />
  ),
  "PI Proposal Form – Advocates": (
    <FileText className="inline-block mr-2 text-accent" />
  ),
  "PI Proposal Form – Architects": (
    <FileText className="inline-block mr-2 text-accent" />
  ),
  "PI Proposal Form – Doctors / Medical Practitioners": (
    <HeartPulse className="inline-block mr-2 text-accent" />
  ),
  "PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS & Land Surveyors":
    <Layers className="inline-block mr-2 text-accent" />,
  "Travel Insurance Proposal Form": (
    <Plane className="inline-block mr-2 text-accent" />
  ),
  "Fidelity Guarantee Proposal Form": (
    <PiggyBank className="inline-block mr-2 text-accent" />
  ),
  "Money Insurance Proposal Form": (
    <Coins className="inline-block mr-2 text-accent" />
  ),
  "Poultry Proposal Form": (
    <UserCheck className="inline-block mr-2 text-accent" />
  ),
  "Livestock Insurance Proposal Form": (
    <UserCheck className="inline-block mr-2 text-accent" />
  ),
  "Personal Accident Proposal Form": (
    <UserCheck className="inline-block mr-2 text-accent" />
  ),
  "Contractors’ All Risk Proposal Form": (
    <Hammer className="inline-block mr-2 text-accent" />
  ),
  "Erection All Risks Proposal Form": (
    <Hammer className="inline-block mr-2 text-accent" />
  ),
  "Contractors’ Plant & Machinery (CPM Write-Up)": (
    <Wrench className="inline-block mr-2 text-accent" />
  ),
  "Machinery Breakdown (Extra Damage)": (
    <Wrench className="inline-block mr-2 text-accent" />
  ),
  "Electronic Equipment Insurance": (
    <MonitorSmartphone className="inline-block mr-2 text-accent" />
  ),
};

export default function Quotes() {
  const [tab, setTab] = useState("quote");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [success, setSuccess] = useState(false);
  const [refNum, setRefNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insuranceProductOptions = [
    "Marine Insurance",
    "Motor Insurance Application Form",
    "Political Violence Proposal",
    "Contractors Plant and Machinery",
    "Carriers Legal Liability Insurance",
    "Public Liability",
    "Professional Indemnity Proposal Form (General)",
    "Professional Indemnity Proposal Form (Engineers/Architects)",
    "Professional Indemnity Insurance Proposal Form (Medical Practitioners)",
    "Professional Indemnity Insurance Proposal Form (Accountants/Auditors)",
    "Professional Indemnity Insurance Proposal Form (Lawyers/Advocates)",
    "Machinery Breakdown/Damage",
    "Equimed Application Form (Medical Insurance)",
    "Fire Insurance Proposal Form",
    "Contractual Liability Proposal Form",
    "Domestic Package Insurance",
    "Goods in Transit Insurance",
    "Money Insurance",
    "Group Personal Accident Proposal Form",
    "All Risk Proposal Form",
    "Work Injury Benefits Act (WIBA) Proposal Form",
    "Fidelity Guarantee Insurance Proposal Form",
    "Electronic Equipment Insurance Proposal Form",
    "Travel Insurance Proposal Form",
    "Burglary Insurance Proposal Form",
    "Erection All Risks Insurance Proposal Form",
  ];

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  // Product field definitions

  const renderProductFields = (product) => {
    const fields = productFields[product];
    if (!fields) return <div>Form coming soon.</div>;
    return (
      <div className="space-y-4">
        {fields.map((field) => {
          if (
            field.type === "text" ||
            field.type === "number" ||
            field.type === "date"
          ) {
            return (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ""}
                />
              </div>
            );
          }
          if (field.type === "textarea") {
            return (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Textarea
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  onChange={handleInputChange}
                  value={formData[field.id] || ""}
                />
              </div>
            );
          }
          if (field.type === "select") {
            return (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <select
                  id={field.id}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required={field.required}
                >
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.type === "checkboxes") {
            return (
              <div key={field.id}>
                <Label>{field.label}</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {field.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" name={field.id} value={opt} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            );
          }
          if (field.type === "checkbox") {
            return (
              <div key={field.id}>
                <Label>{field.label}</Label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name={field.id} />
                  {field.options[0]}
                </label>
              </div>
            );
          }
          if (field.type === "table") {
            return (
              <div key={field.id}>
                <Label>{field.label}</Label>
                <table className="w-full border mt-2 mb-2 text-sm">
                  <thead>
                    <tr>
                      {field.columns.map((col) => (
                        <th key={col} className="border px-2 py-1">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {field.columns.map((col, idx) => (
                        <td key={col} className="border px-2 py-1">
                          <Input id={`${field.id}-${idx}`} type="text" />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine form data with selected product
      const submitData = {
        ...formData,
        productType: selectedProduct,
      };

      // Submit quote using the quotes service
      const response = await quotesService.createQuote(submitData);

      if (response.success) {
        setSuccess(true);
        const refNumber =
          response.data?.reference || `GIQ-${Date.now().toString().slice(-8)}`;
        setRefNum(refNumber);
        setFormData({});
        e.target.reset();
        setSelectedProduct("");

        toast({
          title: "Quote Submitted Successfully!",
          description: `Your quote request (Ref: ${refNumber}) has been submitted. We'll contact you within 24 hours.`,
        });
      } else {
        throw new Error(response.message || "Failed to submit quote");
      }
    } catch (error: any) {
      console.error("Quote submission error:", error);
      toast({
        title: "Submission Error",
        description:
          error.message || "Failed to submit quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex border-b mb-8">
            <button
              className={`px-6 py-3 font-semibold focus:outline-none ${
                tab === "quote"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setTab("quote")}
            >
              Request Quote
            </button>
            <button
              className={`px-6 py-3 font-semibold focus:outline-none ${
                tab === "downloads"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setTab("downloads")}
            >
              Downloads
            </button>
          </div>
          {tab === "downloads" && (
            <div className="py-12">
              <h2 className="text-2xl font-bold mb-6 text-center text-primary">
                Download Forms & Instructions
              </h2>
              <p className="mb-8 text-center text-muted-foreground">
                Please download the required form, fill it in, and upload it for
                processing. Ensure you have all necessary attachments as listed
                in the requirements guide. If you need help, contact our support
                team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Livestock Category */}
                <div className="p-6 bg-card rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                    {insuranceIcons["Livestock Insurance Proposal Form"]}
                    Livestock Insurance Category
                  </h3>
                  <a
                    href="/dist/Downloads/Livestock_Insurance_Proposal_Form.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Livestock
                    Insurance Proposal Form
                  </a>
                  <a
                    href="/dist/Downloads/Livestock Vetenary.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Veterinary
                    Form
                  </a>
                  <div className="font-semibold mb-2">Instructions:</div>
                  <ul className="list-disc ml-6 text-muted-foreground">
                    <li>
                      Download and fill in the Livestock Insurance Proposal
                      Form.
                    </li>
                    <li>
                      Attach a veterinary health valuation certificate (from a
                      certified vet).
                    </li>
                    <li>
                      Upload the completed form and attachments for processing.
                    </li>
                  </ul>
                </div>
                {/* Medical Category */}
                <div className="p-6 bg-card rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                    {
                      insuranceIcons[
                        "Equimed Application Form (Medical Insurance)"
                      ]
                    }
                    Medical Insurance Category
                  </h3>
                  <a
                    href="/dist/Downloads/Medical Insurance - individual.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Medical
                    Insurance - Individual
                  </a>
                  <a
                    href="/dist/Downloads/group_medical_insurance.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Medical
                    Insurance - Group
                  </a>
                  <div className="font-semibold mb-2">Instructions:</div>
                  <ul className="list-disc ml-6 text-muted-foreground">
                    <li>Download and fill in the Medical Insurance Form.</li>
                    <li>
                      Attach all required documents as listed in the form.
                    </li>
                    <li>
                      Upload the completed form and attachments for processing.
                    </li>
                  </ul>
                </div>
                {/* Crop Insurance */}
                <div className="p-6 bg-card rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                    {insuranceIcons["All Risks Insurance"]}
                    Crop Insurance
                  </h3>
                  <a
                    href="/dist/Downloads/crop insurance proposal form.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Crop
                    Insurance Proposal Form
                  </a>
                  <div className="font-semibold mb-2">Instructions:</div>
                  <ul className="list-disc ml-6 text-muted-foreground">
                    <li>
                      Download and fill in the Crop Insurance Proposal Form.
                    </li>
                    <li>
                      Attach all required documents as listed in the form.
                    </li>
                    <li>
                      Upload the completed form and attachments for processing.
                    </li>
                  </ul>
                </div>
                {/* Greenhouse Insurance */}
                <div className="p-6 bg-card rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                    {insuranceIcons["Domestic Package (Write-Up Wording)"]}
                    Greenhouse Insurance
                  </h3>
                  <a
                    href="/dist/Downloads/greenhouse insurance proposal form.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Greenhouse
                    Insurance Proposal Form
                  </a>
                  <div className="font-semibold mb-2">Instructions:</div>
                  <ul className="list-disc ml-6 text-muted-foreground">
                    <li>
                      Download and fill in the Greenhouse Insurance Proposal
                      Form.
                    </li>
                    <li>
                      Attach all required documents as listed in the form.
                    </li>
                    <li>
                      Upload the completed form and attachments for processing.
                    </li>
                  </ul>
                </div>
                {/* Poultry Category */}
                <div className="p-6 bg-card rounded-lg shadow">
                  <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
                    {insuranceIcons["Poultry Proposal Form"]}
                    Poultry Insurance Category
                  </h3>
                  <a
                    href="/dist/Downloads/poultry proposal form.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Poultry
                    Insurance Proposal Form
                  </a>
                  <a
                    href="/dist/Downloads/vet health and valuation poultry.pdf"
                    download
                    className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <FileDown className="mr-2 h-5 w-5" /> Download Veterinary
                    Form
                  </a>
                  <div className="font-semibold mb-2">Instructions:</div>
                  <ul className="list-disc ml-6 text-muted-foreground">
                    <li>
                      Download and fill in the Poultry Insurance Proposal Form.
                    </li>
                    <li>
                      Attach a veterinary health valuation certificate (from a
                      certified vet).
                    </li>
                    <li>
                      Upload the completed form and attachments for processing.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {tab === "quote" && (
            <>
              {success ? (
                <div className="max-w-2xl mx-auto text-center py-16">
                  <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-green-800 mb-4">
                    Quote Submitted Successfully!
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Reference Number:{" "}
                    <span className="font-bold text-primary">{refNum}</span>
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your quote request. Our team will review your
                    requirements and contact you within 24 hours with a
                    personalized quote.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      📧 A confirmation email has been sent to your provided
                      email address.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📱 You'll receive SMS updates on your quote status.
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="mt-4"
                    >
                      Submit Another Quote
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  className="space-y-6"
                  //   onSubmit={async (e) => {
                  //     e.preventDefault();
                  //     setIsLoading(true);
                  //     try {
                  //       const form = e.target as HTMLFormElement;
                  //       const formData = new FormData();

                  //       // Collect all input fields (including custom product fields)
                  //       let contactMethodSet = false;
                  //       const dynamicDetails: Record<string, any> = {};
                  //       Array.from(form.elements).forEach((el: any) => {
                  //         if (el.name && el.type !== "file") {
                  //           if (el.type === "checkbox") {
                  //             formData.append(
                  //               el.name,
                  //               el.checked ? "true" : "false"
                  //             );
                  //             dynamicDetails[el.name] = el.checked
                  //               ? "true"
                  //               : "false";
                  //           } else if (el.type === "select-multiple") {
                  //             const values = Array.from(el.selectedOptions).map(
                  //               (opt: any) => opt.value
                  //             );
                  //             values.forEach((val: any) =>
                  //               formData.append(el.name, val)
                  //             );
                  //             dynamicDetails[el.name] = values;
                  //           } else if (el.name === "contactMethod") {
                  //             if (el.checked) {
                  //               formData.append("contactMethod", el.value);
                  //               contactMethodSet = true;
                  //               dynamicDetails["contactMethod"] = el.value;
                  //             }
                  //           } else {
                  //             formData.append(el.name, el.value);
                  //             dynamicDetails[el.name] = el.value;
                  //           }
                  //         }
                  //       });
                  //       // Ensure contactMethod is always present as a string
                  //       if (!contactMethodSet) {
                  //         formData.append("contactMethod", "");
                  //         dynamicDetails["contactMethod"] = "";
                  //       }
                  //       // Store selected product and all dynamic details as JSON in 'details' field
                  //       formData.append("selectedProduct", selectedProduct);
                  //       formData.append(
                  //         "details",
                  //         JSON.stringify(dynamicDetails)
                  //       );
                  //       // Ensure contactMethod is always present as a string
                  //       if (!contactMethodSet) {
                  //         formData.append("contactMethod", "");
                  //       }

                  //       // Attach all files (support multiple files)
                  //       const fileInputs =
                  //         form.querySelectorAll('input[type="file"]');
                  //       fileInputs.forEach((fileInput: any) => {
                  //         if (fileInput.files && fileInput.files.length > 0) {
                  //           for (let i = 0; i < fileInput.files.length; i++) {
                  //             formData.append("document", fileInput.files[i]);
                  //           }
                  //         }
                  //       });

                  //       // Add selected product info
                  //       formData.append("selectedProduct", selectedProduct);

                  //       // Create the quote using backend service
                  //       console.log(formData);

                  //       // Generate reference number
                  //       const refNumber = `GIQ-${Date.now()
                  //         .toString()
                  //         .slice(-8)}`;
                  //       setRefNum(refNumber);
                  //       setSuccess(true);

                  //       toast({
                  //         title: "Quote Submitted Successfully!",
                  //         description: `Your quote request (Ref: ${refNumber}) has been submitted. We'll contact you within 24 hours.`,
                  //       });
                  //     } catch (error) {
                  //       console.error("Quote submission error:", error);
                  //       toast({
                  //         title: "Submission Error",
                  //         description:
                  //           error.message ||
                  //           "Failed to submit quote. Please try again.",
                  //         variant: "destructive",
                  //       });
                  //     } finally {
                  //       setIsLoading(false);
                  //     }
                  //   }}
                  onSubmit={handleProductSubmit}
                >
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+254 700 123 456"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location/County</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Nairobi, Mombasa, Kisumu"
                      />
                    </div>
                  </div>
                  {/* Insurance Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Insurance Requirements
                    </h3>
                    <div>
                      <Label htmlFor="product">Insurance Product *</Label>
                      <select
                        id="product"
                        name="product"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                        value={selectedProduct}
                        onChange={handleProductChange}
                      >
                        <option value="">Select insurance product</option>
                        {insuranceProductOptions
                          .filter((option) => typeof option === "string")
                          .map((option) => {
                            const strOption = option as string;
                            return (
                              <option key={strOption} value={strOption}>
                                {strOption}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    {/* Dynamic Product-Specific Section */}
                    {selectedProduct && (
                      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">
                          {selectedProduct} Details
                        </h3>
                        {renderProductFields(selectedProduct)}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget">Budget Range (KES)</Label>
                        <select
                          id="budget"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-50k">Under 50,000</option>
                          <option value="50k-100k">50,000 - 100,000</option>
                          <option value="100k-250k">100,000 - 250,000</option>
                          <option value="250k-500k">250,000 - 500,000</option>
                          <option value="500k-1m">500,000 - 1,000,000</option>
                          <option value="above-1m">Above 1,000,000</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="coverage">Coverage Period</Label>
                        <select
                          id="coverage"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Select coverage period</option>
                          <option value="1-year">1 Year</option>
                          <option value="2-years">2 Years</option>
                          <option value="3-years">3 Years</option>
                          <option value="long-term">
                            Long Term (5+ years)
                          </option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="details">Additional Details</Label>
                      <Textarea
                        id="details"
                        placeholder="Please provide any additional information about your insurance needs, family size, assets to cover, specific requirements, etc."
                        className="min-h-32"
                      />
                    </div>
                  </div>
                  {/* Contact Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Contact Preferences
                    </h3>
                    <div>
                      <Label htmlFor="contactMethod">
                        Preferred Contact Method *
                      </Label>
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            id: "phone-call",
                            label: "Phone Call",
                            icon: <Phone className="w-4 h-4" />,
                          },
                          {
                            id: "email",
                            label: "Email",
                            icon: <Mail className="w-4 h-4" />,
                          },
                          {
                            id: "whatsapp",
                            label: "WhatsApp",
                            icon: <MessageSquare className="w-4 h-4" />,
                          },
                          {
                            id: "in-person",
                            label: "In-Person Meeting",
                            icon: <FileText className="w-4 h-4" />,
                          },
                        ].map((method) => (
                          <label
                            key={method.id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="contactMethod"
                              value={method.id}
                              className="text-primary focus:ring-primary"
                            />
                            <div className="flex items-center space-x-2">
                              {method.icon}
                              <span>{method.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bestTime">Best Time to Contact</Label>
                      <select
                        id="bestTime"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select preferred time</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">
                          Afternoon (12PM - 5PM)
                        </option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </div>
                  </div>
                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Supporting Documents (Optional)
                    </h3>
                    <div>
                      <Label>Upload Supporting Documents</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mt-2">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Drag and drop files here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload any relevant documents (ID, vehicle logbook,
                          property documents, etc.)
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB
                          per file)
                        </p>
                        <input
                          type="file"
                          name="document"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="block mx-auto mt-2"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Terms and Submit */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-primary underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary underline">
                          Privacy Policy
                        </a>
                        . I consent to being contacted regarding my insurance
                        quote request.
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="flex-1 px-8 py-3"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : "Submit & Get Quote"}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        type="button"
                        disabled={isLoading}
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsLoading(true);

                          try {
                            const form = e.currentTarget.closest("form");
                            if (!form) return;

                            const formData = new FormData(form);

                            // Create draft quote data as FormData
                            const draftFormData = new FormData();
                            draftFormData.append(
                              "firstName",
                              formData.get("firstName") || ""
                            );
                            draftFormData.append(
                              "lastName",
                              formData.get("lastName") || ""
                            );
                            draftFormData.append(
                              "email",
                              formData.get("email") || ""
                            );
                            draftFormData.append(
                              "phone",
                              formData.get("phone") || ""
                            );
                            draftFormData.append(
                              "location",
                              formData.get("location") || ""
                            );
                            draftFormData.append(
                              "product",
                              formData.get("product") || ""
                            );
                            draftFormData.append(
                              "budget",
                              formData.get("budget") || ""
                            );
                            draftFormData.append(
                              "coverage",
                              formData.get("coverage") || ""
                            );
                            draftFormData.append(
                              "details",
                              formData.get("details") || ""
                            );
                            draftFormData.append(
                              "contactMethod",
                              formData.get("contactMethod") || ""
                            );
                            draftFormData.append(
                              "bestTime",
                              formData.get("bestTime") || ""
                            );
                            draftFormData.append("status", "DRAFT");
                            draftFormData.append("isDraft", "true");
                            draftFormData.append(
                              "createdAt",
                              new Date().toISOString()
                            );

                            // Save draft using backend API
                            const result = await console.log(draftFormData);

                            if (result?.success) {
                              toast({
                                title: "Draft Saved Successfully!",
                                description: `Your quote draft has been saved. Reference: DRAFT-${Date.now()
                                  .toString()
                                  .slice(-8)}`,
                              });
                            } else {
                              throw new Error("Failed to save draft");
                            }
                          } catch (error: any) {
                            console.error("Save draft error:", error);
                            toast({
                              title: "Save Failed",
                              description:
                                error.message ||
                                "Failed to save draft. Please try again.",
                              variant: "destructive",
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        Save as Draft
                      </Button>
                    </div>
                  </div>
                </form>
              )}
              {/* Why Choose Our Quotes */}
              <section className="py-20 px-4 bg-muted/50">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Why Choose Galloways for Your Quote?
                    </h2>
                    <p className="text-muted-foreground">
                      Experience the difference with our professional quote
                      service
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        title: "Fast Response",
                        description:
                          "Get your personalized quote within 24 hours of submission",
                        icon: "⚡",
                      },
                      {
                        title: "Multiple Options",
                        description:
                          "Compare quotes from our network of trusted insurance partners",
                        icon: "📊",
                      },
                      {
                        title: "Expert Guidance",
                        description:
                          "Our certified professionals help you understand your options",
                        icon: "🎯",
                      },
                      {
                        title: "No Obligation",
                        description: "Free quotes with no pressure to purchase",
                        icon: "🤝",
                      },
                      {
                        title: "Competitive Rates",
                        description:
                          "Access to competitive pricing through our partner network",
                        icon: "💰",
                      },
                      {
                        title: "Ongoing Support",
                        description:
                          "Continued support throughout your insurance journey",
                        icon: "🛡️",
                      },
                    ].map((benefit, index) => (
                      <Card key={index} className="p-6 text-center">
                        <div className="text-4xl mb-4">{benefit.icon}</div>
                        <h3 className="font-semibold mb-3">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
              {/* Contact Information */}
              <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Need Help with Your Quote?
                    </h2>
                    <p className="text-muted-foreground">
                      Our team is ready to assist you with any questions
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    <Card className="p-6 text-center">
                      <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Call Us</h3>
                      <p className="text-muted-foreground mb-3">
                        Speak directly with our experts
                      </p>
                      <p className="font-semibold">+254720769993</p>
                      <p className="text-sm text-muted-foreground">
                        Mon-Fri: 8AM-6PM, Sat: 9AM-2PM
                      </p>
                    </Card>
                    <Card className="p-6 text-center">
                      <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Email Us</h3>
                      <p className="text-muted-foreground mb-3">
                        Send us your questions
                      </p>
                      <p className="font-semibold">
                        gallowaysquotations@gmail.com
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Response within 2 hours
                      </p>
                    </Card>
                    <Card className="p-6 text-center">
                      <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">WhatsApp</h3>
                      <p className="text-muted-foreground mb-3">
                        Chat with us instantly
                      </p>
                      <p className="font-semibold">
                        +254720769993/+254758301346
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Available 24/7
                      </p>
                    </Card>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      {/* Insurance Product Downloads Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Insurance Product Downloads & Requirements
          </h2>
          {/* Marine Insurance Category */}
          <div className="p-6 bg-card rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2 text-primary flex items-center">
              {insuranceIcons["Marine Insurance"]}
              Marine Insurance
            </h3>
            <div className="font-semibold mb-2">Cover Includes:</div>
            <ul className="list-disc ml-6 text-muted-foreground mb-2">
              <li>Perils of the sea</li>
              <li>Fire, collusion, theft, etc.</li>
            </ul>
            <div className="font-semibold mb-2">Requirements:</div>
            <ul className="list-disc ml-6 text-muted-foreground">
              <li>Profoma invoice</li>
              <li>Import declaration form</li>
              <li>Bill of lading (sea)</li>
              <li>Airwaybill (air)</li>
              <li>CR 12</li>
              <li>Certificate of incorporation</li>
              <li>KRA pin certificate</li>
            </ul>
          </div>
          {/* Property & Theft Insurance */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">
              Property & Theft Insurance
            </h3>
            {/* Burglary / Theft Insurance */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Burglary / Theft Insurance"]}Burglary / Theft
                Insurance
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Asset register</li>
                <li>Valuation reports</li>
                <li>ID copy</li>
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin for the company</li>
                <li>CR12</li>
                <li>Photos (inside & outside of business premise)</li>
              </ul>
            </div>
            {/* All Risks Insurance */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["All Risks Insurance"]}All Risks Insurance
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Asset register</li>
                <li>ID copy</li>
                <li>Business registration certificate</li>
                <li>KRA pin</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
                <li>Photos (inside & outside of business premise)</li>
              </ul>
            </div>
            {/* Fire & Perils Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Fire & Perils Proposal Form"]}Fire & Perils
                Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Title deed & valuation report (if owned)</li>
                <li>Photos (if rented)</li>
                <li>Asset register (for industrial business)</li>
                <li>ID copy & KRA pin certificate</li>
              </ul>
            </div>
            {/* Political Violence & Terrorism (PVT) */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Political Violence & Terrorism (PVT)"]}
                Political Violence & Terrorism (PVT)
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Client ID & KRA pin</li>
                <li>CR12 (for corporates)</li>
                <li>Valuation reports (for rental businesses)</li>
                <li>Photos (inside & outside premises)</li>
              </ul>
            </div>
            {/* Domestic Package (Write-Up Wording) */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Domestic Package (Write-Up Wording)"]}Domestic
                Package (Write-Up Wording)
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Excel sheet of all contents with estimated values</li>
                <li>Title deed & valuation report (if owned)</li>
                <li>ID copy & KRA pin certificate</li>
              </ul>
            </div>
          </div>
          {/* Motor Insurance */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Motor Insurance</h3>
            {/* Motor Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Motor Proposal Form"]}Motor Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Logbook</li>
                <li>Invoice & buyer/seller agreement (if new)</li>
                <li>Import documents (if applicable)</li>
                <li>Client ID & KRA pin certificate</li>
                <li>
                  If company-owned: KRA pin, certificate of incorporation, CR12
                </li>
              </ul>
            </div>
            {/* Motor Trade Proposal */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Motor Trade Proposal"]}Motor Trade Proposal
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Asset register</li>
                <li>Photos of business premises</li>
                <li>CR12</li>
                <li>KRA pin for company</li>
                <li>Number of KG plates</li>
              </ul>
            </div>
            {/* Carriers’ Legal Liability Insurance */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Carriers’ Legal Liability Insurance"]}Carriers’
                Legal Liability Insurance
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>ID copy</li>
                <li>KRA pin certificate</li>
                <li>CR12</li>
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
              </ul>
            </div>
            {/* Goods in Transit Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Goods in Transit Proposal Form"]}Goods in
                Transit Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Business registration certificate</li>
                <li>ID copy</li>
                <li>KRA pin certificate</li>
                <li>CR12</li>
                <li>Certificate of incorporation</li>
              </ul>
            </div>
          </div>
          {/* Liability & Employee Insurance */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">
              Liability & Employee Insurance
            </h3>
            {/* Work Injury Benefits (WIBA) */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Work Injury Benefits (WIBA)"]}Work Injury
                Benefits (WIBA)
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>
                  Excel sheet of workers (job descriptions, wages, salaries)
                </li>
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
                <li>KRA pin for company</li>
              </ul>
            </div>
            {/* Employer’s Liability */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Employer’s Liability"]}Employer’s Liability
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>
                  Excel sheet of employees (job descriptions & gross salaries)
                </li>
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
                <li>KRA pin for company</li>
              </ul>
            </div>
            {/* Public Liability */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Public Liability"]}Public Liability
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin for company</li>
                <li>CR12</li>
              </ul>
            </div>
            {/* Contractual Liability Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Contractual Liability Proposal Form"]}
                Contractual Liability Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Service Level Agreement (SLA)</li>
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
                <li>KRA pin for company</li>
              </ul>
            </div>
          </div>
          {/* Professional Indemnity & Medical */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">
              Professional Indemnity & Medical
            </h3>
            {/* PI Proposal Form – Advocates */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["PI Proposal Form – Advocates"]}PI Proposal Form
                – Advocates
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>CR12</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin</li>
                <li>Business registration certificate</li>
                <li>Practicing licence</li>
                <li>Regulator licence</li>
              </ul>
            </div>
            {/* PI Proposal Form – Architects */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["PI Proposal Form – Architects"]}PI Proposal
                Form – Architects
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>CR12</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin</li>
                <li>Business registration certificate</li>
                <li>Practicing licence</li>
                <li>Regulator licence</li>
              </ul>
            </div>
            {/* PI Proposal Form – Doctors / Medical Practitioners */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {
                  insuranceIcons[
                    "PI Proposal Form – Doctors / Medical Practitioners"
                  ]
                }
                PI Proposal Form – Doctors / Medical Practitioners
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>CR12</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin</li>
                <li>Business registration certificate</li>
                <li>Practicing licence</li>
                <li>Regulator licence</li>
              </ul>
            </div>
            {/* PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS & Land Surveyors */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {
                  insuranceIcons[
                    "PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS & Land Surveyors"
                  ]
                }
                PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS
                & Land Surveyors
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>CR12</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin</li>
                <li>Business registration certificate</li>
                <li>Practicing licence</li>
                <li>Regulator licence</li>
              </ul>
            </div>
            {/* Travel Insurance Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Travel Insurance Proposal Form"]}Travel
                Insurance Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>ID copy</li>
                <li>KRA pin certificate</li>
                <li>Passport</li>
              </ul>
            </div>
          </div>
          {/* Fidelity, Money & Specialized Covers */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">
              Fidelity, Money & Specialized Covers
            </h3>
            {/* Fidelity Guarantee Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Fidelity Guarantee Proposal Form"]}Fidelity
                Guarantee Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Certificate of incorporation</li>
                <li>Business registration certificate</li>
                <li>CR12</li>
                <li>KRA pin for company</li>
              </ul>
            </div>
            {/* Money Insurance Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Money Insurance Proposal Form"]}Money Insurance
                Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>
                  Standard company KYC docs (ID, KRA, CR12, Incorporation,
                  Registration cert.)
                </li>
              </ul>
            </div>
            {/* Poultry Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Poultry Proposal Form"]}Poultry Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>
                  Veterinary health valuation certificate (uploaded by certified
                  vet)
                </li>
              </ul>
            </div>
            {/* Livestock Insurance Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Livestock Insurance Proposal Form"]}Livestock
                Insurance Proposal Form
              </h4>
              {/* Download button removed, guide content retained */}
              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Vet health report</li>
                <li>KYC docs (ID, KRA, CR12, etc.)</li>
              </ul>
            </div>
            {/* Personal Accident Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Personal Accident Proposal Form"]}Personal
                Accident Proposal Form
              </h4>

              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
                <li>KRA pin certificate</li>
                <li>ID copy (individual)</li>
              </ul>
            </div>
          </div>
          {/* Engineering & Contractors Insurance */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">
              Engineering & Contractors Insurance
            </h3>
            {/* Contractors’ All Risk Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Contractors’ All Risk Proposal Form"]}
                Contractors’ All Risk Proposal Form
              </h4>

              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Business registration certificate</li>
                <li>KRA certificate</li>
                <li>CR12</li>
                <li>Certificate of incorporation</li>
                <li>NCA licence</li>
                <li>County approvals</li>
                <li>NEMA approvals</li>
                <li>Bill of quantities</li>
                <li>KYC for structural engineer</li>
                <li>Project manager’s report</li>
              </ul>
            </div>
            {/* Erection All Risks Proposal Form */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Erection All Risks Proposal Form"]}Erection All
                Risks Proposal Form
              </h4>

              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Business registration certificate</li>
                <li>Certificate of incorporation</li>
                <li>KRA pin for company</li>
                <li>CR12</li>
                <li>Contract award letter</li>
              </ul>
            </div>
            {/* Contractors’ Plant & Machinery (CPM Write-Up) */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {
                  insuranceIcons[
                    "Contractors’ Plant & Machinery (CPM Write-Up)"
                  ]
                }
                Contractors’ Plant & Machinery (CPM Write-Up)
              </h4>

              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Logbook</li>
                <li>Valuation reports</li>
                <li>ID copy</li>
                <li>KRA pin</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
                <li>Proforma invoice (if new)</li>
                <li>Buyer/seller agreement</li>
              </ul>
            </div>
            {/* Machinery Breakdown (Extra Damage) */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Machinery Breakdown (Extra Damage)"]}Machinery
                Breakdown (Extra Damage)
              </h4>

              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>
                  Standard engineering insurance KYC docs (ID, KRA, CR12,
                  Incorporation)
                </li>
              </ul>
            </div>
            {/* Electronic Equipment Insurance */}
            <div className="mb-8 p-6 bg-card rounded-lg shadow">
              <h4 className="text-xl font-bold mb-2">
                {insuranceIcons["Electronic Equipment Insurance"]}Electronic
                Equipment Insurance
              </h4>

              <div className="font-semibold mb-2">Required Attachments:</div>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Business registration certificate</li>
                <li>KRA pin for company</li>
                <li>Certificate of incorporation</li>
                <li>CR12</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
