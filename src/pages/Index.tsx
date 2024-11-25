import { useEffect, useState } from "react";
import { ReceiptForm, type ReceiptData } from "@/components/ReceiptForm";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import AuthComponent from "@/components/Auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UpgradeDialog } from "@/components/dialogs/UpgradeDialog";
import { UserStatusBanner } from "@/components/banners/UserStatusBanner";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReceiptDisplay } from "@/components/receipt/ReceiptDisplay";
import { useIndexUserManagement } from "@/hooks/useIndexUserManagement";
import { useReceiptManagement } from "@/hooks/useReceiptManagement";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    session, 
    userLogo, 
    userStatus, 
    showUpgradeDialog, 
    setShowUpgradeDialog,
    pricingPlans 
  } = useIndexUserManagement();

  const {
    receiptData,
    verificationUrl,
    handleFormSubmit
  } = useReceiptManagement({ 
    toast, 
    setShowUpgradeDialog 
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <UserStatusBanner status={userStatus} onPaymentClick={() => navigate('/payment')} />
        <PageHeader userLogo={userLogo} />

        {!session ? (
          <AuthComponent />
        ) : !receiptData ? (
          <ReceiptForm onSubmit={handleFormSubmit} />
        ) : (
          <ReceiptDisplay 
            data={receiptData} 
            verificationUrl={verificationUrl}
            isPending={userStatus === 'pending'}
            onNewReceipt={() => {
              window.location.reload();
            }}
            userId={session?.user?.id}
          />
        )}

        <UpgradeDialog 
          open={showUpgradeDialog} 
          onOpenChange={setShowUpgradeDialog}
          onUpgradeClick={() => navigate("/prices")}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Index;