import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SiteBrief = z.object({
  id: z.string(),
  name: z.string(),
  district: z.string(),
  category: z.string(),
  lat: z.number(),
  lng: z.number(),
  avgVisitDurationHours: z.number(),
});

const ItineraryInput = z.object({
  stateName: z.string(),
  language: z.enum(["en", "mr", "hi"]),
  days: z.number().min(1).max(14),
  budget: z.string(),
  interests: z.array(z.string()),
  startCity: z.string(),
  groupType: z.string(),
  sites: z.array(SiteBrief).min(1),
});

export const generateItinerary = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ItineraryInput.parse(input))
  .handler(async ({ data }) => {
    const { callGateway, extractJson } = await import("./ai.server");
    const langName = { en: "English", mr: "Marathi", hi: "Hindi" }[data.language];

    const text = await callGateway(
      [
        {
          role: "system",
          content:
            "You are a heritage travel planner for Indian state tourism. You return ONLY valid JSON matching the requested shape. Travel times must be realistic for Indian road conditions. Never invent sites that were not supplied.",
        },
        {
          role: "user",
          content: `Plan a ${data.days}-day heritage trip in ${data.stateName}.
Starting point: ${data.startCity}
Group: ${data.groupType}
Budget: ${data.budget}
Interests: ${data.interests.join(", ") || "heritage"}
Selected sites (use all of them, grouped sensibly by geography):
${data.sites
  .map(
    (s) =>
      `- ${s.name} (${s.category}, ${s.district} district, ${s.lat},${s.lng}, ~${s.avgVisitDurationHours}h visit)`,
  )
  .join("\n")}

Return JSON:
{
  "title": string,
  "summary": string,
  "days": [
    { "day": number, "theme": string, "base": string, "travelNotes": string,
      "stops": [ { "siteId": string, "name": string, "timeSlot": string, "durationHours": number, "blurb": string, "tip": string } ] }
  ]
}
"blurb" must be written in ${langName} (2 sentences). Every other field in English. "siteId" must match the supplied ids exactly. You may add short non-site stops (meals, local market) with siteId "".`,
        },
      ],
      { json: true },
    );

    return extractJson(text) as {
      title: string;
      summary: string;
      days: {
        day: number;
        theme: string;
        base: string;
        travelNotes: string;
        stops: {
          siteId: string;
          name: string;
          timeSlot: string;
          durationHours: number;
          blurb: string;
          tip: string;
        }[];
      }[];
    };
  });

const StoryInput = z.object({
  siteName: z.string(),
  district: z.string(),
  language: z.enum(["en", "mr", "hi"]),
  legends: z.string(),
  context: z.string(),
});

export const narrateStory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => StoryInput.parse(input))
  .handler(async ({ data }) => {
    const { callGateway } = await import("./ai.server");
    const langName = { en: "English", mr: "Marathi", hi: "Hindi" }[data.language];
    const story = await callGateway([
      {
        role: "system",
        content:
          "You are a heritage storyteller. Narrate factual, vivid history in a warm oral-storytelling voice. No headings, no bullet points, no invented dates.",
      },
      {
        role: "user",
        content: `Narrate a 140-180 word story about ${data.siteName} in ${data.district} district, in ${langName}.
Known history: ${data.context}
Known legends: ${data.legends}`,
      },
    ]);
    return { story };
  });

const ChatInput = z.object({
  language: z.enum(["en", "mr", "hi"]),
  stateName: z.string(),
  siteContext: z.string().optional(),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
});

export const askGuide = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { callGateway } = await import("./ai.server");
    const langName = { en: "English", mr: "Marathi", hi: "Hindi" }[data.language];
    const reply = await callGateway([
      {
        role: "system",
        content: `You are the heritage guide for a ${data.stateName} cultural tourism platform. Answer travel, history, safety, accessibility and festival questions about ${data.stateName} concisely (max 130 words), in ${langName}. If asked about somewhere outside ${data.stateName}, say the platform currently covers ${data.stateName} only. Say plainly when you are unsure.${
          data.siteContext ? `\n\nThe traveller is currently looking at:\n${data.siteContext}` : ""
        }`,
      },
      ...data.messages,
    ]);
    return { reply };
  });
