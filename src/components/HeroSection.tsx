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
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left side: Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-normal pb-2 animate-slide-in-left">
              <span className="bg-gradient-blue-pink bg-clip-text text-transparent">She's Strong</span>{" "}
              <span className="text-4xl md:text-5xl lg:text-6xl lg:hidden" role="img" aria-label="Ghana">🇬🇭</span>
              <span className="bg-gradient-blue-pink bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl hidden lg:inline">Ghana</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground/90 font-medium animate-slide-in-left-delayed">
              Empowering Women Through Early Detection
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl animate-slide-in-left-delayed-2">
              Empowering women with tools for early detection, risk assessment, and comprehensive care for triple-negative breast cancer.
            </p>

            <div className="flex justify-center lg:justify-start animate-slide-in-bottom">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-pulse-glow">
                <span className="mr-2">⚡</span>
                About 60% of Ghanaian breast cancer cases are triple-negative — early detection matters.
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-in-left-delayed-3">
              <Button asChild size="lg" className="bg-gradient-primary shadow-medical hover-scale h-12 md:h-11 px-6 md:px-8 text-lg animate-pulse-glow">
                <Link to="/family-history" aria-label="Start risk assessment (3 steps, under 3 minutes)">
                  Start Risk Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-scale h-12 md:h-11 text-lg border-primary/30 hover:bg-primary/10 transition-all duration-300">
                <Link to="/education" aria-label="Learn more about triple-negative breast cancer">
                  Learn More
                </Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground animate-slide-in-left-delayed-3">3 steps • under 3 minutes • Trusted by local clinicians</div>
          </div>

          {/* Right side: Hero image with animations */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative group">
            <img
              src="/lovable-uploads/1c97f9a5-35a1-4b7e-a5d3-4d5db1c333f1.png"
              alt="Strong woman flexing muscles with breast cancer awareness ribbon, embodying strength and empowerment"
              className="w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl transition-all duration-200 ease-out transform group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-3xl"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
                onError={(e) => {
                  console.log('Image failed to load:', e);
                  e.currentTarget.style.display = 'block';
                }}
              />
              {/* Animated glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 opacity-60 group-hover:opacity-80 transition-all duration-700 blur-2xl scale-110 -z-10"></div>
              {/* Subtle overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Stats Section - moved below hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => 
            <Card key={index} className="p-6 text-center bg-gradient-card shadow-card-soft hover-scale animate-slide-in-bottom" style={{ animationDelay: `${1.2 + index * 0.2}s` }}>
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          )}
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
    </div>;
}