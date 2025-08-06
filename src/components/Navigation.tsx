import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Heart, 
  ClipboardList, 
  Activity, 
  Calendar, 
  BookOpen, 
  Menu,
  User
} from "lucide-react";

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Heart,
    description: "Dashboard overview"
  },
  {
    title: "Family History",
    href: "/family-history",
    icon: ClipboardList,
    description: "Assess your risk factors"
  },
  {
    title: "Symptom Tracker",
    href: "/symptoms",
    icon: Activity,
    description: "Monitor your health"
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
    description: "Schedule & manage visits"
  },
  {
    title: "Education",
    href: "/education",
    icon: BookOpen,
    description: "Learn about prevention"
  }
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const NavLinks = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              mobile ? "w-full" : "text-sm",
              isActive
                ? "bg-primary text-primary-foreground shadow-medical"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <item.icon className="h-5 w-5" />
            <div className={mobile ? "text-left" : "hidden lg:block"}>
              <div className="font-medium">{item.title}</div>
              {mobile && (
                <div className="text-xs opacity-70">{item.description}</div>
              )}
            </div>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              She's Strong
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold">She's Strong</span>
                  </div>
                  <NavLinks mobile onItemClick={() => setIsOpen(false)} />
                  <div className="border-t pt-4 mt-4">
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}