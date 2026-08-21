import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Site } from "./sites";

export type Lang = "en" | "mr" | "hi";

export const languages: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
];

type Dict = Record<string, string>;

const en: Dict = {
  appName: "Heritage Maharashtra",
  tagline: "Smart heritage & cultural tourism",
  navMap: "Explore map",
  navPlanner: "Itinerary planner",
  searchPlaceholder: "Search a fort, temple, cave or festival…",
  allCategories: "All",
  sitesShown: "sites on the map",
  legend: "Regions",
  filters: "Categories",
  addToItinerary: "Add to itinerary",
  inItinerary: "In your itinerary",
  removeFromItinerary: "Remove from itinerary",
  askAboutPlace: "Ask about this place",
  narrate: "Narrate this story",
  storyMode: "Story mode",
  culturalSignificance: "Cultural significance & legends",
  history: "History & heritage",
  practicalInfo: "Practical information",
  timings: "Timings",
  entryFee: "Entry fee",
  bestTime: "Best time to visit",
  transit: "Nearest transit",
  duration: "Typical visit",
  accessSafety: "Accessibility & safety",
  wheelchair: "Wheelchair access",
  medical: "Notes",
  advisory: "Safety advisory",
  emergency: "District emergency contact",
  yes: "Yes",
  no: "No",
  partial: "Partial",
  selectedSpots: "Selected spots",
  noSelection: "You haven't picked any spots yet. Open the map and add a few.",
  planTrip: "Plan my trip",
  days: "Number of days",
  budget: "Budget range",
  interests: "Interests",
  startCity: "Starting city / district",
  groupType: "Group type",
  regenerate: "Regenerate",
  print: "Print / export",
  generating: "Composing your itinerary…",
  itineraryTitle: "Your day-wise itinerary",
  chatTitle: "Heritage guide",
  chatPlaceholder: "Ask about timings, safety, festivals…",
  backToMap: "Back to the map",
  hours: "hrs",
};

const mr: Dict = {
  appName: "वारसा महाराष्ट्र",
  tagline: "स्मार्ट वारसा आणि सांस्कृतिक पर्यटन",
  navMap: "नकाशा पहा",
  navPlanner: "प्रवास आराखडा",
  searchPlaceholder: "किल्ला, मंदिर, लेणी किंवा उत्सव शोधा…",
  allCategories: "सर्व",
  sitesShown: "स्थळे नकाशावर",
  legend: "विभाग",
  filters: "प्रकार",
  addToItinerary: "आराखड्यात जोडा",
  inItinerary: "आराखड्यात आहे",
  removeFromItinerary: "आराखड्यातून काढा",
  askAboutPlace: "या स्थळाबद्दल विचारा",
  narrate: "ही कथा सांगा",
  storyMode: "कथा मोड",
  culturalSignificance: "सांस्कृतिक महत्त्व व दंतकथा",
  history: "इतिहास व वारसा",
  practicalInfo: "उपयुक्त माहिती",
  timings: "वेळ",
  entryFee: "प्रवेश शुल्क",
  bestTime: "भेटीचा उत्तम काळ",
  transit: "जवळचे वाहतूक स्थान",
  duration: "सरासरी भेट",
  accessSafety: "सुलभता व सुरक्षा",
  wheelchair: "व्हीलचेअर सुविधा",
  medical: "टिपा",
  advisory: "सुरक्षा सूचना",
  emergency: "जिल्हा आपत्कालीन संपर्क",
  yes: "होय",
  no: "नाही",
  partial: "अंशतः",
  selectedSpots: "निवडलेली स्थळे",
  noSelection: "अजून कोणतेही स्थळ निवडलेले नाही. नकाशा उघडा आणि जोडा.",
  planTrip: "आराखडा तयार करा",
  days: "दिवसांची संख्या",
  budget: "बजेट",
  interests: "आवडी",
  startCity: "सुरुवातीचे शहर / जिल्हा",
  groupType: "गटाचा प्रकार",
  regenerate: "पुन्हा तयार करा",
  print: "छापा / निर्यात",
  generating: "तुमचा आराखडा तयार होत आहे…",
  itineraryTitle: "तुमचा दिवसनिहाय आराखडा",
  chatTitle: "वारसा मार्गदर्शक",
  chatPlaceholder: "वेळ, सुरक्षा, उत्सवांबद्दल विचारा…",
  backToMap: "नकाशाकडे परत",
  hours: "तास",
};

const hi: Dict = {
  appName: "विरासत महाराष्ट्र",
  tagline: "स्मार्ट विरासत और सांस्कृतिक पर्यटन",
  navMap: "नक्शा देखें",
  navPlanner: "यात्रा योजना",
  searchPlaceholder: "किला, मंदिर, गुफा या उत्सव खोजें…",
  allCategories: "सभी",
  sitesShown: "स्थल नक्शे पर",
  legend: "क्षेत्र",
  filters: "श्रेणियाँ",
  addToItinerary: "योजना में जोड़ें",
  inItinerary: "योजना में है",
  removeFromItinerary: "योजना से हटाएँ",
  askAboutPlace: "इस स्थल के बारे में पूछें",
  narrate: "यह कथा सुनाएँ",
  storyMode: "कथा मोड",
  culturalSignificance: "सांस्कृतिक महत्व व दंतकथाएँ",
  history: "इतिहास व विरासत",
  practicalInfo: "व्यावहारिक जानकारी",
  timings: "समय",
  entryFee: "प्रवेश शुल्क",
  bestTime: "घूमने का सर्वोत्तम समय",
  transit: "निकटतम परिवहन",
  duration: "औसत भ्रमण",
  accessSafety: "सुगम्यता व सुरक्षा",
  wheelchair: "व्हीलचेयर सुविधा",
  medical: "टिप्पणी",
  advisory: "सुरक्षा सलाह",
  emergency: "जिला आपातकालीन संपर्क",
  yes: "हाँ",
  no: "नहीं",
  partial: "आंशिक",
  selectedSpots: "चयनित स्थल",
  noSelection: "अभी कोई स्थल नहीं चुना गया। नक्शा खोलें और जोड़ें।",
  planTrip: "यात्रा योजना बनाएँ",
  days: "दिनों की संख्या",
  budget: "बजट",
  interests: "रुचियाँ",
  startCity: "प्रारंभिक शहर / जिला",
  groupType: "समूह का प्रकार",
  regenerate: "फिर बनाएँ",
  print: "प्रिंट / निर्यात",
  generating: "आपकी योजना बन रही है…",
  itineraryTitle: "आपकी दिनवार यात्रा योजना",
  chatTitle: "विरासत मार्गदर्शक",
  chatPlaceholder: "समय, सुरक्षा, उत्सवों के बारे में पूछें…",
  backToMap: "नक्शे पर वापस",
  hours: "घंटे",
};

const dicts: Record<Lang, Dict> = { en, mr, hi };

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof en | string) => string;
  siteName: (site: Site) => string;
};

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("hm.lang");
    if (stored === "en" || stored === "mr" || stored === "hi") setLang(stored);
  }, []);

  const update = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem("hm.lang", l);
  };

  const value: LangCtx = {
    lang,
    setLang: update,
    t: (key) => dicts[lang][key] ?? en[key] ?? String(key),
    siteName: (site) => (lang === "en" ? site.name : site.nameTranslations[lang]),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
