import { BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BillData } from "@/data/mockData";

interface BillBreakdownProps {
  bill: BillData;
}

const BillBreakdown = ({ bill }: BillBreakdownProps) => {
  const surchargeTotal = bill.surcharges.reduce((sum, s) => sum + s.amount, 0);
  const utilizationPercent = ((bill.utilization / bill.totalAmount) * 100).toFixed(1);
  const surchargePercent = ((surchargeTotal / bill.totalAmount) * 100).toFixed(1);

  const chartData = [
    { name: "Energy Usage", value: bill.utilization, color: "hsl(174, 62%, 40%)" },
    ...bill.surcharges.map((s) => ({ name: s.name, value: s.amount, color: s.color })),
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-secondary">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">Your Bill Breakdown</h2>
          <p className="text-sm text-muted-foreground">
            {bill.month} {bill.year} • {bill.state} • {bill.type === "electric" ? "Electric" : "Gas"}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">${bill.totalAmount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Bill</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-primary">${bill.utilization.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Actual Usage</p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-accent">${surchargeTotal.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Fees & Surcharges</p>
        </div>
      </div>

      {/* Highlight Bar */}
      <div className="flex items-start gap-3 bg-accent/10 rounded-xl p-4 mb-6">
        <span className="text-xl">⚡</span>
        <p className="text-sm text-foreground">
          <strong>{surchargePercent}%</strong> of your bill goes to surcharges and fees — only{" "}
          <strong>{utilizationPercent}%</strong> is for actual energy you used.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(180, 12%, 89%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "hsl(174, 62%, 40%)" }} />
            <span className="text-sm text-foreground flex-1">Energy Usage</span>
            <span className="text-sm font-semibold text-foreground">${bill.utilization.toFixed(2)}</span>
          </div>
          {bill.surcharges.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-sm text-foreground flex-1">{s.name}</span>
              <span className="text-sm font-semibold text-foreground">${s.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillBreakdown;
