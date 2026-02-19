export interface PropertySegment {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  sizeRange: string;
  priceRange?: string;
  color: string;
  colorHex: string;
  gradient: string;
  order: number;
}

// --- Oslo segments (apartments) ---

const BACHELOR: PropertySegment = {
  id: "bachelor",
  name: "Ungkarsredet",
  subtitle: "1/2-roms leilighet",
  icon: "🏠",
  description:
    "Ditt første steg på boligstigen. Små leiligheter perfekt for studenter og unge yrkesaktive.",
  sizeRange: "30–55 m²",
  color: "bachelor",
  colorHex: "#F59E0B",
  gradient: "from-amber-400 to-amber-500",
  order: 1,
};

const COUPLE: PropertySegment = {
  id: "couple",
  name: "Første samboerprosjekt",
  subtitle: "2-3 roms leilighet",
  icon: "💑",
  description:
    "Plass til to. Leiligheter med rom for å dele hverdagen med en partner.",
  sizeRange: "55–70 m²",
  priceRange: "5 000 000 – 6 500 000 kr",
  color: "couple",
  colorHex: "#3B82F6",
  gradient: "from-blue-400 to-blue-500",
  order: 2,
};

const UPSIZER: PropertySegment = {
  id: "upsizer",
  name: "Flergangsselger i oppgangstider",
  subtitle: "3-4 roms leilighet",
  icon: "📈",
  description:
    "Oppgradering i et stigende marked. Romslige leiligheter for de som har bygget egenkapital.",
  sizeRange: "70–90 m²",
  priceRange: "6 000 000 – 10 000 000 kr",
  color: "upsizer",
  colorHex: "#10B981",
  gradient: "from-emerald-400 to-emerald-500",
  order: 3,
};

const LUXURY: PropertySegment = {
  id: "luxury",
  name: "Luksusleilighet",
  subtitle: "4-roms leilighet og større",
  icon: "✨",
  description:
    "Toppen av leilighetsmarkedet. Store, eksklusive leiligheter med høy standard og attraktiv beliggenhet.",
  sizeRange: "90–130 m²",
  priceRange: "10 000 000 – 16 000 000 kr",
  color: "luxury",
  colorHex: "#8B5CF6",
  gradient: "from-violet-400 to-violet-500",
  order: 4,
};

// --- Nesodden segments ---

const NESODDEN_LEILIGHET: PropertySegment = {
  id: "nesodden-leilighet",
  name: "Leilighet",
  subtitle: "Leilighet",
  icon: "🏢",
  description:
    "Leiligheter på Nesodden. Fra små til mellomstore leiligheter i sentrale områder.",
  sizeRange: "50–80 m²",
  color: "nesodden-leilighet",
  colorHex: "#F59E0B",
  gradient: "from-amber-400 to-amber-500",
  order: 1,
};

const NESODDEN_TOMANNSBOLIG: PropertySegment = {
  id: "nesodden-tomannsbolig",
  name: "Tomannsbolig",
  subtitle: "Tomannsbolig / rekkehus",
  icon: "🏘️",
  description:
    "Tomannsboliger og rekkehus. Et steg opp fra leilighet med mer plass og ofte hage.",
  sizeRange: "100–140 m²",
  color: "nesodden-tomannsbolig",
  colorHex: "#3B82F6",
  gradient: "from-blue-400 to-blue-500",
  order: 2,
};

const NESODDEN_ENEBOLIG_SM: PropertySegment = {
  id: "nesodden-enebolig-sm",
  name: "Enebolig",
  subtitle: "7–10 mill. kr",
  icon: "🏡",
  description:
    "Rimelige eneboliger på Nesodden. Ofte eldre hus eller mindre tomter.",
  sizeRange: "120–160 m²",
  priceRange: "7 000 000 – 10 000 000 kr",
  color: "nesodden-enebolig-sm",
  colorHex: "#10B981",
  gradient: "from-emerald-400 to-emerald-500",
  order: 3,
};

const NESODDEN_ENEBOLIG_MD: PropertySegment = {
  id: "nesodden-enebolig-md",
  name: "Enebolig",
  subtitle: "10–13 mill. kr",
  icon: "🏠",
  description:
    "Mellomklasse eneboliger. Godt vedlikeholdt med attraktiv beliggenhet.",
  sizeRange: "150–200 m²",
  priceRange: "10 000 000 – 13 000 000 kr",
  color: "nesodden-enebolig-md",
  colorHex: "#8B5CF6",
  gradient: "from-violet-400 to-violet-500",
  order: 4,
};

const NESODDEN_ENEBOLIG_LG: PropertySegment = {
  id: "nesodden-enebolig-lg",
  name: "Enebolig",
  subtitle: "13–17 mill. kr",
  icon: "✨",
  description:
    "Premium eneboliger. Store hus med sjøutsikt eller attraktive tomter.",
  sizeRange: "180–260 m²",
  priceRange: "13 000 000 – 17 000 000 kr",
  color: "nesodden-enebolig-lg",
  colorHex: "#EC4899",
  gradient: "from-pink-400 to-pink-500",
  order: 5,
};

// --- Exports ---

export const OSLO_SEGMENTS: PropertySegment[] = [
  BACHELOR,
  COUPLE,
  UPSIZER,
  LUXURY,
];

export const NESODDEN_SEGMENTS: PropertySegment[] = [
  NESODDEN_LEILIGHET,
  NESODDEN_TOMANNSBOLIG,
  NESODDEN_ENEBOLIG_SM,
  NESODDEN_ENEBOLIG_MD,
  NESODDEN_ENEBOLIG_LG,
];

export const ALL_SEGMENTS: PropertySegment[] = [
  ...OSLO_SEGMENTS,
  ...NESODDEN_SEGMENTS,
];

export function getSegmentsForMunicipality(
  municipalityId: string
): PropertySegment[] {
  if (municipalityId === "oslo") return OSLO_SEGMENTS;
  if (municipalityId === "nesodden") return NESODDEN_SEGMENTS;
  return OSLO_SEGMENTS;
}

export function getSegmentById(id: string): PropertySegment | undefined {
  return ALL_SEGMENTS.find((s) => s.id === id);
}
