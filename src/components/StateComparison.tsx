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
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm min-w-0 overflow-hidden">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-secondary shrink-0">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display font-semibold text-lg text-foreground">State Comparison</h2>
          <p className="text-sm text-muted-foreground truncate">See what you'd pay in another state</p>
        </div>
      </div>

      {/* Comparison Selector - stack vertically in sidebar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your State</p>
          <p className="font-display font-semibold text-sm text-foreground">{userState}</p>
          <p className="text-base font-display font-bold text-foreground mt-1">${userBill.toFixed(0)}/mo</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${saving ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
            {saving ? `Save $${Math.abs(difference).toFixed(0)}/mo` : `+$${Math.abs(difference).toFixed(0)}/mo more`}
          </span>
        </div>

        <div className="bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Compare With</p>
          <Select value={compareState} onValueChange={setCompareState}>
            <SelectTrigger className="w-full border border-border mb-1 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {stateRates.filter((s) => s.state !== userState).map((s) => (
                <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-base font-display font-bold text-foreground">${estimatedBill.toFixed(0)}/mo</p>
        </div>
      </div>

      {/* Surcharge Comparison */}
      {userStateData && compareStateData && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="bg-secondary rounded-xl p-3 flex justify-between items-center gap-2">
            <span className="text-xs text-foreground truncate">Surcharges in {userStateData.abbreviation}</span>
            <span className="text-xs font-semibold text-accent whitespace-nowrap">{userStateData.surchargePercent}%</span>
          </div>
          <div className="bg-secondary rounded-xl p-3 flex justify-between items-center gap-2">
            <span className="text-xs text-foreground truncate">Surcharges in {compareStateData.abbreviation}</span>
            <span className="text-xs font-semibold text-primary whitespace-nowrap">{compareStateData.surchargePercent}%</span>
          </div>
        </div>
      )}

      {/* State Rankings */}
      <div className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-3">
        <BarChart className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate">All States by Avg. Cost</span>
      </div>
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {sortedStates.map((state, i) => (
          <div key={state.abbreviation} className="flex items-center gap-2 text-sm py-1">
            <span className="w-5 text-xs text-muted-foreground text-right shrink-0">{i + 1}</span>
            <span className={`w-7 text-xs font-semibold shrink-0 ${state.state === userState ? "text-primary" : "text-foreground"}`}>{state.abbreviation}</span>
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden min-w-0">
              <div
                className={`h-full rounded-full transition-all ${state.state === userState ? "gradient-primary" : "bg-muted-foreground/30"}`}
                style={{ width: `${(state.avgMonthlyBill / maxBill) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-14 text-right shrink-0">${state.avgMonthlyBill}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateComparison;
