"use client";

import { SOURCE_INFO, type PriceSource } from "@/lib/data";

const SOURCE_KEYS: PriceSource[] = ["finn", "solgt", "ssb"];

export default function DataSourceReferences() {
  return (
    <div className="glass-card p-5">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Datakilder og referanser
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {SOURCE_KEYS.map((key) => {
          const info = SOURCE_INFO[key];
          return (
            <div key={key} className="rounded-xl bg-white/5 p-4">
              <p className="text-sm font-medium text-white">
                {info.icon} {info.label}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {info.description}
              </p>
              {info.url && (
                <a
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {info.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]} &rarr;
                </a>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Merk: Prisdata i denne appen er simulert basert på realistiske mønstre fra kildene over.
        &laquo;Kombinert&raquo; er et vektet snitt av alle tre kilder.
        For offisielle tall, se de enkelte kildene direkte.
      </p>
    </div>
  );
}
