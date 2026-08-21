export type SiteCategory =
  | "fort"
  | "temple"
  | "cave"
  | "museum"
  | "festival"
  | "craft"
  | "nature";

export type Site = {
  id: string;
  name: string;
  nameTranslations: { mr: string; hi: string };
  district: string;
  category: SiteCategory;
  lat: number;
  lng: number;
  shortDescription: string;
  longDescription: string;
  legendsText: string;
  images: string[];
  timings: string;
  entryFee: string;
  bestTimeToVisit: string;
  nearestTransit: string;
  accessibility: { wheelchairAccess: "yes" | "no" | "partial"; notes: string };
  safety: { advisoryText: string; emergencyContact: string };
  avgVisitDurationHours: number;
};

export const categoryLabels: Record<SiteCategory, string> = {
  fort: "Forts",
  temple: "Temples",
  cave: "Caves",
  museum: "Museums",
  festival: "Festivals",
  craft: "Crafts",
  nature: "Nature",
};

import catFort from "@/assets/cat-fort.jpg";
import catTemple from "@/assets/cat-temple.jpg";
import catCave from "@/assets/cat-cave.jpg";
import catMuseum from "@/assets/cat-museum.jpg";
import catFestival from "@/assets/cat-festival.jpg";
import catCraft from "@/assets/cat-craft.jpg";
import catNature from "@/assets/cat-nature.jpg";

/**
 * Placeholder artwork per category. Swap a site's `images` array for real
 * photography whenever it becomes available — nothing else needs to change.
 */
export const categoryImages: Record<SiteCategory, string> = {
  fort: catFort,
  temple: catTemple,
  cave: catCave,
  museum: catMuseum,
  festival: catFestival,
  craft: catCraft,
  nature: catNature,
};

const img = (_q: string) => "";

