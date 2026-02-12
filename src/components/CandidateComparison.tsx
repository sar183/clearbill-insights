import { Vote, TrendingUp, TrendingDown, Minus, Calendar, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ElectionData } from "@/data/mockData";

interface CandidateComparisonProps {
  elections: ElectionData[];
  loading?: boolean;
  state?: string;
}

const CandidateComparison = ({ elections, loading, state }: CandidateComparisonProps) => {
  const election = elections[0];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-secondary">
          <Vote className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">Election & Energy Positions</h2>
          <p className="text-sm text-muted-foreground">
            {state ? `Candidate energy policies in ${state}` : "Neutral comparison of candidate energy policies"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading {state} election data...</p>
        </div>
      ) : !election || !election.candidates?.length ? (
        <p className="text-sm text-muted-foreground text-center py-8">No upcoming election data available for {state || "this state"}.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            {election.title} — {election.date}
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <div style={{ minWidth: "600px" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Policy Topic</TableHead>
                    {election.candidates.map((c) => (
                      <TableHead key={c.name}>
                        <div>
                          <span className="font-display font-semibold text-foreground">{c.name}</span>
                          <br />
                          <span className="text-xs font-normal text-muted-foreground">{c.party} • {c.position}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {election.candidates[0]?.energyPolicies?.map((_, topicIndex) => (
                    <TableRow key={topicIndex}>
                      <TableCell className="font-medium text-foreground text-sm">
                        {election.candidates[0].energyPolicies[topicIndex].topic}
                      </TableCell>
                      {election.candidates.map((candidate) => {
                        const policy = candidate.energyPolicies[topicIndex];
                        if (!policy) return <TableCell key={candidate.name} />;
                        const ImpactIcon = policy.impactDirection === "increase" ? TrendingUp : policy.impactDirection === "decrease" ? TrendingDown : Minus;
                        const impactColor = policy.impactDirection === "increase" ? "text-destructive" : policy.impactDirection === "decrease" ? "text-success" : "text-muted-foreground";
                        return (
                          <TableCell key={candidate.name}>
                            <p className="text-sm text-foreground">{policy.stance}</p>
                            <span className={`flex items-center gap-1 text-xs font-semibold mt-1 ${impactColor}`}>
                              <ImpactIcon className="w-3 h-3" />
                              {policy.estimatedImpact}
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 italic">
            Impact estimates are based on publicly available policy proposals and independent analyses. All figures are approximate and presented for informational purposes only.
          </p>
        </>
      )}
    </div>
  );
};

export default CandidateComparison;
