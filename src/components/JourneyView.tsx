"use client";

import { getSegmentsForMunicipality } from "@/lib/segments";
import {
  getLatestPrice,
  getTotalAppreciation,
  getPriceChange,
  formatPrice,
} from "@/lib/data";

// Typical mid-point sizes for each segment
const MID_SIZES: Record<string, number> = {
  bachelor: 42,
  couple: 62,
  starter: 50,
  upsizer: 80,
  luxury: 110,
  villa: 160,
};

interface JourneyViewProps {
  municipalityId: string;
  onMunicipalityChange: (id: string) => void;
  onSegmentClick: (id: string) => void;
}

export default function JourneyView({
  municipalityId,
  onMunicipalityChange,
  onSegmentClick,
}: JourneyViewProps) {
  const segments = getSegmentsForMunicipality(municipalityId);
  const isOslo = municipalityId === "oslo";

  // Calculate "journey cost" - total cost of climbing the property ladder
  const journeySteps = segments.map((seg) => {
    const pricePerM2 = getLatestPrice(seg.id, municipalityId);
    const midSize = MID_SIZES[seg.id] ?? 80;
    const totalPrice = pricePerM2 * midSize;
    const appreciation = getTotalAppreciation(seg.id, municipalityId);
    const yearChange = getPriceChange(seg.id, municipalityId, 4);

    return {
      segment: seg,
      pricePerM2,
      midSize,
      totalPrice,
      appreciation,
      yearChange,
    };
  });

  const totalJourneyCost = journeySteps.reduce(
    (sum, s) => sum + s.totalPrice,
    0
  );

  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white">Boligreisen</h2>
        <p className="mt-1 text-sm text-slate-400">
          {isOslo
            ? "Fra ungkarsredet til luksusleiligheten. Se hva hvert steg i boligkarrieren koster og hvordan prisene har utviklet seg."
            : "Fra starterleiligheten til villaen. Se hva hvert steg i boligkarrieren koster og hvordan prisene har utviklet seg."}
        </p>
        <div className="mt-4 journey-line" />
      </div>

      {/* Municipality selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "oslo", name: "Oslo" },
          { id: "baerum", name: "Bærum" },
          { id: "asker", name: "Asker" },
          { id: "lillestrom", name: "Lillestrøm" },
          { id: "nordre-follo", name: "Nordre Follo" },
          { id: "lorenskog", name: "Lørenskog" },
          { id: "nesodden", name: "Nesodden" },
          { id: "drammen", name: "Drammen" },
        ].map((muni) => (
          <button
            key={muni.id}
            onClick={() => onMunicipalityChange(muni.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              municipalityId === muni.id
                ? "bg-white/15 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {muni.name}
          </button>
        ))}
      </div>

      {/* Journey timeline */}
      <div className="relative space-y-4">
        {/* Vertical connector line */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-amber-400 via-emerald-400 to-violet-500 opacity-30" />

        {journeySteps.map((step, idx) => (
          <button
            key={step.segment.id}
            onClick={() => onSegmentClick(step.segment.id)}
            className="glass-card-hover relative flex w-full items-stretch gap-0 overflow-hidden text-left"
          >
            {/* Color bar */}
            <div
              className="w-1.5 shrink-0"
              style={{ backgroundColor: step.segment.colorHex }}
            />

            <div className="flex flex-1 items-center gap-4 p-5">
              {/* Step number & icon */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-3xl">{step.segment.icon}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: `${step.segment.colorHex}20`,
                    color: step.segment.colorHex,
                  }}
                >
                  STEG {idx + 1}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-white">{step.segment.name}</h3>
                <p className="text-xs text-slate-400">
                  {step.segment.subtitle} &middot; {step.segment.sizeRange}
                  {step.segment.priceRange && (
                    <span className="text-slate-500"> &middot; {step.segment.priceRange}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  {step.segment.description}
                </p>
              </div>

              {/* Prices */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    ~{step.midSize} m² bolig
                  </p>
                  <p className="text-lg font-bold text-white">
                    {formatPrice(step.totalPrice)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatPrice(step.pricePerM2)}/m²
                  </p>
                </div>

                <div className="w-20 text-right">
                  <p
                    className={`text-lg font-bold ${step.appreciation > 0 ? "price-up" : "price-down"}`}
                  >
                    {step.appreciation > 0 ? "+" : ""}
                    {step.appreciation.toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-500">siden 2019</p>
                  <p
                    className={`mt-1 text-xs font-medium ${step.yearChange > 0 ? "price-up" : step.yearChange < 0 ? "price-down" : "price-flat"}`}
                  >
                    {step.yearChange > 0 ? "↑" : step.yearChange < 0 ? "↓" : "→"}{" "}
                    {Math.abs(step.yearChange).toFixed(1)}% /år
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Journey summary */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Total boligreise-kostnad
            </h3>
            <p className="text-xs text-slate-400">
              Summen av alle {segments.length} steg (typisk størrelse per segment)
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {formatPrice(totalJourneyCost)}
            </p>
            <p className="text-xs text-slate-500">
              Fra {firstSeg.name.toLowerCase()} til {lastSeg.name.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-1">
          {journeySteps.map((step) => (
            <div
              key={step.segment.id}
              className="h-2 rounded-full"
              style={{
                backgroundColor: step.segment.colorHex,
                width: `${(step.totalPrice / totalJourneyCost) * 100}%`,
                opacity: 0.7,
              }}
              title={`${step.segment.name}: ${formatPrice(step.totalPrice)}`}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>{firstSeg.icon} {firstSeg.name}</span>
          <span>{lastSeg.icon} {lastSeg.name}</span>
        </div>
      </div>
    </div>
  );
}