const rawSites: Site[] = [

  {
    id: "raigad-fort",
    name: "Raigad Fort",
    nameTranslations: { mr: "रायगड किल्ला", hi: "रायगढ़ किला" },
    district: "Raigarh",
    category: "fort",
    lat: 18.2341,
    lng: 73.4405,
    shortDescription:
      "The hill capital of the Maratha empire, crowned by Chhatrapati Shivaji Maharaj's coronation court.",
    longDescription:
      "Rising 820 metres above the Sahyadri valleys, Raigad was chosen by Chhatrapati Shivaji Maharaj as his capital in 1674. The fort holds the ruins of the royal court, the Bazaar Peth, the Jagadishwar temple and the samadhi of Shivaji Maharaj. A ropeway now carries visitors up the sheer western face in four minutes.",
    legendsText:
      "The Takmak Tok cliff, from which the guilty were said to be flung, and the whispered acoustics of the Raj Sabha where the throne once stood, are the two stories every guide on Raigad still tells.",
    images: [img("photo-1600100397608-f010cca24ce9"), img("photo-1548013146-72479768bada")],
    timings: "8:00 AM – 6:00 PM daily",
    entryFee: "₹25 per person; ropeway ₹400 return",
    bestTimeToVisit: "October to February",
    nearestTransit: "Mahad bus stand (25 km); Veer railway station (45 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Ropeway reaches the plateau, but the fort surface is uneven rock and steps.",
    },
    safety: {
      advisoryText: "Avoid cliff edges in monsoon fog; carry water, there are few stalls on top.",
      emergencyContact: "Raigad district control room: 02141-222118",
    },
    avgVisitDurationHours: 4,
  },
  {
    id: "ajanta-caves",
    name: "Ajanta Caves",
    nameTranslations: { mr: "अजिंठा लेणी", hi: "अजंता गुफाएँ" },
    district: "Aurangabad",
    category: "cave",
    lat: 20.5519,
    lng: 75.7033,
    shortDescription:
      "Thirty rock-cut Buddhist caves in a horseshoe gorge, holding India's finest surviving ancient painting.",
    longDescription:
      "Carved between the 2nd century BCE and 6th century CE, the Ajanta caves combine chaityas and viharas with murals of the Jataka tales. Rediscovered in 1819 by a British hunting party, the site is a UNESCO World Heritage monument and the reference point for classical Indian painting.",
    legendsText:
      "Cave 1's Padmapani bodhisattva, eyes lowered in compassion, is said to have been painted by artists who worked only by reflected sunlight bounced off polished metal sheets.",
    images: [img("photo-1590766940554-634a7ed41450"), img("photo-1524492412937-b28074a5d7da")],
    timings: "9:00 AM – 5:30 PM, closed Mondays",
    entryFee: "₹40 Indian nationals; ₹600 foreign nationals",
    bestTimeToVisit: "November to March",
    nearestTransit: "Jalgaon railway station (60 km); Aurangabad airport (100 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Ramps and palanquin service to the main terrace; interiors have steps and thresholds.",
    },
    safety: {
      advisoryText: "Flash photography is prohibited; the gorge path gets slippery after rain.",
      emergencyContact: "Aurangabad tourist police: 0240-2331513",
    },
    avgVisitDurationHours: 4,
  },
  {
    id: "ellora-caves",
    name: "Ellora Caves",
    nameTranslations: { mr: "वेरूळ लेणी", hi: "एलोरा गुफाएँ" },
    district: "Aurangabad",
    category: "cave",
    lat: 20.0268,
    lng: 75.1779,
    shortDescription:
      "Thirty-four Buddhist, Hindu and Jain caves, including the monolithic Kailasa temple carved top-down.",
    longDescription:
      "Ellora's basalt escarpment holds 34 excavations from the 6th to 11th centuries. Cave 16, the Kailasa temple, was cut downward out of a single rock, removing an estimated 200,000 tonnes of stone — the largest monolithic excavation on earth.",
    legendsText:
      "Local tradition holds that Kailasa was finished in a single lifetime after a queen vowed to fast until she could see the temple's shikhara.",
    images: [img("photo-1609920658906-8223bd289001"), img("photo-1582510003544-4d00b7f74220")],
    timings: "6:00 AM – 6:00 PM, closed Tuesdays",
    entryFee: "₹40 Indian nationals; ₹600 foreign nationals",
    bestTimeToVisit: "June to March",
    nearestTransit: "Aurangabad city (30 km) by road",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Kailasa courtyard is reachable by ramp; upper storeys are stepped.",
    },
    safety: {
      advisoryText: "Monkeys snatch food near cave 15 — keep bags closed.",
      emergencyContact: "Aurangabad tourist police: 0240-2331513",
    },
    avgVisitDurationHours: 4,
  },
  {
    id: "shaniwar-wada",
    name: "Shaniwar Wada",
    nameTranslations: { mr: "शनिवार वाडा", hi: "शनिवार वाड़ा" },
    district: "Pune",
    category: "fort",
    lat: 18.5195,
    lng: 73.8553,
    shortDescription: "The fortified seat of the Peshwas in the heart of old Pune.",
    longDescription:
      "Built in 1732 by Bajirao I, Shaniwar Wada was the political centre of the Maratha confederacy until 1818. A fire in 1828 consumed the wooden palace, leaving the granite base, the Delhi Darwaza and the lotus fountain foundations.",
    legendsText:
      "Pune folklore insists the cry of the young Peshwa Narayanrao — 'kaka mala vachva' — can still be heard within the walls on full-moon nights.",
    images: [img("photo-1567157577867-05ccb1388e66"), img("photo-1587474260584-136574528ed5")],
    timings: "8:00 AM – 6:30 PM; light & sound show 7:15 PM",
    entryFee: "₹25 Indian nationals; ₹300 foreign nationals",
    bestTimeToVisit: "August to February",
    nearestTransit: "Pune Junction railway station (3 km)",
    accessibility: {
      wheelchairAccess: "yes",
      notes: "Level lawns and paved paths across most of the enclosure.",
    },
    safety: {
      advisoryText: "Crowded on weekends; watch belongings near the main gate.",
      emergencyContact: "Pune police control: 020-26126296",
    },
    avgVisitDurationHours: 1.5,
  },
  {
    id: "gateway-of-india",
    name: "Gateway of India",
    nameTranslations: { mr: "गेटवे ऑफ इंडिया", hi: "गेटवे ऑफ़ इंडिया" },
    district: "Mumbai",
    category: "museum",
    lat: 18.922,
    lng: 72.8347,
    shortDescription: "Mumbai's basalt arch on the Apollo Bunder waterfront, completed in 1924.",
    longDescription:
      "Designed by George Wittet in an Indo-Saracenic idiom, the Gateway commemorated the 1911 royal visit and later watched the last British regiment leave India in 1948. Ferries to Elephanta Island depart from the jetty beside it.",
    legendsText:
      "The arch was meant to be the ceremonial entrance to India; it ended up being remembered chiefly as an exit.",
    images: [img("photo-1570168007204-dfb528c6958f"), img("photo-1529253355930-ddbe423a2ac7")],
    timings: "Open 24 hours",
    entryFee: "Free",
    bestTimeToVisit: "November to February, early morning",
    nearestTransit: "Churchgate & CSMT stations (~3 km); ferry jetty adjacent",
    accessibility: {
      wheelchairAccess: "yes",
      notes: "Flat paved plaza; ferry boarding requires assistance.",
    },
    safety: {
      advisoryText: "High security zone, bags are screened; avoid unlicensed ferry touts.",
      emergencyContact: "Mumbai police: 100 / 022-22621855",
    },
    avgVisitDurationHours: 1,
  },
  {
    id: "cst-mumbai",
    name: "Chhatrapati Shivaji Maharaj Terminus",
    nameTranslations: {
      mr: "छत्रपती शिवाजी महाराज टर्मिनस",
      hi: "छत्रपति शिवाजी महाराज टर्मिनस",
    },
    district: "Mumbai",
    category: "museum",
    lat: 18.9398,
    lng: 72.8355,
    shortDescription: "A UNESCO-listed Victorian Gothic railway cathedral, still a working terminus.",
    longDescription:
      "Completed in 1888 to F.W. Stevens' design, CSMT fuses Venetian Gothic with Mughal detail — gargoyles, peacock windows, and a stone dome crowned by 'Progress'. Over three million commuters pass through it each day.",
    legendsText:
      "The stone lion and tiger flanking the gates were carved to represent Britain and India; guides note the tiger looks distinctly unimpressed.",
    images: [img("photo-1595658658481-d53d3f999875"), img("photo-1566552881560-0be862a7c445")],
    timings: "Heritage gallery 3:00 PM – 5:00 PM, weekdays",
    entryFee: "₹200 heritage tour",
    bestTimeToVisit: "November to February",
    nearestTransit: "CSMT local and mainline station",
    accessibility: {
      wheelchairAccess: "yes",
      notes: "Ramps and lifts on the concourse; heritage wing has a stair-only staircase.",
    },
    safety: {
      advisoryText: "Extremely crowded 8–11 AM and 6–9 PM; photography restricted on platforms.",
      emergencyContact: "Railway helpline: 139",
    },
    avgVisitDurationHours: 1.5,
  },
  {
    id: "elephanta-caves",
    name: "Elephanta Caves",
    nameTranslations: { mr: "घारापुरी लेणी", hi: "एलिफेंटा गुफाएँ" },
    district: "Raigarh",
    category: "cave",
    lat: 18.9633,
    lng: 72.9315,
    shortDescription: "Island rock-cut Shaiva caves famous for the three-headed Trimurti Sadashiva.",
    longDescription:
      "An hour by ferry from the Gateway of India, Gharapuri island holds seven caves excavated between the 5th and 8th centuries. The 6-metre Trimurti panel — creator, preserver, destroyer — is among the greatest sculptures of the subcontinent.",
    legendsText:
      "The Portuguese named the island after a stone elephant on its shore; the elephant now stands in Mumbai's Bhau Daji Lad museum garden.",
    images: [img("photo-1580060839134-75a5edca2e99"), img("photo-1561361058-c24cecae35ca")],
    timings: "9:00 AM – 5:30 PM, closed Mondays",
    entryFee: "₹40 Indian nationals; ₹600 foreign nationals; ferry ₹260 return",
    bestTimeToVisit: "November to March",
    nearestTransit: "Ferry from Gateway of India (60 min)",
    accessibility: {
      wheelchairAccess: "no",
      notes: "120 steps from the jetty; palanquin carriers available for a fee.",
    },
    safety: {
      advisoryText: "Ferries suspend during monsoon; last boat back leaves at 5:30 PM.",
      emergencyContact: "Coast guard: 1554",
    },
    avgVisitDurationHours: 4,
  },
  {
    id: "mahalaxmi-kolhapur",
    name: "Mahalaxmi Temple, Kolhapur",
    nameTranslations: { mr: "श्री महालक्ष्मी मंदिर", hi: "महालक्ष्मी मंदिर" },
    district: "Kolhapur",
    category: "temple",
    lat: 16.6949,
    lng: 74.2222,
    shortDescription: "A 7th-century Shakti Peetha where sunlight strikes the deity twice a year.",
    longDescription:
      "The Ambabai temple was built by the Chalukyas around 700 CE in black basalt with later Yadava and Maratha additions. It is one of the six Shakti Peethas where devotees may both worship and ask for the fulfilment of desire.",
    legendsText:
      "During Kiranotsav, on set days in January and November, the setting sun aligns with the west door and falls directly on the goddess's feet, then her torso, then her face.",
    images: [img("photo-1621996346565-e3dbc353d2e5"), img("photo-1609619385002-f40f1df9b7eb")],
    timings: "4:30 AM – 10:30 PM",
    entryFee: "Free; ₹100 for expedited darshan",
    bestTimeToVisit: "October to February; Navratri for the festival",
    nearestTransit: "Kolhapur railway station (3 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Ramped side entrance; the inner sanctum queue has steps.",
    },
    safety: {
      advisoryText: "Very heavy footfall during Navratri; leave footwear at designated stands.",
      emergencyContact: "Kolhapur control room: 0231-2661333",
    },
    avgVisitDurationHours: 1.5,
  },
  {
    id: "sindhudurg-fort",
    name: "Sindhudurg Fort",
    nameTranslations: { mr: "सिंधुदुर्ग किल्ला", hi: "सिंधुदुर्ग किला" },
    district: "Sindhudurg",
    category: "fort",
    lat: 16.0433,
    lng: 73.4626,
    shortDescription: "A sea fort built on a rocky islet off Malvan, with walls set in molten lead.",
    longDescription:
      "Commissioned by Shivaji Maharaj in 1664, Sindhudurg covers 48 acres of tidal rock. Its curving ramparts were laid so that no cannon could get a straight shot, and it holds the only temple in India dedicated to Shivaji Maharaj himself.",
    legendsText:
      "Handprints and footprints of Shivaji Maharaj, pressed into wet lime at the gate, are still preserved under a small canopy.",
    images: [img("photo-1616432043562-3671ea2e5242"), img("photo-1544986581-efac024faf62")],
    timings: "9:00 AM – 5:00 PM; boats subject to tide",
    entryFee: "₹50 boat fare; fort entry free",
    bestTimeToVisit: "November to May",
    nearestTransit: "Malvan jetty; Kudal railway station (32 km)",
    accessibility: {
      wheelchairAccess: "no",
      notes: "Boat boarding and a stepped gate make wheelchair access impractical.",
    },
    safety: {
      advisoryText: "Boats do not run in rough seas; wear life jackets provided at the jetty.",
      emergencyContact: "Sindhudurg control room: 02362-228847",
    },
    avgVisitDurationHours: 3,
  },
  {
    id: "lonar-crater",
    name: "Lonar Crater Lake",
    nameTranslations: { mr: "लोणार सरोवर", hi: "लोनार झील" },
    district: "Buldana",
    category: "nature",
    lat: 19.9761,
    lng: 76.5083,
    shortDescription:
      "A 50,000-year-old meteorite crater holding a lake that is both saline and alkaline.",
    longDescription:
      "The only hypervelocity impact crater in basaltic rock on earth, Lonar is 1.8 km wide and ringed by Chalukya-era temples. Its water chemistry is unique, and in 2020 the lake briefly turned pink as halophilic bacteria bloomed.",
    legendsText:
      "The Padma Purana names the crater as the spot where Vishnu, as Daityasudan, crushed the demon Lonasura into the earth.",
    images: [img("photo-1470071459604-3b5ec3a7fe05"), img("photo-1441974231531-c6227db76b6e")],
    timings: "Sunrise to sunset",
    entryFee: "Free",
    bestTimeToVisit: "October to February",
    nearestTransit: "Jalna railway station (90 km); Aurangabad (140 km)",
    accessibility: {
      wheelchairAccess: "no",
      notes: "The rim viewpoint is drivable; descending to the lake is a rough 30-minute trail.",
    },
    safety: {
      advisoryText: "Do not descend alone after dark; the water is not safe for swimming.",
      emergencyContact: "Buldana control room: 07262-242222",
    },
    avgVisitDurationHours: 3,
  },
  {
    id: "trimbakeshwar",
    name: "Trimbakeshwar Temple",
    nameTranslations: { mr: "त्र्यंबकेश्वर मंदिर", hi: "त्र्यंबकेश्वर मंदिर" },
    district: "Nashik",
    category: "temple",
    lat: 19.9403,
    lng: 73.5303,
    shortDescription: "One of the twelve Jyotirlingas, at the source of the Godavari river.",
    longDescription:
      "Rebuilt in black basalt by Peshwa Balaji Bajirao in the 1750s, Trimbakeshwar's lingam carries three faces — Brahma, Vishnu and Shiva. The Kushavarta kund in its courtyard is treated as the true origin of the Godavari.",
    legendsText:
      "Sage Gautama is said to have brought the Godavari down to this hillside to atone for the accidental death of a cow.",
    images: [img("photo-1604608672516-f1b9b1a0a3a3"), img("photo-1602216056096-3b40cc0c9944")],
    timings: "5:30 AM – 9:00 PM",
    entryFee: "Free; ₹200 for the Rudrabhishek queue",
    bestTimeToVisit: "October to March; Kumbh Mela years draw millions",
    nearestTransit: "Nashik Road railway station (40 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Ramp at the east gate; sanctum entry is stepped and restricted.",
    },
    safety: {
      advisoryText: "Mobile phones and cameras are not permitted inside the temple.",
      emergencyContact: "Nashik rural control: 0253-2309100",
    },
    avgVisitDurationHours: 2,
  },
  {
    id: "sinhagad-fort",
    name: "Sinhagad Fort",
    nameTranslations: { mr: "सिंहगड किल्ला", hi: "सिंहगढ़ किला" },
    district: "Pune",
    category: "fort",
    lat: 18.3664,
    lng: 73.7554,
    shortDescription: "The 'lion's fort' above Pune, site of Tanaji Malusare's night assault of 1670.",
    longDescription:
      "Perched at 1,312 metres on the Bhuleshwar range, Sinhagad guards the routes between Pune and the Konkan. Its Kalyan and Pune darwazas, Tanaji's memorial and the Dev Take cistern survive, and the ridge is a favourite sunrise trek.",
    legendsText:
      "Tanaji's monitor lizard Yashwanti is said to have carried the first rope up the Donagiri cliff; Shivaji's lament — 'the fort is won but the lion is gone' — gave the fort its name.",
    images: [img("photo-1519681393784-d120267933ba"), img("photo-1464822759023-fed622ff2c3b")],
    timings: "5:00 AM – 6:00 PM",
    entryFee: "Free; vehicle entry ₹50",
    bestTimeToVisit: "July to February",
    nearestTransit: "Pune (35 km) by road via Khadakwasla",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "A motorable road reaches the top plateau; fort paths are rocky.",
    },
    safety: {
      advisoryText: "Ghat road is fog-bound in monsoon; two-wheelers are restricted on some days.",
      emergencyContact: "Pune rural control: 020-26122880",
    },
    avgVisitDurationHours: 3,
  },
  {
    id: "bibi-ka-maqbara",
    name: "Bibi Ka Maqbara",
    nameTranslations: { mr: "बीबी का मकबरा", hi: "बीबी का मक़बरा" },
    district: "Aurangabad",
    category: "museum",
    lat: 19.9012,
    lng: 75.3203,
    shortDescription: "Aurangzeb's son's marble mausoleum for his mother, the 'Taj of the Deccan'.",
    longDescription:
      "Built in 1660 by Prince Azam Shah for Dilras Banu Begum, the tomb echoes the Taj Mahal at a smaller scale — marble on the lower storey, plastered basalt above, set in a charbagh garden with axial water channels.",
    legendsText:
      "The architect Ata-ullah is said to have been the son of the Taj Mahal's designer, working under a budget one-twentieth the size.",
    images: [img("photo-1524492412937-b28074a5d7da"), img("photo-1548013146-72479768bada")],
    timings: "8:00 AM – 8:00 PM",
    entryFee: "₹25 Indian nationals; ₹300 foreign nationals",
    bestTimeToVisit: "October to March",
    nearestTransit: "Aurangabad railway station (5 km)",
    accessibility: {
      wheelchairAccess: "yes",
      notes: "Paved garden paths; the tomb plinth has a short flight of steps.",
    },
    safety: {
      advisoryText: "Open lawns get very hot in April–May; carry water.",
      emergencyContact: "Aurangabad tourist police: 0240-2331513",
    },
    avgVisitDurationHours: 1.5,
  },
  {
    id: "deekshabhoomi",
    name: "Deekshabhoomi, Nagpur",
    nameTranslations: { mr: "दीक्षाभूमी", hi: "दीक्षाभूमि" },
    district: "Nagpur",
    category: "temple",
    lat: 21.1273,
    lng: 79.0603,
    shortDescription:
      "The great white stupa marking Dr Ambedkar's conversion to Buddhism in 1956.",
    longDescription:
      "On 14 October 1956, Dr B.R. Ambedkar and around 400,000 followers took the Buddhist vows here. The domed stupa, completed in 2001 and modelled on Sanchi, is the largest hollow stupa in the world.",
    legendsText:
      "Every Dhamma Chakra Pravartan Din, lakhs of pilgrims walk the grounds barefoot, carrying blue flags — one of the largest peaceful gatherings in India.",
    images: [img("photo-1582510003544-4d00b7f74220"), img("photo-1609920658906-8223bd289001")],
    timings: "6:00 AM – 9:00 PM",
    entryFee: "Free",
    bestTimeToVisit: "October to February; Vijayadashami for the anniversary",
    nearestTransit: "Nagpur railway station (5 km)",
    accessibility: {
      wheelchairAccess: "yes",
      notes: "Ramps to the stupa base and accessible washrooms.",
    },
    safety: {
      advisoryText: "Anniversary crowds are enormous; plan travel a day ahead.",
      emergencyContact: "Nagpur police control: 0712-2561222",
    },
    avgVisitDurationHours: 1.5,
  },
  {
    id: "paithani-yeola",
    name: "Paithani Weaving Village, Yeola",
    nameTranslations: { mr: "येवला पैठणी विणकाम", hi: "येवला पैठनी बुनाई" },
    district: "Nashik",
    category: "craft",
    lat: 20.0424,
    lng: 74.4894,
    shortDescription: "Handloom workshops where a single silk-and-zari Paithani takes months.",
    longDescription:
      "Yeola's weaver quarters keep alive the Paithani sari, a tapestry technique from the Satavahana period. Motifs — peacock, lotus, parrot — are woven with pure gold or silver zari, entirely by hand, on pit looms.",
    legendsText:
      "Peshwa-era records describe Paithani as being traded weight-for-weight against gold in the ports of the Deccan.",
    images: [img("photo-1610030469983-98e550d6193c"), img("photo-1595341888016-a392ef81b7de")],
    timings: "10:00 AM – 6:00 PM, workshops closed Sundays",
    entryFee: "Free to observe; saris from ₹8,000",
    bestTimeToVisit: "September to February",
    nearestTransit: "Manmad railway station (25 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Some workshops are in narrow lanes with a step at the entrance.",
    },
    safety: {
      advisoryText: "Buy from registered co-operatives to avoid powerloom imitations.",
      emergencyContact: "Nashik rural control: 0253-2309100",
    },
    avgVisitDurationHours: 2,
  },
  {
    id: "pandharpur-wari",
    name: "Pandharpur Vithoba Temple & Wari",
    nameTranslations: { mr: "पंढरपूर विठ्ठल मंदिर", hi: "पंढरपुर विट्ठल मंदिर" },
    district: "Solapur",
    category: "festival",
    lat: 17.6785,
    lng: 75.3243,
    shortDescription:
      "The Varkari pilgrimage centre on the Chandrabhaga, endpoint of the annual Wari march.",
    longDescription:
      "The Vitthal-Rukmini temple has drawn Varkari devotees since at least the 13th century. Each Ashadhi Ekadashi, palkhis carrying the sandals of Sant Dnyaneshwar and Sant Tukaram converge here after a 250-km walk with hundreds of thousands of pilgrims.",
    legendsText:
      "Vitthal is said to still be standing on the brick Pundalik placed for him, waiting patiently while a devoted son served his parents first.",
    images: [img("photo-1609619385002-f40f1df9b7eb"), img("photo-1621996346565-e3dbc353d2e5")],
    timings: "Temple 4:00 AM – 11:00 PM",
    entryFee: "Free",
    bestTimeToVisit: "Ashadhi Ekadashi (June/July) for the Wari; winter otherwise",
    nearestTransit: "Pandharpur railway station (2 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Ramped darshan queue; extremely difficult during festival weeks.",
    },
    safety: {
      advisoryText: "Wari crowds require pre-booked stay; follow police queue routing strictly.",
      emergencyContact: "Solapur control room: 0217-2731000",
    },
    avgVisitDurationHours: 2.5,
  },
  {
    id: "pratapgad-fort",
    name: "Pratapgad Fort",
    nameTranslations: { mr: "प्रतापगड किल्ला", hi: "प्रतापगढ़ किला" },
    district: "Satara",
    category: "fort",
    lat: 17.9361,
    lng: 73.5786,
    shortDescription: "The Sahyadri fort where Shivaji Maharaj met Afzal Khan in 1659.",
    longDescription:
      "Completed in 1656 above the Par and Kinesvari valleys, Pratapgad has an upper and lower fort, a Bhavani temple endowed by Shivaji Maharaj, and bastions that fall away 250 metres to dense forest.",
    legendsText:
      "The meeting pavilion below the fort marks where the wagh nakh — tiger claws — turned an embrace into the decisive act of the Maratha rise.",
    images: [img("photo-1600100397608-f010cca24ce9"), img("photo-1519681393784-d120267933ba")],
    timings: "8:00 AM – 6:00 PM",
    entryFee: "Free",
    bestTimeToVisit: "September to February",
    nearestTransit: "Mahabaleshwar (24 km); Satara railway station (75 km)",
    accessibility: {
      wheelchairAccess: "no",
      notes: "Roughly 500 steps from the car park to the upper fort.",
    },
    safety: {
      advisoryText: "Leeches and slippery steps in monsoon; mist reduces visibility sharply.",
      emergencyContact: "Satara control room: 02162-233833",
    },
    avgVisitDurationHours: 3,
  },
  {
    id: "bhaja-karla-caves",
    name: "Bhaja & Karla Caves",
    nameTranslations: { mr: "भाजे व कार्ले लेणी", hi: "भाजा व कार्ला गुफाएँ" },
    district: "Pune",
    category: "cave",
    lat: 18.7511,
    lng: 73.4776,
    shortDescription:
      "Early Hinayana rock-cut chaityas on the Bhor ghat trade route, from the 2nd century BCE.",
    longDescription:
      "Bhaja's 22 excavations include a barrel-vaulted chaitya with wooden ribs still in place, and a group of stupas commemorating resident monks. Karla, across the valley, holds India's largest early chaitya hall with a 15-metre lion pillar at its entrance.",
    legendsText:
      "The caves were funded by merchant guilds and even by individual traders whose names are still legible in Brahmi script above the doorways.",
    images: [img("photo-1561361058-c24cecae35ca"), img("photo-1580060839134-75a5edca2e99")],
    timings: "8:00 AM – 6:00 PM",
    entryFee: "₹25 Indian nationals; ₹300 foreign nationals",
    bestTimeToVisit: "July to February",
    nearestTransit: "Malavli railway station (3 km from Bhaja)",
    accessibility: {
      wheelchairAccess: "no",
      notes: "Both sites require a stepped climb of 15–20 minutes.",
    },
    safety: {
      advisoryText: "Waterfall pools near Bhaja are dangerous in heavy rain.",
      emergencyContact: "Pune rural control: 020-26122880",
    },
    avgVisitDurationHours: 3,
  },
  {
    id: "aundha-nagnath",
    name: "Aundha Nagnath Temple",
    nameTranslations: { mr: "औंढा नागनाथ मंदिर", hi: "औंढा नागनाथ मंदिर" },
    district: "Hingoli",
    category: "temple",
    lat: 19.5372,
    lng: 77.0403,
    shortDescription: "A Hemadpanthi Jyotirlinga temple in Marathwada with dense figural carving.",
    longDescription:
      "Rebuilt in the Yadava period on older foundations, Aundha Nagnath is counted among the twelve Jyotirlingas. Its plinth carries bands of dancers, elephants and epic scenes, and the sanctum sits below the courtyard level.",
    legendsText:
      "The Pandavas are said to have built the original shrine during their exile, which is why the temple faces an unusual direction.",
    images: [img("photo-1602216056096-3b40cc0c9944"), img("photo-1604608672516-f1b9b1a0a3a3")],
    timings: "4:00 AM – 9:00 PM",
    entryFee: "Free",
    bestTimeToVisit: "November to February; Mahashivratri",
    nearestTransit: "Hingoli railway station (25 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Courtyard is level; the sunken sanctum is reached by steps.",
    },
    safety: {
      advisoryText: "Limited facilities nearby — carry essentials from Hingoli.",
      emergencyContact: "Hingoli control room: 02456-222333",
    },
    avgVisitDurationHours: 1.5,
  },
  {
    id: "tadoba",
    name: "Tadoba Andhari Tiger Reserve",
    nameTranslations: { mr: "ताडोबा अंधारी व्याघ्र प्रकल्प", hi: "ताडोबा अंधारी बाघ अभयारण्य" },
    district: "Chandrapur",
    category: "nature",
    lat: 20.2167,
    lng: 79.3333,
    shortDescription: "Maharashtra's oldest national park, with a temple to the god Taru at its heart.",
    longDescription:
      "Declared a national park in 1955, Tadoba's teak and bamboo forest supports one of India's densest tiger populations along with sloth bear, gaur and marsh crocodile. Jeep safaris run from six gates around the core zone.",
    legendsText:
      "Gond villagers name the forest after Taru, a headman said to have died fighting a tiger; his shrine stands beside Tadoba lake.",
    images: [img("photo-1549366021-9f761d040a94"), img("photo-1470071459604-3b5ec3a7fe05")],
    timings: "Safari slots 6:00 AM & 3:00 PM; core zone closed Tuesdays",
    entryFee: "From ₹2,000 per jeep plus guide fee",
    bestTimeToVisit: "February to May for sightings",
    nearestTransit: "Chandrapur railway station (45 km)",
    accessibility: {
      wheelchairAccess: "partial",
      notes: "Safari jeeps require a transfer; some lodges have accessible rooms.",
    },
    safety: {
      advisoryText: "Never alight from the vehicle in the core zone; bookings must be made online.",
      emergencyContact: "Tadoba forest control: 07172-277116",
    },
    avgVisitDurationHours: 4,
  },
];

export const getSiteById = (id: string) => sites.find((s) => s.id === id);
