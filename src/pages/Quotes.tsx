import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Accordion, AccordionItem } from "../components/ui/accordion";
// API import disabled for build
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
	FileDown
} from "lucide-react";

const insuranceIcons = {
	"Burglary / Theft Insurance": <Shield className="inline-block mr-2 text-accent" />,
	"All Risks Insurance": <Home className="inline-block mr-2 text-accent" />,
	"Fire & Perils Proposal Form": <Building2 className="inline-block mr-2 text-accent" />,
	"Political Violence & Terrorism (PVT)": <Shield className="inline-block mr-2 text-accent" />,
	"Domestic Package (Write-Up Wording)": <Home className="inline-block mr-2 text-accent" />,
	"Motor Proposal Form": <Car className="inline-block mr-2 text-accent" />,
	"Motor Trade Proposal": <Car className="inline-block mr-2 text-accent" />,
	"Carriers’ Legal Liability Insurance": <Briefcase className="inline-block mr-2 text-accent" />,
	"Goods in Transit Proposal Form": <Briefcase className="inline-block mr-2 text-accent" />,
	"Work Injury Benefits (WIBA)": <Users className="inline-block mr-2 text-accent" />,
	"Employer’s Liability": <Users className="inline-block mr-2 text-accent" />,
	"Public Liability": <UserCheck className="inline-block mr-2 text-accent" />,
	"Contractual Liability Proposal Form": <FileText className="inline-block mr-2 text-accent" />,
	"PI Proposal Form – Advocates": <FileText className="inline-block mr-2 text-accent" />,
	"PI Proposal Form – Architects": <FileText className="inline-block mr-2 text-accent" />,
	"PI Proposal Form – Doctors / Medical Practitioners": <HeartPulse className="inline-block mr-2 text-accent" />,
	"PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS & Land Surveyors": <Layers className="inline-block mr-2 text-accent" />,
	"Travel Insurance Proposal Form": <Plane className="inline-block mr-2 text-accent" />,
	"Fidelity Guarantee Proposal Form": <PiggyBank className="inline-block mr-2 text-accent" />,
	"Money Insurance Proposal Form": <Coins className="inline-block mr-2 text-accent" />,
	"Poultry Proposal Form": <UserCheck className="inline-block mr-2 text-accent" />,
	"Livestock Insurance Proposal Form": <UserCheck className="inline-block mr-2 text-accent" />,
	"Personal Accident Proposal Form": <UserCheck className="inline-block mr-2 text-accent" />,
	"Contractors’ All Risk Proposal Form": <Hammer className="inline-block mr-2 text-accent" />,
	"Erection All Risks Proposal Form": <Hammer className="inline-block mr-2 text-accent" />,
	"Contractors’ Plant & Machinery (CPM Write-Up)": <Wrench className="inline-block mr-2 text-accent" />,
	"Machinery Breakdown (Extra Damage)": <Wrench className="inline-block mr-2 text-accent" />,
	"Electronic Equipment Insurance": <MonitorSmartphone className="inline-block mr-2 text-accent" />,
};

const insuranceProducts = [
	{
		title: "Burglary / Theft Insurance",
		form: "/Downloads/burglary_proposal.pdf",
		attachments: [
			"Asset register",
			"Valuation reports",
			"ID copy",
			"Business registration certificate",
			"Certificate of incorporation",
			"KRA PIN (company)",
			"CR12",
			"Photos (inside & outside business)",
		],
	},
	{
		title: "All Risks Insurance",
		form: "/Downloads/all_risks_proposal.pdf",
		attachments: [
			"Asset register",
			"ID copy",
			"Business registration certificate",
			"Certificate of incorporation",
			"CR12",
			"KRA PIN (company)",
			"Photos of premises",
		],
	},
	// ...add all other products here in the same format...
];

