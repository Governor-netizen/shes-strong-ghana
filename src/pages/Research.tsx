import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

export default function Research() {
  useSEO({
    title: "Join Research — She's Strong Ghana",
    description: "Students and survivors: express interest to join our research initiatives and community.",
    canonical: typeof window !== "undefined" ? `${window.location.origin}/research` : "/research",
  });

  const handleEmailClick = (subject: string) => {
    const email = "Research.shesstrong@outlook.com";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="shadow-medical bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl">Join Our Research Community</CardTitle>
            <CardDescription>
              We welcome young researchers and breast cancer survivors to participate in impactful research.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Share your interest below. We'll follow up with next steps and opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleEmailClick("Research Interest - Student/Young Researcher")}
                className="block p-5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-left"
              >
                <div className="font-medium mb-1">I'm a Student / Young Researcher</div>
                <div className="text-sm text-muted-foreground">Collaborate on projects and gain experience</div>
              </button>

              <button
                onClick={() => handleEmailClick("Research Interest - Breast Cancer Survivor")}
                className="block p-5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-left"
              >
                <div className="font-medium mb-1">I'm a Breast Cancer Survivor</div>
                <div className="text-sm text-muted-foreground">Join studies to help advance care and support</div>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button asChild variant="secondary">
                <Link to="/education">Explore Education</Link>
              </Button>
              <Button asChild className="bg-gradient-primary">
                <Link to="/family-history">Start Assessment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}