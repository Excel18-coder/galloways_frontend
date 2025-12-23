import React from "react";

const downloadForms = [
  // Claims Forms
  { label: "Workmen's Compensation Accident Claim Form", url: "/dist/Downloads/Workmen's_Compenstion_Accident_Claim_Form_-_ammended.pdf" },
  { label: "Windscreen & Window Damage Claim Form", url: "/dist/Downloads/Windscreen & window damage claim form.pdf" },
  { label: "Public Liability (Third Party) Claim Form", url: "/dist/Downloads/Public_Liability_(THIRDPARTY)_Claim_Form.pdf" },
  { label: "Personal Accident Claim Form", url: "/dist/Downloads/Personal_Accident_Claim_Form.pdf" },
  { label: "Motor Entertainment System Claim Form", url: "/dist/Downloads/Motor_Entertainment_System_Claim_Form.pdf" },
  { label: "Motor Theft Claim Form", url: "/dist/Downloads/Motor Theft Claim Form.pdf" },
  { label: "Machinery Breakdown Extra Damage Claim Form", url: "/dist/Downloads/Machinery_Breakdown_Extr_Damage-Claim_Form.pdf" },
  { label: "Fidelity Guarantee Claim Forms", url: "/dist/Downloads/Fidelity_Guarantee_Claim_Forms.pdf" },
  // Quotes & Insurance Forms
  { label: "Pension Brochure", url: "/dist/Downloads/pension brochure.pdf" },
  { label: "Pension Application Form", url: "/dist/Downloads/pension application form.pdf" },
  { label: "Medical Insurance - Individual", url: "/dist/Downloads/Medical Insurance - individual.pdf" },
  { label: "Medical Insurance - Group", url: "/dist/Downloads/medical Insurance - group.pdf" },
  { label: "Group Medical Insurance", url: "/dist/Downloads/group_medical_insurance.pdf" },
  { label: "Livestock Insurance Proposal Form", url: "/dist/Downloads/Livestock_Insurance_Proposal_Form.pdf" },
  { label: "Livestock Veterinary Form", url: "/dist/Downloads/Livestock Vetenary.pdf" },
  { label: "Vet Health and Valuation Poultry", url: "/dist/Downloads/vet health and valuation poultry.pdf" },
  { label: "Poultry Proposal Form", url: "/dist/Downloads/poultry proposal form.pdf" },
  { label: "Greenhouse Insurance Proposal Form", url: "/dist/Downloads/greenhouse insurance proposal form.pdf" },
  { label: "Crop Insurance Proposal Form", url: "/dist/Downloads/crop insurance proposal form.pdf" },
];

const Downloads: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Download Forms</h1>
      <p className="mb-6 text-center text-muted-foreground">
        All available claim, quote, and insurance forms are listed below for download. Click any link to download the PDF.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloadForms.map((form, idx) => (
          <div key={idx} className="p-4 bg-card rounded shadow flex items-center justify-between">
            <span className="font-medium text-primary">{form.label}</span>
            <a href={form.url} download className="ml-4 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;