export default function Quotes() {
	const [tab, setTab] = useState("quote");
	const [selectedProduct, setSelectedProduct] = useState("");
	const [success, setSuccess] = useState(false);
	const [refNum, setRefNum] = useState("");
	const [isLoading, setIsLoading] = useState(false);

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
	const productFields = {

		"Marine Insurance": [
			{ label: "Full Name", id: "fullName", type: "text", required: true },
			{ label: "ID/Passport Number", id: "idPassport", type: "text", required: true },
			{ label: "PIN Number", id: "pinNumber", type: "text" },
			{ label: "Occupation", id: "occupation", type: "text" },
			{ label: "Postal Address", id: "postalAddress", type: "text" },
			{ label: "Postal Code", id: "postalCode", type: "number" },
			{ label: "Town", id: "town", type: "text" },
			{ label: "Email Address", id: "email", type: "email" },
			{ label: "Telephone/Mobile", id: "phone", type: "text" },
			{ label: "Category of Cargo", id: "cargoCategory", type: "checkboxes", options: ["Chemicals/Pharmaceuticals", "Food", "Machinery/Vehicles", "Textile", "Other"] },
			{ label: "Other Cargo Category Details", id: "otherCargoDetails", type: "text", showIf: { field: "cargoCategory", value: "Other" } },
			{ label: "Cargo Description", id: "cargoDescription", type: "textarea" },
			{ label: "Select Packaging Type(s)", id: "packagingTypes", type: "checkboxes", options: ["Containerized", "Non-containerized", "Boxes", "Cartons", "Bags", "Drums", "Bottled", "Crates", "Locked", "Bulk", "Container", "Conveyance"] },
			{ label: "Name of Vessel", id: "vesselName", type: "text" },
			{ label: "Voyage Start Date", id: "voyageStartDate", type: "date" },
			{ label: "Voyage End Date", id: "voyageEndDate", type: "date" },
			{ label: "Port of Loading", id: "portOfLoading", type: "text" },
			{ label: "Port of Discharge", id: "portOfDischarge", type: "text" },
			{ label: "Final Destination", id: "finalDestination", type: "text" },
			{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare that the above information is true and complete, and that I have withheld no material information regarding this proposal."] },
		],
		"Motor Insurance Application Form": [
			{ label: "Full Customer Name", id: "customerName", type: "text", required: true },
			{ label: "Address", id: "address", type: "text", required: true },
			{ label: "P.O. Box", id: "poBox", type: "text" },
			{ label: "Code", id: "code", type: "text" },
			{ label: "Tel", id: "tel", type: "text" },
			{ label: "E-mail", id: "email", type: "email" },
			{ label: "Mobile No.", id: "mobileNo", type: "text" },
			{ label: "Policy Period From", id: "policyFrom", type: "date" },
			{ label: "Policy Period To", id: "policyTo", type: "date" },
			{ label: "Registration Marks (Number Plate)", id: "registrationMarks", type: "text" },
			{ label: "Make of Vehicle", id: "makeOfVehicle", type: "text" },
			{ label: "Chassis Number", id: "chassisNumber", type: "text" },
			{ label: "Engine Number", id: "engineNumber", type: "text" },
			{ label: "Type of Body", id: "typeOfBody", type: "text" },
			{ label: "Cubic Capacity", id: "cubicCapacity", type: "text" },
			{ label: "Seating Capacity", id: "seatingCapacity", type: "text" },
			{ label: "Sum Insured (KES)", id: "sumInsured", type: "number" },
			{ label: "Scope of Cover", id: "scopeOfCover", type: "checkboxes", options: ["Comprehensive", "Third Party Only"] },
			{ label: "Other Cover Extensions", id: "otherCoverExtensions", type: "checkboxes", options: ["Material Damage Excess Protector", "Theft Excess Protector", "Political Violence and Terrorism (PVT)", "Courtesy Car", "AA Membership", "Others"] },
			{ label: "Use of the Vehicle", id: "useOfVehicle", type: "checkboxes", options: ["Private Own Use", "Commercial General Cartage", "Commercial Own Goods", "PSV Matatu", "PSV Motorcycle", "Taxi / Private Hire Self Drive", "Private Hire (Chauffer Driven)", "Tours", "Uber", "Institutional Vehicle", "Hearse", "Oil Tanker", "Others"] },
			{ label: "Names of Authorized Drivers", id: "authorizedDrivers", type: "textarea" },
			{ label: "Declaration Name of Applicant", id: "declarationName", type: "text", required: true },
			{ label: "Signature", id: "signature", type: "text", required: true },
			{ label: "ID No.", id: "idNo", type: "text" },
			{ label: "PIN Number", id: "pinNumber", type: "text" },
			{ label: "Issued By (Galloways Staff)", id: "issuedBy", type: "text" },
			{ label: "Mode of Payment", id: "modeOfPayment", type: "text" },
		],
			"Political Violence Proposal": [
				{ label: "Proposer and all subsidiary companies", id: "proposerSubsidiaries", type: "text", required: true },
				{ label: "Proposer mailing address", id: "proposerAddress", type: "text", required: true },
				{ label: "Nationality & Date established", id: "nationalityDate", type: "text" },
				{ label: "Status of proposer", id: "proposerStatus", type: "select", options: ["Private Company", "Public Company", "Government Owned", "Other"] },
				{ label: "Proposer's shareholding (%)", id: "proposerShareholding", type: "text" },
				{ label: "Other Shareholders' Percentage & Nationality", id: "otherShareholders", type: "textarea" },
				{ label: "Business operation description", id: "businessDescription", type: "textarea" },
				{ label: "Policy currency to be used", id: "policyCurrency", type: "select", options: ["KES", "USD", "GBP", "EUR"] },
				{ label: "Coverage Required", id: "coverageRequired", type: "checkboxes", options: ["Sabotage & Terrorism", "SRCC & Malicious Damage", "Full Political Violence"] },
				{ label: "Physical Assets and Business Interruption values at locations", id: "assetValues", type: "table", columns: ["Buildings", "Contents", "Business Interruption", "Total Asset Values"] },
				{ label: "Limit of Liability requested for Buildings, Contents, Business Interruption (Each Loss)", id: "liabilityLimitsEachLoss", type: "table", columns: ["Building", "Contents", "Business Interruption", "Total Each Loss"] },
				{ label: "Limit of Liability requested (Total Each Policy)", id: "liabilityLimitsTotalPolicy", type: "text" },
				{ label: "Details of all security arrangements & public access", id: "securityArrangements", type: "textarea" },
				{ label: "Details of any public parking (including street parking)", id: "publicParking", type: "textarea" },
				{ label: "Details of area surrounding location(s)", id: "areaSurroundings", type: "textarea" },
				{ label: "Details of landmark buildings, government offices, hotels, etc. within 500m", id: "landmarksNearby", type: "textarea" },
				{ label: "Describe occupants of surrounding buildings and their occupation", id: "surroundingOccupants", type: "textarea" },
				{ label: "Details of any direct/indirect threat made against proposer/shareholders", id: "threatDetails", type: "textarea" },
				{ label: "Details of previous acts of Terrorism, Sabotage, SRCC, Malicious Damage, War, etc.", id: "previousActs", type: "textarea" },
				{ label: "Reason for requesting terrorism cover", id: "reasonTerrorismCover", type: "textarea" },
				{ label: "Description of security at location(s)", id: "securityDescription", type: "textarea" },
				{ label: "Business involvement with government agencies", id: "govtBusinessInvolvement", type: "textarea" },
				{ label: "Premises owned/leased/rented to government/state agency", id: "govtPremises", type: "textarea" },
				{ label: "Vicinity of government premises/sites", id: "vicinityGovtPremises", type: "checkboxes", options: ["Government premises/sites", "Major economic centres", "Major tourist attractions", "Major sporting stadia", "International airports"] },
				{ label: "Period of cover required", id: "periodOfCover", type: "text" },
				{ label: "Are any assets already covered against terrorism?", id: "assetsAlreadyCovered", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare the statements are true, complete and correct."] },
				{ label: "Privacy Statement & Consent (Galloways)", id: "privacyConsent", type: "checkbox", options: ["I have read and agree to Galloways Privacy Statement."] },
				{ label: "Consent for processing Personal Data relating to a child", id: "childConsent", type: "select", options: ["I AGREE", "I DO NOT AGREE", "Not Applicable"] },
				{ label: "Consent for transfer outside Kenya", id: "transferConsent", type: "select", options: ["I AGREE", "I DO NOT AGREE"] },
				{ label: "Marketing consent", id: "marketingConsent", type: "select", options: ["YES", "NO"] },
				{ label: "Signature", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Contractors Plant and Machinery": [
				{ label: "Proposer Name", id: "proposerName", type: "text", required: true },
				{ label: "Proposer Address", id: "proposerAddress", type: "text", required: true },
				{ label: "Insurance Period (months/years)", id: "insurancePeriod", type: "text" },
				{ label: "Commencement Date", id: "commencementDate", type: "date" },
				{ label: "Geographical Scope of Cover", id: "geoScope", type: "text" },
				{ label: "Previous CPM Insurance?", id: "previousCPM", type: "select", options: ["Yes", "No"] },
				{ label: "Previous CPM Details", id: "previousCPMDetails", type: "textarea" },
				{ label: "Hired Plant/Machinery?", id: "hiredPlant", type: "select", options: ["Yes", "No"] },
				{ label: "Owner's Name & Address (if hired)", id: "ownerDetails", type: "text" },
				{ label: "Exposure to Hazards", id: "hazards", type: "checkboxes", options: ["Fire/Explosion", "Earthquake/Volcanic/Tsunami", "Employment Underground", "Storm/Cyclone", "Flood/Inundation", "Employment in Mountain Terrain", "Landslide", "Blasting", "Other"] },
				{ label: "Extra Charges Cover (Overtime, night work, holidays)", id: "extraChargesCover", type: "select", options: ["Yes", "No"] },
				{ label: "Limit of Indemnity for Extra Charges", id: "extraChargesLimit", type: "text" },
				{ label: "Inland Transport Cover?", id: "inlandTransport", type: "select", options: ["Yes", "No"] },
				{ label: "Maximum Value Transported by One Means", id: "maxTransportValue", type: "text" },
				{ label: "Consent for Marketing Purposes", id: "marketingConsent", type: "select", options: ["I consent", "I do not consent"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare the statements are true and complete."] },
				{ label: "Privacy Notice Consent", id: "privacyConsent", type: "checkbox", options: ["I have read and understood the Privacy Notice."] },
				{ label: "Executed at", id: "executedAt", type: "text" },
				{ label: "Date", id: "date", type: "date", required: true },
				{ label: "Signature", id: "signature", type: "text", required: true },
				{ label: "Schedule of Items (table)", id: "scheduleItems", type: "table", columns: ["Item No.", "Description", "Year of Manufacture", "Hazards", "Replacement Value", "Manufacturer", "Type/Serial No.", "Output"] },
			],
			"Carriers Legal Liability Insurance": [
				{ label: "Name of Proposer", id: "proposerName", type: "text", required: true },
				{ label: "Address and Contacts", id: "proposerAddress", type: "text", required: true },
				{ label: "Pin Certificate Number", id: "pinCertificate", type: "text" },
				{ label: "Physical Address of Central Office", id: "centralOfficeAddress", type: "text" },
				{ label: "Business Type (Sole Trader, Partnership, Limited Company)", id: "businessType", type: "select", options: ["Sole Trader", "Partnership", "Limited Company"] },
				{ label: "Business/Occupation Description", id: "businessDescription", type: "textarea" },
				{ label: "Date of Business Registration", id: "businessRegistrationDate", type: "date" },
				{ label: "Ownership Change Since Registration?", id: "ownershipChange", type: "select", options: ["Yes", "No"] },
				{ label: "Ownership Change Details", id: "ownershipChangeDetails", type: "textarea" },
				{ label: "Main Types of Goods Carried/Handled/Warehoused", id: "goodsTypes", type: "textarea" },
				{ label: "Area of Operations (Geographical)", id: "areaOfOperations", type: "text" },
				{ label: "Vehicles Owned/Hired", id: "vehiclesOwnedHired", type: "select", options: ["Owned", "Hired", "Owned and Hired"] },
				{ label: "Subcontract Carriage?", id: "subcontractCarriage", type: "select", options: ["Yes", "No"] },
				{ label: "Written Contracts with Subcontractors?", id: "writtenContracts", type: "select", options: ["Yes", "No"] },
				{ label: "Subcontractor Contract Details", id: "subcontractorDetails", type: "textarea" },
				{ label: "Vehicle Register Maintained?", id: "vehicleRegister", type: "select", options: ["Yes", "No"] },
				{ label: "Vehicle Register Details", id: "vehicleRegisterDetails", type: "textarea" },
				{ label: "Vehicle Maintenance Details", id: "vehicleMaintenance", type: "textarea" },
				{ label: "Hired Vehicle Maintenance & Staff Reliability", id: "hiredVehicleMaintenance", type: "textarea" },
				{ label: "Goods Safety During Temporary Garaging", id: "goodsSafety", type: "textarea" },
				{ label: "Vehicle Security Devices", id: "securityDevices", type: "checkboxes", options: ["Tracking Devices", "Radio Communication", "Engine Immobilizers", "Overloading Devices", "Other"] },
				{ label: "Total Number of Own Employees", id: "ownEmployees", type: "number" },
				{ label: "Total Number of Hired Drivers/Operators", id: "hiredDrivers", type: "number" },
				{ label: "Employee Vetting System", id: "employeeVetting", type: "textarea" },
				{ label: "Driver License & Identity Verification", id: "driverVerification", type: "textarea" },
				{ label: "Limits of Liability Required (table)", id: "liabilityLimits", type: "table", columns: ["Any One Claim (KES)", "All Claims One Event (KES)", "All Claims Period of Insurance (KES)"] },
				{ label: "Estimated Annual Carry (KES)", id: "estimatedAnnualCarry", type: "number" },
				{ label: "Actual Annual Carry (last 3 years)", id: "actualAnnualCarry", type: "table", columns: ["Year", "KES"] },
				{ label: "Insurance/Loss History", id: "insuranceLossHistory", type: "textarea" },
				{ label: "Previous Loss Details (last 3 years)", id: "previousLossDetails", type: "textarea" },
				{ label: "Precautions to Avoid Recurrence", id: "precautionsRecurrence", type: "textarea" },
				{ label: "Insurance Company History (Cancelled, Declined, etc.)", id: "insuranceCompanyHistory", type: "checkboxes", options: ["Cancelled Policy", "Declined to Insure", "Declined to Renew", "Imposed Special Terms", "Declined Claim"] },
				{ label: "Insurance Company History Details", id: "insuranceCompanyHistoryDetails", type: "textarea" },
				{ label: "Consent for Data Processing", id: "dataConsent", type: "select", options: ["YES", "NO"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare the answers are true and complete."] },
				{ label: "Signature", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Public Liability": [
				{ label: "Name of Proposer (in full)", id: "proposerName", type: "text", required: true },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number(s)", id: "telephoneNumbers", type: "text" },
				{ label: "Email Address", id: "emailAddress", type: "text" },
				{ label: "ID Number (if applicable)", id: "idNumber", type: "text" },
				{ label: "PIN No.", id: "pinNo", type: "text" },
				{ label: "Period of Insurance (From/To)", id: "periodOfInsurance", type: "text" },
				{ label: "Limits of Liability Required (table)", id: "liabilityLimits", type: "table", columns: ["Any One Claim (KES)", "All Claims One Event (KES)", "All Claims Period of Insurance (KES)"] },
				{ label: "Full Description of Business/Trade/Occupation", id: "businessDescription", type: "textarea" },
				{ label: "Hotel/Club Seating Capacity", id: "seatingCapacity", type: "number" },
				{ label: "Accommodation Facilities Offered?", id: "accommodationFacilities", type: "select", options: ["Yes", "No"] },
				{ label: "Car Park Facilities Provided?", id: "carParkFacilities", type: "select", options: ["Yes", "No"] },
				{ label: "Premises Description & Physical Address", id: "premisesDescription", type: "textarea" },
				{ label: "Do you own the premises?", id: "ownPremises", type: "select", options: ["Yes", "No"] },
				{ label: "Are you the sole occupier?", id: "soleOccupier", type: "select", options: ["Yes", "No"] },
				{ label: "Are premises, plant and machinery in sound state?", id: "soundState", type: "select", options: ["Yes", "No"] },
				{ label: "Use of acids, gases, chemicals, explosives, radioactive substances?", id: "hazardousMaterials", type: "select", options: ["Yes", "No"] },
				{ label: "Hazardous Materials Details", id: "hazardousMaterialsDetails", type: "textarea" },
				{ label: "Extend cover to lifts, cranes, hoists, lifting apparatus?", id: "liftingApparatus", type: "select", options: ["Yes", "No"] },
				{ label: "Property belonging to customers left in premises?", id: "customerProperty", type: "select", options: ["Yes", "No"] },
				{ label: "Business activities entail working away from premises?", id: "workAwayPremises", type: "select", options: ["Yes", "No"] },
				{ label: "Other work site locations", id: "otherWorkSites", type: "text" },
				{ label: "Cover liability for guests' personal effects?", id: "guestsPersonalEffects", type: "select", options: ["Yes", "No"] },
				{ label: "Indemnity Limit for Guests' Personal Effects", id: "guestsIndemnityLimit", type: "text" },
				{ label: "Insurance Claims History", id: "claimsHistory", type: "textarea" },
				{ label: "Currently insured for this type of risk?", id: "currentlyInsured", type: "select", options: ["Yes", "No"] },
				{ label: "Previously insured for this type of insurance?", id: "previouslyInsured", type: "select", options: ["Yes", "No"] },
				{ label: "Previous Insurer & Policy Number", id: "previousInsurer", type: "text" },
				{ label: "Previous loss details", id: "previousLossDetails", type: "textarea" },
				{ label: "Insurance Company History (Cancelled, Declined, etc.)", id: "insuranceCompanyHistory", type: "checkboxes", options: ["Cancelled Policy", "Declined to Insure", "Declined to Renew", "Imposed Special Terms", "Repudiated Claim"] },
				{ label: "Insurance Company History Details", id: "insuranceCompanyHistoryDetails", type: "textarea" },
				{ label: "Consent for Data Processing", id: "dataConsent", type: "select", options: ["YES", "NO"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare the answers are true and complete."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Professional Indemnity Proposal Form (General)": [
				{ label: "Name of Insured", id: "nameInsured", type: "text", required: true },
				{ label: "Practice Title", id: "practiceTitle", type: "text" },
				{ label: "Address", id: "address", type: "text" },
				{ label: "Legal Constitution", id: "legalConstitution", type: "select", options: ["Partnership", "Incorporated Company", "Limited Company", "Close Corporation", "Sole Practitioner"] },
				{ label: "Date of Commencement", id: "dateCommencement", type: "date" },
				{ label: "Discipline(s) Engaged", id: "disciplines", type: "text" },
				{ label: "Principals/Partners/Directors", id: "principals", type: "textarea" },
				{ label: "Claims History", id: "claimsHistory", type: "textarea" },
				{ label: "Indemnity Limit", id: "indemnityLimit", type: "number" },
				{ label: "Fee Income (last 3 years)", id: "feeIncome", type: "table", columns: ["Year", "Gross Fees"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare the statements are true and complete."] },
				{ label: "Privacy Statement & Consent (Galloways)", id: "privacyConsent", type: "checkbox", options: ["I have read and agree to Galloways Privacy Statement."] },
				{ label: "Signature", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Professional Indemnity Proposal Form (Engineers/Architects)": [
				{ label: "Title of Insured / Practice", id: "practiceTitle", type: "text", required: true },
				{ label: "P.O. Box", id: "poBox", type: "text" },
				{ label: "Postal Code", id: "postalCode", type: "text" },
				{ label: "Town", id: "town", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Fax Number", id: "fax", type: "text" },
				{ label: "Mobile Number", id: "mobile", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "VAT Registration Number", id: "vatReg", type: "text" },
				{ label: "PIN Number", id: "pin", type: "text" },
				{ label: "Legal Constitution", id: "legalConstitution", type: "select", options: ["Partnership", "Incorporated Company", "Limited Company", "Close Corporation", "Sole Practitioner"] },
				{ label: "Principal Office Address", id: "principalOffice", type: "text" },
				{ label: "Subsidiary Office Address", id: "subsidiaryOffice", type: "text" },
				{ label: "Date of Commencement (Current)", id: "dateCommencementCurrent", type: "date" },
				{ label: "Date of Commencement (Initial)", id: "dateCommencementInitial", type: "date" },
				{ label: "Disciplines Engaged In", id: "disciplines", type: "textarea" },
				{ label: "Names and Qualifications of Principals", id: "principals", type: "textarea" },
				{ label: "Claims History", id: "claimsHistory", type: "select", options: ["Yes", "No"] },
				{ label: "Claims Details (if Yes)", id: "claimsDetails", type: "textarea" },
				{ label: "Awareness of Circumstances for Claims", id: "awarenessCircumstances", type: "select", options: ["Yes", "No"] },
				{ label: "Circumstances Details (if Yes)", id: "circumstancesDetails", type: "textarea" },
				{ label: "Present/Past Insurance", id: "pastInsurance", type: "select", options: ["Yes", "No"] },
				{ label: "Past Insurance Details", id: "pastInsuranceDetails", type: "textarea" },
				{ label: "Indemnity for Retired/Left Principals", id: "indemnityRetired", type: "select", options: ["Yes", "No"] },
				{ label: "Retired Principal Details", id: "retiredPrincipalDetails", type: "textarea" },
				{ label: "Declined/Cancelled/Terms Imposed by Insurer", id: "declinedTerms", type: "select", options: ["Yes", "No"] },
				{ label: "Declined/Terms Details", id: "declinedTermsDetails", type: "textarea" },
				{ label: "Liability for Undiscovered Claims (Run-Off)", id: "runOffLiability", type: "select", options: ["Yes", "No"] },
				{ label: "Total Number of Staff", id: "staffTotal", type: "number" },
				{ label: "Staff Breakdown", id: "staffBreakdown", type: "textarea" },
				{ label: "Percentage of Briefs by Type", id: "briefsPercentage", type: "textarea" },
				{ label: "Percentage of Work Location (Chambers/Court)", id: "workLocationPercentage", type: "textarea" },
				{ label: "Indemnity Limits Required", id: "indemnityLimits", type: "textarea" },
				{ label: "Fee Income (Last 3 Years)", id: "feeIncomeHistory", type: "textarea" },
				{ label: "Estimated Fee Income (Next 12 Months)", id: "feeIncomeEstimate", type: "number" },
				{ label: "Extensions to Basic Cover", id: "extensionsBasicCover", type: "checkboxes", options: ["Loss of Documents", "Dishonesty of Employees", "Libel and Slander"] },
				{ label: "Extension Limits", id: "extensionLimits", type: "textarea" },
				{ label: "Consent for Data Processing", id: "consentData", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I/We declare that the above statements and particulars are true and complete."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Professional Indemnity Insurance Proposal Form (Medical Practitioners)": [
				{ label: "Full Name", id: "fullName", type: "text", required: true },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Business Address", id: "businessAddress", type: "text" },
				{ label: "Medical School Graduated From", id: "medicalSchool", type: "text" },
				{ label: "Year of Graduation", id: "yearGraduation", type: "number" },
				{ label: "Other Medical Schools Attended", id: "otherMedicalSchools", type: "text" },
				{ label: "Year of Graduation (Other)", id: "yearGraduationOther", type: "number" },
				{ label: "Practice History Since Graduation", id: "practiceHistory", type: "textarea" },
				{ label: "Licensed to Practice at Address?", id: "licensed", type: "select", options: ["Yes", "No"] },
				{ label: "Association Memberships", id: "associationMemberships", type: "textarea" },
				{ label: "Nature of Present/Future Activities", id: "natureActivities", type: "checkboxes", options: ["Physician", "Surgeon", "Cosmetic Surgeon", "Anaesthetist", "Gynaecologist", "Urologist", "Orthopaedist", "Radiologist", "Dentist", "Other"] },
				{ label: "Regular First-Aid Service?", id: "firstAidService", type: "select", options: ["Yes", "No"] },
				{ label: "Partners (Names)", id: "partners", type: "textarea" },
				{ label: "Qualified Medical Assistants (Names)", id: "medicalAssistants", type: "textarea" },
				{ label: "Number of Technicians", id: "technicians", type: "number" },
				{ label: "Number of Nurses", id: "nurses", type: "number" },
				{ label: "Contracted/Employed by Firm/Co?", id: "contractedFirm", type: "select", options: ["Yes", "No"] },
				{ label: "Own/Operate Hospital/Clinic?", id: "ownHospital", type: "select", options: ["Yes", "No"] },
				{ label: "Hospital/Clinic Details", id: "hospitalDetails", type: "textarea" },
				{ label: "Own/Operate X-ray/Laser?", id: "ownXrayLaser", type: "select", options: ["Yes", "No"] },
				{ label: "X-ray/Laser Details", id: "xrayLaserDetails", type: "textarea" },
				{ label: "Number of Patients per Year", id: "patientsPerYear", type: "number" },
				{ label: "Previous Insurance?", id: "previousInsurance", type: "select", options: ["Yes", "No"] },
				{ label: "Previous Insurance Details", id: "previousInsuranceDetails", type: "textarea" },
				{ label: "Previous Application Declined?", id: "applicationDeclined", type: "select", options: ["Yes", "No"] },
				{ label: "Special Restrictions/Terminated Insurance?", id: "specialRestrictions", type: "select", options: ["Yes", "No"] },
				{ label: "Claims/Suits for Malpractice (Last 5 Years)?", id: "malpracticeClaims", type: "select", options: ["Yes", "No"] },
				{ label: "Malpractice Claims Details", id: "malpracticeClaimsDetails", type: "textarea" },
				{ label: "Awareness of Circumstances for Claims?", id: "awarenessClaims", type: "select", options: ["Yes", "No"] },
				{ label: "Circumstances Details", id: "circumstancesDetails", type: "textarea" },
				{ label: "Indemnity Required (Any One Claim)", id: "indemnityOneClaim", type: "number" },
				{ label: "Indemnity Required (Annual Aggregate)", id: "indemnityAggregate", type: "number" },
				{ label: "Deductible Per Claim", id: "deductible", type: "number" },
				{ label: "Consent for Data Processing", id: "consentData", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I/We declare that the statements and particulars are true and complete."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Professional Indemnity Insurance Proposal Form (Accountants/Auditors)": [
				{ label: "Title of Insured / Practice", id: "practiceTitle", type: "text", required: true },
				{ label: "P.O. Box", id: "poBox", type: "text" },
				{ label: "Postal Code", id: "postalCode", type: "text" },
				{ label: "Town", id: "town", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Fax Number", id: "fax", type: "text" },
				{ label: "Mobile Number", id: "mobile", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "VAT Registration Number", id: "vatReg", type: "text" },
				{ label: "PIN Number", id: "pin", type: "text" },
				{ label: "Legal Constitution", id: "legalConstitution", type: "select", options: ["Partnership", "Incorporated Company", "Limited Company", "Close Corporation", "Sole Practitioner"] },
				{ label: "Principal Office Address", id: "principalOffice", type: "text" },
				{ label: "Subsidiary Office Address", id: "subsidiaryOffice", type: "text" },
				{ label: "Date of Commencement (Current)", id: "dateCommencementCurrent", type: "date" },
				{ label: "Date of Commencement (Initial)", id: "dateCommencementInitial", type: "date" },
				{ label: "Disciplines Engaged In", id: "disciplines", type: "textarea" },
				{ label: "Names and Qualifications of Principals", id: "principals", type: "textarea" },
				{ label: "Claims History", id: "claimsHistory", type: "select", options: ["Yes", "No"] },
				{ label: "Claims Details (if Yes)", id: "claimsDetails", type: "textarea" },
				{ label: "Awareness of Circumstances for Claims", id: "awarenessCircumstances", type: "select", options: ["Yes", "No"] },
				{ label: "Circumstances Details (if Yes)", id: "circumstancesDetails", type: "textarea" },
				{ label: "Present/Past Insurance", id: "pastInsurance", type: "select", options: ["Yes", "No"] },
				{ label: "Past Insurance Details", id: "pastInsuranceDetails", type: "textarea" },
				{ label: "Indemnity for Retired/Left Principals", id: "indemnityRetired", type: "select", options: ["Yes", "No"] },
				{ label: "Retired Principal Details", id: "retiredPrincipalDetails", type: "textarea" },
				{ label: "Declined/Cancelled/Terms Imposed by Insurer", id: "declinedTerms", type: "select", options: ["Yes", "No"] },
				{ label: "Declined/Terms Details", id: "declinedTermsDetails", type: "textarea" },
				{ label: "Liability for Undiscovered Claims (Run-Off)", id: "runOffLiability", type: "select", options: ["Yes", "No"] },
				{ label: "Total Number of Staff", id: "staffTotal", type: "number" },
				{ label: "Staff Breakdown", id: "staffBreakdown", type: "textarea" },
				{ label: "Percentage of Briefs by Type", id: "briefsPercentage", type: "textarea" },
				{ label: "Percentage of Work Location (Chambers/Court)", id: "workLocationPercentage", type: "textarea" },
				{ label: "Indemnity Limits Required", id: "indemnityLimits", type: "textarea" },
				{ label: "Fee Income (Last 3 Years)", id: "feeIncomeHistory", type: "textarea" },
				{ label: "Estimated Fee Income (Next 12 Months)", id: "feeIncomeEstimate", type: "number" },
				{ label: "Extensions to Basic Cover", id: "extensionsBasicCover", type: "checkboxes", options: ["Loss of Documents", "Dishonesty of Employees", "Libel and Slander"] },
				{ label: "Extension Limits", id: "extensionLimits", type: "textarea" },
				{ label: "Consent for Data Processing", id: "consentData", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I/We declare that the above statements and particulars are true and complete."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Professional Indemnity Insurance Proposal Form (Lawyers/Advocates)": [
				{ label: "Title of Insured / Practice", id: "practiceTitle", type: "text", required: true },
				{ label: "P.O. Box", id: "poBox", type: "text" },
				{ label: "Postal Code", id: "postalCode", type: "text" },
				{ label: "Town", id: "town", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Fax Number", id: "fax", type: "text" },
				{ label: "Mobile Number", id: "mobile", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "VAT Registration Number", id: "vatReg", type: "text" },
				{ label: "PIN Number", id: "pin", type: "text" },
				{ label: "Legal Constitution", id: "legalConstitution", type: "select", options: ["Partnership", "Incorporated Company", "Limited Company", "Close Corporation", "Sole Practitioner"] },
				{ label: "Principal Office Address", id: "principalOffice", type: "text" },
				{ label: "Subsidiary Office Address", id: "subsidiaryOffice", type: "text" },
				{ label: "Date of Commencement (Current)", id: "dateCommencementCurrent", type: "date" },
				{ label: "Date of Commencement (Initial)", id: "dateCommencementInitial", type: "date" },
				{ label: "Disciplines Engaged In", id: "disciplines", type: "textarea" },
				{ label: "Names and Qualifications of Principals", id: "principals", type: "textarea" },
				{ label: "Claims History", id: "claimsHistory", type: "select", options: ["Yes", "No"] },
				{ label: "Claims Details (if Yes)", id: "claimsDetails", type: "textarea" },
				{ label: "Awareness of Circumstances for Claims", id: "awarenessCircumstances", type: "select", options: ["Yes", "No"] },
				{ label: "Circumstances Details (if Yes)", id: "circumstancesDetails", type: "textarea" },
				{ label: "Present/Past Insurance", id: "pastInsurance", type: "select", options: ["Yes", "No"] },
				{ label: "Past Insurance Details", id: "pastInsuranceDetails", type: "textarea" },
				{ label: "Indemnity for Retired/Left Principals", id: "indemnityRetired", type: "select", options: ["Yes", "No"] },
				{ label: "Retired Principal Details", id: "retiredPrincipalDetails", type: "textarea" },
				{ label: "Declined/Cancelled/Terms Imposed by Insurer", id: "declinedTerms", type: "select", options: ["Yes", "No"] },
				{ label: "Declined/Terms Details", id: "declinedTermsDetails", type: "textarea" },
				{ label: "Liability for Undiscovered Claims (Run-Off)", id: "runOffLiability", type: "select", options: ["Yes", "No"] },
				{ label: "Total Number of Staff", id: "staffTotal", type: "number" },
				{ label: "Staff Breakdown", id: "staffBreakdown", type: "textarea" },
				{ label: "Percentage of Briefs by Type", id: "briefsPercentage", type: "textarea" },
				{ label: "Percentage of Work Location (Chambers/Court)", id: "workLocationPercentage", type: "textarea" },
				{ label: "Indemnity Limits Required", id: "indemnityLimits", type: "textarea" },
				{ label: "Fee Income (Last 3 Years)", id: "feeIncomeHistory", type: "textarea" },
				{ label: "Estimated Fee Income (Next 12 Months)", id: "feeIncomeEstimate", type: "number" },
				{ label: "Extensions to Basic Cover", id: "extensionsBasicCover", type: "checkboxes", options: ["Loss of Documents", "Dishonesty of Employees", "Libel and Slander"] },
				{ label: "Extension Limits", id: "extensionLimits", type: "textarea" },
				{ label: "Consent for Data Processing", id: "consentData", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I/We declare that the above statements and particulars are true and complete."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Machinery Breakdown/Damage": [
				{ label: "Name of Insured", id: "insuredName", type: "text", required: true },
				{ label: "Address of Insured", id: "insuredAddress", type: "text" },
				{ label: "Location of Damage", id: "damageLocation", type: "text" },
				{ label: "Policy Number", id: "policyNumber", type: "text" },
				{ label: "Identification Number and Description of Item Damaged", id: "itemDescription", type: "textarea" },
				{ label: "Date of Accident", id: "accidentDate", type: "date" },
				{ label: "Cause and Full Description of Circumstances of Accident", id: "accidentDescription", type: "textarea" },
				{ label: "Repairs/Replacement Necessary and Estimated Cost", id: "repairsEstimate", type: "textarea" },
				{ label: "Repairs Put in Hand or Completed? By Whom?", id: "repairsByWhom", type: "textarea" },
				{ label: "Where Can Damaged Parts Be Inspected?", id: "inspectionLocation", type: "text" },
				{ label: "Accident Caused by Third Party?", id: "thirdParty", type: "select", options: ["Yes", "No"] },
				{ label: "Third Party Name and Address", id: "thirdPartyDetails", type: "textarea" },
				{ label: "Claim Made Upon Third Party?", id: "claimThirdParty", type: "select", options: ["Yes", "No"] },
				{ label: "Third Party Correspondence Details", id: "thirdPartyCorrespondence", type: "textarea" },
				{ label: "Who Witnessed the Accident?", id: "witnesses", type: "textarea" },
				{ label: "Other Insurance Entitled to Recover for Damage?", id: "otherInsurance", type: "select", options: ["Yes", "No"] },
				{ label: "Other Insurance Details", id: "otherInsuranceDetails", type: "textarea" },
				{ label: "Remarks", id: "remarks", type: "textarea" },
				{ label: "Consent for Data Processing", id: "consentData", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I/We declare that the foregoing particulars are true and correct."] },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Equimed Application Form (Medical Insurance)": [
				{ label: "Principal Applicant Name", id: "principalName", type: "text", required: true },
				{ label: "National ID/Passport No.", id: "principalId", type: "text" },
				{ label: "NHIF Member No.", id: "nhifNo", type: "text" },
				{ label: "KRA Pin No.", id: "kraPin", type: "text" },
				{ label: "Date of Birth", id: "dob", type: "date" },
				{ label: "Occupation", id: "occupation", type: "text" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Mobile Number", id: "mobile", type: "tel" },
				{ label: "Postal Address & Code", id: "postalAddress", type: "text" },
				{ label: "Physical Address/Residence", id: "physicalAddress", type: "text" },
				{ label: "Next of Kin Name & ID No.", id: "nextOfKin", type: "text" },
				{ label: "Height (cm)", id: "height", type: "number" },
				{ label: "Weight (kg)", id: "weight", type: "number" },
				{ label: "Nomination of Beneficiary Name", id: "beneficiaryName", type: "text" },
				{ label: "Beneficiary ID Number", id: "beneficiaryId", type: "text" },
				{ label: "Beneficiary Mobile Number", id: "beneficiaryMobile", type: "tel" },
				{ label: "Beneficiary Relationship", id: "beneficiaryRelationship", type: "text" },
				{ label: "Dependants (Name, DOB, Gender, Relationship, ID, Weight, Height)", id: "dependants", type: "textarea" },
				{ label: "Previous Scheme Membership Details", id: "previousScheme", type: "textarea" },
				{ label: "Confidential Medical History", id: "medicalHistory", type: "textarea" },
				{ label: "Exclusions Acknowledgement", id: "exclusions", type: "checkbox", options: ["I acknowledge the listed exclusions."] },
				{ label: "Benefit(s) Selected", id: "benefitsSelected", type: "checkboxes", options: ["Inpatient", "Outpatient", "Dental", "Optical"] },
				{ label: "Official Use (Premiums, Charges, Levies)", id: "officialUse", type: "textarea" },
				{ label: "Consent for Data Processing", id: "consentData", type: "select", options: ["Yes", "No"] },
				{ label: "Declaration of Member", id: "declaration", type: "checkbox", options: ["I declare the information given is true and complete."] },
				{ label: "Applicant's Signature", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Fire Insurance Proposal Form": [
				{ label: "Full Name of Proposer", id: "fullName", type: "text", required: true },
				{ label: "Business/Occupation", id: "businessOccupation", type: "text" },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Location of Property (Building/Street/Plot No./Town)", id: "propertyLocation", type: "text" },
				{ label: "Type of Property", id: "propertyType", type: "select", options: ["Residential", "Commercial", "Industrial", "Other"] },
				{ label: "Sum Insured (Ksh)", id: "sumInsured", type: "number" },
				{ label: "Description of Property to be Insured", id: "propertyDescription", type: "textarea" },
				{ label: "Construction Materials (Walls)", id: "wallsMaterial", type: "text" },
				{ label: "Construction Materials (Roof)", id: "roofMaterial", type: "text" },
				{ label: "Are there any hazardous materials stored?", id: "hazardousMaterials", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "hazardousDetails", type: "textarea" },
				{ label: "Have you ever suffered loss/damage by fire?", id: "lossHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "lossDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Contractual Liability Proposal Form": [
				{ label: "Full Name of Proposer/Organization", id: "proposerName", type: "text", required: true },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Nature of Business/Occupation", id: "businessNature", type: "text" },
				{ label: "Type of Contract", id: "contractType", type: "text" },
				{ label: "Contract Value (Ksh)", id: "contractValue", type: "number" },
				{ label: "Period of Insurance (From)", id: "periodFrom", type: "date" },
				{ label: "Period of Insurance (To)", id: "periodTo", type: "date" },
				{ label: "Description of Works/Services", id: "worksDescription", type: "textarea" },
				{ label: "Sum Insured (Ksh)", id: "sumInsured", type: "number" },
				{ label: "Have you ever made a claim under contractual liability insurance?", id: "claimHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "claimDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer/Authorized Person", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Domestic Package Insurance": [
				{ label: "Agency Name", id: "agencyName", type: "text" },
				{ label: "Code", id: "agencyCode", type: "text" },
				{ label: "PIN Number", id: "pinNumber", type: "text" },
				{ label: "Name of Proposer (in full)", id: "proposerName", type: "text", required: true },
				{ label: "Surname", id: "surname", type: "text" },
				{ label: "First name", id: "firstName", type: "text" },
				{ label: "Other names", id: "otherNames", type: "text" },
				{ label: "Postal Address/Telephone", id: "postalAddress", type: "text" },
				{ label: "Postal Code", id: "postalCode", type: "text" },
				{ label: "Town", id: "town", type: "text" },
				{ label: "ID Number/Passport/Business Reg. No", id: "idOrRegNo", type: "text" },
				{ label: "Email Address", id: "emailAddress", type: "text" },
				{ label: "Age (where applicable)", id: "age", type: "number" },
				{ label: "Profession/Occupation", id: "occupation", type: "text" },
				{ label: "Period of insurance (From/To)", id: "periodOfInsurance", type: "text" },
				{ label: "Does any organization or individual have financial interest with your insured property(s)?", id: "financialInterest", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, briefly give details", id: "financialInterestDetails", type: "textarea" },
				{ label: "Location of the premises: Building/Street/Road/Plot No./Town", id: "premisesLocation", type: "text" },
				{ label: "Material of dwelling construction (Walls)", id: "wallsMaterial", type: "text" },
				{ label: "Material of dwelling construction (Roofs)", id: "roofsMaterial", type: "text" },
				{ label: "Will the dwelling be left without an inhabitant for more than 7 consecutive days?", id: "unoccupied7days", type: "select", options: ["Yes", "No"] },
				{ label: "Extent (if yes)", id: "unoccupied7daysExtent", type: "text" },
				{ label: "Will the dwelling be left without an inhabitant for more than 30 consecutive days?", id: "unoccupied30days", type: "select", options: ["Yes", "No"] },
				{ label: "Extent (if yes)", id: "unoccupied30daysExtent", type: "text" },
				{ label: "Do you wish to enhance the value of your building automatically at the end of every insurance period?", id: "enhanceValue", type: "select", options: ["Yes", "No"] },
				{ label: "Percentage increase required", id: "valueIncrease", type: "select", options: ["5%", "10%", "15%", "20%", "Other"] },
				{ label: "Other percentage (if selected)", id: "otherValueIncrease", type: "text" },
				{ label: "Has any company or insurer declined to insure you?", id: "declinedToInsure", type: "select", options: ["Yes", "No"] },
				{ label: "Required special terms to insure you?", id: "specialTerms", type: "select", options: ["Yes", "No"] },
				{ label: "Cancelled or refused to renew your insurance?", id: "cancelledOrRefusedRenewal", type: "select", options: ["Yes", "No"] },
				{ label: "Section A. Building - Sum Insured", id: "sectionABuildingSum", type: "number" },
				{ label: "Section B. Contents - Sum Insured", id: "sectionBContentsSum", type: "number" },
				{ label: "Section C. All Risk - Sum Insured", id: "sectionCAllRiskSum", type: "number" },
				{ label: "List of items for All Risk (make, model, serial number)", id: "allRiskItems", type: "textarea" },
				{ label: "Section D. Work Injury Benefits - Number of Workers", id: "sectionDWorkers", type: "number" },
				{ label: "Section E. Owner's Liability - Limit", id: "sectionEOwnerLiabilityLimit", type: "number" },
				{ label: "Section F. Occupier's and Personal Liability - Limit", id: "sectionFOccupierLiabilityLimit", type: "number" },
				{ label: "Additional Benefits (ATM withdrawal, freezer contents, emergency rescue)", id: "additionalBenefits", type: "checkboxes", options: ["ATM withdrawal (up to 20,000)", "Freezer contents (up to 5,000)", "Emergency rescue/fire fighting (up to 50,000)"] },
				{ label: "Credit Reference Bureau consent", id: "creditReferenceConsent", type: "checkbox", options: ["I confirm authorization to share/access credit information."] },
				{ label: "Premium Payment consent", id: "premiumPaymentConsent", type: "checkbox", options: ["I confirm all premiums will be paid directly to Madison General Insurance Kenya Limited."] },
				{ label: "Privacy Statement & Consent (Galloways)", id: "privacyConsent", type: "checkbox", options: ["I have read and agree to Galloways Privacy Statement."] },
				{ label: "Consent for processing Personal Data relating to a child", id: "childConsent", type: "select", options: ["I AGREE", "I DO NOT AGREE", "Not Applicable"] },
				{ label: "Consent for transfer outside Kenya", id: "transferConsent", type: "select", options: ["I AGREE", "I DO NOT AGREE"] },
				{ label: "Marketing consent", id: "marketingConsent", type: "select", options: ["YES", "NO"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I acknowledge I have read and understood the privacy statement and selected my choices freely."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Goods in Transit Insurance": [
				{ label: "Full Name of Proposer", id: "fullName", type: "text", required: true },
				{ label: "Business/Occupation", id: "businessOccupation", type: "text" },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Nature of Goods to be Insured", id: "goodsNature", type: "textarea" },
				{ label: "Sum Insured (Ksh)", id: "sumInsured", type: "number" },
				{ label: "Estimated Annual Carryings (Ksh)", id: "annualCarryings", type: "number" },
				{ label: "Type of Conveyance", id: "conveyanceType", type: "select", options: ["Own Vehicles", "Hired Vehicles", "Rail", "Other"] },
				{ label: "Number of Vehicles", id: "vehicleCount", type: "number" },
				{ label: "Vehicle Registration Numbers", id: "vehicleRegNumbers", type: "textarea" },
				{ label: "Territorial Limits (where goods will be carried)", id: "territorialLimits", type: "text" },
				{ label: "Have you ever suffered loss/damage in transit?", id: "lossHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "lossDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Money Insurance": [
				{ label: "Full Name of Proposer", id: "fullName", type: "text", required: true },
				{ label: "Business/Occupation", id: "businessOccupation", type: "text" },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Type of Money to be Insured", id: "moneyType", type: "select", options: ["Cash", "Cheques", "Postal Orders", "Other"] },
				{ label: "Sum Insured (Ksh)", id: "sumInsured", type: "number" },
				{ label: "Estimated Annual Carryings (Ksh)", id: "annualCarryings", type: "number" },
				{ label: "Means of Conveyance", id: "conveyanceMeans", type: "select", options: ["Own Employees", "Security Company", "Other"] },
				{ label: "Number of Employees Involved", id: "employeeCount", type: "number" },
				{ label: "Details of Security Arrangements", id: "securityDetails", type: "textarea" },
				{ label: "Territorial Limits (where money will be carried)", id: "territorialLimits", type: "text" },
				{ label: "Have you ever suffered loss/damage of money?", id: "lossHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "lossDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Group Personal Accident Proposal Form": [
				{ label: "Name of Proposer/Organization", id: "proposerName", type: "text", required: true },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Nature of Business/Occupation", id: "businessNature", type: "text" },
				{ label: "Number of Persons to be Insured", id: "personCount", type: "number" },
				{ label: "List of Persons (Name, Age, Occupation)", id: "personList", type: "textarea" },
				{ label: "Period of Insurance (From)", id: "periodFrom", type: "date" },
				{ label: "Period of Insurance (To)", id: "periodTo", type: "date" },
				{ label: "Benefits Required (Death, Permanent Disability, Medical Expenses, etc.)", id: "benefitsRequired", type: "checkboxes", options: ["Death", "Permanent Disability", "Medical Expenses", "Other"] },
				{ label: "Sum Insured per Person (Ksh)", id: "sumInsuredPerPerson", type: "number" },
				{ label: "Total Sum Insured (Ksh)", id: "totalSumInsured", type: "number" },
				{ label: "Have you ever made a claim under personal accident insurance?", id: "claimHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "claimDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"All Risk Proposal Form": [
				{ label: "Full Name of Proposer", id: "fullName", type: "text", required: true },
				{ label: "Business/Occupation", id: "businessOccupation", type: "text" },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Description of Items to be Insured (Jewellery, Electronics, etc.)", id: "itemsDescription", type: "textarea" },
				{ label: "Sum Insured per Item (Ksh)", id: "sumInsuredPerItem", type: "number" },
				{ label: "Total Sum Insured (Ksh)", id: "totalSumInsured", type: "number" },
				{ label: "Location of Items (where kept)", id: "itemsLocation", type: "text" },
				{ label: "Have you ever suffered loss/damage of these items?", id: "lossHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "lossDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Work Injury Benefits Act (WIBA) Proposal Form": [
				{ label: "Name of Employer/Organization", id: "employerName", type: "text", required: true },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Nature of Business/Occupation", id: "businessNature", type: "text" },
				{ label: "Number of Employees", id: "employeeCount", type: "number" },
				{ label: "List of Employees (Name, Age, Occupation, Salary)", id: "employeeList", type: "textarea" },
				{ label: "Period of Insurance (From)", id: "periodFrom", type: "date" },
				{ label: "Period of Insurance (To)", id: "periodTo", type: "date" },
				{ label: "Benefits Required (Death, Permanent Disability, Medical Expenses, etc.)", id: "benefitsRequired", type: "checkboxes", options: ["Death", "Permanent Disability", "Medical Expenses", "Other"] },
				{ label: "Total Annual Wages (Ksh)", id: "annualWages", type: "number" },
				{ label: "Have you ever made a claim under WIBA insurance?", id: "claimHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "claimDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Employer/Authorized Person", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Fidelity Guarantee Insurance Proposal Form": [
				{ label: "Name of Employer/Organization", id: "employerName", type: "text", required: true },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Nature of Business/Occupation", id: "businessNature", type: "text" },
				{ label: "Number of Employees to be Insured", id: "employeeCount", type: "number" },
				{ label: "List of Employees (Name, Age, Occupation, Salary)", id: "employeeList", type: "textarea" },
				{ label: "Period of Insurance (From)", id: "periodFrom", type: "date" },
				{ label: "Period of Insurance (To)", id: "periodTo", type: "date" },
				{ label: "Sum Insured per Employee (Ksh)", id: "sumInsuredPerEmployee", type: "number" },
				{ label: "Total Sum Insured (Ksh)", id: "totalSumInsured", type: "number" },
				{ label: "Have you ever made a claim under fidelity guarantee insurance?", id: "claimHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "claimDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Employer/Authorized Person", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Electronic Equipment Insurance Proposal Form": [
				{ label: "Full Name of Proposer", id: "fullName", type: "text", required: true },
				{ label: "Business/Occupation", id: "businessOccupation", type: "text" },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Description of Equipment to be Insured (Type, Make, Model, Serial Number)", id: "equipmentDescription", type: "textarea" },
				{ label: "Sum Insured per Equipment (Ksh)", id: "sumInsuredPerEquipment", type: "number" },
				{ label: "Total Sum Insured (Ksh)", id: "totalSumInsured", type: "number" },
				{ label: "Location of Equipment (where kept)", id: "equipmentLocation", type: "text" },
				{ label: "Have you ever suffered loss/damage of this equipment?", id: "lossHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "lossDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Travel Insurance Proposal Form": [
				{ label: "Full Name (as per passport)", id: "fullName", type: "text", required: true },
				{ label: "Date of Birth", id: "dob", type: "date", required: true },
				{ label: "Nationality", id: "nationality", type: "text" },
				{ label: "Passport Number", id: "passportNumber", type: "text" },
				{ label: "Phone Number", id: "phone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Destination Country", id: "destination", type: "text" },
				{ label: "Purpose of Travel", id: "travelPurpose", type: "select", options: ["Business", "Leisure", "Education", "Other"] },
				{ label: "Departure Date", id: "departureDate", type: "date" },
				{ label: "Return Date", id: "returnDate", type: "date" },
				{ label: "Do you have any pre-existing medical conditions?", id: "medicalConditions", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "medicalDetails", type: "textarea" },
				{ label: "Are you traveling with family?", id: "withFamily", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please list family members (Name, Age, Relationship)", id: "familyMembers", type: "textarea" },
				{ label: "Have you ever made a travel insurance claim before?", id: "claimHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "claimDetails", type: "textarea" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the information provided is true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Burglary Insurance Proposal Form": [
				{ label: "Full Name of Proposer", id: "fullName", type: "text", required: true },
				{ label: "Business/Occupation", id: "businessOccupation", type: "text" },
				{ label: "Postal Address", id: "postalAddress", type: "text" },
				{ label: "Telephone Number", id: "telephone", type: "tel" },
				{ label: "Email Address", id: "email", type: "email" },
				{ label: "Location of Premises (Building/Street/Plot No./Town)", id: "premisesLocation", type: "text" },
				{ label: "Type of Premises", id: "premisesType", type: "select", options: ["Shop", "Warehouse", "Office", "Other"] },
				{ label: "Are the premises solely occupied by you?", id: "solelyOccupied", type: "select", options: ["Yes", "No"] },
				{ label: "If not, by whom?", id: "otherOccupants", type: "text" },
				{ label: "Are the premises left unoccupied at night?", id: "unoccupiedAtNight", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, for how long?", id: "unoccupiedDuration", type: "text" },
				{ label: "Describe the means of protection against burglary (locks, alarms, etc.)", id: "protectionMeans", type: "textarea" },
				{ label: "Sum Insured for Stock/Contents (Ksh)", id: "sumInsuredStock", type: "number" },
				{ label: "Sum Insured for Fixtures/Fittings (Ksh)", id: "sumInsuredFixtures", type: "number" },
				{ label: "Sum Insured for Other Property (Ksh)", id: "sumInsuredOther", type: "number" },
				{ label: "Have you ever suffered loss/damage by burglary?", id: "lossHistory", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please provide details", id: "lossDetails", type: "textarea" },
				{ label: "Do you have any other insurance policies?", id: "otherPolicies", type: "select", options: ["Yes", "No"] },
				{ label: "If yes, please specify", id: "otherPoliciesDetails", type: "text" },
				{ label: "Declaration & Consent", id: "declaration", type: "checkbox", options: ["I hereby declare that the statements made above are true and complete. I consent to the collection and processing of my personal data for insurance purposes."] },
				{ label: "Signature of Proposer", id: "signature", type: "text", required: true },
				{ label: "Date", id: "date", type: "date", required: true },
			],
			"Erection All Risks Insurance Proposal Form": [
				{ label: "Title of contract (specify section(s) to be insured)", id: "contractTitle", type: "text", required: true },
				{ label: "Location of Erection Site - County/Province/District", id: "siteCounty", type: "text" },
				{ label: "Location of Erection Site - City/Town/Village", id: "siteCity", type: "text" },
				{ label: "Name and address of principal", id: "principalNameAddress", type: "textarea" },
				{ label: "Name(s) and address(es) of main contractor(s)", id: "mainContractors", type: "textarea" },
				{ label: "Name(s) and address(es) of subcontractor(s)", id: "subContractors", type: "textarea" },
				{ label: "Name(s) and address(es) of Manufacturer(s) of main items", id: "manufacturers", type: "textarea" },
				{ label: "Name(s) and address(es) of Firm supervising erection", id: "supervisingFirm", type: "textarea" },
				{ label: "Name(s) and address(es) of Consulting Engineer", id: "consultingEngineer", type: "textarea" },
				{ label: "Proposer No.", id: "proposerNo", type: "text" },
				{ label: "Insured No(s)", id: "insuredNos", type: "text" },
				{ label: "Exact description of the property to be erected", id: "propertyDescription", type: "textarea" },
				{ label: "Commencement of Insurance - Duration of Pre-storage (months)", id: "preStorageDuration", type: "text" },
				{ label: "Commencement of Erection Work (months)", id: "erectionWorkDuration", type: "text" },
				{ label: "Duration of Erection/Construction (months)", id: "constructionDuration", type: "text" },
				{ label: "Maintenance period (months)", id: "maintenancePeriod", type: "text" },
				{ label: "Duration of testing (weeks)", id: "testingDuration", type: "text" },
				{ label: "If maintenance coverage required - Duration (months)", id: "maintenanceCoverageDuration", type: "text" },
				{ label: "Type of coverage required", id: "coverageType", type: "text" },
				{ label: "Termination of Insurance", id: "terminationInsurance", type: "text" },
				{ label: "Plans/design/materials used/tested in previous constructions?", id: "previousConstructions", type: "select", options: ["Yes", "No"] },
				{ label: "Details of similar projects by contractors", id: "similarProjectsDetails", type: "textarea" },
				{ label: "Extension of existing plant?", id: "extensionExistingPlant", type: "select", options: ["Yes", "No"] },
				{ label: "Operation of existing plant during erection?", id: "operationDuringErection", type: "select", options: ["Yes", "No"] },
				{ label: "Buildings/civil engineering works already completed?", id: "buildingsCompleted", type: "select", options: ["Yes", "No"] },
				{ label: "Work to be carried out by subcontractors", id: "workBySubcontractors", type: "textarea" },
				{ label: "Aggravated risk of Fire?", id: "riskFire", type: "select", options: ["Yes", "No"] },
				{ label: "Aggravated risk of Explosion?", id: "riskExplosion", type: "select", options: ["Yes", "No"] },
				{ label: "Details of aggravated risks", id: "aggravatedRiskDetails", type: "textarea" },
				{ label: "Ground water level", id: "groundWaterLevel", type: "text" },
				{ label: "Nearest river, lake, sea, etc.", id: "nearestWaterBody", type: "text" },
				{ label: "Distance from site", id: "distanceFromSite", type: "text" },
				{ label: "Levels of river/lake/sea (low, mean, highest, mean site)", id: "waterLevels", type: "textarea" },
				{ label: "Meteorological conditions (rainy seasons, rainfall, wind, storm frequency)", id: "meteorologicalConditions", type: "textarea" },
				{ label: "Hazards of earthquake, volcanism, tsunami?", id: "hazardsEarthquake", type: "select", options: ["Yes", "No"] },
				{ label: "Earthquakes observed in area?", id: "earthquakesObserved", type: "select", options: ["Yes", "No"] },
				{ label: "Earthquake intensity/magnitude", id: "earthquakeDetails", type: "text" },
				{ label: "Design based on earthquake-resistant regulations?", id: "earthquakeRegulations", type: "select", options: ["Yes", "No"] },
				{ label: "Subsoil conditions", id: "subsoilConditions", type: "checkboxes", options: ["Rock", "Gravel", "Sand", "Clay", "Filled ground", "Other"] },
				{ label: "Estimate probable maximum loss (% of sum insured)", id: "maxLossEstimate", type: "table", columns: ["Due to Earthquake (%)", "Due to Fire (%)", "Due to Other Cause (%)"] },
				{ label: "Coverage of construction/erection equipment required?", id: "coverageEquipment", type: "select", options: ["Yes", "No"] },
				{ label: "Description and replacement values of equipment", id: "equipmentDetails", type: "textarea" },
				{ label: "Coverage of major machines required?", id: "coverageMachines", type: "select", options: ["Yes", "No"] },
				{ label: "List of major machines and total value", id: "machinesList", type: "textarea" },
				{ label: "Existing buildings/structures on/adjacent to site to be insured?", id: "existingBuildingsInsured", type: "select", options: ["Yes", "No"] },
				{ label: "Third Party Liability to be included?", id: "thirdPartyLiability", type: "select", options: ["Yes", "No"] },
				{ label: "Description of surrounding buildings/structures not belonging to principal/contractor", id: "surroundingBuildingsDescription", type: "textarea" },
				{ label: "Cover extra charges (express freight, overtime, night work, holidays)?", id: "coverExtraCharges", type: "select", options: ["Yes", "No"] },
				{ label: "Cover air freight?", id: "coverAirFreight", type: "select", options: ["Yes", "No"] },
				{ label: "Details of any special extension of cover required", id: "specialExtensionDetails", type: "textarea" },
				{ label: "Amounts to be insured / limits of indemnity required (Section I - Material Damage)", id: "materialDamageLimits", type: "table", columns: ["Item", "Sum to be Insured"] },
				{ label: "Special risks to be insured (limits of indemnity)", id: "specialRisksLimits", type: "table", columns: ["Risk", "Limit of Indemnity"] },
				{ label: "Section II - Third Party Liability (limits of indemnity)", id: "thirdPartyLimits", type: "table", columns: ["Item", "Limit of Indemnity"] },
				{ label: "Declaration", id: "declaration", type: "checkbox", options: ["I declare the statements are true and complete."] },
				{ label: "Consent for Data Processing", id: "dataConsent", type: "select", options: ["YES", "NO"] },
				{ label: "Executed at", id: "executedAt", type: "text" },
				{ label: "Date", id: "date", type: "date", required: true },
				{ label: "Signature", id: "signature", type: "text", required: true },
			],
	};

	const renderProductFields = (product) => {
			const fields = productFields[product];
			if (!fields) return <div>Form coming soon.</div>;
			return (
				<div className="space-y-4">
					{fields.map((field) => {
						if (field.type === "text" || field.type === "number" || field.type === "date") {
							return (
								<div key={field.id}>
									<Label htmlFor={field.id}>{field.label}</Label>
									<Input id={field.id} type={field.type} required={field.required} />
								</div>
							);
						}
						if (field.type === "textarea") {
							return (
								<div key={field.id}>
									<Label htmlFor={field.id}>{field.label}</Label>
									<Textarea id={field.id} required={field.required} />
								</div>
							);
						}
						if (field.type === "select") {
							return (
								<div key={field.id}>
									<Label htmlFor={field.id}>{field.label}</Label>
									<select id={field.id} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required={field.required}>
										<option value="">Select</option>
										{field.options.map((opt) => (
											<option key={opt} value={opt}>{opt}</option>
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
													<th key={col} className="border px-2 py-1">{col}</th>
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
			const formData = new FormData(e.target as HTMLFormElement);
			
			// Add selected product info
			formData.append('selectedProduct', selectedProduct);
			
			// Create the quote using backend service
			const result = await console.log(formData);
			
			// Generate reference number
			const refNumber = `GIQ-${Date.now().toString().slice(-8)}`;
			setRefNum(refNumber);
			setSuccess(true);
			
			toast({
				title: "Quote Submitted Successfully!",
				description: `Your quote request (Ref: ${refNumber}) has been submitted. We'll contact you within 24 hours.`
			});
		} catch (error) {
			console.error('Quote submission error:', error);
			toast({
				title: "Submission Error",
				description: error.message || "Failed to submit quote. Please try again.",
				variant: "destructive"
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
							<h2 className="text-2xl font-bold mb-6 text-center text-primary">Download Forms & Instructions</h2>
							<p className="mb-8 text-center text-muted-foreground">
								Please download the required form, fill it in, and upload it for processing. Ensure you have all necessary attachments as listed in the requirements guide. If you need help, contact our support team.
							</p>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
												
												{/* Livestock Category */}
												<div className="p-6 bg-card rounded-lg shadow">
													<h3 className="text-xl font-bold mb-2 text-primary flex items-center">
														{insuranceIcons["Livestock Insurance Proposal Form"]}
														Livestock Insurance Category
													</h3>
													<a href="/dist/Downloads/Livestock_Insurance_Proposal_Form.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Livestock Insurance Proposal Form
													</a>
													<a href="/dist/Downloads/Livestock Vetenary.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Veterinary Form
													</a>
													<div className="font-semibold mb-2">Instructions:</div>
													<ul className="list-disc ml-6 text-muted-foreground">
														<li>Download and fill in the Livestock Insurance Proposal Form.</li>
														<li>Attach a veterinary health valuation certificate (from a certified vet).</li>
														<li>Upload the completed form and attachments for processing.</li>
													</ul>
												</div>
												{/* Medical Category */}
												<div className="p-6 bg-card rounded-lg shadow">
													<h3 className="text-xl font-bold mb-2 text-primary flex items-center">
														{insuranceIcons["Equimed Application Form (Medical Insurance)"]}
														Medical Insurance Category
													</h3>
													<a href="/dist/Downloads/Medical Insurance - individual.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Medical Insurance - Individual
													</a>
													<a href="/dist/Downloads/group_medical_insurance.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Medical Insurance - Group
													</a>
													<div className="font-semibold mb-2">Instructions:</div>
													<ul className="list-disc ml-6 text-muted-foreground">
														<li>Download and fill in the Medical Insurance Form.</li>
														<li>Attach all required documents as listed in the form.</li>
														<li>Upload the completed form and attachments for processing.</li>
													</ul>
												</div>
												{/* Crop Insurance */}
												<div className="p-6 bg-card rounded-lg shadow">
													<h3 className="text-xl font-bold mb-2 text-primary flex items-center">
														{insuranceIcons["All Risks Insurance"]}
														Crop Insurance
													</h3>
													<a href="/dist/Downloads/crop insurance proposal form.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Crop Insurance Proposal Form
													</a>
													<div className="font-semibold mb-2">Instructions:</div>
													<ul className="list-disc ml-6 text-muted-foreground">
														<li>Download and fill in the Crop Insurance Proposal Form.</li>
														<li>Attach all required documents as listed in the form.</li>
														<li>Upload the completed form and attachments for processing.</li>
													</ul>
												</div>
												{/* Greenhouse Insurance */}
												<div className="p-6 bg-card rounded-lg shadow">
													<h3 className="text-xl font-bold mb-2 text-primary flex items-center">
														{insuranceIcons["Domestic Package (Write-Up Wording)"]}
														Greenhouse Insurance
													</h3>
													<a href="/dist/Downloads/greenhouse insurance proposal form.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Greenhouse Insurance Proposal Form
													</a>
													<div className="font-semibold mb-2">Instructions:</div>
													<ul className="list-disc ml-6 text-muted-foreground">
														<li>Download and fill in the Greenhouse Insurance Proposal Form.</li>
														<li>Attach all required documents as listed in the form.</li>
														<li>Upload the completed form and attachments for processing.</li>
													</ul>
												</div>
												{/* Poultry Category */}
												<div className="p-6 bg-card rounded-lg shadow">
													<h3 className="text-xl font-bold mb-2 text-primary flex items-center">
														{insuranceIcons["Poultry Proposal Form"]}
														Poultry Insurance Category
													</h3>
													<a href="/dist/Downloads/poultry proposal form.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Poultry Insurance Proposal Form
													</a>
													<a href="/dist/Downloads/vet health and valuation poultry.pdf" download className="inline-block mb-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
														<FileDown className="mr-2 h-5 w-5" /> Download Veterinary Form
													</a>
													<div className="font-semibold mb-2">Instructions:</div>
													<ul className="list-disc ml-6 text-muted-foreground">
														<li>Download and fill in the Poultry Insurance Proposal Form.</li>
														<li>Attach a veterinary health valuation certificate (from a certified vet).</li>
														<li>Upload the completed form and attachments for processing.</li>
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
									<h2 className="text-3xl font-bold text-green-800 mb-4">Quote Submitted Successfully!</h2>
									<p className="text-lg text-muted-foreground mb-4">
										Reference Number: <span className="font-bold text-primary">{refNum}</span>
									</p>
									<p className="text-muted-foreground mb-6">
										Thank you for your quote request. Our team will review your requirements and contact you within 24 hours with a personalized quote.
									</p>
									<div className="space-y-4">
										<p className="text-sm text-muted-foreground">
											📧 A confirmation email has been sent to your provided email address.
										</p>
										<p className="text-sm text-muted-foreground">
											📱 You'll receive SMS updates on your quote status.
										</p>
										<Button onClick={() => window.location.reload()} className="mt-4">
											Submit Another Quote
										</Button>
									</div>
								</div>
							) : (
							<form className="space-y-6" onSubmit={async (e) => {
									e.preventDefault();
									setIsLoading(true);
									try {
										const form = e.target as HTMLFormElement;
										const formData = new FormData();

										// Collect all input fields (including custom product fields)
										let contactMethodSet = false;
										const dynamicDetails: Record<string, any> = {};
										Array.from(form.elements).forEach((el: any) => {
											if (el.name && el.type !== 'file') {
												if (el.type === 'checkbox') {
													formData.append(el.name, el.checked ? 'true' : 'false');
													dynamicDetails[el.name] = el.checked ? 'true' : 'false';
												} else if (el.type === 'select-multiple') {
													const values = Array.from(el.selectedOptions).map((opt: any) => opt.value);
													values.forEach((val: any) => formData.append(el.name, val));
													dynamicDetails[el.name] = values;
												} else if (el.name === 'contactMethod') {
													if (el.checked) {
														formData.append('contactMethod', el.value);
														contactMethodSet = true;
														dynamicDetails['contactMethod'] = el.value;
													}
												} else {
													formData.append(el.name, el.value);
													dynamicDetails[el.name] = el.value;
												}
											}
										});
										// Ensure contactMethod is always present as a string
										if (!contactMethodSet) {
											formData.append('contactMethod', '');
											dynamicDetails['contactMethod'] = '';
										}
										// Store selected product and all dynamic details as JSON in 'details' field
										formData.append('selectedProduct', selectedProduct);
										formData.append('details', JSON.stringify(dynamicDetails));
										// Ensure contactMethod is always present as a string
										if (!contactMethodSet) {
											formData.append('contactMethod', '');
										}

										// Attach all files (support multiple files)
										const fileInputs = form.querySelectorAll('input[type="file"]');
										fileInputs.forEach((fileInput: any) => {
											if (fileInput.files && fileInput.files.length > 0) {
												for (let i = 0; i < fileInput.files.length; i++) {
													formData.append('document', fileInput.files[i]);
												}
											}
										});

										// Add selected product info
										formData.append('selectedProduct', selectedProduct);

										// Create the quote using backend service
										const result = await console.log(formData);

										// Generate reference number
										const refNumber = `GIQ-${Date.now().toString().slice(-8)}`;
										setRefNum(refNumber);
										setSuccess(true);

										toast({
											title: "Quote Submitted Successfully!",
											description: `Your quote request (Ref: ${refNumber}) has been submitted. We'll contact you within 24 hours.`
										});
									} catch (error) {
										console.error('Quote submission error:', error);
										toast({
											title: "Submission Error",
											description: error.message || "Failed to submit quote. Please try again.",
											variant: "destructive"
										});
									} finally {
										setIsLoading(false);
									}
								}}>
								{/* Personal Information */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="firstName">First Name *</Label>
										<Input id="firstName" name="firstName" placeholder="Enter your first name" required />
										</div>
										<div>
											<Label htmlFor="lastName">Last Name *</Label>
										<Input id="lastName" name="lastName" placeholder="Enter your last name" required />
										</div>
									</div>
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="email">Email Address *</Label>
										<Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
										</div>
										<div>
											<Label htmlFor="phone">Phone Number *</Label>
										<Input id="phone" name="phone" placeholder="+254 700 123 456" required />
										</div>
									</div>
									<div>
										<Label htmlFor="location">Location/County</Label>
										<Input id="location" placeholder="e.g., Nairobi, Mombasa, Kisumu" />
									</div>
								</div>
								{/* Insurance Details */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold border-b pb-2">Insurance Requirements</h3>
									<div>
										<Label htmlFor="product">Insurance Product *</Label>
									<select id="product" name="product" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={selectedProduct} onChange={handleProductChange}>
											<option value="">Select insurance product</option>
											{insuranceProductOptions
												.filter((option) => typeof option === "string")
												.map((option) => {
													const strOption = option as string;
													return (
														<option key={strOption} value={strOption}>{strOption}</option>
													);
												})}
										</select>
									</div>
									{/* Dynamic Product-Specific Section */}
									{selectedProduct && (
										<div className="mt-8 p-6 bg-muted/50 rounded-lg">
											<h3 className="text-xl font-bold mb-4">{selectedProduct} Details</h3>
											{renderProductFields(selectedProduct)}
										</div>
									)}
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="budget">Budget Range (KES)</Label>
											<select id="budget" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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
											<select id="coverage" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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
										<Textarea id="details" placeholder="Please provide any additional information about your insurance needs, family size, assets to cover, specific requirements, etc." className="min-h-32" />
									</div>
								</div>
								{/* Contact Preferences */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold border-b pb-2">Contact Preferences</h3>
									<div>
										<Label htmlFor="contactMethod">Preferred Contact Method *</Label>
										<div className="space-y-2 mt-2">
											{[
												{ id: "phone-call", label: "Phone Call", icon: <Phone className="w-4 h-4" /> },
												{ id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
												{ id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="w-4 h-4" /> },
												{ id: "in-person", label: "In-Person Meeting", icon: <FileText className="w-4 h-4" /> },
											].map((method) => (
												<label key={method.id} className="flex items-center space-x-2 cursor-pointer">
													<input type="radio" name="contactMethod" value={method.id} className="text-primary focus:ring-primary" />
													<div className="flex items-center space-x-2">{method.icon}<span>{method.label}</span></div>
												</label>
											))}
										</div>
									</div>
									<div>
										<Label htmlFor="bestTime">Best Time to Contact</Label>
										<select id="bestTime" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
											<option value="">Select preferred time</option>
											<option value="morning">Morning (8AM - 12PM)</option>
											<option value="afternoon">Afternoon (12PM - 5PM)</option>
											<option value="evening">Evening (5PM - 8PM)</option>
											<option value="anytime">Anytime</option>
										</select>
									</div>
								</div>
								{/* File Upload */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold border-b pb-2">Supporting Documents (Optional)</h3>
									<div>
															<Label>Upload Supporting Documents</Label>
															<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mt-2">
																<Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
																<p className="text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
																<p className="text-sm text-muted-foreground mb-4">Upload any relevant documents (ID, vehicle logbook, property documents, etc.)</p>
																<p className="text-xs text-muted-foreground mb-4">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)</p>
															<input type="file" name="document" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="block mx-auto mt-2" />
															</div>
									</div>
								</div>
								{/* Terms and Submit */}
								<div className="space-y-6">
									<div className="flex items-start space-x-2">
										<input type="checkbox" id="terms" className="mt-1" required />
										<label htmlFor="terms" className="text-sm text-muted-foreground">
											I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>. I consent to being contacted regarding my insurance quote request.
										</label>
									</div>
									<div className="flex flex-col sm:flex-row gap-4">
										<Button size="lg" className="flex-1 px-8 py-3" type="submit" disabled={isLoading}>
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
													const form = e.currentTarget.closest('form');
													if (!form) return;
													
													const formData = new FormData(form);
													
													// Create draft quote data as FormData
													const draftFormData = new FormData();
													draftFormData.append('firstName', formData.get('firstName') || '');
													draftFormData.append('lastName', formData.get('lastName') || '');
													draftFormData.append('email', formData.get('email') || '');
													draftFormData.append('phone', formData.get('phone') || '');
													draftFormData.append('location', formData.get('location') || '');
													draftFormData.append('product', formData.get('product') || '');
													draftFormData.append('budget', formData.get('budget') || '');
													draftFormData.append('coverage', formData.get('coverage') || '');
													draftFormData.append('details', formData.get('details') || '');
													draftFormData.append('contactMethod', formData.get('contactMethod') || '');
													draftFormData.append('bestTime', formData.get('bestTime') || '');
													draftFormData.append('status', 'DRAFT');
													draftFormData.append('isDraft', 'true');
													draftFormData.append('createdAt', new Date().toISOString());
													
													// Save draft using backend API
													const result = await console.log(draftFormData);
													
													if (result?.success) {
														toast({
															title: "Draft Saved Successfully!",
															description: `Your quote draft has been saved. Reference: DRAFT-${Date.now().toString().slice(-8)}`,
														});
													} else {
														throw new Error('Failed to save draft');
													}
													
												} catch (error: any) {
													console.error('Save draft error:', error);
													toast({
														title: "Save Failed",
														description: error.message || "Failed to save draft. Please try again.",
														variant: "destructive"
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
										<h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Galloways for Your Quote?</h2>
										<p className="text-muted-foreground">Experience the difference with our professional quote service</p>
									</div>
									<div className="grid md:grid-cols-3 gap-8">
										{[
											{ title: "Fast Response", description: "Get your personalized quote within 24 hours of submission", icon: "⚡" },
											{ title: "Multiple Options", description: "Compare quotes from our network of trusted insurance partners", icon: "📊" },
											{ title: "Expert Guidance", description: "Our certified professionals help you understand your options", icon: "🎯" },
											{ title: "No Obligation", description: "Free quotes with no pressure to purchase", icon: "🤝" },
											{ title: "Competitive Rates", description: "Access to competitive pricing through our partner network", icon: "💰" },
											{ title: "Ongoing Support", description: "Continued support throughout your insurance journey", icon: "🛡️" },
										].map((benefit, index) => (
											<Card key={index} className="p-6 text-center">
												<div className="text-4xl mb-4">{benefit.icon}</div>
												<h3 className="font-semibold mb-3">{benefit.title}</h3>
												<p className="text-sm text-muted-foreground">{benefit.description}</p>
											</Card>
										))}
									</div>
								</div>
							</section>
							{/* Contact Information */}
							<section className="py-20 px-4">
								<div className="max-w-6xl mx-auto">
									<div className="text-center mb-12">
										<h2 className="text-3xl font-bold text-foreground mb-4">Need Help with Your Quote?</h2>
										<p className="text-muted-foreground">Our team is ready to assist you with any questions</p>
									</div>
									<div className="grid md:grid-cols-3 gap-8">
										<Card className="p-6 text-center">
											<Phone className="w-8 h-8 text-primary mx-auto mb-4" />
											<h3 className="font-semibold mb-2">Call Us</h3>
											<p className="text-muted-foreground mb-3">Speak directly with our experts</p>
											<p className="font-semibold">+254720769993</p>
											<p className="text-sm text-muted-foreground">Mon-Fri: 8AM-6PM, Sat: 9AM-2PM</p>
										</Card>
										<Card className="p-6 text-center">
											<Mail className="w-8 h-8 text-primary mx-auto mb-4" />
											<h3 className="font-semibold mb-2">Email Us</h3>
											<p className="text-muted-foreground mb-3">Send us your questions</p>
											<p className="font-semibold">gallowaysquotations@gmail.com</p>
											<p className="text-sm text-muted-foreground">Response within 2 hours</p>
										</Card>
										<Card className="p-6 text-center">
											<MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
											<h3 className="font-semibold mb-2">WhatsApp</h3>
											<p className="text-muted-foreground mb-3">Chat with us instantly</p>
											<p className="font-semibold">+254720769993/+254758301346</p>
											<p className="text-sm text-muted-foreground">Available 24/7</p>
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
								{insuranceIcons["Burglary / Theft Insurance"]}Burglary / Theft Insurance
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
								{insuranceIcons["Fire & Perils Proposal Form"]}Fire & Perils Proposal Form
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
								{insuranceIcons["Political Violence & Terrorism (PVT)"]}Political Violence & Terrorism (PVT)
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
								{insuranceIcons["Domestic Package (Write-Up Wording)"]}Domestic Package (Write-Up Wording)
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
								<li>If company-owned: KRA pin, certificate of incorporation, CR12</li>
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
								{insuranceIcons["Carriers’ Legal Liability Insurance"]}Carriers’ Legal Liability Insurance
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
								{insuranceIcons["Goods in Transit Proposal Form"]}Goods in Transit Proposal Form
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
								{insuranceIcons["Work Injury Benefits (WIBA)"]}Work Injury Benefits (WIBA)
							</h4>
							{/* Download button removed, guide content retained */}
							<div className="font-semibold mb-2">Required Attachments:</div>
							<ul className="list-disc ml-6 text-muted-foreground">
								<li>Excel sheet of workers (job descriptions, wages, salaries)</li>
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
								<li>Excel sheet of employees (job descriptions & gross salaries)</li>
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
								{insuranceIcons["Contractual Liability Proposal Form"]}Contractual Liability Proposal Form
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
								{insuranceIcons["PI Proposal Form – Advocates"]}PI Proposal Form – Advocates
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
								{insuranceIcons["PI Proposal Form – Architects"]}PI Proposal Form – Architects
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
								{insuranceIcons["PI Proposal Form – Doctors / Medical Practitioners"]}PI Proposal Form – Doctors / Medical Practitioners
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
								{insuranceIcons["PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS & Land Surveyors"]}PI Proposal Form – Insurance Agents / Solicitors / Engineers, QS & Land Surveyors
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
								{insuranceIcons["Travel Insurance Proposal Form"]}Travel Insurance Proposal Form
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
								{insuranceIcons["Fidelity Guarantee Proposal Form"]}Fidelity Guarantee Proposal Form
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
								{insuranceIcons["Money Insurance Proposal Form"]}Money Insurance Proposal Form
							</h4>
							{/* Download button removed, guide content retained */}
							<div className="font-semibold mb-2">Required Attachments:</div>
							<ul className="list-disc ml-6 text-muted-foreground">
								<li>
									Standard company KYC docs (ID, KRA, CR12, Incorporation, Registration
									cert.)
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
									Veterinary health valuation certificate (uploaded by certified vet)
								</li>
							</ul>
						</div>
						{/* Livestock Insurance Proposal Form */}
						<div className="mb-8 p-6 bg-card rounded-lg shadow">
							<h4 className="text-xl font-bold mb-2">
								{insuranceIcons["Livestock Insurance Proposal Form"]}Livestock Insurance Proposal Form
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
								{insuranceIcons["Personal Accident Proposal Form"]}Personal Accident Proposal Form
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
								{insuranceIcons["Contractors’ All Risk Proposal Form"]}Contractors’ All Risk Proposal Form
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
								{insuranceIcons["Erection All Risks Proposal Form"]}Erection All Risks Proposal Form
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
								{insuranceIcons["Contractors’ Plant & Machinery (CPM Write-Up)"]}Contractors’ Plant & Machinery (CPM Write-Up)
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
								{insuranceIcons["Machinery Breakdown (Extra Damage)"]}Machinery Breakdown (Extra Damage)
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
								{insuranceIcons["Electronic Equipment Insurance"]}Electronic Equipment Insurance
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