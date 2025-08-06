import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AIAssistant />
    </div>
  );
};

export default Index;
