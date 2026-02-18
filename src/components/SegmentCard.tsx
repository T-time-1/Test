"use client";

import { PropertySegment } from "@/lib/segments";
import { getLatestPrice, getPriceChange, formatPrice } from "@/lib/data";

interface SegmentCardProps {
  segment: PropertySegment;
  municipalityId: string;
  onClick: () => void;
}

export default function SegmentCard({
  segment,
  municipalityId,
  onClick,
}: SegmentCardProps) {
  const latestPrice = getLatestPrice(segment.id, municipalityId);
  const yearChange = getPriceChange(segment.id, municipalityId, 4);
  const quarterChange = getPriceChange(segment.id, municipalityId, 1);

  const changeClass =
    yearChange > 0.5 ? "price-up" : yearChange < -0.5 ? "price-down" : "price-flat";
  const arrow = yearChange > 0.5 ? "↑" : yearChange < -0.5 ? "↓" : "→";

  return (
    <button
      onClick={onClick}
      className="glass-card-hover group w-full p-5 text-left segment-glow"
      style={{ "--glow-color": `${segment.colorHex}15` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-2xl">{segment.icon}</span>
          <h3 className="mt-2 font-bold text-white">{segment.name}</h3>
          <p className="text-xs text-slate-400">{segment.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{segment.sizeRange}</p>
          {segment.priceRange && (
            <p className="text-[10px] text-slate-500 mt-0.5">{segment.priceRange}</p>
          )}
          <div
            className="mt-1 h-1 w-12 rounded-full opacity-60 ml-auto"
            style={{ backgroundColor: segment.colorHex }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <p className="text-xs text-slate-500">Per m² (snitt)</p>
          <p className="text-xl font-bold text-white">
            {formatPrice(latestPrice)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-slate-500">Siste år</p>
            <p className={`text-sm font-semibold ${changeClass}`}>
              {arrow} {yearChange > 0 ? "+" : ""}
              {yearChange.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Siste kvartal</p>
            <p
              className={`text-sm font-semibold ${
                quarterChange > 0.2
                  ? "price-up"
                  : quarterChange < -0.2
                    ? "price-down"
                    : "price-flat"
              }`}
            >
              {quarterChange > 0 ? "+" : ""}
              {quarterChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
        Klikk for detaljer →
      </div>
    </button>
  );
}
