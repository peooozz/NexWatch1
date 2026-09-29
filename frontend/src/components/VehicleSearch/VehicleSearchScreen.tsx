import React, { useState } from "react";

interface VehicleSearchScreenProps {
  initialPlate?: string;
}

export const VehicleSearchScreen: React.FC<VehicleSearchScreenProps> = ({
  initialPlate = "KA 01 MJ 5521",
}) => {
  const [searchPlate, setSearchPlate] = useState(initialPlate);
  const [currentPlate, setCurrentPlate] = useState(initialPlate);
  const [copied, setCopied] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<number | null>(6);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchPlate.trim()) return;
    setCurrentPlate(searchPlate.trim());
    setActionToast(`Query executed for plate: ${searchPlate.trim()}`);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentPlate);
    setCopied(true);
    setActionToast(`Copied registration ID: ${currentPlate}`);
    setTimeout(() => {
      setCopied(false);
      setActionToast(null);
    }, 3000);
  };

  const handleExportPDF = () => {
    setActionToast(`Forensic Dossier for ${currentPlate} queued for PDF export.`);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handleFlagUnits = () => {
    setActionToast(`Flagged plate ${currentPlate} across all 48 Bangalore highway intercept units.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleCrossMatch = () => {
    setActionToast(`Cross-matching database: 1 duplicate kinematic discrepancy detected for ${currentPlate}.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  const handleNotifySector = () => {
    setActionToast("Tactical Alert sent to Sector 08 Flying Squad (Hebbal ORR unit).");
    setTimeout(() => setActionToast(null), 4000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container-lowest/95 backdrop-blur-xl px-4 py-3 rounded-xl shadow-lg border border-primary/30 text-on-surface font-label-md text-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          <span>{actionToast}</span>
        </div>
      )}

      <div className="w-full px-gutter-desktop py-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto">
        {/* Sub-header Breadcrumb & Operational State */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm font-label-md text-label-md text-on-surface-variant">
            <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>ATCS Telemetry</span>
            </span>
            <span>/</span>
            <span className="text-on-surface font-semibold">Corridor Re-Identification</span>
            <span>/</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
              Query Mode: Fast Spatial-Temporal
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-outline flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              ANPR Stream Sync: 1,842 Nodes Active
            </span>
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface shadow-sm font-body-sm text-body-sm flex items-center gap-1.5 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* Prominent ANPR Search Bar Card */}
        <section className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm">
          <form className="flex flex-col gap-space-md" onSubmit={handleSearch}>
            <div className="flex flex-col lg:flex-row items-stretch gap-space-sm">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[22px]">search</span>
                </span>
                <input
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-surface-container-low text-on-surface font-headline-sm text-headline-sm placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-all font-mono"
                  placeholder="Search license plate or registration (e.g., KA 01 MJ 5521, DL 08 CA 1944)"
                  type="text"
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                />
                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">manage_search</span>
                  <span>Query Database</span>
                </button>
                <button
                  onClick={() => {
                    setSearchPlate("KA 01 MJ 5521");
                    setCurrentPlate("KA 01 MJ 5521");
                  }}
                  className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
                  title="Reset Filters"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Query Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-label-sm text-label-sm text-outline mr-1">QUICK QUERY:</span>
              {[
                { plate: "KA 01 MJ 5521", label: "KA 01 MJ 5521 (Synthetic Clone)" },
                { plate: "7XYZ892", label: "7XYZ892 (Midtown Sedan)" },
                { plate: "DL 04 AB 1234", label: "DL 04 AB 1234 (North Ring BOLO)" },
              ].map((preset) => (
                <button
                  key={preset.plate}
                  type="button"
                  onClick={() => {
                    setSearchPlate(preset.plate);
                    setCurrentPlate(preset.plate);
                    setActionToast(`Query executed for preset: ${preset.plate}`);
                    setTimeout(() => setActionToast(null), 3500);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                    currentPlate === preset.plate
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container border-outline/20"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Filter Pill Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-label-sm text-label-sm text-outline mr-1">ACTIVE FILTERS:</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm cursor-pointer hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                  <span>
                    Time Window: <strong className="font-semibold">Last 6 Hours</strong>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm cursor-pointer hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span>
                  <span>
                    Jurisdiction: <strong className="font-semibold">Bengaluru Central &amp; South</strong>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm cursor-pointer hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[14px] text-primary">videocam</span>
                  <span>
                    Camera Type: <strong className="font-semibold">ANPR High-Speed</strong>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                </div>
                <button
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm hover:bg-primary-fixed transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                  <span>Advanced Parameters</span>
                </button>
              </div>
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>Query Match Index: 100% (High Confidence OCR)</span>
              </div>
            </div>
          </form>
        </section>

        {/* Vehicle Target Summary Card */}
        <section className="w-full bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl p-space-lg shadow-sm">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-center">
            {/* Left: ANPR Camera Capture Mockup */}
            <div className="xl:col-span-4 flex flex-col sm:flex-row xl:flex-col gap-space-md">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-surface-container-highest shadow-inner">
                <img
                  className="w-full h-full object-cover"
                  alt="Surveillance view of Hyundai Creta"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU-TWO75m0H5s_WwvPJLsRjUujpVWwC_UH-vW7PurpIrhYa0ZMkF-dzzXUcEva6neI8_qS93Fu6DojCgY71Q4JmnX_bozx2KFv6HSBbzdXcI3iNLRdTUB2QD8au5kkJjtBfESMA1wFFK8c6ifAkROckMzd5gRrl8FiAAfLV4zqOXV0o30EYGCVRtx76g1Zrz69KHzPsPBOjtjCBbDsRd8CySwEdQ3Hnm9yoQokZifO3acsrp57fcaOXQ"
                />
                {/* Live OCR Overlay HUD */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-surface-bright font-label-sm text-label-sm tracking-widest">
                      CAM-ORR-204 // IR-ON
                    </span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/90 text-on-tertiary font-label-sm text-label-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LATEST HIT
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[10px] text-surface-variant font-mono">2025-05-18 09:32:14 IST</span>
                      <span className="font-label-sm text-[10px] text-surface-variant font-mono">GPS: 13.0358° N, 77.5970° E</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-secondary-fixed font-label-md text-label-md tracking-wider">
                      OCR: 98.8%
                    </div>
                  </div>
                </div>
                {/* Plate bounding box simulation */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-8 rounded bg-primary/20 pointer-events-none flex items-center justify-center">
                  <span className="font-label-sm text-[9px] text-surface-bright bg-primary px-1 rounded -top-4 absolute">
                    PLATE TRACKED
                  </span>
                </div>
              </div>

              {/* Monospace License Plate Badge Unit */}
              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-9 rounded bg-primary text-on-primary font-label-sm text-[9px] flex flex-col items-center justify-center font-bold">
                    <span>IND</span>
                    <span className="material-symbols-outlined text-[10px]">stars</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">
                      Karnataka Transport Auth
                    </span>
                    <span className="font-label-md text-[18px] text-on-surface font-bold tracking-widest font-mono">
                      {currentPlate}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="Copy Registration ID"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">{copied ? "done" : "content_copy"}</span>
                </button>
              </div>
            </div>

            {/* Middle & Right: Metadata Specifications & Spatial Aggregates */}
            <div className="xl:col-span-8 flex flex-col justify-between gap-space-md">
              <div className="flex flex-wrap items-start justify-between gap-space-sm">
                <div>
                  <div className="flex items-center gap-space-sm mb-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">Hyundai Creta SX</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Polar White • Model Year 2022</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline">
                    Chassis No: <span className="font-label-sm font-semibold text-on-surface-variant">MALC481CLNM902148</span> •
                    Engine: <span className="font-label-sm font-semibold text-on-surface-variant">1.5L CRDi Diesel</span> •
                    Owner Classification: <span className="text-on-surface-variant">Private Individual (Bangalore South RTO)</span>
                  </p>
                </div>
                {/* Status Indicator Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-error-container text-tertiary font-body-sm text-body-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span>Active Investigation • Anomalous Sighting</span>
                </div>
              </div>

              {/* Telemetry Metric Bento Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-space-xs">
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                    Total Sightings
                  </span>
                  <span className="font-headline-xl text-headline-xl text-on-surface">06</span>
                  <span className="font-body-sm text-body-sm text-secondary font-medium">100% Verified Nodes</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
                    First Seen
                  </span>
                  <span className="font-headline-xl text-headline-xl text-on-surface">08:14</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Electronic City Inbound</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">timer_off</span>
                    Last Seen
                  </span>
                  <span className="font-headline-xl text-headline-xl text-on-surface">09:32</span>
                  <span className="font-body-sm text-body-sm text-tertiary font-medium">Hebbal ORR Flyover</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">straighten</span>
                    Est. Distance
                  </span>
                  <span className="font-headline-xl text-headline-xl text-on-surface">
                    28.4 <span className="text-headline-sm font-normal text-outline">km</span>
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg. Speed: 36.2 km/h</span>
                </div>
              </div>

              {/* Quick Action Bar for Dispatch & Tracking */}
              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
                <div className="flex items-center gap-space-sm">
                  <button
                    onClick={handleFlagUnits}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-body-sm text-body-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                    <span>Flag Plate for All Intercept Units</span>
                  </button>
                  <button
                    onClick={handleCrossMatch}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-body-sm text-body-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                    <span>Cross-match Duplicate Plates</span>
                  </button>
                </div>
                <div className="font-label-sm text-label-sm text-outline">
                  Target Profile Updated: <span className="text-on-surface font-mono">14:38 IST</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trajectory Section: Split Map and Chronological Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Trajectory Geospatial Vector Map (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-space-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="p-2 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">route</span>
                </span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Observed Corridor Trajectory</h2>
                  <p className="font-body-sm text-body-sm text-outline">
                    Sequential ANPR node connections across Bengaluru Metro (18 May 2025)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                <button
                  className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface shadow-sm font-label-sm text-label-sm cursor-pointer"
                  type="button"
                >
                  Standard
                </button>
                <button
                  className="px-2.5 py-1 rounded text-outline hover:text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer"
                  type="button"
                >
                  Heatmap
                </button>
                <button
                  className="px-2.5 py-1 rounded text-outline hover:text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer"
                  type="button"
                >
                  Signals
                </button>
              </div>
            </div>

            {/* Geospatial Canvas with Embedded Interactive Route Vector */}
            <div className="relative w-full h-[580px] rounded-xl overflow-hidden bg-surface-container-high">
              {/* Live Map Background Provider Canvas */}
              <div
                className="w-full h-full bg-cover bg-center"
                data-location="Bengaluru, Karnataka, India"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7XM8Fgk45lldfR72P1DmMqUtlSh0VCSALEpFL1gxyQqEBh5aoc-338VP9hUBGzeOXizS2GPKyfKnub8yG2kCfIuJoaRriuxNUvhLZUgzT48rHU54MEc7rb5bliWZ1s8mAwI2vFizWmL-TJ5sn5lb8cHSbo77BFAE499XPLuhIpd-PBboQcx6Di6tEmAQ07RXknASq8IeKOjeK31g7uYPcnI07oW_1z3Ddpv5Lzg7y2k9LzT4GOCG6Gw')",
                }}
              ></div>

              {/* Map Glass Layer & Vector HUD Overlay */}
              <div className="absolute inset-0 bg-surface-container-lowest/30 backdrop-blur-[1px] pointer-events-none">
                <svg className="w-full h-full" fill="none" viewBox="0 0 700 580" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" x2="100%" y1="100%" y2="0%">
                      <stop offset="0%" stopColor="#006a61" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#2563eb" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#ad0033" stopOpacity="0.95" />
                    </linearGradient>
                    <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                      <feGaussianBlur result="blur" stdDeviation="3" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {/* Trajectory Path connecting South to North Bengaluru */}
                  <path
                    d="M 520 510 C 470 440, 420 400, 390 350 C 360 300, 380 250, 350 200 C 320 150, 300 120, 240 70"
                    filter="url(#glow)"
                    stroke="url(#routeGradient)"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="5"
                  />
                </svg>
              </div>

              {/* Trajectory Interactive Numbered Pins overlay */}
              {/* Pin 1: Electronic City */}
              <div
                onClick={() => setSelectedPin(1)}
                className={`absolute top-[500px] left-[510px] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer transition-transform ${
                  selectedPin === 1 ? "scale-125 z-40" : "z-20 hover:scale-110"
                }`}
              >
                <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full shadow-md ${
                  selectedPin === 1 ? "bg-white ring-2 ring-secondary shadow-xl" : "bg-surface-container-lowest/95"
                }`}>
                  <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] flex items-center justify-center font-bold">
                    1
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface font-semibold">ECity (08:14)</span>
                </div>
              </div>

              {/* Pin 2: Silk Board */}
              <div
                onClick={() => setSelectedPin(2)}
                className={`absolute top-[390px] left-[420px] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer transition-transform ${
                  selectedPin === 2 ? "scale-125 z-40" : "z-20 hover:scale-110"
                }`}
              >
                <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full shadow-md ${
                  selectedPin === 2 ? "bg-white ring-2 ring-primary shadow-xl" : "bg-surface-container-lowest/95"
                }`}>
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] flex items-center justify-center font-bold">
                    2
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface font-semibold">Silk Board (08:35)</span>
                </div>
              </div>

              {/* Pin 3: Koramangala 80ft */}
              <div
                onClick={() => setSelectedPin(3)}
                className={`absolute top-[320px] left-[370px] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer transition-transform ${
                  selectedPin === 3 ? "scale-125 z-40" : "z-20 hover:scale-110"
                }`}
              >
                <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full shadow-md ${
                  selectedPin === 3 ? "bg-white ring-2 ring-primary shadow-xl" : "bg-surface-container-lowest/95"
                }`}>
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface font-semibold">Koramangala (08:48)</span>
                </div>
              </div>

              {/* Pin 4: Indiranagar 100ft */}
              <div
                onClick={() => setSelectedPin(4)}
                className={`absolute top-[230px] left-[375px] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer transition-transform ${
                  selectedPin === 4 ? "scale-125 z-40" : "z-20 hover:scale-110"
                }`}
              >
                <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full shadow-md ${
                  selectedPin === 4 ? "bg-white ring-2 ring-primary shadow-xl" : "bg-surface-container-lowest/95"
                }`}>
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] flex items-center justify-center font-bold">
                    4
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface font-semibold">Indiranagar (09:05)</span>
                </div>
              </div>

              {/* Pin 5: MG Road Trinity */}
              <div
                onClick={() => setSelectedPin(5)}
                className={`absolute top-[170px] left-[325px] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer transition-transform ${
                  selectedPin === 5 ? "scale-125 z-40" : "z-20 hover:scale-110"
                }`}
              >
                <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full shadow-md ${
                  selectedPin === 5 ? "bg-white ring-2 ring-primary shadow-xl" : "bg-surface-container-lowest/95"
                }`}>
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] flex items-center justify-center font-bold">
                    5
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface font-semibold">MG Road (09:20)</span>
                </div>
              </div>

              {/* Pin 6: Hebbal ORR (Terminal / Latest) */}
              <div
                onClick={() => setSelectedPin(6)}
                className={`absolute top-[70px] left-[235px] -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer transition-transform ${
                  selectedPin === 6 ? "scale-125 z-40" : "z-20 hover:scale-110"
                }`}
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-tertiary/30 animate-ping"></div>
                  <div className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg ${
                    selectedPin === 6 ? "bg-white ring-2 ring-tertiary shadow-xl" : "bg-surface-container-lowest"
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] flex items-center justify-center font-bold">
                      6
                    </span>
                    <span className="font-label-sm text-[11px] text-tertiary font-bold">Hebbal ORR (09:32)</span>
                  </div>
                </div>
              </div>

              {/* Floating Map Control Tools */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 pointer-events-auto">
                <button
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md hover:bg-surface-container-lowest text-on-surface shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md hover:bg-surface-container-lowest text-on-surface shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <button
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md hover:bg-surface-container-lowest text-on-surface shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  title="Fit Corridor View"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">crop_free</span>
                </button>
              </div>

              {/* Map Legend Indicator */}
              <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-sm pointer-events-auto">
                <div className="flex flex-col gap-1 font-label-sm text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="text-on-surface">Point of Origin (South Entry)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="text-on-surface">Transit Intersections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <span className="text-on-surface">Last Confirmed Intersection</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trajectory Telemetry Footnote */}
            <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">insights</span>
                Estimated route progression: Hosur Road → Sarjapur Rd → Inner Ring Rd → Airport Expressway
              </span>
              <span className="text-outline">GIS Projection: EPSG:4326</span>
            </div>
          </section>

          {/* Right Column: Vertical Chronological Timeline (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="p-2 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">history_toggle_off</span>
                </span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Camera Intercept Log</h2>
                  <p className="font-body-sm text-body-sm text-outline">Chronological reverse order (Recent → Earliest)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">
                6 Hits
              </span>
            </div>

            {/* Airy Vertical Timeline Container */}
            <div className="relative flex flex-col gap-space-md pl-4 pr-1 py-space-xs">
              {/* Timeline Vertical Spine */}
              <div className="absolute top-3 bottom-6 left-[27px] w-0.5 bg-surface-container-highest"></div>

              {/* Sighting 1 (Latest: Pin 6) */}
              <div
                onClick={() => setSelectedPin(6)}
                className="relative flex items-start gap-space-md group cursor-pointer"
              >
                <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm transition-transform ${
                  selectedPin === 6 ? "bg-tertiary text-on-tertiary scale-110 ring-2 ring-tertiary" : "bg-tertiary text-on-tertiary"
                }`}>
                  6
                </div>
                <div className={`flex-1 p-space-md rounded-xl transition-all ${
                  selectedPin === 6
                    ? "bg-red-50/90 border-2 border-tertiary shadow-md ring-2 ring-tertiary/20"
                    : "bg-surface-container-low/70 hover:bg-surface-container-low border border-transparent"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-tertiary font-bold">09:32 IST</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                        CAM-ORR-204
                      </span>
                      {selectedPin === 6 && (
                        <span className="px-2 py-0.5 rounded-full bg-tertiary text-white font-label-sm text-[10px] font-bold">
                          PIN 6 SELECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-tertiary font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>54 km/h</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Hebbal Outer Ring Road</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Lane 2, Northbound corridor toward Kempegowda Intl Airport
                  </p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-container-highest/60 text-outline font-label-sm text-label-sm">
                    <span>Confidence: 99.1%</span>
                    <span>•</span>
                    <span>Direction: 352° N</span>
                    <button className="ml-auto text-primary hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                      <span>View Frame</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sighting 2 (Pin 5) */}
              <div
                onClick={() => setSelectedPin(5)}
                className="relative flex items-start gap-space-md group cursor-pointer"
              >
                <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm transition-transform ${
                  selectedPin === 5 ? "bg-primary text-on-primary scale-110 ring-2 ring-primary" : "bg-primary text-on-primary"
                }`}>
                  5
                </div>
                <div className={`flex-1 p-space-md rounded-xl transition-all ${
                  selectedPin === 5
                    ? "bg-blue-50/90 border-2 border-primary shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-low/70 hover:bg-surface-container-low border border-transparent"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">09:20 IST</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                        CAM-MGR-088
                      </span>
                      {selectedPin === 5 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white font-label-sm text-[10px] font-bold">
                          PIN 5 SELECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>32 km/h</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">MG Road Trinity Circle</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Lane 1, Westbound junction transition
                  </p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-container-highest/60 text-outline font-label-sm text-label-sm">
                    <span>Confidence: 98.4%</span>
                    <span>•</span>
                    <span>Signal Status: Amber Cleared</span>
                    <button className="ml-auto text-primary hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                      <span>View Frame</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sighting 3 (Pin 4) */}
              <div
                onClick={() => setSelectedPin(4)}
                className="relative flex items-start gap-space-md group cursor-pointer"
              >
                <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm transition-transform ${
                  selectedPin === 4 ? "bg-primary text-on-primary scale-110 ring-2 ring-primary" : "bg-primary text-on-primary"
                }`}>
                  4
                </div>
                <div className={`flex-1 p-space-md rounded-xl transition-all ${
                  selectedPin === 4
                    ? "bg-blue-50/90 border-2 border-primary shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-low/70 hover:bg-surface-container-low border border-transparent"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">09:05 IST</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                        CAM-IND-115
                      </span>
                      {selectedPin === 4 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white font-label-sm text-[10px] font-bold">
                          PIN 4 SELECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>28 km/h</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">100 Feet Road, Indiranagar</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Lane 3, Northbound (Near CMH Road junction)
                  </p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-container-highest/60 text-outline font-label-sm text-label-sm">
                    <span>Confidence: 97.9%</span>
                    <span>•</span>
                    <span>High Density Traffic</span>
                    <button className="ml-auto text-primary hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                      <span>View Frame</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sighting 4 (Pin 3) */}
              <div
                onClick={() => setSelectedPin(3)}
                className="relative flex items-start gap-space-md group cursor-pointer"
              >
                <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm transition-transform ${
                  selectedPin === 3 ? "bg-primary text-on-primary scale-110 ring-2 ring-primary" : "bg-primary text-on-primary"
                }`}>
                  3
                </div>
                <div className={`flex-1 p-space-md rounded-xl transition-all ${
                  selectedPin === 3
                    ? "bg-blue-50/90 border-2 border-primary shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-low/70 hover:bg-surface-container-low border border-transparent"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">08:48 IST</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                        CAM-KOR-042
                      </span>
                      {selectedPin === 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white font-label-sm text-[10px] font-bold">
                          PIN 3 SELECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>36 km/h</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">80 Feet Road, Koramangala</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Lane 1, Eastbound (Sony World intersection)
                  </p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-container-highest/60 text-outline font-label-sm text-label-sm">
                    <span>Confidence: 99.4%</span>
                    <span>•</span>
                    <span>Normal Flow</span>
                    <button className="ml-auto text-primary hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                      <span>View Frame</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sighting 5 (Pin 2) */}
              <div
                onClick={() => setSelectedPin(2)}
                className="relative flex items-start gap-space-md group cursor-pointer"
              >
                <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm transition-transform ${
                  selectedPin === 2 ? "bg-primary text-on-primary scale-110 ring-2 ring-primary" : "bg-primary text-on-primary"
                }`}>
                  2
                </div>
                <div className={`flex-1 p-space-md rounded-xl transition-all ${
                  selectedPin === 2
                    ? "bg-blue-50/90 border-2 border-primary shadow-md ring-2 ring-primary/20"
                    : "bg-surface-container-low/70 hover:bg-surface-container-low border border-transparent"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">08:35 IST</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                        CAM-SLK-019
                      </span>
                      {selectedPin === 2 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white font-label-sm text-[10px] font-bold">
                          PIN 2 SELECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>18 km/h</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Central Silk Board Flyover</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Lane 4, Northbound bottleneck ramp
                  </p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-container-highest/60 text-outline font-label-sm text-label-sm">
                    <span>Confidence: 96.8%</span>
                    <span>•</span>
                    <span>Heavy Congestion Node</span>
                    <button className="ml-auto text-primary hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                      <span>View Frame</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sighting 6 (Origin: Pin 1) */}
              <div
                onClick={() => setSelectedPin(1)}
                className="relative flex items-start gap-space-md group cursor-pointer"
              >
                <div className={`relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm transition-transform ${
                  selectedPin === 1 ? "bg-secondary text-on-secondary scale-110 ring-2 ring-secondary" : "bg-secondary text-on-secondary"
                }`}>
                  1
                </div>
                <div className={`flex-1 p-space-md rounded-xl transition-all ${
                  selectedPin === 1
                    ? "bg-teal-50/90 border-2 border-secondary shadow-md ring-2 ring-secondary/20"
                    : "bg-surface-container-low/70 hover:bg-surface-container-low border border-transparent"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-secondary font-bold">08:14 IST</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                        CAM-ECT-002
                      </span>
                      {selectedPin === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-white font-label-sm text-[10px] font-bold">
                          PIN 1 SELECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px]">speed</span>
                      <span>68 km/h</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Electronic City Elevated Tollway</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Lane 1, Inbound from Hosur Inter-State Highway
                  </p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-container-highest/60 text-outline font-label-sm text-label-sm">
                    <span>Confidence: 99.8%</span>
                    <span>•</span>
                    <span>Initial Entry Capture</span>
                    <button className="ml-auto text-primary hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                      <span>View Frame</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs">
              <button
                onClick={() => {
                  setActionToast("High-resolution camera forensic package queued for download (ZIP archive).");
                  setTimeout(() => setActionToast(null), 4000);
                }}
                className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                <span>Download All 6 Camera High-Res Crops</span>
              </button>
            </div>
          </section>
        </div>

        {/* Forensic Cross-Correlation Footer Dock */}
        <section className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface">Automated Alert Dispatch Recommendation</p>
              <p className="font-body-sm text-body-sm text-outline">
                Vehicle last observed traveling North on Hebbal ORR towards Yelahanka / Devanahalli bypass.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm min-w-max">
            <button
              onClick={() => {
                setActionToast("Alert dismissed for Hebbal corridor.");
                setTimeout(() => setActionToast(null), 3000);
              }}
              className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-all cursor-pointer"
              type="button"
            >
              Dismiss Alert
            </button>
            <button
              onClick={handleNotifySector}
              className="px-4 py-2 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary font-body-sm text-body-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">broadcast_on_personal</span>
              <span>Notify Sector 08 Flying Squad</span>
            </button>
          </div>
        </section>
      </div>

      {/* Stitch Design System Footer */}
      <footer className="w-full bg-surface-container-lowest/90 backdrop-blur-md py-6 mt-8">
        <div className="w-full px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-body-sm text-on-surface">CivicFlow ATCS</span>
            <span className="font-body-sm text-body-sm text-outline">| Municipal Traffic Operations Infrastructure</span>
          </div>
          <div className="flex items-center gap-space-md font-label-sm text-label-sm text-outline">
            <span>Node: BLR-CC-09</span>
            <span>Data Feed: Active (120 FPS)</span>
            <span>© 2025 Karnataka State Police &amp; BBMP ITS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
