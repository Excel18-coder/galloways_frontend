import ClientTrust from "../components/home/ClientTrust";
import ExpertTeam from "../components/home/ExpertTeam";
import HeroSection from "../components/home/HeroSection";
import TrustedPartners from "../components/home/TrustedPartners";
import VisionMission from "../components/home/VisionMission";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const Index = () => {
  return (
    <div className="h-screen">
      <Header />
      <main>
        <HeroSection />
        <VisionMission />
        <TrustedPartners />
        <ExpertTeam />
        <ClientTrust />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
