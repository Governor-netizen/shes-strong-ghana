import { useState } from "react";
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
  ArrowRight,
  Heart
} from "lucide-react";

const questions = [
  {
    id: "personal_history",
    title: "Personal Medical History",
    questions: [
      { id: "breast_cancer", label: "Have you been diagnosed with breast cancer?", type: "boolean" },
      { id: "ovarian_cancer", label: "Have you been diagnosed with ovarian cancer?", type: "boolean" },
      { id: "age_first_period", label: "Age when you first started menstruating", type: "number" },
      { id: "pregnancies", label: "Number of pregnancies", type: "number" },
      { id: "breastfeeding", label: "Did you breastfeed?", type: "boolean" }
    ]
  },
  {
    id: "family_history",
    title: "Family Medical History",
    questions: [
      { id: "mother_breast_cancer", label: "Mother diagnosed with breast cancer", type: "boolean" },
      { id: "mother_age", label: "Age when mother was diagnosed (if applicable)", type: "number" },
      { id: "sister_breast_cancer", label: "Sister(s) diagnosed with breast cancer", type: "boolean" },
      { id: "grandmother_breast_cancer", label: "Grandmother diagnosed with breast cancer", type: "boolean" },
      { id: "family_ovarian", label: "Family history of ovarian cancer", type: "boolean" }
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle Factors",
    questions: [
      { id: "alcohol", label: "Do you consume alcohol regularly?", type: "boolean" },
      { id: "smoking", label: "Do you smoke or have you smoked?", type: "boolean" },
      { id: "exercise", label: "How often do you exercise?", type: "select", options: ["Never", "1-2 times/week", "3-4 times/week", "Daily"] },
      { id: "diet", label: "How would you describe your diet?", type: "select", options: ["Mostly processed foods", "Mixed", "Mostly healthy", "Very healthy"] }
    ]
  }
];

export default function FamilyHistory() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | null>(null);
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRisk = () => {
    let riskScore = 0;
    
    // Personal history factors
    if (answers.breast_cancer) riskScore += 3;
    if (answers.ovarian_cancer) riskScore += 2;
    if (answers.age_first_period && answers.age_first_period < 12) riskScore += 1;
    if (answers.pregnancies === 0) riskScore += 1;
    if (!answers.breastfeeding) riskScore += 1;
    
    // Family history factors
    if (answers.mother_breast_cancer) riskScore += 2;
    if (answers.mother_age && answers.mother_age < 50) riskScore += 1;
    if (answers.sister_breast_cancer) riskScore += 2;
    if (answers.grandmother_breast_cancer) riskScore += 1;
    if (answers.family_ovarian) riskScore += 2;
    
    // Lifestyle factors
    if (answers.alcohol) riskScore += 1;
    if (answers.smoking) riskScore += 1;
    if (answers.exercise === "Never") riskScore += 1;
    if (answers.diet === "Mostly processed foods") riskScore += 1;
    
    if (riskScore <= 3) return "low";
    if (riskScore <= 7) return "moderate";
    return "high";
  };

  const handleSubmit = () => {
    const risk = calculateRisk();
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
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
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
                <Button className="flex-1">
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
            {currentSection.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">{question.label}</Label>
                
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
                    onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || 0)}
                    placeholder="Enter number"
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
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
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
              onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
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