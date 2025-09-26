import HeroSection from "../components/home/HeroSection";
import TrustedPartners from "../components/home/TrustedPartners";
import ExpertTeam from "../components/home/ExpertTeam";
import ClientTrust from "../components/home/ClientTrust";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { SEO, seoConfigs, schemaTemplates } from "../components/SEO";

const Index = () => {
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Galloways Insurance Agencies & Consultancy Services",
    "alternateName": "Galloways Insurance",
    "url": "https://galloways.co.ke",
    "logo": "https://galloways.co.ke/LOGOS/galloways-logo.png",
    "description": "Kenya's leading insurance agency offering comprehensive insurance solutions including Health, Motor, Life, Property, Travel and Corporate insurance packages. Licensed by Insurance Regulatory Authority (IRA) Kenya.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nairobi",
      "addressLocality": "Nairobi",
      "addressCountry": "KE"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+254720769993",
        "contactType": "customer service"
      }
    ],
    "sameAs": [
      "https://facebook.com/gallowaysinsurance",
      "https://twitter.com/gallowaysinsurance",
      "https://instagram.com/gallowaysinsurance",
      "https://linkedin.com/company/gallowaysinsurance"
    ]
  };

  return (
  <div className="h-screen">
      <SEO {...seoConfigs.home} schemaData={homepageSchema} />
      <Header />
      <main>
        <HeroSection />
        <TrustedPartners />
        <ExpertTeam />
        <ClientTrust />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
