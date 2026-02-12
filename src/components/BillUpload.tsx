import { useState, useRef } from "react";
import { Upload, Edit3, Zap, Flame, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillData, stateRates } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface BillUploadProps {
  onBillData: (data: BillData) => void;
}

const BillUpload = ({ onBillData }: BillUploadProps) => {
  const [mode, setMode] = useState<"upload" | "manual">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [manualAmount, setManualAmount] = useState("");
  const [manualState, setManualState] = useState("Massachusetts");
  const [billType, setBillType] = useState<"electric" | "gas">("electric");
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const parseBillFile = async (file: File) => {
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/parse-bill`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Failed to parse bill" }));
        throw new Error(err.error || "Failed to parse bill");
      }

      const data: BillData = await response.json();
      onBillData(data);
      toast({ title: "Bill parsed successfully!", description: `Detected ${data.surcharges?.length || 0} line items totaling $${data.totalAmount?.toFixed(2)}` });
    } catch (err: any) {
      console.error("Bill parsing error:", err);
      toast({
        title: "Could not parse bill",
        description: err.message || "Please try manual entry instead.",
        variant: "destructive",
      });
      setMode("manual");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseBillFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseBillFile(file);
  };

  const handleManualSubmit = () => {
    if (!manualAmount) return;
    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) return;
    const utilizationPercent = 0.48;
    const data: BillData = {
      totalAmount: amount,
      utilization: amount * utilizationPercent,
      surcharges: [
        { name: "Distribution Charge", amount: amount * 0.17, color: "hsl(200, 60%, 50%)" },
        { name: "Renewable Energy Surcharge", amount: amount * 0.10, color: "hsl(38, 90%, 55%)" },
        { name: "Transition Charge", amount: amount * 0.07, color: "hsl(150, 30%, 60%)" },
        { name: "Energy Efficiency Charge", amount: amount * 0.08, color: "hsl(280, 40%, 55%)" },
        { name: "System Benefits Charge", amount: amount * 0.04, color: "hsl(340, 50%, 55%)" },
        { name: "Transmission Charge", amount: amount * 0.06, color: "hsl(220, 50%, 55%)" },
      ],
      state: manualState,
      month: "January",
      year: 2026,
      type: billType,
    };
    onBillData(data);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-secondary">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">Analyze Your Bill</h2>
          <p className="text-sm text-muted-foreground">Upload or enter your utility bill details</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-secondary rounded-lg p-1 mb-6">
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
            mode === "upload" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Bill
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
            mode === "manual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Enter Manually
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isParsing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            isParsing
              ? "border-primary bg-primary/5 cursor-wait"
              : dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
          {isParsing ? (
            <>
              <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
              <p className="text-sm font-medium text-foreground">Analyzing your bill with AI...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Drop your bill here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Accepts PDF and image files (JPG, PNG)</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Bill Type</label>
              <div className="flex bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setBillType("electric")}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
                    billType === "electric" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Electric
                </button>
                <button
                  onClick={() => setBillType("gas")}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all ${
                    billType === "gas" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" /> Gas
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Monthly Bill Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  placeholder="e.g. 650"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">State</label>
            <Select value={manualState} onValueChange={setManualState}>
              <SelectTrigger className="w-full border border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {stateRates.map((s) => (
                  <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={handleManualSubmit}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-display font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Analyze My Bill
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        🔒 Your personal information (name, address, account number) is never stored.
      </p>
    </div>
  );
};

export default BillUpload;
