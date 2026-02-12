import { useState } from "react";
import { FileText, TrendingUp, TrendingDown, Minus, Clock, Loader2 } from "lucide-react";
import { PolicyItem } from "@/data/mockData";

const statusLabels: Record<string, string> = {
  proposed: "Proposed",
  in_committee: "In Committee",
  passed_one_chamber: "Passed One Chamber",
  passed: "Passed Both Chambers",
  signed: "Signed Into Law",
};

const statusClasses: Record<string, string> = {
  proposed: "bg-muted text-muted-foreground",
  in_committee: "bg-info/15 text-info",
  passed_one_chamber: "bg-accent/15 text-accent-foreground",
  passed: "bg-success/15 text-success",
  signed: "bg-primary/15 text-primary",
};

interface PolicyFeedProps {
  policies: PolicyItem[];
  loading?: boolean;
  state?: string;
}

const PolicyFeed = ({ policies, loading, state }: PolicyFeedProps) => {
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...Array.from(new Set(policies.map((p) => p.category)))];
  const filtered = filter === "all" ? policies : policies.filter((p) => p.category === filter);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-secondary">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">Policy & Legislative Tracker</h2>
          <p className="text-sm text-muted-foreground">
            {state ? `Proposals affecting utility costs in ${state}` : "Proposals that could affect your utility costs"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading {state} policy data...</p>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filter === cat
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Policies" : cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PolicyCard = ({ policy }: { policy: PolicyItem }) => {
  const ImpactIcon = policy.impactDirection === "increase" ? TrendingUp : policy.impactDirection === "decrease" ? TrendingDown : Minus;
  const impactColor = policy.impactDirection === "increase" ? "text-destructive" : policy.impactDirection === "decrease" ? "text-success" : "text-muted-foreground";

  return (
    <div className="border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display font-semibold text-sm text-foreground">{policy.title}</h3>
        <span className={`flex items-center gap-1 text-xs font-semibold whitespace-nowrap ${impactColor}`}>
          <ImpactIcon className="w-3.5 h-3.5" />
          {policy.estimatedImpact}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{policy.summary}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`px-2.5 py-1 rounded-full font-medium ${statusClasses[policy.status] || "bg-muted text-muted-foreground"}`}>
          {statusLabels[policy.status] || policy.status}
        </span>
        <span className="text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> {policy.timeline}
        </span>
        <span className="text-muted-foreground">{policy.state}</span>
      </div>
    </div>
  );
};

export default PolicyFeed;
