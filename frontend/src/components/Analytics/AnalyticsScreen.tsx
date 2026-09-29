import React, { useState } from "react";

export const AnalyticsScreen: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [selectedCorridor, setSelectedCorridor] = useState("Greater Bengaluru");
  const [selectedRange, setSelectedRange] = useState("Today (vs. 7d Baseline)");
  const [selectedWindow, setSelectedWindow] = useState("Morning Rush (08:00–11:00)");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadDone(true);
      setToastMessage("Report Queued for Download: Executive ATCS Traffic Dossier generated.");
      setTimeout(() => {
        setDownloadDone(false);
        setToastMessage(null);
      }, 3500);
    }, 1200);
  };

  const handleReviewSim = () => {
    setToastMessage("Loaded 30-day historical corridor simulation BLR-SIM-09.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeployGreenWave = () => {
    setToastMessage("Green Wave Signal Timing (+14s) deployed to ORR Bellandur junction controllers.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container-lowest/95 backdrop-blur-xl px-4 py-3 rounded-xl shadow-lg border border-primary/30 text-on-surface font-label-md text-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full px-gutter-desktop py-space-lg flex flex-col gap-space-lg">
        {/* Header Control Dock & Filter Strip */}
        <div className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm tracking-wider uppercase">
                Urban ITS Telemetry
              </span>
              <span className="font-label-sm text-label-sm text-outline">Realtime Ingestion Active (5 min sync)</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Municipal Traffic Flow &amp; Surveillance Analytics
            </h1>
          </div>

          {/* Filter Controls & Actions */}
          <div className="flex flex-wrap items-center gap-space-sm w-full xl:w-auto">
            {/* Filter Pill 1 */}
            <button
              onClick={() => {
                const corridors = ["Greater Bengaluru", "ORR - Silk Board Arc", "CBD Core Area", "Airport Expressway"];
                const next = corridors[(corridors.indexOf(selectedCorridor) + 1) % corridors.length];
                setSelectedCorridor(next);
              }}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-outline text-[16px]">location_on</span>
              <span className="font-label-sm text-label-sm text-on-surface">
                Corridor: <span className="font-semibold text-primary">{selectedCorridor}</span>
              </span>
              <span className="material-symbols-outlined text-outline text-[14px]">expand_more</span>
            </button>

            {/* Filter Pill 2 */}
            <button
              onClick={() => {
                const ranges = ["Today (vs. 7d Baseline)", "Past 48 Hours", "Past 30 Days Baseline"];
                const next = ranges[(ranges.indexOf(selectedRange) + 1) % ranges.length];
                setSelectedRange(next);
              }}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-outline text-[16px]">calendar_today</span>
              <span className="font-label-sm text-label-sm text-on-surface">
                Range: <span className="font-semibold text-primary">{selectedRange}</span>
              </span>
              <span className="material-symbols-outlined text-outline text-[14px]">expand_more</span>
            </button>

            {/* Filter Pill 3 */}
            <button
              onClick={() => {
                const windows = ["Morning Rush (08:00–11:00)", "Midday Lull (12:00–15:00)", "Evening Wave (17:00–20:00)", "Night Flow (21:00–05:00)"];
                const next = windows[(windows.indexOf(selectedWindow) + 1) % windows.length];
                setSelectedWindow(next);
              }}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-outline text-[16px]">schedule</span>
              <span className="font-label-sm text-label-sm text-on-surface">
                Window: <span className="font-semibold text-secondary">{selectedWindow}</span>
              </span>
              <span className="material-symbols-outlined text-outline text-[14px]">expand_more</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={handleExport}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-on-primary font-headline-sm text-body-sm shadow-sm hover:bg-on-primary-fixed-variant transition-all ml-auto xl:ml-2 cursor-pointer disabled:opacity-80"
              id="exportBtn"
              type="button"
            >
              {downloading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Generating Report...</span>
                </>
              ) : downloadDone ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Report Queued for Download</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  <span>Download Executive PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Status Metatiles Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md w-full">
          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div>
              <p className="font-label-sm text-label-sm text-outline">AGGREGATE VEHICLE VOLUME</p>
              <p className="font-headline-md text-headline-md text-on-surface mt-1">1,482,900</p>
              <span className="font-label-sm text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +3.8% vs 7-day average
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">directions_car</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div>
              <p className="font-label-sm text-label-sm text-outline">METRO CORRIDOR CONGESTION INDEX</p>
              <p className="font-headline-md text-headline-md text-tertiary-container mt-1">
                64.2 <span className="font-body-sm text-body-sm text-outline">/ 100</span>
              </p>
              <span className="font-label-sm text-[11px] text-tertiary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">warning</span> Severe at Silk Board &amp; ORR
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">traffic</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div>
              <p className="font-label-sm text-label-sm text-outline">AVG NETWORK TRANSIT SPEED</p>
              <p className="font-headline-md text-headline-md text-on-surface mt-1">
                26.8 <span className="font-body-sm text-body-sm text-outline">km/h</span>
              </p>
              <span className="font-label-sm text-[11px] text-outline flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">check_circle</span> Urban Target: 28.0 km/h
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div>
              <p className="font-label-sm text-label-sm text-outline">ACTIVE ANPR SENSORS &amp; CAMERAS</p>
              <p className="font-headline-md text-headline-md text-on-surface mt-1">
                1,842 <span className="font-body-sm text-body-sm text-outline">/ 1,860</span>
              </p>
              <span className="font-label-sm text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 99.03% Network Uptime
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </div>
          </div>
        </div>

        {/* 2x2 Grid of Primary Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg w-full">
          {/* CARD 1: Traffic Density by Hour */}
          <div className="bg-surface-container-lowest/85 backdrop-blur-md rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-outline">CORRIDOR AGGREGATE</span>
                    <span className="text-outline">•</span>
                    <span className="font-label-sm text-label-sm text-primary">HOURLY DISTRIBUTION</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                    Traffic Density by Hour
                  </h2>
                </div>
                {/* Peak badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>Peak: 09:00–10:00 (112.4k veh/h)</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">
                Volumetric vehicle throughput captured across 114 optical sensor junction gates between 06:00 and 22:00.
              </p>

              {/* Modern SVG Bar Chart */}
              <div className="w-full relative">
                <div className="flex items-end justify-between h-56 w-full pt-6 pb-2 px-2 bg-surface-container-low/40 rounded-xl relative">
                  {/* Grid lines */}
                  <div className="absolute inset-x-2 top-6 h-px bg-outline-variant/30"></div>
                  <div className="absolute inset-x-2 top-24 h-px bg-outline-variant/30"></div>
                  <div className="absolute inset-x-2 top-40 h-px bg-outline-variant/30"></div>

                  {/* Hourly Bars */}
                  {/* 06 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "22%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">06</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      06:00: 24.2k
                    </div>
                  </div>

                  {/* 07 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "48%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">07</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      07:00: 54.0k
                    </div>
                  </div>

                  {/* 08: Peak window */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-secondary rounded-t-sm group-hover:brightness-110 transition-all shadow-sm" style={{ height: "84%" }}></div>
                    <span className="font-label-sm text-[10px] text-secondary font-bold mt-2">08</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      08:00: 94.6k (Peak)
                    </div>
                  </div>

                  {/* 09: Max Peak */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-secondary-fixed-dim rounded-t-sm group-hover:brightness-110 transition-all shadow-md relative" style={{ height: "98%" }}>
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                    </div>
                    <span className="font-label-sm text-[10px] text-secondary font-bold mt-2">09</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm z-10">
                      09:00: 112.4k (Highest)
                    </div>
                  </div>

                  {/* 10: Peak window */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-secondary rounded-t-sm group-hover:brightness-110 transition-all shadow-sm" style={{ height: "88%" }}></div>
                    <span className="font-label-sm text-[10px] text-secondary font-bold mt-2">10</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      10:00: 99.1k
                    </div>
                  </div>

                  {/* 11 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "60%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">11</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      11:00: 67.5k
                    </div>
                  </div>

                  {/* 12 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "52%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">12</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      12:00: 58.2k
                    </div>
                  </div>

                  {/* 13 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "46%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">13</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      13:00: 51.6k
                    </div>
                  </div>

                  {/* 14 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "50%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">14</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      14:00: 56.0k
                    </div>
                  </div>

                  {/* 15 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "58%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">15</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      15:00: 65.4k
                    </div>
                  </div>

                  {/* 16 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "68%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">16</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      16:00: 76.8k
                    </div>
                  </div>

                  {/* 17: Evening */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary rounded-t-sm group-hover:brightness-110 transition-all" style={{ height: "86%" }}></div>
                    <span className="font-label-sm text-[10px] text-primary font-medium mt-2">17</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      17:00: 97.2k
                    </div>
                  </div>

                  {/* 18: Evening */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary rounded-t-sm group-hover:brightness-110 transition-all" style={{ height: "92%" }}></div>
                    <span className="font-label-sm text-[10px] text-primary font-medium mt-2">18</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      18:00: 104.1k
                    </div>
                  </div>

                  {/* 19 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary rounded-t-sm group-hover:brightness-110 transition-all" style={{ height: "80%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">19</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      19:00: 90.3k
                    </div>
                  </div>

                  {/* 20 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "62%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">20</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      20:00: 69.8k
                    </div>
                  </div>

                  {/* 21 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "42%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">21</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      21:00: 47.1k
                    </div>
                  </div>

                  {/* 22 */}
                  <div className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer px-1">
                    <div className="w-full max-w-[24px] bg-primary-fixed rounded-t-sm group-hover:brightness-95 transition-all" style={{ height: "28%" }}></div>
                    <span className="font-label-sm text-[10px] text-outline mt-2">22</span>
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded text-[10px] font-label-sm pointer-events-none whitespace-nowrap shadow-sm">
                      22:00: 31.5k
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Legend & Metadata Strip */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-md mt-space-sm bg-surface-container-low/20 rounded-lg p-2.5">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-secondary"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Morning Surge (08:00 - 11:00)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Evening Wave (17:00 - 20:00)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary-fixed"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Regular Hours</span>
                </div>
              </div>
              <span className="font-label-sm text-[11px] text-outline">Scale: 0k to 120k v/h</span>
            </div>
          </div>

          {/* CARD 2: Congestion Hotspots Heatmap */}
          <div className="bg-surface-container-lowest/85 backdrop-blur-md rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-outline">BOTTLENECK MATRIX</span>
                    <span className="text-outline">•</span>
                    <span className="font-label-sm text-label-sm text-secondary">SEVERITY INDEX</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                    Congestion Hotspots
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[11px] text-outline">Delay Metric:</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[11px]">
                    Minutes Over Baseline
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Cross-corridor bottleneck index assessing delay time impact on key vehicular junctions across distinct diurnal shifts.
              </p>

              {/* Heatmap Matrix Grid */}
              <div className="w-full flex flex-col gap-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 text-outline font-label-sm text-[11px] px-2">
                  <span className="col-span-4">CORRIDOR / JUNCTION</span>
                  <span className="col-span-2 text-center">MORNING PEAK</span>
                  <span className="col-span-2 text-center">MIDDAY</span>
                  <span className="col-span-2 text-center">EVENING PEAK</span>
                  <span className="col-span-2 text-center">NIGHT</span>
                </div>

                {/* Row 1: Outer Ring Road - Marathahalli */}
                <div className="grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-all">
                  <div className="col-span-4 min-w-0 pr-1">
                    <p className="font-headline-sm text-body-sm text-on-surface truncate">ORR - Marathahalli</p>
                    <p className="font-label-sm text-[10px] text-outline truncate">Kadubeesanahalli to Bridge</p>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+28 min</span>
                    <span className="text-[9px] opacity-75">Heavy Jam</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-surface-container-high text-on-primary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+08 min</span>
                    <span className="text-[9px] opacity-75">Moderate</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+34 min</span>
                    <span className="text-[9px] opacity-75">Gridlock</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-secondary-fixed/50 text-secondary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+01 min</span>
                    <span className="text-[9px] opacity-75">Free Flow</span>
                  </div>
                </div>

                {/* Row 2: Central Silk Board Junction */}
                <div className="grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-all">
                  <div className="col-span-4 min-w-0 pr-1">
                    <p className="font-headline-sm text-body-sm text-on-surface truncate">Central Silk Board</p>
                    <p className="font-label-sm text-[10px] text-outline truncate">Hosur Rd - BTM Interchange</p>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+32 min</span>
                    <span className="text-[9px] opacity-75">Critical</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-error-container text-tertiary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+16 min</span>
                    <span className="text-[9px] opacity-75">Dense</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+41 min</span>
                    <span className="text-[9px] opacity-75">Severe</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-surface-container text-on-primary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+04 min</span>
                    <span className="text-[9px] opacity-75">Steady</span>
                  </div>
                </div>

                {/* Row 3: MG Road / Trinity Circle */}
                <div className="grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-all">
                  <div className="col-span-4 min-w-0 pr-1">
                    <p className="font-headline-sm text-body-sm text-on-surface truncate">MG Road / Trinity</p>
                    <p className="font-label-sm text-[10px] text-outline truncate">CBD Core - Brigade Cross</p>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-surface-container-high text-on-primary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+12 min</span>
                    <span className="text-[9px] opacity-75">Moderate</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-secondary-fixed/50 text-secondary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+04 min</span>
                    <span className="text-[9px] opacity-75">Free Flow</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+18 min</span>
                    <span className="text-[9px] opacity-75">Congested</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-secondary-fixed/50 text-secondary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+00 min</span>
                    <span className="text-[9px] opacity-75">Nominal</span>
                  </div>
                </div>

                {/* Row 4: Hebbal Flyover */}
                <div className="grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-all">
                  <div className="col-span-4 min-w-0 pr-1">
                    <p className="font-headline-sm text-body-sm text-on-surface truncate">Hebbal Flyover</p>
                    <p className="font-label-sm text-[10px] text-outline truncate">KIA Airport Incline</p>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+26 min</span>
                    <span className="text-[9px] opacity-75">Heavy Jam</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-surface-container-high text-on-primary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+09 min</span>
                    <span className="text-[9px] opacity-75">Moderate</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-error-container text-tertiary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span className="font-bold">+22 min</span>
                    <span className="text-[9px] opacity-75">Slow Wave</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-secondary-fixed/50 text-secondary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+02 min</span>
                    <span className="text-[9px] opacity-75">Free Flow</span>
                  </div>
                </div>

                {/* Row 5: Electronic City Elevated Toll */}
                <div className="grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg hover:bg-surface-container-low transition-all">
                  <div className="col-span-4 min-w-0 pr-1">
                    <p className="font-headline-sm text-body-sm text-on-surface truncate">E-City Elevated Toll</p>
                    <p className="font-label-sm text-[10px] text-outline truncate">Phase 1 Entry / Exit Plaza</p>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-surface-container-high text-on-primary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+07 min</span>
                    <span className="text-[9px] opacity-75">Slight Delay</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-secondary-fixed/50 text-secondary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+01 min</span>
                    <span className="text-[9px] opacity-75">Free Flow</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-surface-container-high text-on-primary-fixed-variant text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+11 min</span>
                    <span className="text-[9px] opacity-75">Plaza Queue</span>
                  </div>
                  <div className="col-span-2 py-2 px-1 rounded-lg bg-secondary-fixed/50 text-secondary text-center font-label-sm text-[11px] flex flex-col items-center">
                    <span>+00 min</span>
                    <span className="text-[9px] opacity-75">Clear</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap Status Key */}
            <div className="flex items-center justify-between gap-space-sm pt-space-md mt-space-sm bg-surface-container-low/20 rounded-lg p-2.5">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Free Flow (&lt;5m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Moderate (5-15m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Heavy/Severe (&gt;15m)</span>
                </div>
              </div>
              <span className="font-label-sm text-[11px] text-outline">Updated: 2 mins ago</span>
            </div>
          </div>

          {/* CARD 3: Origin-Destination Flow Diagram */}
          <div className="bg-surface-container-lowest/85 backdrop-blur-md rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-outline">COMMUTER CHANNELS</span>
                    <span className="text-outline">•</span>
                    <span className="font-label-sm text-label-sm text-primary">MACRO MOBILITY</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                    Origin-Destination Flow
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
                  Total Commute Trips: 168k/day
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Directional vehicle volume between primary employment hubs, tech zones, and suburban residential corridors.
              </p>

              {/* Flow Diagram Visual Container */}
              <div className="w-full bg-surface-container-low/40 rounded-xl p-space-md relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg relative z-10">
                  {/* ORIGINS (Left Side) */}
                  <div className="flex flex-col gap-space-md">
                    <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">Origins (Morning Dep.)</span>
                    {/* Zone 1 Box */}
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                        <div>
                          <p className="font-headline-sm text-body-sm text-on-surface">Zone 1: E-City &amp; South</p>
                          <p className="font-label-sm text-[10px] text-outline">Suburbs &amp; Bommasandra</p>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold">58k veh</span>
                    </div>

                    {/* Zone 4 Box */}
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                        <div>
                          <p className="font-headline-sm text-body-sm text-on-surface">Zone 4: North Corridor</p>
                          <p className="font-label-sm text-[10px] text-outline">Hebbal, Yelahanka &amp; KIA</p>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">46k veh</span>
                    </div>
                  </div>

                  {/* DESTINATIONS (Right Side) */}
                  <div className="flex flex-col gap-space-md">
                    <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">Destinations (Major Inflow)</span>
                    {/* Zone 3 Box */}
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim"></span>
                        <div>
                          <p className="font-headline-sm text-body-sm text-on-surface">Zone 3: Central BD</p>
                          <p className="font-label-sm text-[10px] text-outline">MG Road, Vidhana Soudha</p>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">64k trips</span>
                    </div>

                    {/* Zone 2 Box */}
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim"></span>
                        <div>
                          <p className="font-headline-sm text-body-sm text-on-surface">Zone 2: Whitefield Corridor</p>
                          <p className="font-label-sm text-[10px] text-outline">ITPL, Brookefield &amp; Kadugodi</p>
                        </div>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">52k trips</span>
                    </div>
                  </div>
                </div>

                {/* Inter-zone Flow Bars */}
                <div className="mt-space-md pt-space-sm flex flex-col gap-space-xs">
                  <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Primary Arterial Channels</span>
                  {/* Flow 1: South to CBD */}
                  <div className="p-2 rounded bg-surface-container-lowest/90 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-headline-sm text-[13px] text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary"></span> South Suburbs{" "}
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span> CBD Core
                      </span>
                      <span className="font-label-sm text-label-sm text-primary font-bold">42,000 trips/day (25.0%)</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>

                  {/* Flow 2: CBD to Whitefield */}
                  <div className="p-2 rounded bg-surface-container-lowest/90 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-headline-sm text-[13px] text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span> CBD Core{" "}
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span> Whitefield Tech Hub
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary font-bold">38,000 trips/day (22.6%)</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  {/* Flow 3: North Corridor to CBD */}
                  <div className="p-2 rounded bg-surface-container-lowest/90 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-headline-sm text-[13px] text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span> North (Hebbal/Airport){" "}
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span> CBD
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">29,400 trips/day (17.5%)</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-fixed-dim h-full rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>

                  {/* Flow 4: South to Whitefield via ORR */}
                  <div className="p-2 rounded bg-surface-container-lowest/90 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-headline-sm text-[13px] text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span> South{" "}
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span> Whitefield (via ORR)
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">24,600 trips/day (14.6%)</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary-fixed-dim h-full rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="flex items-center justify-between pt-space-md mt-space-sm bg-surface-container-low/20 rounded-lg p-2.5">
              <span className="font-label-sm text-[11px] text-outline">Source: FastTag Toll &amp; ANPR Ingress Trajectory</span>
              <span className="font-label-sm text-[11px] text-primary font-medium">Auto-calibrated hourly</span>
            </div>
          </div>

          {/* CARD 4: Average Speed by Route */}
          <div className="bg-surface-container-lowest/85 backdrop-blur-md rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-outline">VELOCITY TELEMETRY</span>
                    <span className="text-outline">•</span>
                    <span className="font-label-sm text-label-sm text-secondary">REAL-TIME MONITOR</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5">
                    Average Speed by Route
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span>12 min Rolling Window</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Speed performance across major key corridors throughout the operating day comparing signalized vs. elevated freeways.
              </p>

              {/* Multi-Line SVG Chart */}
              <div className="w-full bg-surface-container-low/40 rounded-xl p-space-md">
                <div className="relative h-56 w-full">
                  {/* Y-Axis Speed Marks */}
                  <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-outline font-label-sm text-[10px] pointer-events-none">
                    <span>70 km/h</span>
                    <span>50 km/h</span>
                    <span>30 km/h</span>
                    <span>10 km/h</span>
                  </div>

                  {/* Chart Canvas Area */}
                  <div className="ml-10 h-full relative">
                    {/* Horizontal Guide Lines */}
                    <div className="absolute inset-x-0 top-0 h-px bg-outline-variant/30"></div>
                    <div className="absolute inset-x-0 top-1/3 h-px bg-outline-variant/30"></div>
                    <div className="absolute inset-x-0 top-2/3 h-px bg-outline-variant/30"></div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-outline-variant/30"></div>

                    {/* SVG Paths */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                      {/* Line 2: Elevated Toll (Steady 58-62 km/h) -> Muted Teal */}
                      <path d="M 0,40 Q 150,38 300,42 T 600,38" fill="none" stroke="#006a61" strokeLinecap="round" strokeWidth="2.5" />
                      <circle cx="300" cy="42" fill="#006a61" r="3.5" />
                      <circle cx="600" cy="38" fill="#006a61" r="3.5" />

                      {/* Line 1: ORR Bellandur to Hebbal -> Soft Blue */}
                      <path d="M 0,80 C 100,85 140,165 200,165 C 280,165 320,95 400,95 C 480,95 520,150 600,140" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="2.5" />
                      <circle cx="200" cy="165" fill="#ba1a1a" r="4.5" />
                      <circle cx="400" cy="95" fill="#2563eb" r="3.5" />

                      {/* Line 3: Old Airport Road -> Slate / Outline */}
                      <path d="M 0,140 C 100,135 200,150 300,138 C 400,125 500,145 600,135" fill="none" stroke="#737686" strokeDasharray="4 3" strokeLinecap="round" strokeWidth="2" />
                    </svg>

                    {/* Annotation on ORR Dip */}
                    <div className="absolute top-[138px] left-[150px] bg-error-container text-tertiary px-2 py-0.5 rounded text-[10px] font-label-sm shadow-sm pointer-events-none">
                      09:00 AM • 14 km/h
                    </div>
                  </div>

                  {/* X-Axis Labels */}
                  <div className="ml-10 flex justify-between pt-2 text-outline font-label-sm text-[10px]">
                    <span>06:00</span>
                    <span>09:00</span>
                    <span>12:00</span>
                    <span>15:00</span>
                    <span>18:00</span>
                    <span>21:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Legend with Delays & Speeds */}
            <div className="flex flex-col gap-space-xs pt-space-md mt-space-sm bg-surface-container-low/20 rounded-lg p-2.5">
              {/* Route 1 */}
              <div className="flex items-center justify-between text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-primary-container"></span>
                  <span className="font-headline-sm text-body-sm text-on-surface">Outer Ring Road (Bellandur to Hebbal)</span>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                  <span className="text-tertiary font-bold">14 km/h (9 AM)</span>
                  <span className="text-outline">Midday: 42 km/h</span>
                  <span className="text-on-surface-variant font-medium">Delay Index: 2.8x</span>
                </div>
              </div>

              {/* Route 2 */}
              <div className="flex items-center justify-between text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-secondary"></span>
                  <span className="font-headline-sm text-body-sm text-on-surface">Electronic City Elevated Expressway</span>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                  <span className="text-secondary font-bold">58–62 km/h</span>
                  <span className="text-outline">Steady flow</span>
                  <span className="text-on-surface-variant font-medium">Delay Index: 1.0x</span>
                </div>
              </div>

              {/* Route 3 */}
              <div className="flex items-center justify-between text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-outline" style={{ borderTop: "2px dashed #737686" }}></span>
                  <span className="font-headline-sm text-body-sm text-on-surface">Old Airport Road / Domlur</span>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                  <span className="text-on-surface font-semibold">18–28 km/h</span>
                  <span className="text-outline">Congested</span>
                  <span className="text-on-surface-variant font-medium">Delay Index: 1.9x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Context & Incident Correlation Strip */}
        <div className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">insights</span>
            </div>
            <div>
              <p className="font-headline-sm text-body-sm text-on-surface">Automated ITS Operations Recommendation</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Adaptive signal timing adjustment advised for ORR Bellandur junction (+14s Green Wave toward Silk Board).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm w-full xl:w-auto justify-end">
            <button
              onClick={handleReviewSim}
              className="px-4 py-1.5 rounded-full bg-surface-container font-headline-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
              type="button"
            >
              Review Historical Sim
            </button>
            <button
              onClick={handleDeployGreenWave}
              className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-headline-sm text-body-sm shadow-sm hover:bg-on-primary-fixed-variant transition-all cursor-pointer"
              type="button"
            >
              Deploy Green Wave Timing
            </button>
          </div>
        </div>
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
