"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getSegmentById, getSegmentsForMunicipality } from "@/lib/segments";
import { MUNICIPALITIES } from "@/lib/municipalities";
import {
  getSegmentPriceData,
  getMunicipalityPriceData,
  formatPrice,
} from "@/lib/data";

interface PriceTrendChartProps {
  segmentId?: string;
  municipalityId?: string;
  source?: "finn" | "ssb" | "combined";
  showAllSegments?: boolean;
  showAllMunicipalities?: boolean;
  height?: number;
}

export default function PriceTrendChart({
  segmentId,
  municipalityId = "oslo",
  source = "combined",
  showAllSegments = false,
  showAllMunicipalities = false,
  height = 320,
}: PriceTrendChartProps) {
  // Mode 1: Show all segments for one municipality
  if (showAllSegments && municipalityId) {
    const segments = getSegmentsForMunicipality(municipalityId);
    const segmentIds = new Set(segments.map((s) => s.id));
    const municipalityData = getMunicipalityPriceData(municipalityId, source)
      .filter((d) => segmentIds.has(d.segmentId));

    // Build combined dataset keyed by label
    const combined: Record<string, Record<string, number>> = {};
    for (const sd of municipalityData) {
      for (const point of sd.data) {
        if (!combined[point.label]) combined[point.label] = {};
        combined[point.label][sd.segmentId] = point.price;
      }
    }

    const chartData = Object.entries(combined)
      .map(([label, prices]) => ({
        label,
        ...prices,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return (
      <div className="glass-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Prisutvikling per segment &mdash;{" "}
          {MUNICIPALITIES.find((m) => m.id === municipalityId)?.name ?? municipalityId}
        </h3>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                formatPrice(value),
                getSegmentById(name)?.name ?? name,
              ]}
            />
            <Legend
              formatter={(value: string) =>
                `${getSegmentById(value)?.icon ?? ""} ${getSegmentById(value)?.name ?? value}`
              }
            />
            {segments.map((seg) => (
              <Line
                key={seg.id}
                type="monotone"
                dataKey={seg.id}
                stroke={seg.colorHex}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Mode 2: Show one segment across municipalities
  if (showAllMunicipalities && segmentId) {
    const segmentData = getSegmentPriceData(segmentId, source);

    const combined: Record<string, Record<string, number>> = {};
    for (const sd of segmentData) {
      for (const point of sd.data) {
        if (!combined[point.label]) combined[point.label] = {};
        combined[point.label][sd.municipalityId] = point.price;
      }
    }

    const chartData = Object.entries(combined)
      .map(([label, prices]) => ({
        label,
        ...prices,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const segment = getSegmentById(segmentId);
    const muniColors = [
      "#60a5fa",
      "#34d399",
      "#fbbf24",
      "#a78bfa",
      "#f472b6",
      "#fb923c",
      "#2dd4bf",
      "#e879f9",
    ];

    return (
      <div className="glass-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">
          {segment?.icon} {segment?.name} &mdash; Prisutvikling per kommune
        </h3>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                formatPrice(value),
                MUNICIPALITIES.find((m) => m.id === name)?.name ?? name,
              ]}
            />
            <Legend
              formatter={(value: string) =>
                MUNICIPALITIES.find((m) => m.id === value)?.name ?? value
              }
            />
            {MUNICIPALITIES.map((muni, idx) => (
              <Line
                key={muni.id}
                type="monotone"
                dataKey={muni.id}
                stroke={muniColors[idx % muniColors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Mode 3: Show single segment + municipality with Finn vs SSB comparison
  if (segmentId && municipalityId) {
    const finnData = getMunicipalityPriceData(municipalityId, "finn").find(
      (d) => d.segmentId === segmentId
    );
    const ssbData = getMunicipalityPriceData(municipalityId, "ssb").find(
      (d) => d.segmentId === segmentId
    );

    const combined: Record<
      string,
      { label: string; finn?: number; ssb?: number }
    > = {};
    for (const point of finnData?.data ?? []) {
      combined[point.label] = {
        ...combined[point.label],
        label: point.label,
        finn: point.price,
      };
    }
    for (const point of ssbData?.data ?? []) {
      combined[point.label] = {
        ...combined[point.label],
        label: point.label,
        ssb: point.price,
      };
    }

    const chartData = Object.values(combined).sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    const segment = getSegmentById(segmentId);
    const muniName =
      MUNICIPALITIES.find((m) => m.id === municipalityId)?.name ?? municipalityId;

    return (
      <div className="glass-card p-4">
        <h3 className="mb-1 text-sm font-semibold text-white">
          {segment?.icon} {segment?.name} &mdash; {muniName}
        </h3>
        <p className="mb-3 text-xs text-slate-400">
          Sammenligning: Finn.no markedspris vs. SSB offisiell statistikk
        </p>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                formatPrice(value),
                name === "finn" ? "Finn.no" : "SSB",
              ]}
            />
            <Legend
              formatter={(value: string) =>
                value === "finn" ? "🔍 Finn.no" : "📊 SSB"
              }
            />
            <Line
              type="monotone"
              dataKey="finn"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="ssb"
              stroke="#60a5fa"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
