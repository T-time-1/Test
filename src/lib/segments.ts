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

export const SEGMENTS: PropertySegment[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export function getSegmentById(id: string): PropertySegment | undefined {
  return SEGMENTS.find((s) => s.id === id);
}
