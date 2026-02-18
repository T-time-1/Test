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

// Oslo-only segments (apartments)
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

// Shared segments (used by all municipalities)
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

// Non-Oslo segments
const STARTER: PropertySegment = {
  id: "starter",
  name: "Starterleilighet",
  subtitle: "1-3 roms leilighet",
  icon: "🏠",
  description:
    "Første bolig. Fra ungkarsredet til det første samboerprosjektet – små til mellomstore leiligheter.",
  sizeRange: "30–70 m²",
  color: "starter",
  colorHex: "#F59E0B",
  gradient: "from-amber-400 to-amber-500",
  order: 1,
};

const VILLA: PropertySegment = {
  id: "villa",
  name: "Villa",
  subtitle: "Enebolig / rekkehus",
  icon: "🏡",
  description:
    "Hus med hage. Eneboliger og rekkehus for de som vil ha plass, grønt uteområde og ro.",
  sizeRange: "130+ m²",
  color: "villa",
  colorHex: "#EC4899",
  gradient: "from-pink-400 to-pink-500",
  order: 5,
};

// Oslo segments: 4 apartment categories
export const OSLO_SEGMENTS: PropertySegment[] = [
  BACHELOR,
  COUPLE,
  { ...UPSIZER, order: 3 },
  { ...LUXURY, order: 4 },
];

// Non-Oslo segments: combined starter + villa
export const OTHER_SEGMENTS: PropertySegment[] = [
  STARTER,
  { ...UPSIZER, order: 2 },
  { ...LUXURY, order: 3 },
  { ...VILLA, order: 4 },
];

// All unique segments (for data generation and lookups)
export const ALL_SEGMENTS: PropertySegment[] = [
  BACHELOR,
  COUPLE,
  STARTER,
  UPSIZER,
  LUXURY,
  VILLA,
];

// Legacy export for backwards compatibility in imports
export const SEGMENTS = OSLO_SEGMENTS;

export function getSegmentsForMunicipality(
  municipalityId: string
): PropertySegment[] {
  return municipalityId === "oslo" ? OSLO_SEGMENTS : OTHER_SEGMENTS;
}

export function getSegmentById(id: string): PropertySegment | undefined {
  return ALL_SEGMENTS.find((s) => s.id === id);
}
