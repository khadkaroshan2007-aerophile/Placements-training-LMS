import { NextResponse } from "next/server";

// Curated voices with crystal-clear articulation and easily understandable accents
const INTERVIEW_VOICE_PRESETS: Record<string, { id: string; name: string; accent: string; description: string }> = {
  rachel: {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    accent: "American (Clear & Calm)",
    description: "Standard corporate interviewer, highly intelligible and friendly",
  },
  daniel: {
    id: "onwK4e9ZLuTAKqWW03F9",
    name: "Daniel",
    accent: "British / Neutral (Authoritative)",
    description: "Deep, formal executive interviewer tone",
  },
  george: {
    id: "JBFqnCBsd6RMkjVDRZzb",
    name: "George",
    accent: "British (Warm & Articulate)",
    description: "Measured pacing with pristine syllable clarity",
  },
  adam: {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    accent: "American (Conversational)",
    description: "Natural tech lead interviewer presence",
  },
  sarah: {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    accent: "American (Crisp & Professional)",
    description: "Sharp, modern engineering manager cadence",
  },
};

const DEFAULT_VOICE_ID = INTERVIEW_VOICE_PRESETS.rachel.id;

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({ error: "ElevenLabs API key is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { text?: string; voiceId?: string; voicePreset?: string };
    const text = typeof body.text === "string" ? body.text.trim() : "";
    
    // Resolve voice ID from preset name or direct ID
    let voiceId = DEFAULT_VOICE_ID;
    if (body.voicePreset && INTERVIEW_VOICE_PRESETS[body.voicePreset]) {
      voiceId = INTERVIEW_VOICE_PRESETS[body.voicePreset].id;
    } else if (typeof body.voiceId === "string" && body.voiceId.trim()) {
      voiceId = body.voiceId.trim();
    }

    if (!text || text.length > 2000) {
      return NextResponse.json({ error: "Invalid text length for speech synthesis." }, { status: 400 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.78, // High stability for smooth, intelligible cadence
          similarity_boost: 0.85,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("ElevenLabs TTS failed:", response.status, errText);
      return NextResponse.json({ error: "ElevenLabs TTS unavailable.", detail: errText }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS generation error:", error);
    return NextResponse.json({ error: "Could not generate speech audio." }, { status: 500 });
  }
}
