import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  properties?: any[];
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Welcome to TrueNest. How can I help you find a property? You can ask me things like \"Show 2BHK flats in Dharampeth under 20000\" or \"Find PG near Sitabuldi\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseSearchQuery = (query: string) => {
    const lower = query.toLowerCase();
    const filters: Record<string, any> = {};

    // Location extraction
    const locations = [
      "dharampeth", "sitabuldi", "sadar", "manish nagar", "byramji town",
      "civil lines", "ramdaspeth", "seminary hills", "wardha road", "hingna",
      "laxmi nagar", "pratap nagar", "gandhibagh", "itwari", "cotton market",
    ];
    for (const loc of locations) {
      if (lower.includes(loc)) {
        filters.location = loc;
        break;
      }
    }

    // Property type
    if (lower.includes("1bhk") || lower.includes("1 bhk")) filters.type = "Apartment";
    else if (lower.includes("2bhk") || lower.includes("2 bhk")) filters.type = "Apartment";
    else if (lower.includes("3bhk") || lower.includes("3 bhk")) filters.type = "Apartment";
    else if (lower.includes("villa")) filters.type = "Villa";
    else if (lower.includes("pg") || lower.includes("hostel")) filters.type = "PG";
    else if (lower.includes("studio")) filters.type = "Studio";
    else if (lower.includes("house") || lower.includes("independent")) filters.type = "Independent House";
    else if (lower.includes("flat") || lower.includes("apartment")) filters.type = "Apartment";

    // Listing type
    if (lower.includes("buy") || lower.includes("sale") || lower.includes("purchase")) filters.listing = "Sale";
    else if (lower.includes("pg")) filters.listing = "PG";
    else if (lower.includes("rent")) filters.listing = "Rent";

    // Budget
    const budgetMatch = lower.match(/(\d+)\s*k/);
    const budgetMatch2 = lower.match(/under\s*(\d+)/);
    const budgetMatch3 = lower.match(/below\s*(\d+)/);
    if (budgetMatch) filters.maxBudget = parseInt(budgetMatch[1]) * 1000;
    else if (budgetMatch2) filters.maxBudget = parseInt(budgetMatch2[1]);
    else if (budgetMatch3) filters.maxBudget = parseInt(budgetMatch3[1]);

    return filters;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const filters = parseSearchQuery(userMsg);

      let query = supabase.from("properties").select("*");
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.type) {
        query = query.eq("property_type", filters.type);
      }
      if (filters.listing) {
        query = query.eq("listing_type", filters.listing);
      }
      if (filters.maxBudget) {
        query = query.lte("price", filters.maxBudget);
      }

      const { data, error } = await query.limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Found ${data.length} matching properties:`,
            properties: data,
          },
        ]);
      } else {
        // If no filters matched, show all properties
        if (Object.keys(filters).length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I can help you search for properties. Try asking something like:\n- Show apartments in Dharampeth\n- Find PG under 10000\n- 2BHK for rent near Sadar",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "No properties match your search. Try broadening your criteria or exploring all properties.",
            },
          ]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const formatPrice = (price: number, listing: string) => {
    if (listing === "Sale") {
      if (price >= 10000000) return `Rs.${(price / 10000000).toFixed(1)}Cr`;
      if (price >= 100000) return `Rs.${(price / 100000).toFixed(1)}L`;
    }
    return `Rs.${price.toLocaleString("en-IN")}${listing !== "Sale" ? "/mo" : ""}`;
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-foreground text-background flex items-center justify-center shadow-architectural hover:scale-105 transition-transform"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] md:w-[400px] h-[500px] bg-background border border-border flex flex-col shadow-architectural">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="text-sm font-medium text-foreground">TrueNest Assistant</h3>
              <p className="text-xs text-muted-foreground">Property search assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block max-w-[85%] text-left p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.properties && (
                  <div className="mt-2 space-y-2">
                    {msg.properties.map((p: any) => (
                      <Link
                        key={p.id}
                        to={`/property/${p.id}`}
                        onClick={() => setOpen(false)}
                        className="block border border-border p-3 hover:border-foreground transition-colors text-left"
                      >
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-xs text-foreground">{formatPrice(p.price, p.listing_type)}</span>
                          <span className="text-xs text-muted-foreground">{p.property_type}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Searching...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for properties..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
