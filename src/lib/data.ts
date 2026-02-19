// Central source type used across the app
export type PriceSource = "finn" | "ssb" | "solgt" | "combined";

export const PRICE_SOURCES: PriceSource[] = [
  "combined",
  "finn",
  "solgt",
  "ssb",
];

export interface SourceInfo {
  label: string;
  icon: string;
  description: string;
  url: string;
}

export const SOURCE_INFO: Record<PriceSource, SourceInfo> = {
  combined: {
    label: "Kombinert",
    icon: "",
    description: "Vektet snitt av alle kilder",
    url: "",
  },
  finn: {
    label: "Finn.no",
    icon: "🔍",
    description:
      "Utlyste priser (prisantydning) fra boligannonser på Finn.no",
    url: "https://www.finn.no/realestate/homes/search.html",
  },
  solgt: {
    label: "Solgtpris",
    icon: "🏷️",
    description:
      "Faktiske salgspriser fra Finn.no solgt-sider og Kartverkets tinglysingsdata",
    url: "https://www.kartverket.no/eiendom/eiendomsdata",
  },
  ssb: {
    label: "SSB",
    icon: "📊",
    description:
      "Offisiell boligprisstatistikk fra Statistisk sentralbyrå (tabell 07241)",
    url: "https://www.ssb.no/statbank/table/07241/",
  },
};

export function getSourceLabel(source: PriceSource): string {
  const info = SOURCE_INFO[source];
  return info.icon ? `${info.icon} ${info.label}` : info.label;
}

export interface PriceDataPoint {
  year: number;
  quarter: string;
  label: string;
  price: number; // NOK per m²
}

export interface SegmentPriceData {
  segmentId: string;
  municipalityId: string;
  source: PriceSource;
  data: PriceDataPoint[];
}

// Base prices per m² (2019 Q1)
// Oslo segments use Oslo prices directly.
// Nesodden segments: base prices set so that × Nesodden multiplier (0.6) gives
// realistic Nesodden per-m² prices.
const BASE_PRICES: Record<string, number> = {
  // Oslo apartments
  bachelor: 72000,
  couple: 68000,
  upsizer: 62000,
  luxury: 65000,
  // Nesodden (base ÷ 0.6 = Nesodden 2019 price per m²)
  "nesodden-leilighet": 62000, // → 37,200 kr/m² × ~65m² ≈ 2.4M (2019)
  "nesodden-tomannsbolig": 55000, // → 33,000 kr/m² × ~120m² ≈ 4.0M (2019)
  "nesodden-enebolig-sm": 75000, // → 45,000 kr/m² × ~140m² ≈ 6.3M (2019)
  "nesodden-enebolig-md": 81000, // → 48,600 kr/m² × ~175m² ≈ 8.5M (2019)
  "nesodden-enebolig-lg": 84000, // → 50,400 kr/m² × ~220m² ≈ 11.1M (2019)
};

// Municipality multiplier relative to Oslo
const MUNICIPALITY_MULTIPLIERS: Record<string, number> = {
  oslo: 1.0,
  nesodden: 0.6,
};

