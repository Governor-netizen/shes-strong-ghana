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
      { id: "age_first_period", label: "Age when you first started menstruating", type: "number", info: "Early menarche (before age 12) increases risk" },
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
      { id: "weight_gain", label: "Have you gained significant weight after menopause?", type: "boolean", info: "Post-menopausal obesity increases risk" },
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
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | null>(null);
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateRisk = () => {
    let riskScore = 0;
    
    // Personal history factors (higher weights)
    if (answers.breast_cancer) riskScore += 5;
    if (answers.ovarian_cancer) riskScore += 3;
    if (answers.age_first_period && answers.age_first_period < 12) riskScore += 2;
    if (answers.pregnancies === 0 || (answers.age_first_birth && answers.age_first_birth > 30)) riskScore += 2;
    if (!answers.breastfeeding || (answers.breastfeeding_duration && answers.breastfeeding_duration < 6)) riskScore += 1;
    if (answers.contraceptive_duration && answers.contraceptive_duration >= 5) riskScore += 2;
    if (answers.radiation_exposure) riskScore += 3;
    
    // Calculate BMI and weight factors
    if (answers.current_weight && answers.height) {
      const bmi = answers.current_weight / ((answers.height / 100) ** 2);
      if (bmi >= 30) riskScore += 2; // Obesity
      else if (bmi >= 25) riskScore += 1; // Overweight
    }
    if (answers.weight_gain) riskScore += 2;
    
    // Family history & genetics (highest weights)
    if (answers.genetic_results) riskScore += 8; // BRCA positive
    if (answers.mother_breast_cancer) riskScore += 3;
    if (answers.mother_age && answers.mother_age < 50) riskScore += 2;
    if (answers.father_breast_cancer) riskScore += 2;
    if (answers.sister_breast_cancer) riskScore += 3;
    if (answers.brother_breast_cancer) riskScore += 2;
    if (answers.grandmother_breast_cancer) riskScore += 2;
    if (answers.aunt_breast_cancer) riskScore += 1;
    if (answers.family_ovarian) riskScore += 3;
    if (answers.family_prostate) riskScore += 1;
    if (answers.family_pancreatic) riskScore += 2;
    
    // Lifestyle factors
    if (answers.alcohol_frequency === "Daily") riskScore += 3;
    else if (answers.alcohol_frequency === "3-4 times/week") riskScore += 2;
    else if (answers.alcohol_frequency === "1-2 times/week") riskScore += 1;
    
    if (answers.smoking_duration && answers.smoking_duration > 10) riskScore += 2;
    else if (answers.smoking) riskScore += 1;
    
    if (answers.exercise === "Never") riskScore += 2;
    else if (answers.exercise === "1-2 times/week") riskScore += 1;
    
    if (answers.diet === "Mostly processed/fried foods") riskScore += 2;
    else if (answers.diet === "Mixed diet") riskScore += 1;
    
    if (answers.local_foods) riskScore += 1;
    
    // Medical factors
    if (answers.previous_biopsy) riskScore += 1;
    if (answers.benign_breast_disease) riskScore += 2;
    if (answers.dense_breast_tissue) riskScore += 2;
    if (answers.hormone_therapy) riskScore += 2;
    if (answers.stress_levels === "Very High") riskScore += 1;
    
    // Risk categorization (adjusted for expanded scoring)
    if (riskScore <= 5) return "low";
    if (riskScore <= 12) return "moderate";
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
                    {question.info && (
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border-l-4 border-warning">
                        <span className="font-medium">Note:</span> {question.info}
                      </p>
                    )}
                  </div>
                )}
                
                {question.type === "number" && (
                  <div className="space-y-3">
                    <Input
                      type="number"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || 0)}
                      placeholder="Enter number"
                      min="0"
                    />
                    {question.info && (
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border-l-4 border-warning">
                        <span className="font-medium">Note:</span> {question.info}
                      </p>
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
                    {question.info && (
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border-l-4 border-warning">
                        <span className="font-medium">Note:</span> {question.info}
                      </p>
                    )}
                  </div>
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