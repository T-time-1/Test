"use client";

import { PropertySegment, getSegmentsForMunicipality } from "@/lib/segments";
import { MUNICIPALITIES } from "@/lib/municipalities";
import {
  getLatestPrice,
  getPriceChange,
  getTotalAppreciation,
  formatPrice,
} from "@/lib/data";
import PriceTrendChart from "./PriceTrendChart";

interface SegmentDetailProps {
  segment: PropertySegment;
  selectedMunicipality: string;
  onMunicipalityChange: (id: string) => void;
  source: "finn" | "ssb" | "combined";
  onSourceChange: (source: "finn" | "ssb" | "combined") => void;
}

export default function SegmentDetail({
  segment,
  selectedMunicipality,
  onMunicipalityChange,
  source,
  onSourceChange,
}: SegmentDetailProps) {
  const totalAppreciation = getTotalAppreciation(
    segment.id,
    selectedMunicipality
  );
  const yearChange = getPriceChange(segment.id, selectedMunicipality, 4);

  return (
    <div className="space-y-6">
      {/* Segment header */}
      <div
        className="glass-card p-6 segment-glow"
        style={
          { "--glow-color": `${segment.colorHex}20` } as React.CSSProperties
        }
      >
        <div className="flex items-start gap-4">
          <span className="text-5xl">{segment.icon}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{segment.name}</h2>
            <p className="text-sm text-slate-400">{segment.subtitle}</p>
            <p className="mt-2 text-sm text-slate-300">{segment.description}</p>
            <div className="mt-3 flex items-center gap-4">
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${segment.colorHex}20`,
                  color: segment.colorHex,
                }}
              >
                {segment.sizeRange}
              </span>
              {segment.priceRange && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${segment.colorHex}10`,
                    color: segment.colorHex,
                  }}
                >
                  {segment.priceRange}
                </span>
              )}
              <span className="text-xs text-slate-500">
                Steg {segment.order} av {getSegmentsForMunicipality(selectedMunicipality).length} i boligreisen
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Siden 2019</p>
            <p
              className={`text-2xl font-bold ${totalAppreciation > 0 ? "price-up" : "price-down"}`}
            >
              {totalAppreciation > 0 ? "+" : ""}
              {totalAppreciation.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {MUNICIPALITIES.map((muni) => (
            <button
              key={muni.id}
              onClick={() => onMunicipalityChange(muni.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedMunicipality === muni.id
                  ? "bg-white/15 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {muni.name}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {(["combined", "finn", "ssb"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSourceChange(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                source === s
                  ? "bg-white/15 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s === "combined"
                ? "Kombinert"
                : s === "finn"
                  ? "🔍 Finn.no"
                  : "📊 SSB"}
            </button>
          ))}
        </div>
      </div>

      {/* Price comparison chart: Finn vs SSB */}
      <PriceTrendChart
        segmentId={segment.id}
        municipalityId={selectedMunicipality}
        height={300}
      />

      {/* Municipality comparison chart */}
      <PriceTrendChart
        segmentId={segment.id}
        showAllMunicipalities
        source={source}
        height={300}
      />

      {/* Price table */}
      <div className="glass-card overflow-hidden">
        <div className="border-b border-white/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">
            Nåværende priser per kommune
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {MUNICIPALITIES.map((muni) => {
            const price = getLatestPrice(segment.id, muni.id, source);
            const change = getPriceChange(segment.id, muni.id, 4, source);
            const total = getTotalAppreciation(segment.id, muni.id, source);

            return (
              <div
                key={muni.id}
                className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/5 ${
                  selectedMunicipality === muni.id ? "bg-white/5" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{muni.name}</p>
                  <p className="text-xs text-slate-500">{muni.region}</p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(price)}
                    </p>
                    <p className="text-xs text-slate-500">per m²</p>
                  </div>
                  <div className="w-16">
                    <p
                      className={`text-sm font-semibold ${change > 0 ? "price-up" : change < 0 ? "price-down" : "price-flat"}`}
                    >
                      {change > 0 ? "+" : ""}
                      {change.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500">1 år</p>
                  </div>
                  <div className="w-16">
                    <p
                      className={`text-sm font-semibold ${total > 0 ? "price-up" : "price-down"}`}
                    >
                      {total > 0 ? "+" : ""}
                      {total.toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-500">totalt</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
