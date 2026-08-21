const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function callGateway(
  messages: ChatMsg[],
  opts: { json?: boolean } = {},
): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this project (missing LOVABLE_API_KEY).");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("The AI guide is busy right now. Please retry shortly.");
    if (res.status === 402)
      throw new Error("AI credits for this workspace are exhausted. Please add credits in Lovable.");
    throw new Error(`AI request failed (${res.status}): ${body.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("The AI returned an empty response.");
  return text;
}

export function extractJson(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("The AI response could not be read as an itinerary.");
  }
}
