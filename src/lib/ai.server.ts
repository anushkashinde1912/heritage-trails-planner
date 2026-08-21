const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function callGateway(
  messages: ChatMsg[],
  opts: { json?: boolean } = {},
): Promise<string> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const geminiKey = process.env["GEMINI_API_KEY"];

  // 1. If LOVABLE_API_KEY is present, use Lovable Gateway
  if (lovableKey) {
    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
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

  // 2. If GEMINI_API_KEY is present, call Google Gemini API directly
  if (geminiKey) {
    const systemMessage = messages.find((m) => m.role === "system");
    const userModelMessages = messages.filter((m) => m.role !== "system");

    const contents = userModelMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body: any = { contents };
    if (systemMessage) {
      body.systemInstruction = {
        parts: [{ text: systemMessage.content }],
      };
    }
    if (opts.json) {
      body.generationConfig = {
        responseMimeType: "application/json",
      };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API request failed (${res.status}): ${errorText.slice(0, 400)}`);
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
  }

  // 3. Fallback: Demo / Mock Mode
  console.warn("Neither LOVABLE_API_KEY nor GEMINI_API_KEY is set. Running in local Demo Mode.");

  const systemPrompt = messages.find((m) => m.role === "system")?.content || "";
  const userPrompt = messages.find((m) => m.role === "user")?.content || "";

  if (systemPrompt.includes("heritage travel planner") || opts.json) {
    const siteMatches = Array.from(userPrompt.matchAll(/- ([^\n(]+)/g));
    const extractedSites = siteMatches.map((m) => m[1]?.trim() || "").filter(Boolean);

    const title =
      extractedSites.length > 0
        ? `Heritage Tour: ${extractedSites.slice(0, 2).join(" & ")} and Beyond`
        : "Custom Maharashtra Heritage Itinerary (Demo)";

    const daysCount = 3;
    const daysData = [];

    const stopsPool =
      extractedSites.length > 0 ? extractedSites : ["Raigad Fort", "Ajanta Caves", "Ellora Caves"];

    for (let d = 1; d <= daysCount; d++) {
      const stopsForDay = [];
      const stopIndex = (d - 1) % stopsPool.length;
      const currentStop = stopsPool[stopIndex];
      if (!currentStop) continue;

      stopsForDay.push({
        siteId: currentStop.toLowerCase().replace(/\s+/g, "-"),
        name: currentStop,
        timeSlot: "09:30 AM - 01:30 PM",
        durationHours: 4,
        blurb: `Explore the historical wonders and architectural marvels of ${currentStop}. Feel the heritage and local stories.`,
        tip: "Keep water handy and hire a local guide for best insights.",
      });

      const nextStop = stopsPool[(stopIndex + 1) % stopsPool.length];
      if (nextStop && nextStop !== currentStop) {
        stopsForDay.push({
          siteId: nextStop.toLowerCase().replace(/\s+/g, "-"),
          name: nextStop,
          timeSlot: "03:00 PM - 05:30 PM",
          durationHours: 2.5,
          blurb: `Discover the cultural significance and heritage structures surrounding ${nextStop}.`,
          tip: "Great photo spot during sunset.",
        });
      }

      daysData.push({
        day: d,
        theme: `Exploring cultural landmarks - Day ${d}`,
        base: d === 1 ? "Pune" : d === 2 ? "Aurangabad" : "Mumbai",
        travelNotes: "Moderate driving along scenic state highways.",
        stops: stopsForDay,
      });
    }

    return JSON.stringify({
      title,
      summary: `A delightful day-by-day exploration of Maharashtra's historic sites. This plan is generated in local Demo Mode. Set your API key in .env to get full AI-powered planning.`,
      days: daysData,
    });
  }

  if (systemPrompt.includes("heritage storyteller")) {
    const siteNameMatch = userPrompt.match(/story about ([^\n,]+)/i);
    const siteName = siteNameMatch && siteNameMatch[1] ? siteNameMatch[1].trim() : "this heritage site";

    return `Welcome to the local chronicle of ${siteName}! Standing as a silent guardian of time, this historic site holds centuries of memories within its stone walls. The air here whispers tales of valor, devotion, and outstanding craftsmanship that flourished under ancient dynasties. Visitors can sense the historical weight of each archway and carved pillar. According to local folklore and timeless legends, this spot is celebrated for its deep spiritual and cultural significance, keeping the traditions alive for generations to come. Explore the grounds, listen to the echoes of the past, and marvel at the engineering genius of our ancestors.`;
  }

  return "Namaste! I am your AI Heritage Guide, currently running in local Demo Mode. You can ask me anything about the history, timings, and culture of Maharashtra. To enable real-time AI responses, please configure your LOVABLE_API_KEY or GEMINI_API_KEY in the .env file of the project root.";
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
