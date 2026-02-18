"use client";

import { useState } from "react";
import { getSegmentsForMunicipality } from "@/lib/segments";
import { MUNICIPALITIES } from "@/lib/municipalities";
import { getLatestPrice, getPriceChange, formatPrice } from "@/lib/data";
import PriceTrendChart from "./PriceTrendChart";

interface MunicipalityComparisonProps {
  source: "finn" | "ssb" | "combined";
  onSourceChange: (source: "finn" | "ssb" | "combined") => void;
}

export default function MunicipalityComparison({
  source,
  onSourceChange,
}: MunicipalityComparisonProps) {
  const [selectedMunicipality, setSelectedMunicipality] = useState("oslo");
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const segments = getSegmentsForMunicipality(selectedMunicipality);

  // When changing municipality, clear segment if it doesn't exist in the new set
  const handleMunicipalityChange = (id: string) => {
    setSelectedMunicipality(id);
    if (selectedSegment) {
      const newSegments = getSegmentsForMunicipality(id);
      if (!newSegments.find((s) => s.id === selectedSegment)) {
        setSelectedSegment(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white">
          Kommune-sammenligning
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Sammenlign prisutvikling mellom Oslo og omegnskommuner. Velg en
          kommune for å se detaljert utvikling, eller velg et segment for
          geografisk sammenligning.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1">
          {MUNICIPALITIES.map((muni) => (
            <button
              key={muni.id}
              onClick={() => handleMunicipalityChange(muni.id)}
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

      {/* All segments for selected municipality */}
      <PriceTrendChart
        municipalityId={selectedMunicipality}
        showAllSegments
        source={source}
        height={360}
      />

      {/* Segment selector for cross-municipality comparison */}
      <div className="glass-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Velg segment for geografisk sammenligning
        </h3>
        <div className="flex flex-wrap gap-2">
          {segments.map((seg) => (
            <button
              key={seg.id}
              onClick={() =>
                setSelectedSegment(
                  selectedSegment === seg.id ? null : seg.id
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedSegment === seg.id
                  ? "text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
              style={
                selectedSegment === seg.id
                  ? {
                      backgroundColor: `${seg.colorHex}25`,
                      color: seg.colorHex,
                    }
                  : {}
              }
            >
              {seg.icon} {seg.name}
            </button>
          ))}
        </div>
      </div>

      {selectedSegment && (
        <PriceTrendChart
          segmentId={selectedSegment}
          showAllMunicipalities
          source={source}
          height={360}
        />
      )}

      {/* Price table per municipality */}
      <div className="glass-card overflow-x-auto">
        <div className="border-b border-white/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">
            Prisoversikt per kommune (kr/m²)
          </h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-3 py-2 text-left text-slate-400">Kommune</th>
              {segments.map((seg) => (
                <th key={seg.id} className="px-3 py-2 text-right text-slate-400">
                  {seg.icon} {seg.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MUNICIPALITIES.map((muni) => {
              const muniSegments = getSegmentsForMunicipality(muni.id);
              return (
                <tr key={muni.id} className="hover:bg-white/5">
                  <td className="px-3 py-2 font-medium text-white">
                    {muni.name}
                    {muni.id === "oslo" && (
                      <span className="ml-1 text-[10px] text-slate-500">(leiligheter)</span>
                    )}
                  </td>
                  {segments.map((seg) => {
                    const hasSegment = muniSegments.find((s) => s.id === seg.id);
                    if (!hasSegment) {
                      return (
                        <td key={seg.id} className="px-3 py-2 text-right text-slate-600">
                          —
                        </td>
                      );
                    }
                    const price = getLatestPrice(seg.id, muni.id, source);
                    const change = getPriceChange(seg.id, muni.id, 4, source);
                    return (
                      <td key={seg.id} className="px-3 py-2 text-right">
                        <span className="text-white">
                          {formatPrice(price)}
                        </span>
                        <br />
                        <span
                          className={`${change > 0 ? "price-up" : change < 0 ? "price-down" : "price-flat"}`}
                        >
                          {change > 0 ? "+" : ""}
                          {change.toFixed(1)}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
