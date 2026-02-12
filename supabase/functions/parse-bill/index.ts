import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const manualText = formData.get("text") as string | null;

    let userContent: any[];

    if (file) {
      const bytes = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
      const mimeType = file.type || "image/png";

      if (mimeType === "application/pdf") {
        // For PDFs, send as base64 data
        userContent = [
          {
            type: "text",
            text: "Extract all line items from this utility bill. Return ONLY valid JSON, no markdown fences.",
          },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
        ];
      } else {
        userContent = [
          {
            type: "text",
            text: "Extract all line items from this utility bill. Return ONLY valid JSON, no markdown fences.",
          },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
        ];
      }
    } else if (manualText) {
      userContent = [
        {
          type: "text",
          text: `Extract all line items from this utility bill text. Return ONLY valid JSON, no markdown fences.\n\n${manualText}`,
        },
      ];
    } else {
      return new Response(JSON.stringify({ error: "No file or text provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a utility bill parser. Extract structured data from utility bills (gas or electric).

Return ONLY a JSON object with this exact structure (no markdown, no code fences, just raw JSON):
{
  "totalAmount": <number>,
  "utilization": <number - the base energy usage cost>,
  "type": "electric" or "gas",
  "state": "<state name>",
  "month": "<billing month>",
  "year": <billing year>,
  "surcharges": [
    { "name": "<charge name>", "amount": <number> }
  ]
}

Rules:
- "utilization" is the actual energy usage/supply charge (kWh or therms cost)
- "surcharges" includes ALL other line items: distribution, transmission, renewable energy, efficiency charges, taxes, fees, riders, etc.
- If you cannot determine the state, default to "Massachusetts"
- If you cannot determine the month/year, use the current month and year
- If you cannot determine the bill type, default to "electric"
- Make your best effort to extract accurate numbers
- All amounts should be positive numbers`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    // Parse the JSON from the AI response
    let parsed;
    try {
      // Strip markdown fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Could not parse bill data from the uploaded file. Please try manual entry.", raw: content }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add colors to surcharges
    const colors = [
      "hsl(200, 60%, 50%)", "hsl(38, 90%, 55%)", "hsl(150, 30%, 60%)",
      "hsl(280, 40%, 55%)", "hsl(340, 50%, 55%)", "hsl(220, 50%, 55%)",
      "hsl(10, 70%, 55%)", "hsl(60, 60%, 45%)", "hsl(300, 40%, 50%)",
    ];

    if (parsed.surcharges) {
      parsed.surcharges = parsed.surcharges.map((s: any, i: number) => ({
        ...s,
        color: colors[i % colors.length],
      }));
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-bill error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
