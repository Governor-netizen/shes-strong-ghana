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
    const body = await req.json();
    const images: string[] = Array.isArray(body?.images) ? body.images : [];
    const prompt: string = typeof body?.prompt === "string" ? body.prompt : "";

    if (!images.length) {
      return new Response(JSON.stringify({ error: "No images provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build OpenAI message with text + images (data URLs allowed)
    const userContent: any[] = [];
    if (prompt) {
      userContent.push({ type: "text", text: prompt });
    } else {
      userContent.push({ type: "text", text: "Please analyze these medical images/video frames and provide helpful, non-diagnostic insights focused on breast health. Use clear, supportive language." });
    }

    for (const url of images) {
      userContent.push({ type: "image_url", image_url: { url } });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a concise, compassionate health assistant. Provide general, educational guidance only. Do not diagnose. Note Ghana/Sub-Saharan context when helpful. If content is inappropriate or unsafe, advise seeing a clinician.",
      },
      {
        role: "user",
        content: userContent,
      },
    ];

    console.log("vision-analyze: sending", images.length, "image(s) to OpenAI");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI vision error:", errText);
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
    console.error("vision-analyze function error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
