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
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-blue-pink bg-clip-text text-transparent mb-2 leading-relaxed py-2">
              She's Strong Ghana
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Empowering Women Through Early Detection
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl">
              Empowering women with tools for early detection, risk assessment, and comprehensive care for triple-negative breast cancer.
            </p>

            <div className="flex justify-center lg:justify-start mb-8">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">About 60% of Ghanaian breast cancer cases are triple-negative — early detection matters.</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4 animate-fade-in">
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
            <div className="text-sm text-muted-foreground mb-8 lg:mb-0">3 steps • under 3 minutes • Trusted by local clinicians</div>
          </div>

          {/* Right side: Hero image with animations */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group">
              <img
                src="/lovable-uploads/ff01b965-6445-4eef-a8ae-b891a4f1b8e8.png"
                alt="Strong woman with breast cancer awareness ribbon flexing muscles, showing strength and empowerment"
                className="w-full max-w-md rounded-2xl shadow-2xl transition-all duration-700 ease-out transform group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-3xl animate-fade-in"
                loading="eager"
                fetchPriority="high"
              />
              {/* Animated glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl scale-110 -z-10"></div>
              {/* Subtle overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Stats Section - moved below hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => 
            <Card key={index} className="p-6 text-center bg-gradient-card shadow-card-soft hover-scale">
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