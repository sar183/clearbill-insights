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

    const { state } = await req.json();
    if (!state) {
      return new Response(JSON.stringify({ error: "State is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an energy policy research assistant. You provide factual, neutral, nonpartisan information about energy legislation and elections relevant to a specific US state.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "policies": [
    {
      "id": "<unique id>",
      "title": "<bill or policy name>",
      "summary": "<1-2 sentence neutral summary focusing on bill impact to utility costs>",
      "status": "proposed" | "in_committee" | "passed_one_chamber" | "passed" | "signed",
      "estimatedImpact": "<e.g. +$6/mo or -$10/mo>",
      "impactDirection": "increase" | "decrease" | "neutral",
      "timeline": "<expected next milestone>",
      "category": "<e.g. Grid Infrastructure, Renewable Mandates, Rate Caps, Tax Credits>",
      "state": "${state}" or "Federal"
    }
  ],
  "elections": [
    {
      "title": "<election name, e.g. Governor's Race>",
      "date": "<election date>",
      "candidates": [
        {
          "name": "<candidate name>",
          "party": "<party>",
          "position": "<current role>",
          "energyPolicies": [
            {
              "topic": "<policy area>",
              "stance": "<brief neutral description of position>",
              "estimatedImpact": "<e.g. +$5/mo>",
              "impactDirection": "increase" | "decrease" | "neutral"
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Include 4-6 policies (mix of state-level and relevant federal)
- Include 1-2 upcoming elections relevant to energy policy in this state
- Each candidate should have 3-4 energy policy positions
- All information should be factual and based on real legislation and candidates where possible
- Estimated impacts should be realistic monthly dollar amounts for residential customers
- Maintain strict neutrality - no partisan bias
- Focus on how policies affect residential utility bills
- Use current 2026 legislative sessions and upcoming elections
- If you're unsure about specific details, use realistic but clearly approximate figures`;

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
          { role: "user", content: `Provide current energy policy and election data relevant to ${state}. Focus on legislation and elections that would affect residential utility bills in ${state}.` },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Could not generate state data" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("state-data error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
