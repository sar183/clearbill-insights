import { Shield, X, Eye, EyeOff, Database, Lock } from "lucide-react";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy = ({ isOpen, onClose }: PrivacyPolicyProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-secondary">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display font-bold text-lg text-foreground">How Your Data Is Used</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-3">
            <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-1">What We Extract</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you upload a bill, we extract only: total amount, individual line-item charges, surcharges, and fees. We read your utility type and service state to provide accurate comparisons.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <EyeOff className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-1">What We Don't Keep</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your name, address, account number, and any other personally identifiable information is never stored. Uploaded bill images are processed in-memory and discarded immediately after extraction.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Database className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-1">How Data Is Stored</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Extracted bill data is stored only in your browser's local session. Nothing is sent to external servers beyond what's needed for bill parsing. No account or login is required.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-sm text-foreground mb-1">How Data Is Used</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your bill data is used solely to generate your personal cost breakdown, state comparisons, and contextual policy impact estimates. We do not sell, share, or monetize your data in any way.
              </p>
            </div>
          </div>

          <div className="bg-secondary rounded-xl p-4 text-center text-sm text-muted-foreground font-medium">
            🔒 No account required. No data sold. Ever.
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-display font-semibold"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
