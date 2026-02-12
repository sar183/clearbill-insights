export interface Surcharge {
  name: string;
  amount: number;
  color: string;
}

export interface BillData {
  totalAmount: number;
  utilization: number;
  surcharges: Surcharge[];
  state: string;
  month: string;
  year: number;
  type: "electric" | "gas";
}

export const sampleBillData: BillData = {
  totalAmount: 187.43,
  utilization: 89.97,
  surcharges: [
    { name: "Distribution Charge", amount: 31.86, color: "hsl(200, 60%, 50%)" },
    { name: "Renewable Energy Surcharge", amount: 18.74, color: "hsl(38, 90%, 55%)" },
    { name: "Transition Charge", amount: 13.12, color: "hsl(150, 30%, 60%)" },
    { name: "Energy Efficiency Charge", amount: 14.99, color: "hsl(280, 40%, 55%)" },
    { name: "System Benefits Charge", amount: 7.49, color: "hsl(340, 50%, 55%)" },
    { name: "Transmission Charge", amount: 11.26, color: "hsl(220, 50%, 55%)" },
  ],
  state: "Massachusetts",
  month: "January",
  year: 2026,
  type: "electric",
};

export interface PolicyItem {
  id: string;
  title: string;
  summary: string;
  status: "proposed" | "in_committee" | "passed_one_chamber" | "passed" | "signed";
  estimatedImpact: string;
  impactDirection: "increase" | "decrease" | "neutral";
  timeline: string;
  category: string;
  state: string;
}

export const policyData: PolicyItem[] = [
  {
    id: "1",
    title: "Grid Modernization Investment Program",
    summary: "Authorizes $2.1B in smart grid upgrades funded through a new infrastructure surcharge on residential and commercial customers.",
    status: "passed_one_chamber",
    estimatedImpact: "+$6/mo",
    impactDirection: "increase",
    timeline: "Senate vote expected April 2026",
    category: "Grid Infrastructure",
    state: "Massachusetts",
  },
  {
    id: "2",
    title: "Renewable Portfolio Standard Expansion",
    summary: "Increases the state renewable energy mandate from 35% to 50% by 2030, potentially increasing the renewable energy surcharge.",
    status: "in_committee",
    estimatedImpact: "+$12/mo",
    impactDirection: "increase",
    timeline: "Committee hearing March 2026",
    category: "Renewable Mandates",
    state: "Massachusetts",
  },
  {
    id: "3",
    title: "Residential Rate Cap Act",
    summary: "Caps total surcharges at 20% of residential utility bills, potentially reducing fees for high-cost customers.",
    status: "proposed",
    estimatedImpact: "-$15/mo",
    impactDirection: "decrease",
    timeline: "Filed for 2026 session",
    category: "Rate Caps",
    state: "Massachusetts",
  },
  {
    id: "4",
    title: "Community Solar Access Act",
    summary: "Expands community solar programs, offering bill credits to participating residents and reducing reliance on traditional grid power.",
    status: "in_committee",
    estimatedImpact: "-$8/mo",
    impactDirection: "decrease",
    timeline: "Markup expected May 2026",
    category: "Renewable Mandates",
    state: "Massachusetts",
  },
  {
    id: "5",
    title: "Federal Clean Energy Tax Credit Extension",
    summary: "Extends residential clean energy tax credits through 2035, potentially offsetting some utility cost increases.",
    status: "signed",
    estimatedImpact: "-$5/mo",
    impactDirection: "decrease",
    timeline: "Effective January 2026",
    category: "Tax Credits",
    state: "Federal",
  },
];

export interface CandidateData {
  name: string;
  party: string;
  position: string;
  energyPolicies: {
    topic: string;
    stance: string;
    estimatedImpact: string;
    impactDirection: "increase" | "decrease" | "neutral";
  }[];
}

export interface ElectionData {
  title: string;
  date: string;
  candidates: CandidateData[];
}