// Quarterly growth rates by segment (28 quarters: 2019 Q1 – 2025 Q4)
const QUARTERLY_GROWTH: Record<string, number[]> = {
  // Oslo apartments
  bachelor: [
    0.012, 0.008, 0.015, 0.01, -0.005, 0.02, 0.035, 0.025, 0.04, 0.03,
    0.025, 0.02, 0.015, 0.01, -0.01, -0.015, -0.008, 0.005, 0.012, 0.018,
    0.02, 0.015, 0.01, 0.008, 0.01, 0.012, 0.008, 0.006,
  ],
  couple: [
    0.01, 0.007, 0.012, 0.008, -0.008, 0.015, 0.03, 0.022, 0.035, 0.028,
    0.022, 0.018, 0.012, 0.008, -0.012, -0.018, -0.01, 0.003, 0.01, 0.015,
    0.018, 0.012, 0.008, 0.006, 0.008, 0.01, 0.007, 0.005,
  ],
  upsizer: [
    0.015, 0.01, 0.018, 0.012, -0.003, 0.025, 0.04, 0.03, 0.038, 0.032,
    0.028, 0.022, 0.018, 0.012, -0.008, -0.012, -0.005, 0.008, 0.015, 0.02,
    0.022, 0.018, 0.014, 0.01, 0.012, 0.015, 0.01, 0.008,
  ],
  luxury: [
    0.02, 0.015, 0.022, 0.018, 0.0, 0.035, 0.05, 0.04, 0.045, 0.038, 0.032,
    0.028, 0.022, 0.018, -0.003, -0.005, -0.001, 0.012, 0.02, 0.025, 0.028,
    0.022, 0.018, 0.015, 0.018, 0.02, 0.015, 0.012,
  ],
  // Nesodden: apartments follow a similar pattern to Oslo couple
  "nesodden-leilighet": [
    0.01, 0.007, 0.013, 0.009, -0.006, 0.016, 0.032, 0.023, 0.036, 0.029,
    0.023, 0.019, 0.013, 0.009, -0.011, -0.016, -0.009, 0.004, 0.011, 0.016,
    0.019, 0.013, 0.009, 0.007, 0.009, 0.011, 0.008, 0.006,
  ],
  // Tomannsbolig: moderate suburban growth
  "nesodden-tomannsbolig": [
    0.014, 0.009, 0.016, 0.011, -0.004, 0.022, 0.038, 0.028, 0.036, 0.03,
    0.025, 0.02, 0.016, 0.012, -0.006, -0.01, -0.004, 0.007, 0.014, 0.018,
    0.02, 0.016, 0.013, 0.01, 0.013, 0.015, 0.01, 0.008,
  ],
  // Eneboliger: strong post-COVID surge, house-with-garden premium
  "nesodden-enebolig-sm": [
    0.016, 0.01, 0.018, 0.013, -0.002, 0.028, 0.042, 0.032, 0.04, 0.034,
    0.028, 0.023, 0.018, 0.014, -0.004, -0.007, -0.002, 0.009, 0.016, 0.02,
    0.023, 0.018, 0.015, 0.011, 0.014, 0.016, 0.011, 0.009,
  ],
  "nesodden-enebolig-md": [
    0.018, 0.012, 0.02, 0.015, -0.001, 0.032, 0.046, 0.036, 0.043, 0.036,
    0.03, 0.025, 0.02, 0.016, -0.003, -0.005, -0.001, 0.011, 0.018, 0.022,
    0.025, 0.02, 0.017, 0.013, 0.016, 0.018, 0.013, 0.01,
  ],
  "nesodden-enebolig-lg": [
    0.02, 0.014, 0.022, 0.017, 0.0, 0.035, 0.05, 0.04, 0.046, 0.038, 0.032,
    0.027, 0.022, 0.018, -0.002, -0.004, 0.0, 0.013, 0.02, 0.024, 0.027,
    0.022, 0.018, 0.015, 0.018, 0.02, 0.015, 0.012,
  ],
};

// Small deterministic variation per municipality to make data feel real
function jitter(base: number, amplitude: number): number {
  const seed = Math.sin(base * 9301 + 49297) % 1;
  return base * (1 + seed * amplitude);
}

function generateSegmentData(
  segmentId: string,
  municipalityId: string,
  source: PriceSource
): SegmentPriceData {
  const basePrice = BASE_PRICES[segmentId] || 60000;
  const muni = MUNICIPALITY_MULTIPLIERS[municipalityId] || 0.6;
  const growth = QUARTERLY_GROWTH[segmentId] || QUARTERLY_GROWTH["couple"];

  // Source variation:
  // Finn = listing prices, slightly higher
  // Solgt = actual sold prices, typically ~3% below listing
  // SSB = official stats, conservative
  const sourceMultiplier =
    source === "finn"
      ? 1.02
      : source === "solgt"
        ? 0.97
        : source === "ssb"
          ? 0.98
          : 1.0;

  let price = basePrice * muni * sourceMultiplier;
  const data: PriceDataPoint[] = [];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  for (let yearIdx = 0; yearIdx < 7; yearIdx++) {
    const year = 2019 + yearIdx;
    for (let q = 0; q < 4; q++) {
      const idx = yearIdx * 4 + q;
      if (idx >= growth.length) break;
      price = price * (1 + growth[idx]);
      const jitteredPrice = jitter(
        price,
        0.005 * (municipalityId === "oslo" ? 0.5 : 1)
      );
      data.push({
        year,
        quarter: quarters[q],
        label: `${year} ${quarters[q]}`,
        price: Math.round(jitteredPrice),
      });
    }
  }

  return { segmentId, municipalityId, source, data };
}

// Get latest price for a segment/municipality combo
export function getLatestPrice(
  segmentId: string,
  municipalityId: string,
  source: PriceSource = "combined"
): number {
  const data = generateSegmentData(segmentId, municipalityId, source);
  return data.data[data.data.length - 1]?.price ?? 0;
}

// Get price change percentage over last N quarters
export function getPriceChange(
  segmentId: string,
  municipalityId: string,
  quarters: number = 4,
  source: PriceSource = "combined"
): number {
  const data = generateSegmentData(segmentId, municipalityId, source);
  const points = data.data;
  if (points.length < quarters + 1) return 0;
  const current = points[points.length - 1].price;
  const previous = points[points.length - 1 - quarters].price;
  return ((current - previous) / previous) * 100;
}

// Get total appreciation from start to end
export function getTotalAppreciation(
  segmentId: string,
  municipalityId: string,
  source: PriceSource = "combined"
): number {
  const data = generateSegmentData(segmentId, municipalityId, source);
  const points = data.data;
  if (points.length < 2) return 0;
  const first = points[0].price;
  const last = points[points.length - 1].price;
  return ((last - first) / first) * 100;
}

// Format NOK price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(price);
}
