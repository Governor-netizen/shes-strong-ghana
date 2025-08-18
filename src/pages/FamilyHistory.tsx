import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const questions = [
  {
    id: "personal_history",
    title: "Personal Medical History",
    questions: [
      { id: "breast_cancer", label: "Have you been diagnosed with breast cancer?", type: "boolean" },
      { id: "ovarian_cancer", label: "Have you been diagnosed with ovarian cancer?", type: "boolean" },
      { id: "age_first_period", label: "Age when you first started menstruating (if applicable)", type: "number", info: "Early menarche (before age 12) increases risk" },
      { id: "pregnancies", label: "Number of pregnancies", type: "number" },
      { id: "age_first_birth", label: "Age at first childbirth (if applicable)", type: "number", info: "Late first childbirth (after 30) or never giving birth increases risk" },
      { id: "breastfeeding", label: "Did you breastfeed any of your children?", type: "boolean", info: "Lack of breastfeeding increases risk" },
      { id: "breastfeeding_duration", label: "Total months of breastfeeding (if applicable)", type: "number" },
      { id: "menopause_age", label: "Age at menopause (if applicable)", type: "number" },
      { id: "hormonal_contraceptives", label: "Have you used hormonal contraceptives (birth control pills, injections)?", type: "boolean" },
      { id: "contraceptive_duration", label: "For how many years did you use hormonal contraceptives?", type: "number", info: "Long-term use (5+ years) increases risk" },
      { id: "radiation_exposure", label: "Have you been exposed to radiation or toxic chemicals?", type: "boolean", info: "Previous exposure to radiation or chemicals increases risk" }
    ]
  },
  {
    id: "family_history",
    title: "Family Medical History & Genetics",
    questions: [
      { id: "mother_breast_cancer", label: "Mother diagnosed with breast cancer", type: "boolean" },
      { id: "mother_age", label: "Age when mother was diagnosed (if applicable)", type: "number" },
      { id: "father_breast_cancer", label: "Father diagnosed with breast cancer", type: "boolean" },
      { id: "sister_breast_cancer", label: "Sister(s) diagnosed with breast cancer", type: "boolean" },
      { id: "brother_breast_cancer", label: "Brother(s) diagnosed with breast cancer", type: "boolean" },
      { id: "grandmother_breast_cancer", label: "Grandmother diagnosed with breast cancer", type: "boolean" },
      { id: "aunt_breast_cancer", label: "Aunt(s) diagnosed with breast cancer", type: "boolean" },
      { id: "family_ovarian", label: "Family history of ovarian cancer", type: "boolean" },
      { id: "family_prostate", label: "Family history of prostate cancer", type: "boolean" },
      { id: "family_pancreatic", label: "Family history of pancreatic cancer", type: "boolean" },
      { id: "genetic_testing", label: "Have you had genetic testing for BRCA1/BRCA2 mutations?", type: "boolean", info: "BRCA mutations are more common in TNBC" },
      { id: "genetic_results", label: "If tested, were any mutations found?", type: "boolean" }
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Environmental Factors",
    questions: [
      { id: "current_weight", label: "Current weight (kg)", type: "number" },
      { id: "height", label: "Height (cm)", type: "number" },
      { id: "weight_gain", label: "Have you gained significant weight after menopause? (if applicable)", type: "boolean", info: "Post-menopausal obesity increases risk" },
      { id: "alcohol", label: "Do you consume alcohol regularly?", type: "boolean", info: "Regular alcohol consumption increases risk" },
      { id: "alcohol_frequency", label: "How often do you drink alcohol?", type: "select", options: ["Never", "Occasionally", "1-2 times/week", "3-4 times/week", "Daily"] },
      { id: "smoking", label: "Do you smoke or have you smoked?", type: "boolean" },
      { id: "smoking_duration", label: "If yes, for how many years?", type: "number" },
      { id: "exercise", label: "How often do you exercise or engage in physical activity?", type: "select", options: ["Never", "1-2 times/week", "3-4 times/week", "Daily"], info: "Lack of physical activity increases risk" },
      { id: "diet", label: "How would you describe your diet?", type: "select", options: ["Mostly processed/fried foods", "Mixed diet", "Mostly healthy/balanced", "Very healthy/organic"], info: "High-fat diet increases risk" },
      { id: "local_foods", label: "Do you regularly consume traditional Ghanaian foods (palm oil, processed meats)?", type: "boolean" }
    ]
  },
  {
    id: "medical_factors",
    title: "Additional Medical Factors",
    questions: [
      { id: "previous_biopsy", label: "Have you had a breast biopsy?", type: "boolean" },
      { id: "benign_breast_disease", label: "Have you been diagnosed with benign breast disease?", type: "boolean" },
      { id: "dense_breast_tissue", label: "Have you been told you have dense breast tissue?", type: "boolean" },
      { id: "hormone_therapy", label: "Have you used hormone replacement therapy?", type: "boolean" },
      { id: "diabetes", label: "Do you have diabetes?", type: "boolean" },
      { id: "hypertension", label: "Do you have high blood pressure?", type: "boolean" },
      { id: "stress_levels", label: "How would you rate your stress levels?", type: "select", options: ["Low", "Moderate", "High", "Very High"] }
    ]
  }
];

export default function FamilyHistory() {
  useScrollToTop();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Family cancer flow state
  const RELATIVES = [
    "Mother",
    "Father",
    "Sister(s)",
    "Brother(s)",
    "Grandmother",
    "Grandfather",
    "Aunt(s)",
    "Uncle(s)",
    "Other",
  ] as const;
  const CANCER_TYPES = ["Breast", "Ovarian", "Prostate", "Pancreatic", "Other"] as const;
  const [familyGate, setFamilyGate] = useState<boolean | null>(null);
  const [selectedRelatives, setSelectedRelatives] = useState<string[]>([]);
  const [relativeDetails, setRelativeDetails] = useState<
    Record<string, { types: string[]; age?: number; otherType?: string; otherRelativeText?: string }>
  >({});

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const calculateRisk = (ans: Record<string, any> = answers) => {
    let riskScore = 0;
    
    // Personal history factors (higher weights)
    if (ans.breast_cancer) riskScore += 5;
    if (ans.ovarian_cancer) riskScore += 3;
    if (ans.age_first_period && ans.age_first_period < 12) riskScore += 2;
    if (ans.pregnancies === 0 || (ans.age_first_birth && ans.age_first_birth > 30)) riskScore += 2;
    if (!ans.breastfeeding || (ans.breastfeeding_duration && ans.breastfeeding_duration < 6)) riskScore += 1;
    if (ans.contraceptive_duration && ans.contraceptive_duration >= 5) riskScore += 2;
    if (ans.radiation_exposure) riskScore += 3;
    
    // Calculate BMI and weight factors
    if (ans.current_weight && ans.height) {
      const bmi = ans.current_weight / ((ans.height / 100) ** 2);
      if (bmi >= 30) riskScore += 2; // Obesity
      else if (bmi >= 25) riskScore += 1; // Overweight
    }
    if (ans.weight_gain) riskScore += 2;
    
    // Family history & genetics (highest weights)
    if (ans.genetic_results) riskScore += 8; // BRCA positive
    if (ans.mother_breast_cancer) riskScore += 3;
    if (ans.mother_age && ans.mother_age < 50) riskScore += 2;
    if (ans.father_breast_cancer) riskScore += 2;
    if (ans.sister_breast_cancer) riskScore += 3;
    if (ans.brother_breast_cancer) riskScore += 2;
    if (ans.grandmother_breast_cancer) riskScore += 2;
    if (ans.aunt_breast_cancer) riskScore += 1;
    if (ans.family_ovarian) riskScore += 3;
    if (ans.family_prostate) riskScore += 1;
    if (ans.family_pancreatic) riskScore += 2;
    
    // Lifestyle factors
    if (ans.alcohol_frequency === "Daily") riskScore += 3;
    else if (ans.alcohol_frequency === "3-4 times/week") riskScore += 2;
    else if (ans.alcohol_frequency === "1-2 times/week") riskScore += 1;
    
    if (ans.smoking_duration && ans.smoking_duration > 10) riskScore += 2;
    else if (ans.smoking) riskScore += 1;
    
    if (ans.exercise === "Never") riskScore += 2;
    else if (ans.exercise === "1-2 times/week") riskScore += 1;
    
    if (ans.diet === "Mostly processed/fried foods") riskScore += 2;
    else if (ans.diet === "Mixed diet") riskScore += 1;
    
    if (ans.local_foods) riskScore += 1;
    
    // Medical factors
    if (ans.previous_biopsy) riskScore += 1;
    if (ans.benign_breast_disease) riskScore += 2;
    if (ans.dense_breast_tissue) riskScore += 2;
    if (ans.hormone_therapy) riskScore += 2;
    if (ans.stress_levels === "Very High") riskScore += 1;
    
    // Risk categorization (adjusted for expanded scoring)
    if (riskScore <= 5) return "low";
    if (riskScore <= 12) return "moderate";
    return "high";
  };

  const buildFamilyMapping = () => {
    const mapping: Record<string, any> = {
      mother_breast_cancer: false,
      father_breast_cancer: false,
      sister_breast_cancer: false,
      brother_breast_cancer: false,
      grandmother_breast_cancer: false,
      aunt_breast_cancer: false,
      family_ovarian: false,
      family_prostate: false,
      family_pancreatic: false,
      mother_age: undefined,
      family_relative_details: relativeDetails,
    };

    if (familyGate !== true) {
      return mapping;
    }

    let anyOvarian = false, anyProstate = false, anyPancreatic = false;

    for (const rel of selectedRelatives) {
      const det = relativeDetails[rel];
      if (!det) continue;
      const types = det.types || [];
      if (types.includes("Breast")) {
        switch (rel) {
          case "Mother":
            mapping.mother_breast_cancer = true;
            break;
          case "Father":
            mapping.father_breast_cancer = true;
            break;
          case "Sister(s)":
            mapping.sister_breast_cancer = true;
            break;
          case "Brother(s)":
            mapping.brother_breast_cancer = true;
            break;
          case "Grandmother":
            mapping.grandmother_breast_cancer = true;
            break;
          case "Aunt(s)":
            mapping.aunt_breast_cancer = true;
            break;
        }
      }
      if (types.includes("Ovarian")) anyOvarian = true;
      if (types.includes("Prostate")) anyProstate = true;
      if (types.includes("Pancreatic")) anyPancreatic = true;

      if (rel === "Mother" && typeof det.age === "number") {
        mapping.mother_age = det.age;
      }
    }

    mapping.family_ovarian = anyOvarian;
    mapping.family_prostate = anyProstate;
    mapping.family_pancreatic = anyPancreatic;

    return mapping;
  };

  const handleSubmit = () => {
    if (
      familyGate &&
      selectedRelatives.includes("Mother") &&
      (relativeDetails["Mother"]?.age === undefined || Number.isNaN(relativeDetails["Mother"]?.age))
    ) {
      toast({
        title: "Mother's age at diagnosis is required",
        description: "Please enter your mother's age at diagnosis to continue.",
      });
      return;
    }

    const mapped = buildFamilyMapping();
    const merged = { ...answers, ...mapped };
    const risk = calculateRisk(merged);
    setAnswers(merged);
    setRiskLevel(risk);
    
    toast({
      title: "Assessment Complete",
      description: "Your risk assessment has been calculated. Please review your results below.",
    });
  };
  const currentSection = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-success";
      case "moderate": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-foreground";
    }
  };

  const getRiskMessage = (risk: string) => {
    switch (risk) {
      case "low":
        return "Your assessment indicates a lower risk profile. Continue with regular screening and healthy lifestyle choices.";
      case "moderate":
        return "Your assessment indicates a moderate risk profile. Consider discussing enhanced screening options with your healthcare provider.";
      case "high":
        return "Your assessment indicates a higher risk profile. We strongly recommend scheduling a consultation with a specialist for personalized screening and prevention strategies.";
      default:
        return "";
    }
  };

  if (riskLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-medical bg-gradient-card">
            <CardHeader className="text-center">
              <img
                src="/lovable-uploads/2f185e8b-5554-46b6-a58d-37f494f55165.png"
                alt="She's Strong Ghana logo — heart with pulse line and pink ribbon"
                className="h-16 w-16 mx-auto mb-4 object-contain"
                loading="lazy"
              />
              <CardTitle className="text-2xl">Risk Assessment Results</CardTitle>
              <CardDescription>Based on your family history and lifestyle factors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getRiskColor(riskLevel)}`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </div>
                <p className="text-muted-foreground mb-6">
                  {getRiskMessage(riskLevel)}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommended Next Steps:</h3>
                <div className="space-y-3">
                  {riskLevel === "high" && (
                    <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Schedule Specialist Consultation</p>
                        <p className="text-sm text-muted-foreground">Consider genetic counseling and enhanced screening protocols</p>
                      </div>
                    </div>
                  )}
                  {(riskLevel === "moderate" || riskLevel === "high") && (
                    <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <CheckCircle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium text-warning">Enhanced Screening</p>
                        <p className="text-sm text-muted-foreground">Discuss earlier or more frequent mammograms with your doctor</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-success">Maintain Healthy Lifestyle</p>
                      <p className="text-sm text-muted-foreground">Regular exercise, healthy diet, and limited alcohol consumption</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={() => setRiskLevel(null)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Retake Assessment
                </Button>
                <Button className="flex-1" onClick={() => navigate("/appointments", { state: { fromRiskAssessment: true, riskLevel } })}>
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Family History Assessment</h1>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {questions.length}
          </p>
        </div>

        <Card className="shadow-medical bg-gradient-card">
          <CardHeader>
            <CardTitle>{currentSection.title}</CardTitle>
            <CardDescription>
              Please answer the following questions honestly to assess your risk factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSection.id === "family_history" ? (
              <>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Has anyone in your family ever been diagnosed with cancer?</Label>
                  <RadioGroup
                    value={familyGate === null ? undefined : familyGate ? "yes" : "no"}
                    onValueChange={(val) => {
                      const yes = val === "yes";
                      setFamilyGate(yes);
                       if (!yes) {
                        setSelectedRelatives([]);
                        setRelativeDetails({});
                       }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="family-gate-yes" />
                      <Label htmlFor="family-gate-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="family-gate-no" />
                      <Label htmlFor="family-gate-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {familyGate && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Which of your relatives have been diagnosed with cancer?</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {RELATIVES.map((rel) => (
                          <div key={rel} className="flex items-center space-x-2">
                            <Checkbox
                              id={`rel-${rel}`}
                              checked={selectedRelatives.includes(rel)}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                setSelectedRelatives((prev) => {
                                  const next = isChecked ? [...prev, rel] : prev.filter((r) => r !== rel);
                                  return Array.from(new Set(next));
                                });
                                setRelativeDetails((prev) => {
                                  if (isChecked) {
                                    return prev[rel] ? prev : { ...prev, [rel]: { types: [] } };
                                  } else {
                                    const copy = { ...prev } as Record<string, { types: string[]; age?: number; otherType?: string; otherRelativeText?: string }>;
                                    delete copy[rel];
                                    return copy;
                                  }
                                });
                              }}
                            />
                            <Label htmlFor={`rel-${rel}`}>{rel}</Label>
                          </div>
                        ))}
                      </div>
                      {selectedRelatives.includes("Other") && (
                        <div className="mt-2 space-y-2">
                          <Label htmlFor="other-relative">Please specify other relative</Label>
                          <Input
                            id="other-relative"
                            value={relativeDetails["Other"]?.otherRelativeText || ""}
                            onChange={(e) =>
                              setRelativeDetails((prev) => ({
                                ...prev,
                                Other: { ...(prev["Other"] || { types: [] }), otherRelativeText: e.target.value },
                              }))
                            }
                            placeholder="e.g., Cousin"
                          />
                        </div>
                      )}
                    </div>

                    {selectedRelatives.map((rel) => (
                      <div key={`detail-${rel}`} className="space-y-3 rounded-lg border p-4">
                        <Label className="text-base font-medium">
                          What type(s) of cancer was your {rel.toLowerCase()} diagnosed with?
                        </Label>
                        <div className="flex flex-wrap gap-3">
                          {CANCER_TYPES.map((type) => (
                            <div key={`${rel}-${type}`} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${rel}-${type}`}
                                checked={relativeDetails[rel]?.types?.includes(type) || false}
                                onCheckedChange={(checked) => {
                                  const isChecked = checked === true;
                                  setRelativeDetails((prev) => {
                                    const curr = prev[rel] || { types: [] as string[] };
                                    const set = new Set(curr.types);
                                    if (isChecked) set.add(type);
                                    else set.delete(type);
                                    return { ...prev, [rel]: { ...curr, types: Array.from(set) } };
                                  });
                                }}
                              />
                              <Label htmlFor={`${rel}-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </div>
                        {relativeDetails[rel]?.types?.includes("Other") && (
                          <div className="space-y-2">
                            <Label htmlFor={`${rel}-other-type`}>Please specify other cancer type</Label>
                            <Input
                              id={`${rel}-other-type`}
                              value={relativeDetails[rel]?.otherType || ""}
                              onChange={(e) =>
                                setRelativeDetails((prev) => ({
                                  ...prev,
                                  [rel]: { ...(prev[rel] || { types: [] }), otherType: e.target.value },
                                }))
                              }
                              placeholder="e.g., Colorectal"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor={`${rel}-age`}>
                            How old was your {rel.toLowerCase()} when diagnosed? {rel === "Mother" ? "(Required)" : "(Optional)"}
                          </Label>
                          <Input
                            id={`${rel}-age`}
                            type="number"
                            min={0}
                            value={relativeDetails[rel]?.age ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRelativeDetails((prev) => ({
                                ...prev,
                                [rel]: {
                                  ...(prev[rel] || { types: [] }),
                                  age: val ? parseInt(val) : undefined,
                                },
                              }));
                            }}
                            placeholder="Enter age"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                 {/* Genetic testing questions - always show regardless of family history */}
                <div className="space-y-3">
                   <Label className="text-base font-medium">
                     Have you had genetic testing for BRCA1/BRCA2 mutations?
                   </Label>
                   <RadioGroup
                     value={answers["genetic_testing"]?.toString()}
                     onValueChange={(value) => handleAnswer("genetic_testing", value === "true")}
                   >
                     <div className="flex items-center space-x-2">
                       <RadioGroupItem value="true" id="genetic_testing-yes" />
                       <Label htmlFor="genetic_testing-yes">Yes</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                       <RadioGroupItem value="false" id="genetic_testing-no" />
                       <Label htmlFor="genetic_testing-no">No</Label>
                     </div>
                   </RadioGroup>
                 </div>

                 {/* Only show genetic results question if user answered "Yes" to testing */}
                 {answers["genetic_testing"] === true && (
                   <div className="space-y-3">
                     <Label className="text-base font-medium">If tested, were any mutations found?</Label>
                     <RadioGroup
                       value={answers["genetic_results"]?.toString()}
                       onValueChange={(value) => handleAnswer("genetic_results", value === "true")}
                     >
                       <div className="flex items-center space-x-2">
                         <RadioGroupItem value="true" id="genetic_results-yes" />
                         <Label htmlFor="genetic_results-yes">Yes</Label>
                       </div>
                       <div className="flex items-center space-x-2">
                         <RadioGroupItem value="false" id="genetic_results-no" />
                         <Label htmlFor="genetic_results-no">No</Label>
                       </div>
                     </RadioGroup>
                   </div>
                 )}
              </>
            ) : (
              <>
                {currentSection.questions.map((question) => (
                  <div key={question.id} className="space-y-3">
                    <Label className="text-base font-medium">{question.label}</Label>
                    
                    {question.type === "boolean" && (
                      <div className="space-y-3">
                        <RadioGroup
                          value={answers[question.id]?.toString()}
                          onValueChange={(value) => handleAnswer(question.id, value === "true")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id={`${question.id}-yes`} />
                            <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id={`${question.id}-no`} />
                            <Label htmlFor={`${question.id}-no`}>No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                    
                    {question.type === "number" && (
                      <div className="space-y-3">
                        {question.id === "pregnancies" ? (
                          <>
                            <Input
                              type="number"
                              value={answers[question.id] ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v === "") {
                                  handleAnswer(question.id, "");
                                } else {
                                  const num = parseInt(v);
                                  handleAnswer(question.id, Number.isFinite(num) ? num : (answers[question.id] ?? 0));
                                }
                              }}
                              placeholder="Enter number (enter 0 if none)"
                              min={0}
                              inputMode="numeric"
                            />
                            <p className="text-xs text-muted-foreground">Enter 0 if you have not been pregnant.</p>
                          </>
                        ) : (
                          <Input
                            type="number"
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || 0)}
                            placeholder="Enter number"
                            min="0"
                          />
                        )}
                      </div>
                    )}
                    
                    {question.type === "select" && question.options && (
                      <div className="space-y-3">
                        <RadioGroup
                          value={answers[question.id]}
                          onValueChange={(value) => handleAnswer(question.id, value)}
                        >
                          {question.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                              <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(Math.max(0, currentStep - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === questions.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-gradient-primary">
              Calculate Risk
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                setCurrentStep(Math.min(questions.length - 1, currentStep + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gradient-primary"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}