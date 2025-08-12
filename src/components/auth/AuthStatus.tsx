
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserLike = {
  email?: string;
  user_metadata?: Record<string, any>;
};

export default function AuthStatus() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserLike | null>(null);

  const displayName = useMemo(() => {
    const meta = user?.user_metadata || {};
    const full =
      meta.full_name ||
      meta.name ||
      [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim();
    return full || user?.email || "there";
  }, [user]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser as UserLike | null);

      if (event === "SIGNED_IN" && currentUser) {
        toast({
          title: `Welcome, ${displayName}!`,
          description: "You're now signed in.",
        });
      }

      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    // Initialize current session after listener is set
    supabase.auth.getSession().then(({ data: sessionData }) => {
      setUser((sessionData.session?.user as UserLike) ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [toast, displayName]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2 shadow-md backdrop-blur">
      <span className="text-sm text-foreground/80">Hi, {displayName}</span>
      <Button size="sm" variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
