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
  // Oslo
  bachelor: 42,
  couple: 62,
  upsizer: 80,
  luxury: 110,
  // Nesodden
  "nesodden-leilighet": 65,
  "nesodden-tomannsbolig": 120,
  "nesodden-enebolig-sm": 140,
  "nesodden-enebolig-md": 175,
  "nesodden-enebolig-lg": 220,
};

interface JourneyViewProps {
  municipalityId: string;
}

export default function JourneyView({ municipalityId }: JourneyViewProps) {
  const segments = getSegmentsForMunicipality(municipalityId);
  const isOslo = municipalityId === "oslo";

  const journeySteps = segments.map((seg) => {
    const pricePerM2 = getLatestPrice(seg.id, municipalityId);
    const midSize = MID_SIZES[seg.id] ?? 100;
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
    <div className="space-y-4">
      {/* Journey timeline */}
      <div className="relative space-y-4">
        {/* Vertical connector line */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-amber-400 via-emerald-400 to-violet-500 opacity-30" />

        {journeySteps.map((step, idx) => (
          <div
            key={step.segment.id}
            className="glass-card relative flex w-full items-stretch gap-0 overflow-hidden"
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
                    <span className="text-slate-500">
                      {" "}
                      &middot; {step.segment.priceRange}
                    </span>
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
          </div>
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
              Summen av alle {segments.length} steg (typisk størrelse per
              segment)
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {formatPrice(totalJourneyCost)}
            </p>
            <p className="text-xs text-slate-500">
              Fra {firstSeg.name.toLowerCase()} til{" "}
              {lastSeg.name.toLowerCase()}
              {lastSeg.subtitle ? ` (${lastSeg.subtitle.toLowerCase()})` : ""}
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
          <span>
            {firstSeg.icon} {firstSeg.name}
          </span>
          <span>
            {lastSeg.icon} {lastSeg.name}
          </span>
        </div>
      </div>
    </div>
  );
}
