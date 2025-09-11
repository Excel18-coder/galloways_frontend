import React, { useState } from "react";
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
} from "lucide-react";

// ============= CONSTANTS =============
const INSURANCE_PRODUCTS = [
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

const CONTACT_METHODS = [
  {
    id: "phone-call",
    label: "Phone Call",
    icon: <Phone className="w-4 h-4" />,
  },
  { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
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
];

const WHY_CHOOSE_US = [
  {
    title: "Fast Response",
    description: "Get your personalized quote within 24 hours of submission",
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
    description: "Our certified professionals help you understand your options",
    icon: "🎯",
  },
  {
    title: "No Obligation",
    description: "Free quotes with no pressure to purchase",
    icon: "🤝",
  },
  {
    title: "Competitive Rates",
    description: "Access to competitive pricing through our partner network",
    icon: "💰",
  },
  {
    title: "Ongoing Support",
    description: "Continued support throughout your insurance journey",
    icon: "🛡️",
  },
];

const CONTACT_INFO = [
  {
    title: "Call Us",
    subtitle: "Speak directly with our experts",
    value: "+254720769993",
    detail: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
    icon: <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />,
  },
  {
    title: "Email Us",
    subtitle: "Send us your questions",
    value: "gallowaysquotations@gmail.com",
    detail: "Response within 2 hours",
    icon: <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />,
  },
  {
    title: "WhatsApp",
    subtitle: "Chat with us instantly",
    value: "+254720769993/+254758301346",
    detail: "Available 24/7",
    icon: <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-4" />,
  },
];

// Sample product fields for demonstration
const PRODUCT_FIELDS = {
  "Motor Insurance Application Form": [
    {
      id: "vehicleType",
      label: "Vehicle Type",
      type: "select",
      options: ["Car", "Motorcycle", "Truck", "Van"],
      required: true,
    },
    {
      id: "vehicleValue",
      label: "Vehicle Value (KES)",
      type: "number",
      required: true,
    },
    {
      id: "registrationNumber",
      label: "Registration Number",
      type: "text",
      required: false,
    },
    {
      id: "engineCapacity",
      label: "Engine Capacity (CC)",
      type: "number",
      required: true,
    },
  ],
  "Travel Insurance Proposal Form": [
    {
      id: "destination",
      label: "Travel Destination",
      type: "text",
      required: true,
    },
    { id: "travelDates", label: "Travel Period", type: "text", required: true },
    {
      id: "tripPurpose",
      label: "Purpose of Trip",
      type: "select",
      options: ["Business", "Leisure", "Medical", "Education"],
      required: true,
    },
    {
      id: "travelersCount",
      label: "Number of Travelers",
      type: "number",
      required: true,
    },
  ],
  "Fire Insurance Proposal Form": [
    {
      id: "propertyType",
      label: "Property Type",
      type: "select",
      options: ["Residential", "Commercial", "Industrial"],
      required: true,
    },
    {
      id: "propertyValue",
      label: "Property Value (KES)",
      type: "number",
      required: true,
    },
    {
      id: "constructionType",
      label: "Construction Type",
      type: "select",
      options: ["Stone", "Timber", "Iron Sheets", "Mixed"],
      required: true,
    },
    {
      id: "occupancy",
      label: "Occupancy Details",
      type: "textarea",
      required: true,
    },
  ],
};

// ============= UTILITY FUNCTIONS =============
const generateReferenceNumber = () => `GIQ-${Date.now().toString().slice(-8)}`;

const collectFormData = (formElement) => {
  const formData = {};
  const inputs = formElement.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    if (input.name) {
      if (input.type === "checkbox") {
        formData[input.name] = input.checked;
      } else if (input.type === "radio") {
        if (input.checked) {
          formData[input.name] = input.value;
        }
      } else if (input.type === "file") {
        formData[input.name] = input.files;
      } else {
        formData[input.name] = input.value;
      }
    }
  });

  return formData;
};

