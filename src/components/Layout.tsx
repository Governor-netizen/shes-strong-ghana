import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Layout = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
