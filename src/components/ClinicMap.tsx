/// <reference types="google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star,
  Search,
  X
} from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
  distance?: string;
}

interface ClinicMapProps {
  onClose: () => void;
}

// This will be fetched from Supabase secrets in the actual implementation
const GOOGLE_MAPS_API_KEY = 'AIzaSyBHLett8djBo62dDXj0EjCpMFITG4PKdgw'; // Demo key - replace with your actual key

// Mock clinics data - in real app, this would come from your backend
const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Korle-Bu Teaching Hospital',
    address: 'Guggisberg Ave, Accra, Ghana',
    phone: '+233 30 267 2501',
    rating: 4.2,
    hours: '24/7',
    services: ['Oncology', 'Mammogram', 'Surgery'],
    lat: 5.5415,
    lng: -0.2317
  },
  {
    id: '2',
    name: 'University of Ghana Hospital',
    address: 'University of Ghana Campus, Legon, Ghana',
    phone: '+233 30 251 2401',
    rating: 4.0,
    hours: 'Mon-Fri: 8AM-6PM',
    services: ['Radiology', 'Consultation', 'Screening'],
    lat: 5.6514,
    lng: -0.1870
  },
  {
    id: '3',
    name: 'Greater Accra Regional Hospital',
    address: 'Ridge Hospital Rd, Accra, Ghana',
    phone: '+233 30 222 5441',
    rating: 3.8,
    hours: 'Mon-Sat: 7AM-9PM',
    services: ['Genetic Counseling', 'Support Groups'],
    lat: 5.5736,
    lng: -0.1958
  },
  {
    id: '4',
    name: '37 Military Hospital',
    address: '37 Military Hospital Rd, Accra, Ghana',
    phone: '+233 30 277 6591',
    rating: 4.1,
    hours: 'Mon-Fri: 6AM-8PM',
    services: ['Surgery', 'Emergency Care'],
    lat: 5.5614,
    lng: -0.1692
  }
];

const ClinicMap: React.FC<ClinicMapProps> = ({ onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // Calculate distances and sort clinics
          const clinicsWithDistance = mockClinics.map(clinic => ({
            ...clinic,
            distance: calculateDistance(location.lat, location.lng, clinic.lat, clinic.lng)
          })).sort((a, b) => parseFloat(a.distance!) - parseFloat(b.distance!));
          
          setClinics(clinicsWithDistance);
          
          if (map) {
            map.setCenter(location);
            map.setZoom(12);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Access Denied",
            description: "Please enable location access to find nearby clinics",
            variant: "destructive"
          });
          // Use Accra as default location
          const accraCenter = { lat: 5.6037, lng: -0.1870 };
          setUserLocation(accraCenter);
          setClinics(mockClinics);
          if (map) {
            map.setCenter(accraCenter);
            map.setZoom(11);
          }
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
    }
  };

  // Initialize Google Map
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 5.6037, lng: -0.1870 }, // Accra center
            zoom: 11,
            styles: [
              {
                featureType: 'poi.medical',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ff6b6b' }]
              }
            ]
          });

          setMap(mapInstance);
          
          // Get user location after map is initialized
          getUserLocation();
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast({
          title: "Map Loading Error",
          description: "Failed to load Google Maps. Please check your API key.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [toast]);

  // Add markers when map and clinics are ready
  useEffect(() => {
    if (!map || clinics.length === 0) return;

    // Clear existing markers
    // In a real app, you'd want to store marker references to clear them

    // Add user location marker
    if (userLocation) {
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzAwN2NmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
          scaledSize: new google.maps.Size(20, 20)
        }
      });
    }

    // Add clinic markers
    clinics.forEach((clinic) => {
      const marker = new google.maps.Marker({
        position: { lat: clinic.lat, lng: clinic.lng },
        map: map,
        title: clinic.name,
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iI2ZmNjY2NiIvPgo8L3N2Zz4K',
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      marker.addListener('click', () => {
        setSelectedClinic(clinic);
        map.setCenter({ lat: clinic.lat, lng: clinic.lng });
        map.setZoom(15);
      });
    });
  }, [map, clinics, userLocation]);

  // Filter clinics based on search query
  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-background border-l border-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Find Nearby Clinics</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clinics or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clinic List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredClinics.map((clinic) => (
            <Card
              key={clinic.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedClinic?.id === clinic.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedClinic(clinic);
                if (map) {
                  map.setCenter({ lat: clinic.lat, lng: clinic.lng });
                  map.setZoom(15);
                }
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{clinic.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-warning text-warning mr-1" />
                        <span className="text-sm text-muted-foreground">{clinic.rating}</span>
                      </div>
                      {clinic.distance && (
                        <Badge variant="outline" className="text-xs">
                          {clinic.distance}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="line-clamp-2">{clinic.address}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span>{clinic.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span>{clinic.hours}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {clinic.services.slice(0, 3).map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredClinics.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>No clinics found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicMap;