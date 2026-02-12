import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";

interface HeaderProps {
  onPrivacyClick: () => void;
  onSectionClick: (section: string) => void;
}

const navItems = [
  { label: "Dashboard", id: "dashboard" },
  { label: "Policy Tracker", id: "policy" },
  { label: "Elections", id: "elections" },
  { label: "Compare States", id: "compare" },
];

const Header = ({ onPrivacyClick, onSectionClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button onClick={() => onSectionClick("dashboard")} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            C
          </span>
          <span className="font-display font-bold text-lg text-foreground">ClearBill</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick(item.id)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrivacyClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
          >
            <Shield className="w-3.5 h-3.5" />
            How Your Data Is Used
          </button>
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onSectionClick(item.id); setMobileMenuOpen(false); }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground text-left rounded-md hover:bg-secondary"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onPrivacyClick(); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground text-left rounded-md hover:bg-secondary flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              How Your Data Is Used
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
