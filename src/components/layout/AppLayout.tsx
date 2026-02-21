import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
    if (!isLoading && user && !user.onboardingComplete) navigate("/onboarding");
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-orbitron text-sm">Initializing AI Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}
