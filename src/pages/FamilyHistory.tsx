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
import { calculateTyrerCuzickRisk, validateTyrerCuzickInput, type TyrerCuzickInput, type TyrerCuzickResult, type FamilyMember } from "@/utils/tyrerCuzickModel";

const questions = [
  {
    id: "basic_info",
    title: "Basic Information",
    questions: [
      { id: "current_age", label: "Your current age", type: "number", required: true },
      { id: "ethnicity", label: "Ethnicity", type: "select", options: ["White", "Black/African", "Asian", "Hispanic/Latino", "Mixed/Other"], required: true }
    ]
  },
  {
    id: "reproductive_history",
    title: "Reproductive History",
    questions: [
      { id: "age_at_menarche", label: "Age when you first started menstruating", type: "number", required: true },
      { id: "pregnancies", label: "Number of pregnancies (including miscarriages)", type: "number" },
      { id: "age_first_birth", label: "Age at first childbirth (leave blank if never pregnant)", type: "number" },
      { id: "menopausal_status", label: "Menopausal status", type: "select", options: ["Pre-menopausal", "Post-menopausal", "Unknown"], required: true },
      { id: "age_at_menopause", label: "Age at menopause (if post-menopausal)", type: "number" }
    ]
  },
  {
    id: "hormone_therapy",
    title: "Hormone Use History",
    questions: [
      { id: "hrt_use", label: "Have you ever used hormone replacement therapy (HRT)?", type: "boolean" },
      { id: "hrt_type", label: "Type of HRT used", type: "select", options: ["Combined (estrogen + progestin)", "Estrogen only", "Unknown type"] },
      { id: "hrt_duration", label: "Duration of HRT use (in months)", type: "number" },
      { id: "oral_contraceptive_use", label: "Have you used oral contraceptives for more than 5 years?", type: "boolean" }
    ]
  },
  {
    id: "genetic_testing",
    title: "Genetic Testing History",
    questions: [
      { id: "brca_testing", label: "Have you had genetic testing for BRCA1/BRCA2 mutations?", type: "boolean" },
      { id: "brca1_status", label: "BRCA1 test result", type: "select", options: ["Positive (mutation found)", "Negative (no mutation)", "Unknown/Not tested"] },
      { id: "brca2_status", label: "BRCA2 test result", type: "select", options: ["Positive (mutation found)", "Negative (no mutation)", "Unknown/Not tested"] }
    ]
  },
  {
    id: "biopsy_history", 
    title: "Breast Biopsy History",
    questions: [
      { id: "previous_biopsy", label: "Have you ever had a breast biopsy?", type: "boolean" },
      { id: "biopsy_histology", label: "Biopsy result (if applicable)", type: "select", options: ["Normal tissue", "Atypical hyperplasia", "Lobular carcinoma in situ (LCIS)", "Ductal carcinoma in situ (DCIS)", "Unknown"] }
    ]
  },
  {
    id: "family_history",
    title: "Family Medical History",
    questions: []
  }
];

