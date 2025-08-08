import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Shield, 
  Users, 
  BookOpen,
  ArrowRight,
  Star
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Comprehensive family history evaluation to understand your personal risk factors"
  },
  {
    icon: Heart,
    title: "Symptom Tracking",
    description: "Monitor and track symptoms with intelligent insights for early detection"
  },
  {
    icon: Users,
    title: "Expert Care",
    description: "Schedule appointments with healthcare professionals specialized in breast cancer"
  },
  {
    icon: BookOpen,
    title: "Education Hub",
    description: "Access reliable information about prevention, treatment, and support resources"
  }
];

const stats = [
  { number: "15%", label: "of breast cancers are triple-negative" },
  { number: "40%", label: "higher rates in West African women" },
  { number: "85%", label: "early detection success rate" }
];

export function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-hero p-1.5 shadow-medical transition-transform duration-500 hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-background/80 backdrop-blur-sm">
                  <img
                    src="/lovable-uploads/56aa1b96-11fa-4f9f-95da-2b824f5276a1.png"
                    alt="She's Strong Ghana logo: heart with stethoscope"
                    className="h-16 w-16 md:h-24 md:w-24 object-contain"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 -z-10 blur-2xl opacity-70 bg-gradient-hero rounded-[2rem]" aria-hidden="true" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
            She's Strong Ghana
          </h1>
          
          <ul className="text-lg md:text-xl text-muted-foreground mb-6 space-y-2 text-left mx-auto max-w-2xl">
            <li>• Early detection and personalized risk insights</li>
            <li>• Track symptoms and learn what to look for</li>
            <li>• Connect with trusted care providers</li>
          </ul>

          <div className="flex justify-center mb-8">
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
              15% of breast cancers are triple-negative — early detection matters.
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 animate-fade-in">
            <Button asChild size="lg" className="bg-gradient-primary shadow-medical hover-scale h-12 md:h-11 px-6 md:px-8">
              <Link to="/family-history" aria-label="Start risk assessment (3 steps, under 3 minutes)">
                Start Risk Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-scale h-12 md:h-11">
              <Link to="/education" aria-label="Learn more about triple-negative breast cancer">
                Learn More
              </Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground mb-12">3 steps • under 3 minutes • Trusted by local clinicians</div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-gradient-card shadow-card-soft">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Care & Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From risk assessment to ongoing care, we provide the tools and resources 
            you need at every step of your health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-medical transition-all duration-300 bg-gradient-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Take Control of Your Health Today
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Early detection saves lives. Start your health journey with our comprehensive 
              assessment tools and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/family-history">
                  Begin Assessment
                  <Star className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/symptoms">
                  Track Symptoms
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}