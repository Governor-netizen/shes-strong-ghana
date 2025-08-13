
import { HeroSection } from "@/components/HeroSection";
import { AIAssistant } from "@/components/AIAssistant";
import { useSEO } from "@/hooks/useSEO";
import AuthStatus from "@/components/auth/AuthStatus";
import { VideoSection } from "@/components/VideoSection";

const Index = () => {
  useSEO({
    title: "She's Strong Ghana — Early Detection & Risk Assessment",
    description:
      "Empowering women with tools for early detection, risk assessment, and comprehensive care for triple-negative breast cancer.",
    canonical: window.location.origin + "/",
  });
  return (
    <div className="min-h-screen">
      <HeroSection />
      <VideoSection
        title="How She's Strong Ghana Helps"
        videoId="6Af6b_wyiwI"
        description="A quick overview of our mission and how to use the tools on this site."
      />
      <AIAssistant />
      <AuthStatus />
    </div>
  );
};

export default Index;
