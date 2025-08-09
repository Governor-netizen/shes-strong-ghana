import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AIAssistant } from "@/components/AIAssistant";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  useSEO({
    title: "She's Strong Ghana — Early Detection & Risk Assessment",
    description:
      "Empowering women with tools for early detection, risk assessment, and comprehensive care for triple-negative breast cancer.",
    canonical: window.location.origin + "/",
  });
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AIAssistant />
    </div>
  );
};

export default Index;
