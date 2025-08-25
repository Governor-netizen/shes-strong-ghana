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
              Share your interest below. We’ll follow up with next steps and opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:Research.shesstrong@outlook.com?subject=Research%20Interest%20-%20Student%2FYoung%20Researcher"
                className="block p-5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium mb-1">I’m a Student / Young Researcher</div>
                <div className="text-sm text-muted-foreground">Collaborate on projects and gain experience</div>
              </a>

              <a
                href="mailto:Research.shesstrong@outlook.com?subject=Research%20Interest%20-%20Breast%20Cancer%20Survivor"
                className="block p-5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium mb-1">I’m a Breast Cancer Survivor</div>
                <div className="text-sm text-muted-foreground">Join studies to help advance care and support</div>
              </a>
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
