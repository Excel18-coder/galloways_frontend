import { getLogoUrl } from "../../lib/assets";

const TrustedPartners = () => {
  const partners = [
    { name: "UAP", img: "UAP.png" },
    { name: "BRITAM", img: "BRITAM.jpeg" },
    { name: "CIC", img: "CIC.jpeg" },
    { name: "LIBERTY", img: "LIBERTY.png" },
    { name: "HERITAGE", img: "HERTAGE.jpeg" },
    { name: "MADISON", img: "MADISON.jpeg" },
    { name: "JUBILEE", img: "JUBILEE.jpeg" },
    { name: "GA", img: "GA.png" },
    { name: "NCBA", img: "NCBA.png" },
    { name: "AMACO", img: "AMACO.jpeg" },
    { name: "MAYFAIR", img: "MAYFAIR.jpeg" }
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Trusted Underwriter Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We work with Kenya's leading insurance underwriters to provide you with the best coverage options and competitive rates
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center"
            >
              <img
                src={getLogoUrl(partner.img)}
                alt={partner.name + ' logo'}
                className="h-16 w-28 object-contain mb-2 bg-white rounded-lg"
              />
              <div className="text-lg font-semibold text-primary">
                {partner.name}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All our partner insurers are licensed and regulated by the Insurance Regulatory Authority (IRA) of Kenya
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;