import HeroSection from "../components/home/HeroSection";
import TrustedPartners from "../components/home/TrustedPartners";
import ExpertTeam from "../components/home/ExpertTeam";
import ClientTrust from "../components/home/ClientTrust";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Index = () => {
  return (
  <div className="h-screen">
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
