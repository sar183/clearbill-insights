import { useState, useRef } from "react";
import { BillData } from "@/data/mockData";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BillUpload from "@/components/BillUpload";
import BillBreakdown from "@/components/BillBreakdown";
import PolicyFeed from "@/components/PolicyFeed";
import CandidateComparison from "@/components/CandidateComparison";
import StateComparison from "@/components/StateComparison";
import ChatInterface from "@/components/ChatInterface";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { useStateData } from "@/hooks/useStateData";

const Index = () => {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("Massachusetts");

  const { policies, elections, loading } = useStateData(billData?.state || selectedState);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const policyRef = useRef<HTMLDivElement>(null);
  const electionsRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  const scrollTo = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      dashboard: dashboardRef,
      policy: policyRef,
      elections: electionsRef,
      compare: compareRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBillData = (data: BillData) => {
    setBillData(data);
    if (data.state) setSelectedState(data.state);
  };

  const currentState = billData?.state || selectedState;

  return (
    <div className="min-h-screen bg-background">
      <Header onPrivacyClick={() => setPrivacyOpen(true)} onSectionClick={scrollTo} />

      {!billData && (
        <HeroSection onGetStarted={() => scrollTo("dashboard")} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Dashboard / Upload */}
        <div ref={dashboardRef}>
          {!billData ? (
            <div className="max-w-xl mx-auto">
              <BillUpload onBillData={handleBillData} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BillBreakdown bill={billData} />
              </div>
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-sm text-foreground mb-3">Quick Actions</h3>
                  <button
                    onClick={() => setBillData(null)}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    📄 Upload a different bill
                  </button>
                  <button
                    onClick={() => scrollTo("compare")}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    🗺️ Compare with other states
                  </button>
                  <button
                    onClick={() => scrollTo("policy")}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    📋 View policy tracker
                  </button>
                </div>
                <StateComparison bill={billData} />
              </div>
            </div>
          )}
        </div>

        {/* Policy Tracker */}
        <div ref={policyRef}>
          <PolicyFeed policies={policies} loading={loading} state={currentState} />
        </div>

        {/* Elections */}
        <div ref={electionsRef}>
          <CandidateComparison elections={elections} loading={loading} state={currentState} />
        </div>

        {/* State Comparison (full width when no bill) */}
        {!billData && (
          <div ref={compareRef}>
            <StateComparison bill={null} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            ClearBill provides informational estimates only. Policy impact projections are based on publicly available data and independent analyses.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ClearBill — No login required. No data sold.
          </p>
        </div>
      </footer>

      <ChatInterface bill={billData} />
      <PrivacyPolicy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
};

export default Index;
