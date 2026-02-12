import { ArrowRight, Shield, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25% 50%, hsla(174, 62%, 60%, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 30%, hsla(38, 90%, 55%, 0.15) 0%, transparent 40%)"
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/80 text-xs font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Understand your utility costs
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            Know Exactly What{" "}
            <span className="text-accent">You're Paying For</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your gas or electric bill and see a clear breakdown of usage vs. surcharges. Track policies that impact your costs and compare rates across states.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="gradient-accent text-primary-foreground px-8 py-3.5 rounded-xl font-display font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Analyze My Bill
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="border border-primary-foreground/30 text-primary-foreground/90 px-8 py-3.5 rounded-xl font-display font-medium text-base hover:bg-primary-foreground/10 transition-all"
            >
              Enter Manually
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-10 text-primary-foreground/50 text-sm">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> No login required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Free to use
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
