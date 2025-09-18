import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FamilyHistory from "./pages/FamilyHistory";
import Symptoms from "./pages/Symptoms";
import Appointments from "./pages/Appointments";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import Research from "./pages/Research";
import Auth from "./pages/Auth";
import Meeting from "./pages/Meeting";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAInstallPrompt />
      <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/family-history" element={<FamilyHistory />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/education" element={<Education />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/research" element={<Research />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/meeting/:roomId" element={<Meeting />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
