import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;

  useSEO({
    title: "Sign in or Create Account — She's Strong Ghana",
    description: "Access appointments, save progress, and manage your profile.",
    canonical: window.location.origin + "/auth",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo, { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.state]);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back", description: "Signed in successfully" });
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your inbox", description: "Confirm your email to finish signup." });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-medical bg-gradient-card">
        <CardHeader>
          <CardTitle>{isSignup ? "Create your account" : "Welcome back"}</CardTitle>
          <CardDescription>
            {isSignup ? "Join She's Strong Ghana to book oncologist appointments." : "Sign in to manage appointments and your profile."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button className="w-full" onClick={isSignup ? handleSignUp : handleSignIn} disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            {isSignup ? (
              <>Already have an account? <button className="underline" onClick={() => setIsSignup(false)}>Sign in</button></>
            ) : (
              <>New here? <button className="underline" onClick={() => setIsSignup(true)}>Create an account</button></>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            <Link to="/">Back to home</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
