import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDevice } from "@/hooks/useDevice";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Verify from "./pages/Verify";
import Promissory from "./pages/Promissory";
import Login from "./components/Login";
import Register from "./components/Register";
import Prices from "./pages/Prices";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import FooterPage from "./pages/FooterPage";
import Receipts from "./pages/Receipts";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isMobile } = useDevice();

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await checkAdminStatus(session.user.id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking session:", error);
      setLoading(false);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: adminData, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!adminData);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HashRouter>
          <div className={`min-h-screen flex flex-col ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
            {isAdmin ? <AdminNavbar session={session} /> : <Navbar isAdmin={isAdmin} session={session} />}
            <main className={`flex-1 ${isMobile ? 'px-4 py-4' : 'px-4 sm:px-6 lg:px-8 py-6'}`}>
              <Routes>
                <Route
                  path="/"
                  element={session ? (isAdmin ? <Navigate to="/admin" replace /> : <Index />) : <Landing />}
                />
                <Route path="/verify/:id" element={<Verify />} />
                <Route
                  path="/promissory"
                  element={session && !isAdmin ? <Promissory /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/login"
                  element={session ? <Navigate to="/dashboard" replace /> : <Login />}
                />
                <Route
                  path="/admin-login"
                  element={session && isAdmin ? <Navigate to="/admin" replace /> : <AdminLogin />}
                />
                <Route
                  path="/register"
                  element={session ? <Navigate to="/dashboard" replace /> : <Register />}
                />
                <Route path="/prices" element={<Prices />} />
                <Route
                  path="/admin"
                  element={session && isAdmin ? <Admin /> : <Navigate to="/admin-login" replace />}
                />
                <Route
                  path="/dashboard"
                  element={session && !isAdmin ? <Dashboard /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/receipts"
                  element={session && !isAdmin ? <Receipts /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/payment"
                  element={session && !isAdmin ? <Payment /> : <Navigate to="/" replace />}
                />
                <Route path="/page/:slug" element={<FooterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
            <Sonner />
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;