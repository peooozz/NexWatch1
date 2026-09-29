import React, { useState } from "react";
import { Anomaly } from "../../api/client";

interface OverviewScreenProps {
  onSelectAnomaly: (anomalyId: number) => void;
  onSearchPlate: (plate: string) => void;
  realtimeAnomalies: Anomaly[];
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onSelectAnomaly,
  onSearchPlate,
  realtimeAnomalies,
}) => {
  const [selectedCam, setSelectedCam] = useState({
    id: "CAM-402",
    title: "Midtown Core",
    ocr: "98.4%",
    rate: "54 veh/min",
    targetPlate: "7XYZ892",
  });

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [timeline, setTimeline] = useState<string>("Live");
  const [heatmapOn, setHeatmapOn] = useState<boolean>(true);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const handleSelectCamera = (id: string, ocr: string, rate: string, title: string, targetPlate: string = "7XYZ892") => {
    setSelectedCam({ id, title, ocr, rate, targetPlate });
  };

  const handleDispatch = (plate: string, unit: string) => {
    setDispatchToast(`Patrol Unit ${unit} dispatched to intercept ${plate}. Tactical sector locked.`);
    setTimeout(() => setDispatchToast(null), 5000);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col antialiased">
      {/* Toast Notification */}
      {dispatchToast && (
        <div className="fixed top-20 right-6 z-50 glass-panel px-4 py-3 rounded-2xl shadow-glass-modal border border-emerald-300 bg-white/95 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">local_police</span>
          <span>{dispatchToast}</span>
        </div>
      )}

      <div className="flex w-full">
        {/* Left Sidebar Mini Rail Navigation (Stitch Export) */}
        <aside className="fixed left-0 top-16 bottom-0 w-20 xl:w-60 z-40 glass-panel border-r border-white/70 flex flex-col justify-between p-3.5 transition-all">
          <div className="space-y-4">
            <div className="px-2 pt-2 hidden xl:block">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation Rail</span>
            </div>
            <nav className="space-y-1.5">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50/90 text-blue-700 font-semibold text-xs border border-blue-200/50 shadow-sm transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">layers</span>
                <span className="hidden xl:inline">GIS Grid Map</span>
              </button>
              <button
                type="button"
                onClick={() => onSearchPlate("KA 01 MJ 5521")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium text-xs transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-400">radar</span>
                <span className="hidden xl:inline">Vehicle Trajectory</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectAnomaly(realtimeAnomalies[0]?.id || 1)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium text-xs transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-400">emergency_share</span>
                <span className="hidden xl:inline">Incident Dispatch</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium text-xs transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-400">query_stats</span>
                <span className="hidden xl:inline">Telemetry &amp; Sensors</span>
              </button>
              <button
                type="button"
                onClick={() => handleDispatch("ZONE-04", "HQ-12")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium text-xs transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-400">shield_person</span>
                <span className="hidden xl:inline">Patrol Units (12)</span>
              </button>
            </nav>
          </div>

          {/* Bottom Left Card Mini Status */}
          <div className="glass-card-subtle p-3 rounded-2xl hidden xl:flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">traffic</span>
                <span>Core Flow</span>
              </span>
              <span className="text-emerald-600 font-bold">Stable</span>
            </div>
            <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full w-[84%] rounded-full"></div>
            </div>
            <span className="text-[10px] text-slate-400">Grid sync: 14:28:49 UTC</span>
          </div>
        </aside>

        {/* Main Content Wrapper (Stitch Export) */}
        <div className="pl-20 xl:pl-60 w-full min-h-screen">
          <main className="p-4 md:p-6 space-y-5 max-w-[1920px] mx-auto">
            {/* Top KPI Row: 4 Clean Floating Frosted Glass Metric Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Cameras Active */}
              <div className="glass-panel p-4 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cameras Active</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    99.4% Uptime
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">4,892</span>
                  <span className="text-xs font-medium text-slate-400">/ 4,920 total</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Core Metronet Online</span>
                  <span className="text-emerald-600 font-semibold">+14 restored</span>
                </div>
              </div>

              {/* Card 2: Plates Monitored Today */}
              <div className="glass-panel p-4 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plates Monitored Today</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">trending_up</span>
                    +6.4%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">1.43M</span>
                  <svg className="w-16 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 64 20">
                    <path d="M1 16L12 13L24 15L34 8L44 11L54 3L63 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M1 16L12 13L24 15L34 8L44 11L54 3L63 6V20H1Z" fill="currentColor" fillOpacity="0.1" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>OCR Confidence: <strong className="text-slate-700">99.1%</strong></span>
                  <span className="text-slate-400">840/min peak</span>
                </div>
              </div>

              {/* Card 3: Active Incidents */}
              <div className="glass-panel p-4 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Incidents</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200/70">
                    Action Required
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {realtimeAnomalies.length > 0 ? realtimeAnomalies.length : 19}
                  </span>
                  <span className="text-xs font-medium text-slate-400">live queued</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs pt-2 border-t border-slate-100">
                  <span className="px-1.5 py-0.5 rounded bg-rose-100/70 text-rose-700 font-bold text-[10px]">3 Urgent</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-800 font-bold text-[10px]">7 Priority</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">9 Standard</span>
                </div>
              </div>

              {/* Card 4: Avg Network Velocity */}
              <div className="glass-panel p-4 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg. Network Velocity</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/70">
                    Normal Flow
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">41.2</span>
                  <span className="text-xs font-semibold text-slate-400">km/h</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="text-amber-600 font-semibold">-4.8 km/h variance</span>
                  <span className="text-slate-400">I-88 Midtown Spur</span>
                </div>
              </div>
            </section>

            {/* Main Operational Section: Map (72%) + Live Feed (28%) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Central High-Res Clean Map Viewport */}
              <div className="lg:col-span-8 xl:col-span-8 flex flex-col relative glass-panel rounded-3xl overflow-hidden min-h-[680px] h-[calc(100vh-230px)] shadow-xl border border-white">
                {/* Top Floating Map Control Header */}
                <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  {/* Map Mode / Breadcrumb Pill */}
                  <div className="glass-pill px-3.5 py-2 rounded-2xl flex items-center gap-2.5 pointer-events-auto shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800">Metropolitan GIS Vector Grid</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px] font-medium text-slate-500">Sector 04 Core</span>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-600">
                      37.77° N, 122.41° W
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="glass-pill p-1 rounded-2xl flex items-center gap-1 pointer-events-auto shadow-sm">
                    <button
                      onClick={() => setHeatmapOn(!heatmapOn)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        heatmapOn ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 bg-white/80"
                      }`}
                      id="toggle-heatmap"
                      type="button"
                    >
                      Heatmap {heatmapOn ? "[ON]" : "[OFF]"}
                    </button>
                    <button
                      className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition cursor-pointer"
                      type="button"
                    >
                      ANPR Nodes (64)
                    </button>
                    <button
                      className="hidden md:inline-block px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition cursor-pointer"
                      type="button"
                    >
                      Speed Sensors
                    </button>
                    <button
                      onClick={() => handleDispatch("SECTOR-04", "12")}
                      className="px-3 py-1 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 transition cursor-pointer"
                      type="button"
                    >
                      Patrols (12)
                    </button>
                  </div>
                </div>

                {/* Clean Styled Light-Mode Cartographic SVG Map */}
                <div className="relative w-full h-full map-mesh-bg overflow-hidden select-none cursor-grab active:cursor-grabbing" id="gis-map-canvas">
                  {/* Soft Coordinate Fine Grid */}
                  <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern height="60" id="lightGrid" patternUnits="userSpaceOnUse" width="60">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="0.7" />
                      </pattern>
                    </defs>
                    <rect fill="url(#lightGrid)" height="100%" width="100%" />
                  </svg>

                  {/* Geographic Water Channels & Urban Blocks */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="softRiverGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.45" />
                      </linearGradient>
                      <linearGradient id="arterialHeat" x1="0%" x2="100%" y1="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                        <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.95" />
                        <stop offset="85%" stopColor="#ef4444" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    {/* River / Bay Geometry */}
                    <path
                      d="M-50,540 C320,510 520,360 720,280 C920,190 1200,150 1600,130 L1600,430 C1200,410 900,470 700,560 C500,660 320,700 -50,760 Z"
                      fill="url(#softRiverGrad)"
                    />
                    <path
                      d="M920,190 C980,80 1150,20 1350,-20 L1420,-20 C1280,60 1120,120 1040,240 Z"
                      fill="url(#softRiverGrad)"
                      opacity="0.8"
                    />
                    {/* Secondary Urban Road Grid */}
                    <g opacity="0.75" stroke="#cbd5e1" strokeWidth="1.6">
                      <line x1="0" x2="900" y1="120" y2="120" />
                      <line x1="0" x2="800" y1="210" y2="210" />
                      <line x1="0" x2="720" y1="300" y2="300" />
                      <line x1="0" x2="650" y1="390" y2="390" />
                      <line x1="0" x2="560" y1="480" y2="480" />
                      <line x1="850" x2="1600" y1="620" y2="620" />
                      <line x1="780" x2="1600" y1="710" y2="710" />
                      <line x1="1020" x2="1600" y1="260" y2="260" />
                      <line x1="1100" x2="1600" y1="350" y2="350" />
                      <line x1="140" x2="140" y1="0" y2="600" />
                      <line x1="260" x2="260" y1="0" y2="580" />
                      <line x1="380" x2="380" y1="0" y2="540" />
                      <line x1="500" x2="500" y1="0" y2="460" />
                      <line x1="620" x2="620" y1="0" y2="360" />
                      <line x1="1180" x2="1180" y1="300" y2="900" />
                      <line x1="1300" x2="1300" y1="280" y2="900" />
                      <line x1="1420" x2="1420" y1="260" y2="900" />
                    </g>
                    {/* Outer Peripheral Ring Roads */}
                    <path d="M 40,-20 C 180,240 220,620 380,820" fill="none" stroke="#94a3b8" strokeDasharray="6,4" strokeWidth="2.5" />
                    <path d="M 800,-20 C 1200,60 1480,260 1550,820" fill="none" stroke="#94a3b8" strokeWidth="3" />
                    {/* Highway I-88 */}
                    <path d="M 0,440 C 260,420 540,320 740,240 C 960,150 1280,110 1600,80" fill="none" filter="blur(4px)" opacity="0.6" stroke="#fecdd3" strokeWidth="12" />
                    <path d="M 0,440 C 260,420 540,320 740,240 C 960,150 1280,110 1600,80" fill="none" stroke="url(#arterialHeat)" strokeLinecap="round" strokeWidth="4" />
                    {/* Suspension Bridge Span Link */}
                    <path d="M 640,460 L 860,210" fill="none" stroke="#f87171" strokeWidth="4.5" />
                    <line stroke="#475569" strokeWidth="1.8" x1="680" x2="700" y1="415" y2="400" />
                    <line stroke="#475569" strokeWidth="1.8" x1="740" x2="760" y1="345" y2="330" />
                    <line stroke="#475569" strokeWidth="1.8" x1="800" x2="820" y1="280" y2="265" />
                    {/* Anomaly Correlation Velocity Arc */}
                    <path className="animate-pulse" d="M 525,258 C 650,180 820,130 920,121" fill="none" stroke="#e11d48" strokeDasharray="6,4" strokeWidth="2" />
                  </svg>

                  {/* Subtle Light Heatmap Glow Blobs */}
                  {heatmapOn && (
                    <>
                      <div className="absolute top-[28%] left-[45%] w-48 h-48 rounded-full bg-rose-400/20 filter blur-3xl pointer-events-none"></div>
                      <div className="absolute top-[48%] left-[34%] w-36 h-36 rounded-full bg-amber-400/20 filter blur-2xl pointer-events-none"></div>
                    </>
                  )}

                  {/* Floating Impossible Speed Pill Callout */}
                  <div
                    onClick={() => onSelectAnomaly(1)}
                    className="absolute top-[17%] left-[44%] z-30 flex items-center gap-2 px-3 py-1.5 glass-panel rounded-xl shadow-lg border border-rose-200 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Duplicate Speed Flag</span>
                      <span className="text-xs font-semibold text-slate-800">Tag 7XYZ892 · 14.2 mi in 90s</span>
                    </div>
                  </div>

                  {/* Camera Node 1: CAM-402 */}
                  <div
                    className="absolute top-[34%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                    onClick={() => handleSelectCamera("CAM-402", "98.4%", "54 veh/min", "Midtown Core", "7XYZ892")}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute h-8 w-8 rounded-full bg-blue-500 opacity-30"></span>
                      <span className="absolute h-6 w-6 rounded-full bg-blue-100 ring-2 ring-blue-500/40"></span>
                      <div className="relative w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      </div>
                    </div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 glass-pill rounded-md text-[11px] font-bold text-blue-900 whitespace-nowrap shadow-sm border border-blue-200/60">
                      CAM-402 (Active)
                    </div>
                  </div>

                  {/* Camera Node 2: CAM-118 */}
                  <div
                    className="absolute top-[49%] left-[39%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                    onClick={() => handleSelectCamera("CAM-118", "99.7%", "82 veh/min", "Harbor Span", "3KLM401")}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-3.5 h-3.5 bg-white border-2 border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 glass-pill rounded-md text-[10px] font-semibold text-slate-700 whitespace-nowrap shadow-sm">
                      CAM-118
                    </div>
                  </div>

                  {/* Camera Node 3: CAM-889 */}
                  <div
                    className="absolute top-[22%] left-[64%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                    onClick={() => handleSelectCamera("CAM-889", "99.2%", "68 veh/min", "East Arterial", "KA01MJ5521")}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 glass-pill rounded-md text-[10px] font-semibold text-slate-700 whitespace-nowrap shadow-sm">
                      CAM-889
                    </div>
                  </div>

                  {/* Camera Node 4: CAM-204 */}
                  <div
                    className="absolute top-[16%] left-[84%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                    onClick={() => handleSelectCamera("CAM-204", "97.9%", "39 veh/min", "Airport Junction", "7XYZ892")}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute h-7 w-7 rounded-full bg-rose-500 opacity-40"></span>
                      <div className="relative w-3.5 h-3.5 bg-rose-600 rounded-full ring-2 ring-white shadow-md"></div>
                    </div>
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 glass-pill rounded-md text-[10px] font-bold text-rose-700 whitespace-nowrap shadow-sm border border-rose-200">
                      CAM-204 · Match
                    </div>
                  </div>

                  {/* Camera Node 5: CAM-077 */}
                  <div
                    className="absolute top-[68%] left-[29%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                    onClick={() => handleSelectCamera("CAM-077", "99.9%", "12 veh/min", "Ramp 4B West", "9TTB120")}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-3 h-3 bg-amber-500 rounded-full ring-2 ring-white shadow-sm"></div>
                    </div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 glass-pill rounded-md text-[10px] font-medium text-slate-600 whitespace-nowrap shadow-sm">
                      CAM-077
                    </div>
                  </div>

                  {/* Sleek Glass Floating Preview Card for Selected Camera (Bottom Left) */}
                  <div className="absolute bottom-16 left-4 z-30 w-76 glass-panel rounded-2xl p-3 shadow-2xl border border-white transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-slate-800 truncate" id="active-cam-title">
                          Node {selectedCam.id.replace(/[^0-9]/g, "")} - {selectedCam.title}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200/50 shrink-0">
                        1080p 60fps
                      </span>
                    </div>
                    {/* Miniature Video Stream Container */}
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mt-2 bg-slate-900 shadow-inner">
                      <img
                        className="w-full h-full object-cover"
                        alt="High-contrast surveillance camera view"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy9w1JarrB3CIn0mJ70zPgwX_m-I3Yb79ymKrvMbDwnmw3RlmMXl5_NTlImWza7zYn0o7R6lu3tl3E1DKZTLr7YeRV2HZXyxG4w_mFE0iiZxrtMtH_zfhT-C3VwWIYgeLuUZ6HudsRSoNB3kRCJD9ickXLkH38EmTN-5rCb-0VdOIgSg5K15e5asvDXCJjKDaJwpAg1DgCSrlw132-MNIJ-dhQlaFafiSgVCSPhvtgm7Y_0P1wEXlD"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                        Live Stream
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-bold tracking-wider">
                        TARGET: {selectedCam.targetPlate}
                      </div>
                    </div>
                    {/* Mini Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-1 text-xs">
                      <div className="bg-white/70 p-2 rounded-xl border border-white">
                        <span className="text-[10px] text-slate-400 font-medium block">Detection Flow</span>
                        <span className="text-xs font-bold text-slate-800" id="active-cam-rate">
                          {selectedCam.rate}
                        </span>
                      </div>
                      <div className="bg-white/70 p-2 rounded-xl border border-white">
                        <span className="text-[10px] text-slate-400 font-medium block">OCR Confidence</span>
                        <span className="text-xs font-bold text-blue-600" id="active-cam-ocr">
                          {selectedCam.ocr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Floating Timeline & Map Utilities */}
                  <div className="absolute bottom-3 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                    <div className="glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-2 pointer-events-auto shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                      <button
                        onClick={() => setTimeline("Live")}
                        className={`px-2.5 py-1 text-xs font-bold rounded-xl cursor-pointer ${
                          timeline === "Live" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Live
                      </button>
                      <button
                        onClick={() => setTimeline("-15m")}
                        className={`px-2.5 py-1 text-xs font-medium rounded-xl cursor-pointer ${
                          timeline === "-15m" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        -15m
                      </button>
                      <button
                        onClick={() => setTimeline("-30m")}
                        className={`px-2.5 py-1 text-xs font-medium rounded-xl cursor-pointer ${
                          timeline === "-30m" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        -30m
                      </button>
                      <button
                        onClick={() => setTimeline("-1h")}
                        className={`px-2.5 py-1 text-xs font-medium rounded-xl cursor-pointer ${
                          timeline === "-1h" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        -1h
                      </button>
                    </div>

                    {/* Map Zoom Controls */}
                    <div className="glass-pill p-1 rounded-2xl flex items-center gap-1 pointer-events-auto shadow-sm">
                      <button className="w-7 h-7 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition cursor-pointer">
                        +
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition cursor-pointer">
                        -
                      </button>
                      <button
                        onClick={() => handleSelectCamera("CAM-402", "98.4%", "54 veh/min", "Midtown Core")}
                        className="px-2.5 h-7 flex items-center gap-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">center_focus_strong</span>
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right-Hand Real-Time Incident Stream Dock (28%) */}
              <div className="lg:col-span-4 xl:col-span-4 flex flex-col glass-panel rounded-3xl overflow-hidden min-h-[680px] h-[calc(100vh-230px)] shadow-xl border border-white">
                {/* Stream Header */}
                <div className="p-4 border-b border-slate-100/80 bg-white/50 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                      <h2 className="text-sm font-bold text-slate-900 tracking-tight">Real-Time Incident Stream</h2>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      19 Active
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-0.5">
                    {["All", "Cloned", "Speed", "BOLO", "Commercial"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                          activeFilter === f
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white/70 hover:bg-white text-slate-600 border border-slate-200/60"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Incident Scrollable Feed Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10" id="incident-feed-scroll">
                  {/* Card 1: High Priority Flagged Anomaly */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/90 to-white/95 border border-rose-200/80 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wide">
                        Critical · Cloned Plate
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">31s ago</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">Impossible Velocity Correlation</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                          7XYZ892
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">Sedan · Black</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Simultaneous detection at <strong className="text-slate-800 font-semibold">CAM-402</strong> and{" "}
                        <strong className="text-slate-800 font-semibold">CAM-204</strong> (14.2 miles apart within 90s). Implied speed:{" "}
                        <span className="text-rose-600 font-bold">568 mph</span>.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-rose-100">
                      <button
                        onClick={() => handleDispatch("7XYZ892", "Patrol-09")}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">local_police</span>
                        <span>Dispatch Patrol</span>
                      </button>
                      <button
                        onClick={() => onSelectAnomaly(1)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Review Case</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Amber Priority (Stolen Vehicle BOLO) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 to-white/95 border border-amber-200/80 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                        High Priority · Stolen BOLO
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">1m ago</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">Active Stolen Vehicle Match</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                          3KLM401
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">2021 Dodge Charger</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Optical verification at <strong className="text-slate-800 font-semibold">CAM-118</strong> (Harbor Tunnel). Speed recorded at{" "}
                        <span className="text-amber-700 font-bold">78 mph</span> in a 45 mph zone.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-100">
                      <span className="text-[11px] font-semibold text-slate-500">98.9% match confidence</span>
                      <button
                        onClick={() => handleDispatch("3KLM401", "Interceptor-02")}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition flex items-center gap-1 shadow-sm shadow-amber-500/20 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">navigation</span>
                        <span>Intercept Route</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Traffic Directional Warning */}
                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wide">
                        Traffic Hazard
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">2m ago</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">Wrong-Way Driver Detected</h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        Sensors at <strong className="text-slate-800 font-semibold">CAM-077</strong> (Ramp 4B Eastbound) triggered reversed flow. Overhead variable matrix signs deployed automatically.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        VMS Signage Active
                      </span>
                      <button
                        onClick={() => {
                          setDispatchToast("Ramp 4B Eastbound held. Variable message signs active.");
                          setTimeout(() => setDispatchToast(null), 4000);
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                      >
                        Hold Ramp
                      </button>
                    </div>
                  </div>

                  {/* Card 4: Routine Commercial Infraction */}
                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                        Commercial Weight
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">4m ago</span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">Overweight Bypass Flagged</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-700">9TTB120</span>
                        <span className="text-[11px] text-slate-400">Semi 3-Axle</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Est. gross 94,200 lbs (Limit 80,000 lbs) at Weigh Stn 3 East.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-medium text-blue-600">Auto-Citation #9921</span>
                      <button
                        onClick={() => {
                          setDispatchToast("Citation #9921 acknowledged.");
                          setTimeout(() => setDispatchToast(null), 3000);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Dock Footer */}
                <div className="p-3 border-t border-slate-100 bg-white/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Auto-ingest: 12.4 items/s
                  </span>
                  <button
                    onClick={() => {
                      setDispatchToast("Real-Time Incident Stream exported (CSV / JSON ready).");
                      setTimeout(() => setDispatchToast(null), 3500);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-50 transition shadow-sm cursor-pointer"
                  >
                    Export Stream
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
