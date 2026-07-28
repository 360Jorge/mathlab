import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

type AIAction = "hint" | "check_idea" | "missing_concept";

type AIRequestBody = {
  action?: AIAction;
  problemTitle?: string;
  problemText?: string;
  problemSlug?: string;
  attempt?: string;
};

function buildSystemPrompt(action: AIAction) {
  if (action === "hint") {
    return [
      "You are a math tutor.",
      "Give a short hint.",
      "Do not reveal the full solution.",
      "Focus on the next useful idea only.",
    ].join(" ");
  }

  if (action === "check_idea") {
    return [
      "You are a math tutor.",
      "Evaluate the student's current attempt.",
      "Be encouraging but precise.",
      "Point out one gap or next step.",
      "Do not give the full solution unless absolutely necessary.",
    ].join(" ");
  }

  return [
    "You are a math tutor.",
    "Identify the likely missing concept.",
    "Keep the response concise and educational.",
    "Do not reveal the full solution.",
  ].join(" ");
}

function buildUserPrompt({
  action,
  problemTitle,
  problemText,
  attempt,
}: Required<AIRequestBody>) {
  return `
Action: ${action}

Problem title:
${problemTitle}

Problem statement:
${problemText}

Student attempt:
${attempt || "(empty)"}

Respond as a math tutor. Keep it concise, helpful, and non-spoiling.
`.trim();
}

async function getSignedInUserId(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user.id;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AIRequestBody;

    const action = body.action;
    const problemTitle = body.problemTitle ?? "";
    const problemText = body.problemText ?? "";
    const problemSlug = body.problemSlug ?? "";
    const attempt = body.attempt ?? "";

    if (!action || !problemTitle || !problemText || !problemSlug) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const model = process.env.OLLAMA_MODEL ?? "gemma4:cloud";
    const apiKey = process.env.OLLAMA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OLLAMA_API_KEY on the server." },
        { status: 500 }
      );
    }

    const ollamaRes = await fetch("https://ollama.com/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
  body: JSON.stringify({
    model,
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(action),
      },
      {
        role: "user",
        content: buildUserPrompt({
          action,
          problemTitle,
          problemText,
          attempt,
          problemSlug,
        }),
      },
    ],
    stream: false,
  }),
});

  const rawText = await ollamaRes.text();

  if (!ollamaRes.ok) {
    return NextResponse.json(
      { error: `Ollama error: ${rawText}` },
      { status: ollamaRes.status }
    );
  }

  const ollamaData = JSON.parse(rawText);

  const reply =
    ollamaData?.message?.content ??
    "No reply returned.";

    const userId = await getSignedInUserId(req);

    if (userId) {
      await supabase.from("ai_interactions").insert({
        user_id: userId,
        problem_slug: problemSlug,
        action_type: action,
        attempt,
        reply,
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}