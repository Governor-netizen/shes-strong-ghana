/// <reference types="google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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


// Mock clinics data covering all major regions of Ghana
const mockClinics: Clinic[] = [
  // Greater Accra Region
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
    name: '37 Military Hospital',
    address: '37 Military Hospital Rd, Accra, Ghana',
    phone: '+233 30 277 6591',
    rating: 4.1,
    hours: 'Mon-Fri: 6AM-8PM',
    services: ['Surgery', 'Emergency Care'],
    lat: 5.5614,
    lng: -0.1692
  },
  // Ashanti Region
  {
    id: '4',
    name: 'Komfo Anokye Teaching Hospital',
    address: 'Bantama, Kumasi, Ghana',
    phone: '+233 32 022 701',
    rating: 4.3,
    hours: '24/7',
    services: ['Oncology', 'Surgery', 'Emergency Care'],
    lat: 6.6885,
    lng: -1.6244
  },
  {
    id: '5',
    name: 'Kumasi South Hospital',
    address: 'Atonsu, Kumasi, Ghana',
    phone: '+233 32 026 345',
    rating: 3.9,
    hours: 'Mon-Sun: 6AM-10PM',
    services: ['Screening', 'Consultation', 'Radiology'],
    lat: 6.6745,
    lng: -1.6163
  },
  // Northern Region
  {
    id: '6',
    name: 'Tamale Teaching Hospital',
    address: 'Education Ridge, Tamale, Ghana',
    phone: '+233 37 202 9701',
    rating: 4.0,
    hours: '24/7',
    services: ['Oncology', 'Surgery', 'Screening'],
    lat: 9.4034,
    lng: -0.8424
  },
  // Western Region
  {
    id: '7',
    name: 'Effia-Nkwanta Regional Hospital',
    address: 'Sekondi-Takoradi, Ghana',
    phone: '+233 31 201 2345',
    rating: 3.8,
    hours: 'Mon-Sun: 6AM-9PM',
    services: ['Consultation', 'Screening', 'Support Groups'],
    lat: 4.9344,
    lng: -1.7637
  },
  // Central Region
  {
    id: '8',
    name: 'Cape Coast Teaching Hospital',
    address: 'Cape Coast, Ghana',
    phone: '+233 33 213 2109',
    rating: 3.9,
    hours: '24/7',
    services: ['Oncology', 'Radiology', 'Surgery'],
    lat: 5.1053,
    lng: -1.2466
  },
  // Eastern Region
  {
    id: '9',
    name: 'Eastern Regional Hospital',
    address: 'Koforidua, Ghana',
    phone: '+233 34 202 0234',
    rating: 3.7,
    hours: 'Mon-Sat: 7AM-8PM',
    services: ['Screening', 'Consultation', 'Genetic Counseling'],
    lat: 6.0897,
    lng: -0.2599
  },
  // Volta Region
  {
    id: '10',
    name: 'Ho Teaching Hospital',
    address: 'Ho, Ghana',
    phone: '+233 36 202 6543',
    rating: 3.8,
    hours: 'Mon-Sun: 6AM-9PM',
    services: ['Consultation', 'Screening', 'Support Groups'],
    lat: 6.6108,
    lng: 0.4724
  },
  // Upper East Region
  {
    id: '11',
    name: 'Bolgatanga Regional Hospital',
    address: 'Bolgatanga, Ghana',
    phone: '+233 38 202 2134',
    rating: 3.6,
    hours: 'Mon-Fri: 7AM-7PM',
    services: ['Screening', 'Consultation', 'Emergency Care'],
    lat: 10.7856,
    lng: -0.8512
  },
  // Upper West Region
  {
    id: '12',
    name: 'Wa Regional Hospital',
    address: 'Wa, Ghana',
    phone: '+233 39 202 3456',
    rating: 3.5,
    hours: 'Mon-Sat: 6AM-8PM',
    services: ['Consultation', 'Screening', 'Radiology'],
    lat: 10.0601,
    lng: -2.5057
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
          // Use Ghana center as default location
          const ghanaCenter = { lat: 7.9465, lng: -1.0232 };
          setUserLocation(ghanaCenter);
          setClinics(mockClinics);
          if (map) {
            map.setCenter(ghanaCenter);
            map.setZoom(7);
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

  // Fetch Google Maps API key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-maps-api-key');
        
        if (error) {
          console.error('Error fetching API key:', error);
          setError('Failed to fetch API key');
          toast({
            title: "Configuration Error",
            description: "Unable to load map configuration. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (!data?.apiKey) {
          console.error('No API key received from server');
          setError('No API key received');
          toast({
            title: "Configuration Error",
            description: "Google Maps API key not configured properly.",
            variant: "destructive"
          });
          return;
        }

        console.log('Successfully received API key');
        setApiKey(data.apiKey);
      } catch (error) {
        console.error('Error fetching Google Maps API key:', error);
        setError(`Failed to fetch API key: ${error.message}`);
        toast({
          title: "Network Error",
          description: "Unable to connect to server. Please check your connection.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, [toast]);

  // Initialize Google Map
  useEffect(() => {
    if (!apiKey) return;

    const initMap = async () => {
      try {
        console.log('Initializing Google Maps...');
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 7.9465, lng: -1.0232 }, // Ghana center
            zoom: 7,
            styles: [
              {
                featureType: 'poi.medical',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ff6b6b' }]
              }
            ]
          });

          setMap(mapInstance);
          console.log('Map initialized successfully');
          
          // Get user location after map is initialized
          getUserLocation();
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError(`Map loading failed: ${error.message}`);
        toast({
          title: "Map Loading Error",
          description: `Failed to load Google Maps: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [apiKey, toast]);

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
              <p>{apiKey ? 'Loading map...' : 'Fetching configuration...'}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <div className="text-destructive mb-4">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
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
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`, '_blank');
                    }}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${clinic.phone}`, '_self');
                    }}
                  >
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