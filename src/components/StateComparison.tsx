import { useMemo, useState } from "react";
import { MapPin, ArrowRight, BarChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillData, stateRates } from "@/data/mockData";

interface StateComparisonProps {
  bill: BillData | null;
}

const StateComparison = ({ bill }: StateComparisonProps) => {
  const userState = bill?.state || "Massachusetts";
  const userBill = bill?.totalAmount || 187;
  const [compareState, setCompareState] = useState("Texas");

  const userStateData = stateRates.find((s) => s.state === userState);
  const compareStateData = stateRates.find((s) => s.state === compareState);

  const estimatedBill = useMemo(() => {
    if (!userStateData || !compareStateData) return userBill;
    return (userBill / userStateData.avgMonthlyBill) * compareStateData.avgMonthlyBill;
  }, [userBill, userStateData, compareStateData]);

  const difference = userBill - estimatedBill;
  const saving = difference > 0;

  const sortedStates = useMemo(
    () => [...stateRates].sort((a, b) => a.avgMonthlyBill - b.avgMonthlyBill),
    []
  );

  const maxBill = Math.max(...stateRates.map((s) => s.avgMonthlyBill));

  return (
    <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-secondary">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">State Comparison</h2>
          <p className="text-sm text-muted-foreground">See what you'd pay in another state</p>
        </div>
      </div>

      {/* Comparison Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-6">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your State</p>
          <p className="font-display font-semibold text-foreground">{userState}</p>
          <p className="text-lg font-display font-bold text-foreground mt-1">${userBill.toFixed(0)}/mo</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${saving ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
            {saving ? `Save $${Math.abs(difference).toFixed(0)}/mo` : `+$${Math.abs(difference).toFixed(0)}/mo more`}
          </span>
        </div>

        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Compare With</p>
          <Select value={compareState} onValueChange={setCompareState}>
            <SelectTrigger className="w-full border border-border mb-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {stateRates.filter((s) => s.state !== userState).map((s) => (
                <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-lg font-display font-bold text-foreground">${estimatedBill.toFixed(0)}/mo</p>
        </div>
      </div>

      {/* Surcharge Comparison */}
      {userStateData && compareStateData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-secondary rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-foreground">Surcharges in {userStateData.abbreviation}</span>
            <span className="text-sm font-semibold text-accent">{userStateData.surchargePercent}% of bill</span>
          </div>
          <div className="bg-secondary rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-foreground">Surcharges in {compareStateData.abbreviation}</span>
            <span className="text-sm font-semibold text-primary">{compareStateData.surchargePercent}% of bill</span>
          </div>
        </div>
      )}

      {/* State Rankings */}
      <div className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-3">
        <BarChart className="w-4 h-4 text-primary" />
        All States by Avg. Monthly Cost
      </div>
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {sortedStates.map((state, i) => (
          <div key={state.abbreviation} className="flex items-center gap-3 text-sm py-1.5">
            <span className="w-6 text-xs text-muted-foreground text-right">{i + 1}</span>
            <span className={`w-8 font-semibold ${state.state === userState ? "text-primary" : "text-foreground"}`}>{state.abbreviation}</span>
            <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${state.state === userState ? "gradient-primary" : "bg-muted-foreground/30"}`}
                style={{ width: `${(state.avgMonthlyBill / maxBill) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-16 text-right">${state.avgMonthlyBill}/mo</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateComparison;
