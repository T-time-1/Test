"use client";

import { useState } from "react";
import JourneyView from "./JourneyView";
import DataSourceReferences from "./DataSourceReferences";

type Page = "oslo" | "nesodden";

export default function Dashboard() {
  const [page, setPage] = useState<Page>("oslo");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Life of Property
                </h1>
                <p className="text-xs text-slate-400">
                  Boligreisen &mdash; prisutvikling 2019–2025
                </p>
              </div>
            </div>

            <nav className="flex gap-1 rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setPage("oslo")}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                  page === "oslo"
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Oslo
              </button>
              <button
                onClick={() => setPage("nesodden")}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                  page === "nesodden"
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Nesodden
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="space-y-6">
          {/* Page intro */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white">
              Boligreisen &mdash;{" "}
              {page === "oslo" ? "Oslo" : "Nesodden"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {page === "oslo"
                ? "Fra ungkarsredet til luksusleiligheten. Se hva hvert steg i boligkarrieren koster i Oslo og hvordan prisene har utviklet seg siden 2019."
                : "Fra leilighet til drømmehuset. Se hva hvert steg i boligkarrieren koster på Nesodden og hvordan prisene har utviklet seg siden 2019."}
            </p>
            <div className="mt-4 journey-line" />
          </div>

          {/* Journey */}
          <JourneyView municipalityId={page} />

          {/* Data source references */}
          <DataSourceReferences />

          {/* Footer */}
          <footer className="pb-8 pt-4 text-center text-xs text-slate-600">
            <p>
              Life of Property &copy; 2025 &middot; Boligprisene i
              Oslo-regionen
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
