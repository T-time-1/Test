import { ALL_SEGMENTS, getSegmentsForMunicipality } from "./segments";
import { MUNICIPALITIES } from "./municipalities";

export interface PriceDataPoint {
  year: number;
  quarter: string;
  label: string;
  price: number; // NOK per m²
}

export interface SegmentPriceData {
  segmentId: string;
  municipalityId: string;
  source: "finn" | "ssb" | "combined";
  data: PriceDataPoint[];
}

// Realistic base prices per m² for Oslo (2019 Q1) by segment
// Calibrated so that at typical sizes, total prices align with target price ranges
const BASE_PRICES_OSLO: Record<string, number> = {
  bachelor: 72000, // ~42 m² → ~3.0M (starter segment, no fixed price range)
  couple: 68000, // ~62 m² → ~4.2M base, grows to ~5-6.5M range
  starter: 70000, // Combined bachelor+couple, ~50 m² average
  upsizer: 62000, // ~80 m² → ~5.0M base, grows to ~6-10M range
  luxury: 65000, // ~110 m² → ~7.2M base, grows to ~10-16M range
  villa: 45000, // ~160 m² → lower per m² but larger homes
};

// Municipality multiplier relative to Oslo
const MUNICIPALITY_MULTIPLIERS: Record<string, number> = {
  oslo: 1.0,
  baerum: 0.92,
  asker: 0.78,
  lillestrom: 0.62,
  "nordre-follo": 0.72,
  lorenskog: 0.65,
  nesodden: 0.6,
  drammen: 0.48,
};

// Quarterly growth rates by segment (simulate different market dynamics)
// Small apartments surged post-2020, luxury had bigger swings
const QUARTERLY_GROWTH: Record<string, number[]> = {
  // 2019 Q1-Q4, 2020 Q1-Q4, 2021 Q1-Q4, 2022 Q1-Q4, 2023 Q1-Q4, 2024 Q1-Q4, 2025 Q1-Q4
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
  // Starter: blend of bachelor and couple growth (averaged)
  starter: [
    0.011, 0.0075, 0.0135, 0.009, -0.0065, 0.0175, 0.0325, 0.0235, 0.0375,
    0.029, 0.0235, 0.019, 0.0135, 0.009, -0.011, -0.0165, -0.009, 0.004,
    0.011, 0.0165, 0.019, 0.0135, 0.009, 0.007, 0.009, 0.011, 0.0075, 0.0055,
  ],
  // Villa: suburban houses, bigger swings, strong post-COVID surge
  villa: [
    0.018, 0.012, 0.02, 0.015, -0.002, 0.03, 0.045, 0.035, 0.042, 0.035,
    0.03, 0.025, 0.02, 0.015, -0.005, -0.008, -0.003, 0.01, 0.018, 0.022,
    0.025, 0.02, 0.016, 0.012, 0.015, 0.018, 0.012, 0.01,
  ],
};

// Small random variation per municipality to make data feel more real
function jitter(base: number, amplitude: number): number {
  // Deterministic jitter based on the value itself
  const seed = Math.sin(base * 9301 + 49297) % 1;
  return base * (1 + seed * amplitude);
}

function generateSegmentData(
  segmentId: string,
  municipalityId: string,
  source: "finn" | "ssb" | "combined"
): SegmentPriceData {
  const basePrice = BASE_PRICES_OSLO[segmentId] || 60000;
  const muni = MUNICIPALITY_MULTIPLIERS[municipalityId] || 0.7;
  const growth = QUARTERLY_GROWTH[segmentId] || QUARTERLY_GROWTH["couple"];

  // Source variation: Finn tends slightly higher, SSB slightly more conservative
  const sourceMultiplier =
    source === "finn" ? 1.02 : source === "ssb" ? 0.98 : 1.0;

  let price = basePrice * muni * sourceMultiplier;
  const data: PriceDataPoint[] = [];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  for (let yearIdx = 0; yearIdx < 7; yearIdx++) {
    const year = 2019 + yearIdx;
    for (let q = 0; q < 4; q++) {
      const idx = yearIdx * 4 + q;
      if (idx >= growth.length) break;
      price = price * (1 + growth[idx]);
      // Add municipality-specific jitter
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

// Generate all price data (all segments × all municipalities)
export function getAllPriceData(): SegmentPriceData[] {
  const allData: SegmentPriceData[] = [];
  const sources: Array<"finn" | "ssb" | "combined"> = [
    "finn",
    "ssb",
    "combined",
  ];

  for (const segment of ALL_SEGMENTS) {
    for (const municipality of MUNICIPALITIES) {
      for (const source of sources) {
        allData.push(
          generateSegmentData(segment.id, municipality.id, source)
        );
      }
    }
  }

  return allData;
}

// Get price data for a specific municipality, filtered to applicable segments
export function getMunicipalitySegmentData(
  municipalityId: string,
  source: "finn" | "ssb" | "combined" = "combined"
): SegmentPriceData[] {
  const segments = getSegmentsForMunicipality(municipalityId);
  const segmentIds = new Set(segments.map((s) => s.id));
  return getAllPriceData().filter(
    (d) =>
      d.municipalityId === municipalityId &&
      d.source === source &&
      segmentIds.has(d.segmentId)
  );
}

// Get price data for a specific segment across municipalities
export function getSegmentPriceData(
  segmentId: string,
  source: "finn" | "ssb" | "combined" = "combined"
): SegmentPriceData[] {
  return getAllPriceData().filter(
    (d) => d.segmentId === segmentId && d.source === source
  );
}

// Get price data for a specific municipality across segments
export function getMunicipalityPriceData(
  municipalityId: string,
  source: "finn" | "ssb" | "combined" = "combined"
): SegmentPriceData[] {
  return getAllPriceData().filter(
    (d) => d.municipalityId === municipalityId && d.source === source
  );
}

// Get latest price for a segment/municipality combo
export function getLatestPrice(
  segmentId: string,
  municipalityId: string,
  source: "finn" | "ssb" | "combined" = "combined"
): number {
  const data = generateSegmentData(segmentId, municipalityId, source);
  return data.data[data.data.length - 1]?.price ?? 0;
}

// Get price change percentage over last N quarters
export function getPriceChange(
  segmentId: string,
  municipalityId: string,
  quarters: number = 4,
  source: "finn" | "ssb" | "combined" = "combined"
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
  source: "finn" | "ssb" | "combined" = "combined"
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

// Format price per m² shorter
export function formatPriceShort(price: number): string {
  if (price >= 1000) {
    return `${Math.round(price / 1000)}k`;
  }
  return price.toString();
}
