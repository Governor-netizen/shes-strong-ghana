import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone,
  Map as MapIcon,
  Navigation,
  Clock
} from "lucide-react";
import ClinicMap from "@/components/ClinicMap";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

interface Hospital {
  id: string;
  name: string;
  specialty?: string;
  location?: string;
  phone?: string;
  email?: string;
}

export default function FindHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [showClinicMap, setShowClinicMap] = useState(false);
  const { toast } = useToast();

  useSEO({
    title: "Find Hospitals Near You — Healthcare Facilities | She's Strong Ghana",
    description: "Find hospitals and clinics near you. Get contact information and directions to healthcare facilities in Ghana.",
    canonical: window.location.origin + "/appointments",
  });

  // Load hospitals from providers table
  useEffect(() => {
    const loadHospitals = async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("id,name,specialty,location,phone,email")
        .eq("is_active", true)
        .order("name", { ascending: true });
      
      if (!error && data) {
        setHospitals(data as Hospital[]);
      }
    };
    loadHospitals();
  }, []);

  const handleCallHospital = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast({
        title: "Contact Information Unavailable",
        description: "Phone number not available for this facility.",
        variant: "destructive",
      });
    }
  };

  const handleGetDirections = (location?: string) => {
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
    } else {
      toast({
        title: "Location Unavailable",
        description: "Location information not available for this facility.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Find Hospitals Near You</h1>
            </div>
            <Button 
              onClick={() => setShowClinicMap(true)}
              className="bg-gradient-primary"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              View Map
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Locate healthcare facilities and get contact information for hospitals and clinics in Ghana
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card-soft cursor-pointer hover:shadow-medical transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Emergency Contact</p>
                  <p className="text-sm text-muted-foreground">24/7 Emergency Hotline</p>
                  <a href="tel:112" className="text-sm font-mono text-primary hover:underline">
                    Call 112
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-card shadow-card-soft cursor-pointer hover:shadow-medical transition-shadow"
            onClick={() => setShowClinicMap(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <MapIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">View Interactive Map</p>
                  <p className="text-sm text-muted-foreground">See all facilities on the map</p>
                  <p className="text-sm text-primary">Open map view</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-sm text-muted-foreground">Most facilities</p>
                  <p className="text-sm text-foreground">Mon-Fri: 8AM - 5PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hospitals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Healthcare Facilities</h2>
          
          {hospitals.length === 0 ? (
            <Card className="bg-gradient-card shadow-card-soft">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No healthcare facilities found. Please check back later.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="bg-gradient-card shadow-card-soft hover:shadow-medical transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Hospital Info */}
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{hospital.name}</h3>
                        {hospital.specialty && (
                          <p className="text-sm text-primary">{hospital.specialty}</p>
                        )}
                        {hospital.location && (
                          <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{hospital.location}</span>
                          </div>
                        )}
                        {hospital.phone && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{hospital.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => handleCallHospital(hospital.phone)}
                          variant="default"
                          className="flex-1 bg-gradient-primary"
                          disabled={!hospital.phone}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        <Button 
                          onClick={() => handleGetDirections(hospital.location)}
                          variant="outline"
                          className="flex-1"
                          disabled={!hospital.location}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clinic Map Modal */}
      {showClinicMap && (
        <ClinicMap onClose={() => setShowClinicMap(false)} />
      )}
    </div>
  );
}
