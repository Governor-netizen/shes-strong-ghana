
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;

  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);

    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }

    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

async function transcribe(formData: FormData, model: string) {
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: (() => {
      const fd = new FormData();
      for (const [k, v] of formData.entries()) fd.append(k, v);
      fd.set("model", model);
      return fd;
    })(),
  });

  const text = await response.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // not json
  }

  return { ok: response.ok, bodyText: text, json };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { audio, mimeType } = await req.json();

    if (!audio) {
      throw new Error("No audio data provided");
    }

    const approxBytes = Math.floor((audio.length * 3) / 4);
    const MAX_BYTES = 15 * 1024 * 1024; // ~15MB
    if (approxBytes > MAX_BYTES) {
      return new Response(
        JSON.stringify({ error: "Audio too large. Max ~15MB base64." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);

    const type =
      typeof mimeType === "string" && mimeType.startsWith("audio/")
        ? mimeType
        : "audio/webm";

    // Build form data once; we will clone its entries per attempt
    const baseForm = new FormData();
    const blob = new Blob([binaryAudio], { type });
    baseForm.append("file", blob, "audio");
    // model will be set per attempt

    // Attempt 1: gpt-4o-mini-transcribe
    console.log("[voice-to-text] Attempting with gpt-4o-mini-transcribe; mime:", type);
    let result = await transcribe(baseForm, "gpt-4o-mini-transcribe");

    if (!result.ok) {
      console.warn("[voice-to-text] First attempt failed:", result.bodyText);
      // Attempt 2: whisper-1 fallback
      console.log("[voice-to-text] Falling back to whisper-1");
      result = await transcribe(baseForm, "whisper-1");
    }

    if (!result.ok) {
      const errMsg =
        (result.json && (result.json.error?.message || result.json.error)) ||
        result.bodyText ||
        "Transcription failed";
      throw new Error(errMsg);
    }

    const finalJson = result.json || JSON.parse(result.bodyText);
    const text = finalJson.text ?? "";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[voice-to-text] Error:", error?.message || error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
