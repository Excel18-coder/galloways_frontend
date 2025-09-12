import React from "react";
import { FileDown } from "lucide-react";

const DownloadsSection = () => {
  // Available files from the directory listing
  const availableFiles = [
    "ALL RISKS.pdf",
    "Britam erectors all risk.pdf",
    "Burglary Insurance Proposa23.pdf",
    "CARRIERS LEGAL LIABILITY INSURANCE  BRITAM form.pdf",
    "claim_documentation_guide.pdf",
    "Claim_Form_Motor_-_Ammended.pdf",
    "Claim_Forms_-_Damage_or_Loss-amended.pdf",
    "CONTRACTORS ALL RISK PROPOSAL FORM.pdf",
    "Contractors plant and machinery 421V1.pdf",
    "Contractual liability proposal form.pdf",
    "crop insurance proposal form.pdf",
    "domestic package insurance proposal form.pdf",
    "ELECTRONIC INSURANCE PROPOSAL FORM.pdf",
    "Fidelity Guarantee Claim Forms.pdf",
    "Fidelity_Guarantee_Claim_Forms.pdf",
    "FIRE INSURANCE PROPOSAL FORM.pdf",
    "GALLOWAYS MOTOR INSURANCE APPLICATION FORM.pdf",
    "Galloways Professional Indemnity Cover Proposal Form.pdf",
    "GOODS IN TRANSIT INSURANCE.pdf",
    "greenhouse insurance proposal form.pdf",
    "group_medical_insurance.pdf",
    "Livestock_Insurance_Proposal_Form.pdf",
    "Livestock Vetenary.pdf",
    "Machinery_Breakdown_Extr_Damage-Claim_Form.pdf",
    "Medical Insurance - individual.pdf",
    "Money Insurance Proposal form(254) 294 mad.pdf",
    "Motor_Entertainment_System_Claim_Form.pdf",
    "Motor Theft Claim Form.pdf",
    "pension_application_form.pdf",
    "pension_brochure.pdf",
    "Personal_Accident_Claim_Form.pdf",
    "PI Proposal - Architects.pdf",
    "PI Proposal form - Advocates.pdf",
    "Political Violence _ Terrorism Proposal Form(1) converted[1].pdf",
    "poultry proposal form.pdf",
    "Professional Indemnity Insurance Proposal Form.pdf",
    "PUBLIC LIABILITY.pdf",
    "Public_Liability_(THIRDPARTY)_Claim_Form.pdf",
    "travel insurance.pdf",
    "vet health and valuation poultry.pdf",
    "wiba new.pdf",
    "Windscreen & window damage claim form.pdf",
    "Workmen's_Compenstion_Accident_Claim_Form_-_ammended.pdf",
    "CIC Marine Cargo Insurance Proposal Form.pdf"
  ];

  // Group files by category
  const fileCategories = {
    "Livestock Insurance": [
      "Livestock_Insurance_Proposal_Form.pdf",
      "Livestock Vetenary.pdf",
    ],
    "Medical Insurance": [
      "Medical Insurance - individual.pdf",
      "group_medical_insurance.pdf",
    ],
    "Motor Insurance": [
      "GALLOWAYS MOTOR INSURANCE APPLICATION FORM.pdf",
      "Motor Theft Claim Form.pdf",
      "Windscreen & window damage claim form.pdf",
      "Motor_Entertainment_System_Claim_Form.pdf",
      "Claim_Form_Motor_-_Ammended.pdf",
    ],
    "Fire Insurance": ["FIRE INSURANCE PROPOSAL FORM.pdf"],
    "Travel Insurance": ["travel insurance.pdf"],
    "Burglary Insurance": ["Burglary Insurance Proposa23.pdf"],
    "Contractors Insurance": [
      "Contractors plant and machinery 421V1.pdf",
      "CONTRACTORS ALL RISK PROPOSAL FORM.pdf",
    ],
    "Contractual Liability": ["Contractual liability proposal form.pdf"],
    "Domestic Package": ["domestic package insurance proposal form.pdf"],
    "Electronic Insurance": ["ELECTRONIC INSURANCE PROPOSAL FORM.pdf"],
    "Fidelity Guarantee": [
      "Fidelity Guarantee Claim Forms.pdf",
      "Fidelity_Guarantee_Claim_Forms.pdf",
    ],
    "Goods in Transit": ["GOODS IN TRANSIT INSURANCE.pdf"],
    "Money Insurance": ["Money Insurance Proposal form(254) 294 mad.pdf"],
    "Professional Indemnity": [
      "Galloways Professional Indemnity Cover Proposal Form.pdf",
      "PI Proposal - Architects.pdf",
      "PI Proposal form - Advocates.pdf",
      "Professional Indemnity Insurance Proposal Form.pdf",
    ],
    "Public Liability": [
      "PUBLIC LIABILITY.pdf",
      "Public_Liability_(THIRDPARTY)_Claim_Form.pdf",
    ],
    "Workmen's Compensation": [
      "Workmen's_Compenstion_Accident_Claim_Form_-_ammended.pdf",
    ],
    "All Risks": ["ALL RISKS.pdf", "Britam erectors all risk.pdf"],
    "Carriers Liability": [
      "CARRIERS LEGAL LIABILITY INSURANCE  BRITAM form.pdf",
    ],
    "Machinery Breakdown": ["Machinery_Breakdown_Extr_Damage-Claim_Form.pdf"],
    "Personal Accident": ["Personal_Accident_Claim_Form.pdf"],
    "Political Violence & Terrorism": [
      "Political Violence _ Terrorism Proposal Form(1) converted[1].pdf",
    ],
    WIBA: ["wiba new.pdf"],
    "Claim Documentation": [
      "claim_documentation_guide.pdf",
      "Claim_Forms_-_Damage_or_Loss-amended.pdf",
    ],
    "Crop Insurance": ["crop insurance proposal form.pdf"],
    "Greenhouse Insurance": ["greenhouse insurance proposal form.pdf"],
    Pension: ["pension_application_form.pdf", "pension_brochure.pdf"],
    "Poultry Insurance": [
      "poultry proposal form.pdf",
      "vet health and valuation poultry.pdf",
    ],
    "Marine Insurance": ["CIC Marine Cargo Insurance Proposal Form.pdf"],
  };

  // Filter out files that don't exist in the directory
  Object.keys(fileCategories).forEach((category) => {
    fileCategories[category] = fileCategories[category].filter((file) =>
      availableFiles.includes(file)
    );

    // Remove empty categories
    if (fileCategories[category].length === 0) {
      delete fileCategories[category];
    }
  });

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Download Forms & Instructions
      </h2>
      <p className="mb-8 text-center text-muted-foreground">
        Please download the required form, fill it in, and upload it for
        processing. Ensure you have all necessary attachments as listed in the
        requirements guide. If you need help, contact our support team.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(fileCategories).map(([category, files]) => (
          <div key={category} className="p-6 bg-card rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 text-primary">{category}</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file} className="flex flex-col">
                  <a
                    href={`/Downloads/${encodeURIComponent(file)}`}
                    download
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    <span className="text-sm truncate">
                      {file.replace(/.pdf$/i, "")}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadsSection;
