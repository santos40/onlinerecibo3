import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ReceiptsCard } from "@/components/dashboard/ReceiptsCard";
import { MonthlyStats } from "@/components/dashboard/MonthlyStats";
import { ReceiptsChart } from "@/components/dashboard/ReceiptsChart";
import { StatsDisplay } from "@/components/dashboard/StatsDisplay";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: receipts = [] } = useQuery({
    queryKey: ["receipts"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data } = await supabase
        .from("receipts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      return data || [];
    }
  });

  const monthlyTotals = receipts.reduce((acc: any[], receipt: any) => {
    const date = new Date(receipt.created_at);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    const existingMonth = acc.find(m => m.month === monthYear);
    if (existingMonth) {
      existingMonth.total += Number(receipt.amount);
      existingMonth.count += 1;
    } else {
      acc.push({
        month: monthYear,
        total: Number(receipt.amount),
        count: 1
      });
    }
    return acc;
  }, []);

  const totalAmount = receipts.reduce((sum: number, receipt: any) => {
    return sum + Number(receipt.amount);
  }, 0);

  const planLimits = {
    start: 5,
    gold: 15,
    supergold: 50
  };

  const getRemainingReceipts = () => {
    const limit = activePlan ? planLimits[activePlan as keyof typeof planLimits] || 0 : 0;
    return Math.max(0, limit - receipts.length);
  };

  const chartData = monthlyTotals.map(({ month, total }) => ({
    month,
    total
  })).reverse();

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile) {
      setProfile(profile);
    }
  };

  const loadActivePlan = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("plan_type")
      .eq("user_id", session.user.id)
      .eq("active", true)
      .maybeSingle();

    if (error) {
      toast({
        title: "Erro ao carregar plano",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setActivePlan(data?.plan_type || null);
  };

  useEffect(() => {
    loadProfile();
    loadActivePlan();
  }, []);

  // Refresh active plan when component mounts and periodically
  useQuery({
    queryKey: ["activePlan"],
    queryFn: loadActivePlan,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <div className="grid gap-4 sm:gap-6">
        <StatsDisplay
          planType={activePlan}
          receiptCount={receipts.length}
          totalAmount={totalAmount}
          remainingReceipts={getRemainingReceipts()}
        />
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <ProfileCard 
            profile={profile} 
            activePlan={activePlan} 
            onProfileUpdate={loadProfile} 
          />
          <MonthlyStats monthlyTotals={monthlyTotals} />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1">
          <ReceiptsChart data={chartData} />
          <ReceiptsCard receipts={receipts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;