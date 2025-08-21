import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Save, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Shield,
  Bell
} from "lucide-react";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string;
  medications: string;
  preferredLanguage: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodType: "",
    allergies: "",
    medications: "",
    preferredLanguage: "English",
  });

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (!error && data) {
        setProfile({
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          dateOfBirth: data.date_of_birth ?? "",
          address: data.address ?? "",
          emergencyContact: data.emergency_contact ?? "",
          emergencyPhone: data.emergency_phone ?? "",
          bloodType: data.blood_type ?? "",
          allergies: data.allergies ?? "",
          medications: data.medications ?? "",
          preferredLanguage: data.preferred_language ?? "English",
        });
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData.user?.id;

    if (!uid) {
      setLoading(false);
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      id: uid,
      first_name: profile.firstName || null,
      last_name: profile.lastName || null,
      email: profile.email || null,
      phone: profile.phone || null,
      date_of_birth: profile.dateOfBirth || null,
      address: profile.address || null,
      emergency_contact: profile.emergencyContact || null,
      emergency_phone: profile.emergencyPhone || null,
      blood_type: profile.bloodType || null,
      allergies: profile.allergies || null,
      medications: profile.medications || null,
      preferred_language: profile.preferredLanguage || "English",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload);

    setLoading(false);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Keep your information up to date for better healthcare coordination
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
          {/* Personal Information */}
          <Card className="shadow-medical bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic information about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <RadioGroup
                  value={profile.preferredLanguage}
                  onValueChange={(value) => handleChange('preferredLanguage', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="English" id="lang-en" />
                    <Label htmlFor="lang-en">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Twi" id="lang-twi" />
                    <Label htmlFor="lang-twi">Twi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ga" id="lang-ga" />
                    <Label htmlFor="lang-ga">Ga</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ewe" id="lang-ewe" />
                    <Label htmlFor="lang-ewe">Ewe</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-medical bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How we can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Your home address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="shadow-medical bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
              <CardDescription>
                Someone we can contact in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={profile.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  placeholder="Full name of emergency contact"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={profile.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card className="shadow-medical bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Medical Information
              </CardTitle>
              <CardDescription>
                Important medical details for healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  value={profile.bloodType}
                  onChange={(e) => handleChange('bloodType', e.target.value)}
                  placeholder="e.g., O+, A-, AB+"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  placeholder="List any known allergies (medications, food, environmental)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={profile.medications}
                  onChange={(e) => handleChange('medications', e.target.value)}
                  placeholder="List current medications and dosages"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-gradient-primary" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}