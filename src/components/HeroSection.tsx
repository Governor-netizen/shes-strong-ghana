import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Shield, Users, BookOpen, ArrowRight, Star } from "lucide-react";
const features = [{
  icon: Shield,
  title: "Risk Assessment",
  description: "Comprehensive family history evaluation to understand your personal risk factors"
}, {
  icon: Heart,
  title: "Symptom Tracking",
  description: "Monitor and track symptoms with intelligent insights for early detection"
}, {
  icon: Users,
  title: "Expert Care",
  description: "Schedule appointments with healthcare professionals specialized in breast cancer"
}, {
  icon: BookOpen,
  title: "Education Hub",
  description: "Access reliable information about prevention, treatment, and support resources"
}];
const stats = [{
  number: "15%",
  label: "of breast cancers are triple-negative"
}, {
  number: "40%",
  label: "higher rates in West African women"
}, {
  number: "85%",
  label: "early detection success rate"
}];
export function HeroSection() {
  return <div 
    className="min-h-screen bg-cover bg-center bg-no-repeat relative"
    style={{
      backgroundImage: `url('/lovable-uploads/42feaf70-5f41-4011-a4ba-b6358a67485d.png')`
    }}
  >
    {/* Overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-muted/20"></div>
    
    {/* Content */}
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img src="/lovable-uploads/6f5d86f1-d967-4b49-b3e1-7bfa5dfa3241.png" alt="She's Strong Ghana logo — heart with ribbon" className="h-[7.5rem] w-[7.5rem] md:h-[10.5rem] md:w-[10.5rem] object-contain" loading="eager" width={120} height={120} fetchPriority="high" />
          </div>
          
          <h1 className="text-5xl md:text-7xl leading-snug tracking-tight font-bold mb-6 pb-2 md:pb-3 bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
            She's Strong Ghana
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-6 mx-auto max-w-3xl text-center">
            Empowering women with tools for early detection, risk assessment, and comprehensive care for triple-negative breast cancer.
          </p>

          <div className="flex justify-center mb-8">
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">About 60% of Ghanaian breast cancer cases are triple-negative — early detection matters.</span>
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
            <Button asChild variant="secondary" size="lg" className="hover-scale h-12 md:h-11">
              <Link to="/research" aria-label="Join our research community">
                Join Research
              </Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground mb-12">3 steps • under 3 minutes • Trusted by local clinicians</div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => <Card key={index} className="p-6 text-center bg-gradient-card shadow-card-soft">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>)}
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
          {features.map((feature, index) => <Card key={index} className="p-6 text-center hover:shadow-medical transition-all duration-300 bg-gradient-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>)}
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
              <Button asChild size="lg" className="hover-scale h-12 md:h-11">
                <Link to="/symptoms">
                  Track Symptoms
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>;
}