export const electionData: ElectionData[] = [
  {
    title: "Massachusetts Governor's Race",
    date: "November 2026",
    candidates: [
      {
        name: "Andrea Campbell",
        party: "Democrat",
        position: "Attorney General",
        energyPolicies: [
          { topic: "Renewable Mandates", stance: "Expand to 60% by 2030", estimatedImpact: "+$18/mo", impactDirection: "increase" },
          { topic: "Grid Modernization", stance: "Support $2.1B investment", estimatedImpact: "+$6/mo", impactDirection: "increase" },
          { topic: "Rate Relief", stance: "Targeted low-income credits", estimatedImpact: "-$5/mo", impactDirection: "decrease" },
          { topic: "EV Infrastructure", stance: "Mandate utility EV programs", estimatedImpact: "+$3/mo", impactDirection: "increase" },
        ],
      },
      {
        name: "Chris Doughty",
        party: "Republican",
        position: "Business Owner",
        energyPolicies: [
          { topic: "Renewable Mandates", stance: "Maintain current 35% target", estimatedImpact: "$0/mo", impactDirection: "neutral" },
          { topic: "Grid Modernization", stance: "Private sector led upgrades", estimatedImpact: "-$2/mo", impactDirection: "decrease" },
          { topic: "Rate Relief", stance: "Cap surcharges at 15% of bill", estimatedImpact: "-$15/mo", impactDirection: "decrease" },
          { topic: "EV Infrastructure", stance: "Market-driven approach", estimatedImpact: "$0/mo", impactDirection: "neutral" },
        ],
      },
    ],
  },
];

export interface StateRate {
  state: string;
  abbreviation: string;
  avgMonthlyBill: number;
  surchargePercent: number;
}

export const stateRates: StateRate[] = [
  { state: "Massachusetts", abbreviation: "MA", avgMonthlyBill: 187, surchargePercent: 52 },
  { state: "Connecticut", abbreviation: "CT", avgMonthlyBill: 199, surchargePercent: 48 },
  { state: "New Hampshire", abbreviation: "NH", avgMonthlyBill: 168, surchargePercent: 38 },
  { state: "Rhode Island", abbreviation: "RI", avgMonthlyBill: 175, surchargePercent: 45 },
  { state: "New York", abbreviation: "NY", avgMonthlyBill: 178, surchargePercent: 44 },
  { state: "California", abbreviation: "CA", avgMonthlyBill: 195, surchargePercent: 49 },
  { state: "Texas", abbreviation: "TX", avgMonthlyBill: 132, surchargePercent: 18 },
  { state: "Florida", abbreviation: "FL", avgMonthlyBill: 145, surchargePercent: 22 },
  { state: "Ohio", abbreviation: "OH", avgMonthlyBill: 128, surchargePercent: 25 },
  { state: "Pennsylvania", abbreviation: "PA", avgMonthlyBill: 155, surchargePercent: 35 },
  { state: "Illinois", abbreviation: "IL", avgMonthlyBill: 142, surchargePercent: 30 },
  { state: "Georgia", abbreviation: "GA", avgMonthlyBill: 138, surchargePercent: 20 },
  { state: "North Carolina", abbreviation: "NC", avgMonthlyBill: 130, surchargePercent: 19 },
  { state: "Virginia", abbreviation: "VA", avgMonthlyBill: 140, surchargePercent: 24 },
  { state: "Michigan", abbreviation: "MI", avgMonthlyBill: 148, surchargePercent: 32 },
  { state: "Washington", abbreviation: "WA", avgMonthlyBill: 118, surchargePercent: 15 },
  { state: "Oregon", abbreviation: "OR", avgMonthlyBill: 122, surchargePercent: 17 },
  { state: "Colorado", abbreviation: "CO", avgMonthlyBill: 125, surchargePercent: 21 },
  { state: "Arizona", abbreviation: "AZ", avgMonthlyBill: 152, surchargePercent: 28 },
  { state: "Minnesota", abbreviation: "MN", avgMonthlyBill: 135, surchargePercent: 26 },
];
