export interface PropertySegment {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  sizeRange: string;
  color: string;
  colorHex: string;
  gradient: string;
  order: number;
}

export const SEGMENTS: PropertySegment[] = [
  {
    id: "nest",
    name: "Redet",
    subtitle: "The Nest",
    icon: "🐣",
    description:
      "Your first step on the property ladder. Studios and one-room apartments perfect for students and young professionals.",
    sizeRange: "20–35 m²",
    color: "nest",
    colorHex: "#F59E0B",
    gradient: "from-amber-400 to-amber-500",
    order: 1,
  },
  {
    id: "perch",
    name: "Friplassen",
    subtitle: "The Perch",
    icon: "🐦",
    description:
      "Spreading your wings. Two-room apartments with space to breathe and maybe share with a partner.",
    sizeRange: "35–55 m²",
    color: "perch",
    colorHex: "#3B82F6",
    gradient: "from-blue-400 to-blue-500",
    order: 2,
  },
  {
    id: "family",
    name: "Familiehjemmet",
    subtitle: "The Family Home",
    icon: "🏡",
    description:
      "Room for the whole flock. Three-room apartments and smaller units ideal for young families.",
    sizeRange: "55–85 m²",
    color: "family",
    colorHex: "#10B981",
    gradient: "from-emerald-400 to-emerald-500",
    order: 3,
  },
  {
    id: "villa",
    name: "Villadrømmen",
    subtitle: "The Villa Dream",
    icon: "🏠",
    description:
      "The suburban dream takes shape. Townhouses and row houses with a garden and neighbours who wave.",
    sizeRange: "85–130 m²",
    color: "villa",
    colorHex: "#8B5CF6",
    gradient: "from-violet-400 to-violet-500",
    order: 4,
  },
  {
    id: "castle",
    name: "Slottet",
    subtitle: "The Castle",
    icon: "🏰",
    description:
      "Living large. Spacious detached houses for established families who need room for kids, hobbies, and a home office.",
    sizeRange: "130–200 m²",
    color: "castle",
    colorHex: "#EC4899",
    gradient: "from-pink-400 to-pink-500",
    order: 5,
  },
  {
    id: "crown",
    name: "Kronjuvelen",
    subtitle: "The Crown Jewel",
    icon: "👑",
    description:
      "The pinnacle of property life. Luxury villas with premium locations, architectural flair, and all the trimmings.",
    sizeRange: "200+ m²",
    color: "crown",
    colorHex: "#F97316",
    gradient: "from-orange-400 to-orange-600",
    order: 6,
  },
];

export function getSegmentById(id: string): PropertySegment | undefined {
  return SEGMENTS.find((s) => s.id === id);
}
