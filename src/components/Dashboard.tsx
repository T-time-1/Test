"use client";

import { useState } from "react";
import { SEGMENTS, getSegmentById } from "@/lib/segments";
import Header from "./Header";
import SegmentCard from "./SegmentCard";
import SegmentDetail from "./SegmentDetail";
import PriceTrendChart from "./PriceTrendChart";
import MunicipalityComparison from "./MunicipalityComparison";
import JourneyView from "./JourneyView";
import {
  getLatestPrice,
  getPriceChange,
  getTotalAppreciation,
  formatPrice,
} from "@/lib/data";

export default function Dashboard() {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<
    "overview" | "compare" | "journey"
  >("overview");
  const [selectedMunicipality, setSelectedMunicipality] = useState("oslo");
  const [source, setSource] = useState<"finn" | "ssb" | "combined">(
    "combined"
  );

  const handleSegmentClick = (id: string | null) => {
    setActiveSegment(id);
    if (id) {
      setActiveView("overview");
    }
  };

  const segment = activeSegment ? getSegmentById(activeSegment) : null;

  return (
    <div className="min-h-screen">
      <Header
        activeSegment={activeSegment}
        onSegmentClick={handleSegmentClick}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Journey view */}
        {activeView === "journey" && (
          <JourneyView
            municipalityId={selectedMunicipality}
            onMunicipalityChange={setSelectedMunicipality}
            onSegmentClick={(id) => {
              setActiveSegment(id);
              setActiveView("overview");
            }}
          />
        )}

        {/* Municipality comparison view */}
        {activeView === "compare" && (
          <MunicipalityComparison
            source={source}
            onSourceChange={setSource}
          />
        )}

        {/* Overview: segment detail */}
        {activeView === "overview" && segment && (
          <SegmentDetail
            segment={segment}
            selectedMunicipality={selectedMunicipality}
            onMunicipalityChange={setSelectedMunicipality}
            source={source}
            onSourceChange={setSource}
          />
        )}

        {/* Overview: dashboard grid */}
        {activeView === "overview" && !segment && (
          <div className="space-y-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard
                label="Segmenter"
                value="4"
                sub="boligkategorier"
              />
              <StatCard
                label="Kommuner"
                value="8"
                sub="Oslo + omegn"
              />
              <StatCard
                label="Datakilder"
                value="2"
                sub="Finn.no + SSB"
              />
              <StatCard
                label="Historikk"
                value="7 år"
                sub="2019 – 2025"
              />
            </div>

            {/* Municipality selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Vis priser for:</span>
              <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1">
                {[
                  { id: "oslo", name: "Oslo" },
                  { id: "baerum", name: "Bærum" },
                  { id: "asker", name: "Asker" },
                  { id: "lillestrom", name: "Lillestrøm" },
                  { id: "nordre-follo", name: "N. Follo" },
                  { id: "lorenskog", name: "Lørenskog" },
                ].map((muni) => (
                  <button
                    key={muni.id}
                    onClick={() => setSelectedMunicipality(muni.id)}
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
            </div>

            {/* Segment cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {SEGMENTS.map((seg) => (
                <SegmentCard
                  key={seg.id}
                  segment={seg}
                  municipalityId={selectedMunicipality}
                  onClick={() => handleSegmentClick(seg.id)}
                />
              ))}
            </div>

            {/* Overview chart */}
            <PriceTrendChart
              municipalityId={selectedMunicipality}
              showAllSegments
              source={source}
              height={400}
            />

            {/* Source selector */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-slate-500">Datakilde:</span>
              <div className="flex gap-1 rounded-xl bg-white/5 p-1">
                {(["combined", "finn", "ssb"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSource(s)}
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

            {/* Biggest movers */}
            <div className="glass-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-white">
                Største bevegelser siste år
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {SEGMENTS.map((seg) => {
                  const change = getPriceChange(
                    seg.id,
                    selectedMunicipality,
                    4,
                    source
                  );
                  return (
                    <div
                      key={seg.id}
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                    >
                      <span className="text-xl">{seg.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {seg.name}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-bold ${change > 0 ? "price-up" : change < 0 ? "price-down" : "price-flat"}`}
                      >
                        {change > 0 ? "↑" : change < 0 ? "↓" : "→"}{" "}
                        {change > 0 ? "+" : ""}
                        {change.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <footer className="pb-8 pt-4 text-center text-xs text-slate-600">
              <p>
                Data: Simulerte markedspriser basert på Finn.no-mønstre og
                SSB-statistikk.
              </p>
              <p className="mt-1">
                Life of Property &copy; 2025 &middot; Boligprisene i
                Oslo-regionen
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}
