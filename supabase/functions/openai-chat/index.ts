import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const incomingMessages = Array.isArray(body?.messages) ? body.messages : [];
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";

    // Basic input validation to prevent abuse
    if (incomingMessages.length > 30) {
      return new Response(
        JSON.stringify({ error: "Too many messages. Max 30." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const totalChars = (incomingMessages.reduce((acc: number, m: any) => acc + (String(m?.content || "").length), 0) + prompt.length);
    if (totalChars > 12000) {
      return new Response(
        JSON.stringify({ error: "Request too large. Please shorten your input." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a concise, compassionate health assistant. Provide accurate, general information. Do not diagnose. When relevant, include Ghana/Sub-Saharan Africa context. If unsure, say you don't know and advise consulting a clinician.",
      },
      ...incomingMessages
        .filter((m: any) => m?.role && m?.content)
        .map((m: any) => ({ ...m, content: String(m.content).slice(0, 2000) })),
    ];

    if (prompt) {
      messages.push({ role: "user", content: prompt.slice(0, 2000) });
    }

    console.log("openai-chat: calling OpenAI with", messages.length, "messages");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return new Response(JSON.stringify({ error: "OpenAI error", detail: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("openai-chat function error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
