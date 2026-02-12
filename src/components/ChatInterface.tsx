import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { BillData } from "@/data/mockData";

const sampleResponses: Record<string, string> = {
  default: "I can help you understand your utility bill, track energy policies, and compare costs across states. Try asking me about specific charges on your bill or upcoming policy changes!",
  surcharge: "The **Renewable Energy Surcharge** on your Massachusetts bill covers the cost utilities incur to meet the state's Renewable Portfolio Standard (RPS). Currently, utilities must source 35% of electricity from renewable sources. This adds approximately **$18.74/month** to your bill based on your usage level.",
  high: "Several factors could be driving your bill higher:\n\n1. **Seasonal usage increases** — heating in winter months\n2. **Rate adjustments** — MA approved a 6.2% distribution rate increase in 2025\n3. **New surcharges** — The Grid Modernization surcharge was added last quarter\n\nYour surcharges now make up about 52% of your total bill.",
  candidate: "Here's a quick summary of the gubernatorial candidates' energy positions:\n\n**Andrea Campbell (D)** — Proposes expanding renewable mandates to 60% by 2030. Estimated impact: net +$18/mo increase.\n\n**Chris Doughty (R)** — Proposes capping surcharges at 15% of total bill. Estimated impact: net -$15/mo decrease.\n\nBoth candidates agree on the need for grid modernization but differ on funding mechanisms.",
  senate: "**Senate Bill 1234** (Grid Modernization Investment Program) would authorize $2.1B in smart grid upgrades funded through a new infrastructure surcharge. If passed, it's estimated to add approximately **$6/month** to residential electric bills over 10 years. The bill has passed the House and is scheduled for a Senate vote in April 2026.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("surcharge") || lower.includes("renewable")) return sampleResponses.surcharge;
  if (lower.includes("high") || lower.includes("higher") || lower.includes("increase")) return sampleResponses.high;
  if (lower.includes("candidate") || lower.includes("election") || lower.includes("governor")) return sampleResponses.candidate;
  if (lower.includes("senate") || lower.includes("bill") || lower.includes("1234")) return sampleResponses.senate;
  return sampleResponses.default;
}

interface ChatInterfaceProps {
  bill: BillData | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface = ({ bill }: ChatInterfaceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your ClearBill assistant. Ask me anything about your utility bill, energy policies, or how costs compare across states. 💡" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(userMsg) }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col" style={{ height: "500px" }}>
      {/* Header */}
      <div className="gradient-primary rounded-t-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Bot className="w-5 h-5" />
          <span className="font-display font-semibold text-sm">ClearBill Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "gradient-primary text-primary-foreground rounded-tr-sm"
                : "bg-secondary text-foreground rounded-tl-sm"
            }`}>
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-1.5" : ""}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={k}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce-dot" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce-dot" style={{ animationDelay: "0.16s" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce-dot" style={{ animationDelay: "0.32s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your bill..."
            className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={handleSend} className="gradient-primary text-primary-foreground p-2.5 rounded-full">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {["What's my renewable surcharge?", "Why is my bill high?", "Candidate positions?"].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-xs bg-secondary px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
