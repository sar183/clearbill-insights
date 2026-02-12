import { useState, useEffect, useRef } from "react";
import { PolicyItem, ElectionData } from "@/data/mockData";
import { policyData, electionData } from "@/data/mockData";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface StateData {
  policies: PolicyItem[];
  elections: ElectionData[];
  loading: boolean;
  error: string | null;
}

export function useStateData(state: string): StateData {
  const [policies, setPolicies] = useState<PolicyItem[]>(policyData);
  const [elections, setElections] = useState<ElectionData[]>(electionData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedStates = useRef<Set<string>>(new Set(["Massachusetts"]));
  const cache = useRef<Record<string, { policies: PolicyItem[]; elections: ElectionData[] }>>({
    Massachusetts: { policies: policyData, elections: electionData },
  });

  useEffect(() => {
    if (!state || fetchedStates.current.has(state)) {
      if (cache.current[state]) {
        setPolicies(cache.current[state].policies);
        setElections(cache.current[state].elections);
      }
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/state-data`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch state data");
        }

        const data = await response.json();
        if (!cancelled) {
          const newPolicies = data.policies || policyData;
          const newElections = data.elections || electionData;
          cache.current[state] = { policies: newPolicies, elections: newElections };
          fetchedStates.current.add(state);
          setPolicies(newPolicies);
          setElections(newElections);
        }
      } catch (err: any) {
        console.error("State data fetch error:", err);
        if (!cancelled) {
          setError(err.message);
          // Fall back to default data
          setPolicies(policyData);
          setElections(electionData);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [state]);

  return { policies, elections, loading, error };
}