// Family member management component
const FamilyMemberForm = ({ 
  member, 
  onUpdate, 
  onRemove 
}: { 
  member: FamilyMember; 
  onUpdate: (member: FamilyMember) => void; 
  onRemove: () => void;
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Family Member Details</h4>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Relationship</Label>
          <RadioGroup
            value={member.relationship}
            onValueChange={(value) => onUpdate({ ...member, relationship: value as any })}
          >
            {['mother', 'sister', 'daughter', 'grandmother', 'aunt', 'half_sister'].map((rel) => (
              <div key={rel} className="flex items-center space-x-2">
                <RadioGroupItem value={rel} id={`rel-${rel}`} />
                <Label htmlFor={`rel-${rel}`}>{rel.charAt(0).toUpperCase() + rel.slice(1).replace('_', ' ')}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Cancer Type</Label>
          <RadioGroup
            value={member.cancerType}
            onValueChange={(value) => onUpdate({ ...member, cancerType: value as any })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="breast" id="breast" />
              <Label htmlFor="breast">Breast Cancer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ovarian" id="ovarian" />
              <Label htmlFor="ovarian">Ovarian Cancer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">No Cancer</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      {member.cancerType !== 'none' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Age at Diagnosis</Label>
            <Input
              type="number"
              value={member.ageAtDiagnosis || ''}
              onChange={(e) => onUpdate({ ...member, ageAtDiagnosis: parseInt(e.target.value) || undefined })}
              placeholder="Age when diagnosed"
            />
          </div>
          {member.cancerType === 'breast' && (
            <div className="space-y-2">
              <Label>Bilateral Breast Cancer?</Label>
              <RadioGroup
                value={member.bilateralBreast?.toString()}
                onValueChange={(value) => onUpdate({ ...member, bilateralBreast: value === 'true' })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="bilateral-yes" />
                  <Label htmlFor="bilateral-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="bilateral-no" />
                  <Label htmlFor="bilateral-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function FamilyHistory() {
  useScrollToTop();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [riskResult, setRiskResult] = useState<TyrerCuzickResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Family history state for detailed collection
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Scroll to top when component mounts or step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const calculateTyrerCuzickFromAnswers = (ans: Record<string, any> = answers): TyrerCuzickResult | null => {
    try {
      // Map answers to Tyrer-Cuzick input format
      const input: TyrerCuzickInput = {
        currentAge: ans.current_age,
        ageAtMenarche: ans.age_at_menarche,
        ageAtFirstBirth: ans.age_first_birth || undefined,
        menopausalStatus: ans.menopausal_status?.toLowerCase().replace('-', '') === 'premenopausal' ? 'pre' : 
                         ans.menopausal_status?.toLowerCase().replace('-', '') === 'postmenopausal' ? 'post' : 'unknown',
        ageAtMenopause: ans.age_at_menopause,
        hrtUse: ans.hrt_use || false,
        hrtType: ans.hrt_type?.toLowerCase().includes('combined') ? 'combined' :
                ans.hrt_type?.toLowerCase().includes('estrogen') ? 'estrogen_only' : 'unknown',
        hrtDuration: ans.hrt_duration,
        brca1Status: ans.brca1_status?.toLowerCase().includes('positive') ? 'positive' :
                    ans.brca1_status?.toLowerCase().includes('negative') ? 'negative' : 'unknown',
        brca2Status: ans.brca2_status?.toLowerCase().includes('positive') ? 'positive' :
                    ans.brca2_status?.toLowerCase().includes('negative') ? 'negative' : 'unknown',
        previousBiopsy: ans.previous_biopsy || false,
        biopsyHistology: ans.biopsy_histology?.toLowerCase().includes('atypical') ? 'atypical_hyperplasia' :
                        ans.biopsy_histology?.toLowerCase().includes('lcis') ? 'lcis' :
                        ans.biopsy_histology?.toLowerCase().includes('dcis') ? 'dcis' : 'normal',
        familyHistory: {
          firstDegree: familyMembers.filter(m => ['mother', 'sister', 'daughter'].includes(m.relationship)),
          secondDegree: familyMembers.filter(m => ['grandmother', 'aunt', 'half_sister'].includes(m.relationship))
        },
        ethnicity: ans.ethnicity?.toLowerCase().replace('/', '').replace(' ', '_') as any || 'other'
      };

      // Validate input
      const validationErrors = validateTyrerCuzickInput(input);
      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        toast({
          title: "Incomplete Information",
          description: "Please complete all required fields: " + validationErrors.join(', '),
          variant: "destructive"
        });
        return null;
      }

      return calculateTyrerCuzickRisk(input);
    } catch (error) {
      console.error('Error calculating risk:', error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your risk. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = () => {
    const result = calculateTyrerCuzickFromAnswers();
    if (result) {
      setRiskResult(result);
      toast({
        title: "Assessment Complete",
        description: "Your Tyrer-Cuzick risk assessment has been calculated. Please review your results below.",
      });
    }
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

  const getRiskMessage = (result: TyrerCuzickResult) => {
    switch (result.riskCategory) {
      case "low":
        return "Your Tyrer-Cuzick assessment indicates a lower risk profile. Continue with regular screening as recommended by your healthcare provider.";
      case "moderate":
        return "Your assessment indicates a moderate risk profile. You may benefit from enhanced screening starting at an earlier age or with additional methods like MRI.";
      case "high":
        return "Your assessment indicates a higher risk profile (≥20% lifetime risk). You are eligible for high-risk screening protocols and should consider genetic counseling.";
      default:
        return "";
    }
  };

  if (riskResult) {
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
              <CardTitle className="text-2xl">Tyrer-Cuzick Risk Assessment Results</CardTitle>
              <CardDescription>Based on the validated Tyrer-Cuzick breast cancer risk prediction model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className={`text-4xl font-bold mb-2 ${getRiskColor(riskResult.riskCategory)}`}>
                  {riskResult.lifetimeRisk}% Lifetime Risk
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium">10-Year Risk</p>
                    <p className="text-2xl font-bold text-primary">{riskResult.tenYearRisk}%</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium">Relative Risk</p>
                    <p className="text-2xl font-bold text-primary">{riskResult.relativeRisk}x</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Population average: {riskResult.averagePopulationRisk}% | Your risk category: <span className={getRiskColor(riskResult.riskCategory)}>{riskResult.riskCategory}</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  {getRiskMessage(riskResult)}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Recommended Next Steps:</h3>
                <div className="space-y-3">
                  {riskResult.riskCategory === "high" && (
                    <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Schedule Specialist Consultation</p>
                        <p className="text-sm text-muted-foreground">Consider genetic counseling and enhanced screening protocols</p>
                      </div>
                    </div>
                  )}
                  {(riskResult.riskCategory === "moderate" || riskResult.riskCategory === "high") && (
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
                  onClick={() => setRiskResult(null)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Retake Assessment
                </Button>
                <Button className="flex-1" onClick={() => navigate("/appointments", { state: { fromRiskAssessment: true, riskResult } })}>
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
            <h1 className="text-2xl font-bold">Tyrer-Cuzick Risk Assessment</h1>
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
              Please answer the following questions to calculate your breast cancer risk using the validated Tyrer-Cuzick model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSection.id === "family_history" ? (
              <>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    The Tyrer-Cuzick model requires detailed family history information. Please add family members who have been diagnosed with breast or ovarian cancer.
                  </p>
                  
                  <div className="space-y-4">
                    {familyMembers.map((member, index) => (
                      <FamilyMemberForm
                        key={index}
                        member={member}
                        onUpdate={(updatedMember) => {
                          const newMembers = [...familyMembers];
                          newMembers[index] = updatedMember;
                          setFamilyMembers(newMembers);
                        }}
                        onRemove={() => {
                          setFamilyMembers(familyMembers.filter((_, i) => i !== index));
                        }}
                      />
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFamilyMembers([...familyMembers, {
                          relationship: 'mother',
                          cancerType: 'none'
                        }]);
                      }}
                    >
                      Add Family Member
                    </Button>
                    
                    {familyMembers.length === 0 && (
                      <div className="text-center p-6 text-muted-foreground">
                        <p>No family members added yet.</p>
                        <p className="text-xs mt-2">If no family members have had breast or ovarian cancer, you can proceed to the next step.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {currentSection.questions.map((question) => {
                  // Skip conditional questions
                  if (question.id === "hrt_type" && !answers["hrt_use"]) return null;
                  if (question.id === "hrt_duration" && !answers["hrt_use"]) return null;
                  if (question.id === "age_at_menopause" && answers["menopausal_status"] !== "Post-menopausal") return null;
                  if (question.id === "biopsy_histology" && !answers["previous_biopsy"]) return null;
                  
                  return (
                  <div key={question.id} className="space-y-3">
                    <Label className="text-base font-medium">
                      {question.label}
                      {(question as any).required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    
                    {question.type === "boolean" && (
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
                    )}
                    
                    {question.type === "number" && (
                      <Input
                        type="number"
                        value={answers[question.id] || ""}
                        onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || "")}
                        placeholder="Enter number"
                        min="0"
                      />
                    )}
                    
                    {question.type === "select" && question.options && (
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
                     )}
                   </div>
                  );
                })}
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