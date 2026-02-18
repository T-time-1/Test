"use client";

import { getSegmentsForMunicipality } from "@/lib/segments";

interface HeaderProps {
  activeSegment: string | null;
  onSegmentClick: (id: string | null) => void;
  activeView: "overview" | "compare" | "journey";
  onViewChange: (view: "overview" | "compare" | "journey") => void;
  municipalityId: string;
}

export default function Header({
  activeSegment,
  onSegmentClick,
  activeView,
  onViewChange,
  municipalityId,
}: HeaderProps) {
  const segments = getSegmentsForMunicipality(municipalityId);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              onSegmentClick(null);
              onViewChange("overview");
            }}
            className="group flex items-center gap-3"
          >
            <span className="text-2xl">🏠</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Life of Property
              </h1>
              <p className="text-xs text-slate-400">
                Boligprisene i Oslo-regionen
              </p>
            </div>
          </button>

          <nav className="flex gap-1 rounded-xl bg-white/5 p-1">
            {(["overview", "compare", "journey"] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeView === view
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {view === "overview"
                  ? "Dashboard"
                  : view === "compare"
                    ? "Kommuner"
                    : "Reisen"}
              </button>
            ))}
          </nav>
        </div>

        {/* Segment selector pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => onSegmentClick(null)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activeSegment === null
                ? "bg-white/15 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Alle
          </button>
          {segments.map((seg) => (
            <button
              key={seg.id}
              onClick={() => onSegmentClick(seg.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeSegment === seg.id
                  ? `text-white shadow-sm`
                  : "text-slate-400 hover:text-white"
              }`}
              style={
                activeSegment === seg.id
                  ? { backgroundColor: `${seg.colorHex}30`, color: seg.colorHex }
                  : {}
              }
            >
              {seg.icon} {seg.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