const showToast = (title, description, variant = "default") => {
  console.log(`Toast: ${title} - ${description} (${variant})`);
};

// ============= COMPONENTS =============
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

const Label = ({ className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

const Button = ({
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
  };

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    lg: "h-11 px-8",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ className = "", children, ...props }) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const FormField = ({ field }) => {
  const baseInputClass =
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  switch (field.type) {
    case "text":
    case "number":
    case "date":
      return (
        <div>
          <Label htmlFor={field.id}>
            {field.label} {field.required && "*"}
          </Label>
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            required={field.required}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label htmlFor={field.id}>
            {field.label} {field.required && "*"}
          </Label>
          <Textarea id={field.id} name={field.id} required={field.required} />
        </div>
      );
    case "select":
      return (
        <div>
          <Label htmlFor={field.id}>
            {field.label} {field.required && "*"}
          </Label>
          <select
            id={field.id}
            name={field.id}
            className={baseInputClass}
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
    case "checkboxes":
      return (
        <div>
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
    default:
      return <div>Unsupported field type</div>;
  }
};

const PersonalInfoSection = () => (
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
        name="location"
        placeholder="e.g., Nairobi, Mombasa, Kisumu"
      />
    </div>
  </div>
);

const InsuranceDetailsSection = ({ selectedProduct, onProductChange }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold border-b pb-2">
      Insurance Requirements
    </h3>
    <div>
      <Label htmlFor="product">Insurance Product *</Label>
      <select
        id="product"
        name="product"
        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
        value={selectedProduct}
        onChange={onProductChange}
      >
        <option value="">Select insurance product</option>
        {INSURANCE_PRODUCTS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>

    {selectedProduct && PRODUCT_FIELDS[selectedProduct] && (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{selectedProduct} Details</h3>
        <div className="space-y-4">
          {PRODUCT_FIELDS[selectedProduct].map((field) => (
            <FormField key={field.id} field={field} />
          ))}
        </div>
      </div>
    )}

    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="budget">Budget Range (KES)</Label>
        <select
          id="budget"
          name="budget"
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          name="coverage"
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select coverage period</option>
          <option value="1-year">1 Year</option>
          <option value="2-years">2 Years</option>
          <option value="3-years">3 Years</option>
          <option value="long-term">Long Term (5+ years)</option>
        </select>
      </div>
    </div>

    <div>
      <Label htmlFor="details">Additional Details</Label>
      <Textarea
        id="details"
        name="details"
        placeholder="Please provide any additional information about your insurance needs, family size, assets to cover, specific requirements, etc."
        className="min-h-32"
      />
    </div>
  </div>
);

const ContactPreferencesSection = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold border-b pb-2">Contact Preferences</h3>
    <div>
      <Label>Preferred Contact Method *</Label>
      <div className="space-y-2 mt-2">
        {CONTACT_METHODS.map((method) => (
          <label
            key={method.id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name="contactMethod"
              value={method.id}
              className="text-blue-600 focus:ring-blue-500"
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
        name="bestTime"
        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select preferred time</option>
        <option value="morning">Morning (8AM - 12PM)</option>
        <option value="afternoon">Afternoon (12PM - 5PM)</option>
        <option value="evening">Evening (5PM - 8PM)</option>
        <option value="anytime">Anytime</option>
      </select>
    </div>
  </div>
);

const FileUploadSection = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold border-b pb-2">
      Supporting Documents (Optional)
    </h3>
    <div>
      <Label>Upload Supporting Documents</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Upload any relevant documents (ID, vehicle logbook, property
          documents, etc.)
        </p>
        <p className="text-xs text-gray-400 mb-4">
          Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
        </p>
        <input
          type="file"
          name="document"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
          className="block mx-auto mt-2"
        />
      </div>
    </div>
  </div>
);

const SuccessMessage = ({ refNum, onReset }) => (
  <div className="max-w-2xl mx-auto text-center py-16">
    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
    <h2 className="text-3xl font-bold text-green-800 mb-4">
      Quote Submitted Successfully!
    </h2>
    <p className="text-lg text-gray-600 mb-4">
      Reference Number:{" "}
      <span className="font-bold text-blue-600">{refNum}</span>
    </p>
    <p className="text-gray-600 mb-6">
      Thank you for your quote request. Our team will review your requirements
      and contact you within 24 hours with a personalized quote.
    </p>
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        A confirmation email has been sent to your provided email address.
      </p>
      <p className="text-sm text-gray-500">
        You'll receive SMS updates on your quote status.
      </p>
      <Button onClick={onReset} className="mt-4">
        Submit Another Quote
      </Button>
    </div>
  </div>
);

const WhyChooseUsSection = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Why Choose Galloways for Your Quote?
        </h2>
        <p className="text-gray-600">
          Experience the difference with our professional quote service
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {WHY_CHOOSE_US.map((benefit, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="font-semibold mb-3">{benefit.title}</h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ContactInfoSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Need Help with Your Quote?
        </h2>
        <p className="text-gray-600">
          Our team is ready to assist you with any questions
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {CONTACT_INFO.map((contact, index) => (
          <Card key={index} className="p-6 text-center">
            {contact.icon}
            <h3 className="font-semibold mb-2">{contact.title}</h3>
            <p className="text-gray-600 mb-3">{contact.subtitle}</p>
            <p className="font-semibold">{contact.value}</p>
            <p className="text-sm text-gray-500">{contact.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// ============= MAIN COMPONENT =============
export default function InsuranceQuotesForm() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [success, setSuccess] = useState(false);
  const [refNum, setRefNum] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleReset = () => {
    setSuccess(false);
    setRefNum("");
    setSelectedProduct("");
  };

  const handleSubmit = async (isDraft = false) => {
    setIsLoading(true);

    try {
      const formElement = document.querySelector("#quote-form");
      const formData = collectFormData(formElement);

      // Add metadata
      const submissionData = {
        ...formData,
        selectedProduct,
        status: isDraft ? "DRAFT" : "SUBMITTED",
        timestamp: new Date().toISOString(),
      };

      // Log form data for debugging
      console.log("Form submission data:", submissionData);
      console.log("Is draft:", isDraft);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!isDraft) {
        const refNumber = generateReferenceNumber();
        setRefNum(refNumber);
        setSuccess(true);
        showToast(
          "Quote Submitted Successfully!",
          `Your quote request (Ref: ${refNumber}) has been submitted. We'll contact you within 24 hours.`
        );
      } else {
        showToast(
          "Draft Saved Successfully!",
          `Your quote draft has been saved. Reference: DRAFT-${generateReferenceNumber()}`
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast(
        "Submission Error",
        error.message || "Failed to submit. Please try again.",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Insurance Quote Request
          </h1>

          {success ? (
            <SuccessMessage refNum={refNum} onReset={handleReset} />
          ) : (
            <div
              id="quote-form"
              className="space-y-6 bg-white p-8 rounded-lg shadow-sm border"
            >
              <PersonalInfoSection />
              <InsuranceDetailsSection
                selectedProduct={selectedProduct}
                onProductChange={handleProductChange}
              />
              <ContactPreferencesSection />
              <FileUploadSection />

              <div className="space-y-6">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 underline">
                      Privacy Policy
                    </a>
                    . I consent to being contacted regarding my insurance quote
                    request.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 px-8 py-3"
                    disabled={isLoading}
                    onClick={() => handleSubmit(false)}
                  >
                    {isLoading ? "Submitting..." : "Submit & Get Quote"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={isLoading}
                    onClick={() => handleSubmit(true)}
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <WhyChooseUsSection />
        <ContactInfoSection />
      </div>
    </div>
  );
}
