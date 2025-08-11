import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Activity, 
  Plus, 
  CalendarIcon, 
  AlertCircle, 
  TrendingUp,
  Heart,
  Clock,
  CheckCircle
} from "lucide-react";

const commonSymptoms = [
  "Breast lump or thickening",
  "Breast pain or tenderness",
  "Changes in breast size or shape",
  "Nipple discharge",
  "Skin changes (dimpling, puckering)",
  "Swollen lymph nodes",
  "Fatigue",
  "Unexplained weight loss",
  "Persistent cough",
  "Bone pain"
];

const severityLevels = [
  { value: 1, label: "Mild", color: "bg-success/20 text-success" },
  { value: 2, label: "Moderate", color: "bg-warning/20 text-warning" },
  { value: 3, label: "Severe", color: "bg-destructive/20 text-destructive" }
];

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: number;
  date: Date;
  notes: string;
  duration: string;
}

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const addFormRef = useRef<HTMLDivElement | null>(null);

  const scrollToAddForm = () => {
    requestAnimationFrame(() => {
      addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    if (showAddForm) {
      scrollToAddForm();
    }
  }, [showAddForm]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#add") {
      setShowAddForm(true);
    }
  }, []);

  const addSymptom = () => {
    const symptomToAdd = selectedSymptom || customSymptom;
    if (!symptomToAdd.trim()) {
      toast({
        title: "Error",
        description: "Please select or enter a symptom",
        variant: "destructive"
      });
      return;
    }

    const newSymptom: SymptomEntry = {
      id: Date.now().toString(),
      symptom: symptomToAdd,
      severity: selectedSeverity,
      date: selectedDate,
      notes,
      duration
    };

    setSymptoms(prev => [newSymptom, ...prev]);
    
    // Reset form
    setSelectedSymptom("");
    setCustomSymptom("");
    setSelectedSeverity(1);
    setNotes("");
    setDuration("");
    setShowAddForm(false);

    toast({
      title: "Symptom Added",
      description: "Your symptom has been recorded successfully",
    });
  };

  const getSeverityLabel = (severity: number) => {
    return severityLevels.find(level => level.value === severity);
  };

  const getRecentSymptoms = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return symptoms.filter(symptom => symptom.date >= lastWeek);
  };

  const getHighSeveritySymptoms = () => {
    return symptoms.filter(symptom => symptom.severity === 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Symptom Tracker</h1>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Symptom
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Track your symptoms to help healthcare providers understand your health journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getRecentSymptoms().length}</p>
                  <p className="text-sm text-muted-foreground">This week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getHighSeveritySymptoms().length}</p>
                  <p className="text-sm text-muted-foreground">Severe symptoms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{symptoms.length}</p>
                  <p className="text-sm text-muted-foreground">Total entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Symptom Form */}
        {showAddForm && (
          <Card ref={addFormRef} id="add" className="mb-8 shadow-medical bg-gradient-card">
            <CardHeader>
              <CardTitle>Add New Symptom</CardTitle>
              <CardDescription>Record a symptom you're experiencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Select Symptom</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant={selectedSymptom === symptom ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedSymptom(symptom);
                        setCustomSymptom("");
                      }}
                      className="w-full h-auto py-3 text-sm text-left justify-start whitespace-normal break-words leading-normal"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-symptom">Or enter custom symptom</Label>
                <Input
                  id="custom-symptom"
                  value={customSymptom}
                  onChange={(e) => {
                    setCustomSymptom(e.target.value);
                    setSelectedSymptom("");
                  }}
                  placeholder="Describe your symptom"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Severity Level</Label>
                  <div className="space-y-2">
                    {severityLevels.map((level) => (
                      <Button
                        key={level.value}
                        variant={selectedSeverity === level.value ? "default" : "outline"}
                        onClick={() => setSelectedSeverity(level.value)}
                        className="w-full justify-start"
                      >
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Date & Duration</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="How long have you had this? (e.g., 3 days)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details about this symptom..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={addSymptom} className="flex-1 bg-gradient-primary">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Add Symptom
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Symptoms List */}
        <Card className="shadow-medical bg-gradient-card">
          <CardHeader>
            <CardTitle>Symptom History</CardTitle>
            <CardDescription>Your recorded symptoms over time</CardDescription>
          </CardHeader>
          <CardContent>
            {symptoms.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No symptoms recorded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your symptoms to help your healthcare provider
                </p>
                <Button onClick={() => setShowAddForm(true)} className="bg-gradient-primary">
                  Add Your First Symptom
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {symptoms.map((symptom) => {
                  const severityInfo = getSeverityLabel(symptom.severity);
                  return (
                    <div
                      key={symptom.id}
                      className="border border-border rounded-lg p-4 hover:shadow-card-soft transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{symptom.symptom}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {format(symptom.date, "PPP")}
                            </span>
                            {symptom.duration && (
                              <span className="text-sm text-muted-foreground">
                                • Duration: {symptom.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        {severityInfo && (
                          <Badge className={severityInfo.color}>
                            {severityInfo.label}
                          </Badge>
                        )}
                      </div>
                      {symptom.notes && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                          {symptom.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}