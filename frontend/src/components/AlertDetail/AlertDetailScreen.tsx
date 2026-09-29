import React, { useState } from "react";
import { Anomaly, acknowledgeAnomaly, injectSyntheticClone } from "../../api/client";

interface AlertDetailScreenProps {
  anomaly: Anomaly | null;
  onRefresh: () => void;
  onBackToOverview?: () => void;
}

export const AlertDetailScreen: React.FC<AlertDetailScreenProps> = ({
  anomaly,
  onRefresh,
  onBackToOverview,
}) => {
  const [updating, setUpdating] = useState(false);
  const [injecting, setInjecting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleAcknowledge = async (status: "acknowledged" | "false_positive") => {
    if (!anomaly) return;
    setUpdating(true);
    try {
      await acknowledgeAnomaly(anomaly.id, status);
      setActionMessage(`Incident #${anomaly.id} marked as ${status.replace("_", " ").toUpperCase()}`);
      onRefresh();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleInjectDemoClone = async () => {
    setInjecting(true);
    try {
      const newAnomaly = await injectSyntheticClone();
      setActionMessage(`Synthetic clone injected! Created Incident #${newAnomaly.id} (${newAnomaly.plate_text})`);
      onRefresh();
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setInjecting(false);
    }
  };

  const handleDispatchIntercept = () => {
    setActionMessage("Patrol units dispatched: Intercept perimeter sealed around Hope Farm & ITPL.");
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleEngageRedWave = () => {
    setActionMessage("Red Wave engaged: Holding signals at Hope Farm Junction.");
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleExportDossier = () => {
    setActionMessage("Forensic Incident Dossier INC-2025-0892B exported to PDF.");
    setTimeout(() => setActionMessage(null), 4000);
  };

  const plateText = anomaly?.plate_text || "KA 01 MJ 5521";
  const impliedSpeed = Math.round(anomaly?.implied_speed_kmh || 315);
  const incidentId = anomaly ? `INC-2025-${String(anomaly.id).padStart(4, "0")}B` : "INC-2025-0892B";

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container-lowest/95 backdrop-blur-xl px-4 py-3 rounded-xl shadow-lg border border-tertiary/30 text-on-surface font-label-md text-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-tertiary">warning</span>
          <span>{actionMessage}</span>
        </div>
      )}

      <div className="w-full px-gutter-desktop py-space-lg flex flex-col gap-space-lg">
        {/* Breadcrumb & Top Indicator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToOverview}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Alert Queue
            </button>
            <span className="text-outline-variant font-label-md">/</span>
            <span className="font-label-md text-label-md text-primary font-semibold">{incidentId}</span>
            <span className="font-label-md text-label-md text-outline-variant">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant">ANPR Dual-Sensor Anomaly Engine</span>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={handleInjectDemoClone}
              disabled={injecting}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs hover:from-blue-700 hover:to-indigo-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>{injecting ? "Injecting Clone..." : "Inject Synthetic Clone Test (M5)"}</span>
            </button>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
              Cryptographic ANPR Signature: MATCH_98.8%
            </span>
            <span className="font-label-sm text-label-sm text-outline bg-surface-container px-3 py-1 rounded-full">
              Audit Stream BLR-SURV-NODES-4
            </span>
          </div>
        </div>

        {/* Master Incident Header Card */}
        <section className="w-full bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-label-md text-label-md tracking-wider text-outline uppercase font-semibold">
                {incidentId} • Automated Telemetry Discrepancy
              </span>
              <div className="bg-error-container/70 text-on-error-container font-label-sm text-label-sm px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span>
                Flagged: physically impossible
              </div>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
              Duplicate Registration Vector: <span className="font-label-md text-primary uppercase">{plateText}</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Simultaneous license plate detection recorded across disjoint municipal corridors. Delta kinematics violates urban traversal velocity ceilings.
            </p>
          </div>

          {/* Action Panel Buttons */}
          <div className="flex flex-wrap items-center gap-space-sm self-start lg:self-center">
            <button
              onClick={handleDispatchIntercept}
              className="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-headline-sm text-body-md flex items-center gap-2 shadow-sm hover:bg-primary-container transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              Dispatch Intercept Team
            </button>
            <button
              onClick={handleExportDossier}
              className="bg-surface-container-low text-on-surface hover:bg-surface-container px-4 py-2.5 rounded-lg font-body-md text-body-md flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">description</span>
              Export Forensic Dossier
            </button>
            <button
              onClick={() => handleAcknowledge("false_positive")}
              disabled={updating}
              className="bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/40 px-3.5 py-2.5 rounded-lg font-body-md text-body-md flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">rule_folder</span>
              Mark False Positive
            </button>
          </div>
        </section>

        {/* Side-by-Side Sighting Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
          {/* Sighting A Card */}
          <section className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
            <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between gap-2 pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Sighting A • Primary Detection</h2>
                </div>
                <span className="font-label-sm text-label-sm bg-secondary-fixed/40 text-on-secondary-fixed-variant px-2.5 py-1 rounded-full">
                  Baseline Target
                </span>
              </div>
              <div className="flex flex-col gap-1 text-on-surface-variant font-body-md text-body-md mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">videocam</span>
                  <span className="font-headline-sm text-body-md text-on-surface">CAM-MGR-088</span>
                  <span className="text-outline-variant">—</span>
                  <span>MG Road (Brigade Road Junction), Bengaluru</span>
                </div>
                <div className="flex items-center gap-1.5 text-outline font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Today, 09:20:14 IST</span>
                  <span className="text-outline-variant">•</span>
                  <span>Frame #88194 (30 FPS HDR)</span>
                </div>
              </div>

              {/* Camera Stream Graphic with Plate Inset */}
              <div className="relative w-full h-72 rounded-lg overflow-hidden bg-surface-container mt-space-md group">
                <img
                  className="w-full h-full object-cover"
                  alt="MG Road Camera Capture"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3HkrVFCuRfGOv68yH_baAAa1YBzE6aVIGCl--5Pg8I8hNYjLsj4f345bDvhNDFcb0vvPIGhxhRjQIEqLIGnYCtuwAlSb7wFabOAl4p5I_L-R9HwxlWpqUsJwkaS70YH6d08tP6MWt7-2QQZKGd0PpcELWb9k1f1WcXt8Zk6tIrRBt8rrMbnlfjKuF9zohrmuOGptzgppUhaFXVC74T3diWIqvzTHYlMWq7vpQb8NnGviDIreQ0-TmbA"
                />
                {/* Live Camera Feed Badging */}
                <div className="absolute top-3 left-3 bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>ANPR LOCK: CONFIDENCE 99.4%</span>
                </div>
                {/* Inset Plate Inspection Snapshot */}
                <div className="absolute bottom-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md p-2 rounded-lg shadow-md max-w-[200px] flex flex-col gap-1">
                  <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">HSRP Stamp OCR Crop</span>
                  <div className="bg-surface-container-high px-2 py-1 rounded flex items-center justify-center">
                    <span className="font-label-md text-headline-sm tracking-widest text-on-surface font-semibold">{plateText}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-label-sm text-secondary">
                    <span>Ashoka Chakra: Present</span>
                    <span>IND Laser: Valid</span>
                  </div>
                </div>
              </div>

              {/* Detailed Attributes Spec Sheet */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm mt-space-md">
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Vehicle Make</span>
                  <span className="font-headline-sm text-body-md text-on-surface mt-0.5">Hyundai Creta</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Factory Color</span>
                  <span className="font-headline-sm text-body-md text-on-surface mt-0.5">Polar White (OEM)</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Hardware Signature</span>
                  <span className="font-headline-sm text-body-md text-on-surface mt-0.5">Silver Roof Rails &amp; Sunroof</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Traffic Vector</span>
                  <span className="font-headline-sm text-body-md text-on-surface mt-0.5">Lane 1 (Westbound)</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Instantaneous Velocity</span>
                  <span className="font-headline-sm text-body-md text-secondary mt-0.5 font-semibold">34 km/h (Normal)</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Registry Match</span>
                  <span className="font-headline-sm text-body-md text-primary mt-0.5 font-semibold">Parivahan Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container/60 rounded-lg p-3 flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                Registered Owner: Anand K. Varma • Residency Indiranagar
              </span>
              <button className="text-primary hover:underline font-label-sm cursor-pointer" type="button">
                View Vahan Dossier
              </button>
            </div>
          </section>

          {/* Sighting B Card */}
          <section className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
            <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between gap-2 pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Sighting B • Concurrent Detection</h2>
                </div>
                <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-2.5 py-1 rounded-full font-semibold">
                  Suspect Clone Unit
                </span>
              </div>
              <div className="flex flex-col gap-1 text-on-surface-variant font-body-md text-body-md mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">videocam</span>
                  <span className="font-headline-sm text-body-md text-on-surface">CAM-WHT-031</span>
                  <span className="text-outline-variant">—</span>
                  <span>Whitefield Main Road (ITPL Gate), Bengaluru</span>
                </div>
                <div className="flex items-center gap-1.5 text-outline font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span className="text-tertiary font-semibold">Today, 09:23:42 IST</span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-tertiary font-medium">Δ 3m 28s from Sighting A</span>
                </div>
              </div>

              {/* Camera Stream Graphic with Plate Inset */}
              <div className="relative w-full h-72 rounded-lg overflow-hidden bg-surface-container mt-space-md group">
                <img
                  className="w-full h-full object-cover"
                  alt="Whitefield Camera Capture"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKNL87RXLUNDQclQcSEoba5SPhyF22PVhBGPmle3AZpKtbpzlxJxx5VEQAOdWo5icGtC3bcW63dqhdlb14k5nj4BqVlkf4O5x5rj74Bbcc5sFY_XPyn81gj4ZCdtwQd0lP5eLb9O93X9hNuv0ywh3E4pvW_lroAyK0dVaBC8Rl5A8XKcYSur_4T43CUcYe5E9SYBg895DpOuqAe5YHVjE6PcfO3fPBRZNDF6upZrV7ge8cv1jYfqyaBA"
                />
                {/* Live Camera Feed Badging */}
                <div className="absolute top-3 left-3 bg-tertiary/90 backdrop-blur-md text-on-tertiary px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>ANPR MATCH: {plateText}</span>
                </div>
                {/* Inset Plate Inspection Snapshot */}
                <div className="absolute bottom-3 right-3 bg-surface-container-lowest/95 backdrop-blur-md p-2 rounded-lg shadow-md max-w-[200px] flex flex-col gap-1">
                  <span className="font-label-sm text-[10px] text-tertiary uppercase tracking-wider font-semibold">
                    Visual Incongruity Detected
                  </span>
                  <div className="bg-error-container/60 px-2 py-1 rounded flex items-center justify-center">
                    <span className="font-label-md text-headline-sm tracking-widest text-on-error-container font-semibold">
                      {plateText}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-label-sm text-tertiary">
                    <span>Holotag: Non-Reflective</span>
                    <span>Font Kerning: Mismatch</span>
                  </div>
                </div>
              </div>

              {/* Detailed Attributes Spec Sheet */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm mt-space-md">
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Vehicle Make</span>
                  <span className="font-headline-sm text-body-md text-tertiary mt-0.5">Creta (Modified Trim)</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Detected Shade</span>
                  <span className="font-headline-sm text-body-md text-tertiary mt-0.5">Off-White / Dull Silver</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Hardware Signature</span>
                  <span className="font-headline-sm text-body-md text-tertiary mt-0.5">Dark Tint &amp; Sport Alloys</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Traffic Vector</span>
                  <span className="font-headline-sm text-body-md text-on-surface mt-0.5">Lane 3 (Eastbound)</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Instantaneous Velocity</span>
                  <span className="font-headline-sm text-body-md text-on-surface mt-0.5">48 km/h</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">Plate Integrity Flag</span>
                  <span className="font-headline-sm text-body-md text-tertiary mt-0.5 font-semibold">Counterfeit Acrylic</span>
                </div>
              </div>
            </div>

            <div className="bg-error-container/30 rounded-lg p-3 flex items-center justify-between text-body-sm font-body-sm text-on-error-container">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                Active Tracking: Vehicle heading towards Hope Farm Junction
              </span>
              <span className="font-label-sm font-semibold">CCTV Feed Live</span>
            </div>
          </section>
        </div>

        {/* Velocity & Spatial Telemetry Kinematics Bar */}
        <section className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Kinematic Feasibility Telemetry</h2>
            </div>
            <span className="font-label-md text-label-md text-outline">Geodesic &amp; Road Distance Matrix Algorithm v4.2</span>
          </div>

          {/* Key Kinematic Metrics 4-Col Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">Corridor Distance</span>
              <span className="font-headline-xl text-headline-xl text-on-surface mt-1">
                18.2 <span className="font-headline-sm text-headline-sm text-on-surface-variant">km</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Via Old Airport Rd / ORR</span>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">Elapsed Interval</span>
              <span className="font-headline-xl text-headline-xl text-tertiary mt-1">
                03:28 <span className="font-headline-sm text-headline-sm text-tertiary">min</span>
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Exact: 208 Seconds</span>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">Required Avg Velocity</span>
              <span className="font-headline-xl text-headline-xl text-tertiary mt-1">
                {impliedSpeed} <span className="font-headline-sm text-headline-sm text-tertiary">km/h</span>
              </span>
              <span className="font-body-sm text-body-sm text-tertiary font-medium mt-0.5">Surpasses Supercar Limit</span>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">Max Permissible @ 60 km/h</span>
              <span className="font-headline-xl text-headline-xl text-secondary mt-1">
                3.4 <span className="font-headline-sm text-headline-sm text-secondary">km</span>
              </span>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5">Urban Law Ceiling</span>
            </div>
          </div>

          {/* Visual Comparative Velocity Bars */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Bar 1: Detected Travel Impossibility */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-body-md font-body-md">
                <span className="font-headline-sm text-body-md text-tertiary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  Recorded ANPR Traversal: 18.2 km traversed in 3m 28s
                </span>
                <span className="font-label-md text-label-md font-semibold text-tertiary bg-error-container/60 px-2 py-0.5 rounded">
                  Calculated {impliedSpeed} km/h • 525% Over Upper Envelope
                </span>
              </div>
              <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-tertiary to-tertiary-container rounded-full w-full transition-all duration-1000"></div>
              </div>
            </div>

            {/* Bar 2: Max Urban Feasible Reference */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-body-md font-body-md">
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                  Max Possible Urban Distance in 3m 28s (@ 60 km/h municipal corridor limit): 3.4 km
                </span>
                <span className="font-label-md text-label-md text-secondary font-medium">18.7% of Recorded Discrepancy</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-secondary rounded-full w-[18.7%] transition-all duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Corridor Map Simulation Preview */}
          <div
            className="w-full h-40 bg-cover bg-center rounded-lg relative overflow-hidden flex items-end p-space-md shadow-sm"
            data-location="Bengaluru, Karnataka, India"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7XM8Fgk45lldfR72P1DmMqUtlSh0VCSALEpFL1gxyQqEBh5aoc-338VP9hUBGzeOXizS2GPKyfKnub8yG2kCfIuJoaRriuxNUvhLZUgzT48rHU54MEc7rb5bliWZ1s8mAwI2vFizWmL-TJ5sn5lb8cHSbo77BFAE499XPLuhIpd-PBboQcx6Di6tEmAQ07RXknASq8IeKOjeK31g7uYPcnI07oW_1z3Ddpv5Lzg7y2k9LzT4GOCG6Gw')",
            }}
          >
            <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-lg flex flex-wrap items-center gap-4 text-body-sm font-body-sm shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span>Origin: MG Road Corridor (CAM-MGR-088)</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span>Concurrent: ITPL Whitefield (CAM-WHT-031)</span>
              </div>
              <span className="text-outline-variant">•</span>
              <span className="font-label-sm text-label-sm text-outline">
                Geometric Spatial Separation: 18.2 km East-by-Northeast
              </span>
            </div>
          </div>
        </section>

        {/* Forensic Assessment & Tactical Dispatch Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Forensic Discrepancy Summary Card */}
          <section className="lg:col-span-2 bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">csv</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Forensic Discrepancy Matrix</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Automated image classification models running on Edge-Node 14 have isolated 4 non-conforming exterior visual markers confirming high probability of illegal plate cloning.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-1">
                <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">cancel</span>
                  <div>
                    <span className="font-headline-sm text-body-md text-on-surface">Wheel Hub Specification</span>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Sighting A features stock OEM diamond-cut alloys. Sighting B carries multi-spoke matte black aftermarket rim geometry.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">cancel</span>
                  <div>
                    <span className="font-headline-sm text-body-md text-on-surface">Glass Solar Transmittance</span>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Sighting B exhibits illegal 15% VLT dark tinted windows in violation of CMVR Rule 100; Sighting A retains OEM clear green glass.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">cancel</span>
                  <div>
                    <span className="font-headline-sm text-body-md text-on-surface">Bumper Skids &amp; Front Grille</span>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Sighting B shows aftermarket chrome honeycomb front insert and front-lip diffuser unlisted in Parivahan manufacturing records.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">cancel</span>
                  <div>
                    <span className="font-headline-sm text-body-md text-on-surface">HSRP Security Inscription</span>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      Infrared camera channel failed to reflect the laser-etched 10-digit PIN beneath the IND monogram on Sighting B plate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-body-sm font-body-sm text-outline pt-2">
              <span>Classifier Engine: YOLO-v9 Urban Surveillance (Trained on Indian Vehicles)</span>
              <span className="font-label-sm font-medium text-secondary">Confidence 99.8% Clone Confirmed</span>
            </div>
          </section>

          {/* Operational Dispatch Recommender Card */}
          <section className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">local_police</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Tactical Dispatch</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Target vehicle B is currently in motion. Recommended perimeter units ready for coordinated intercept.
              </p>

              <div className="flex flex-col gap-space-sm mt-1">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <div>
                      <p className="font-headline-sm text-body-md text-on-surface">Highway Patrol Unit 12 (Interceptor)</p>
                      <p className="font-label-sm text-label-sm text-outline">Staged at Hope Farm Signal • 1.2 km away</p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm font-semibold text-secondary">ETA 2 MIN</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <div>
                      <p className="font-headline-sm text-body-md text-on-surface">Whitefield Traffic PS Quick-Response</p>
                      <p className="font-label-sm text-label-sm text-outline">Pattandur Agrahara Junction • 2.4 km away</p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm font-semibold text-secondary">ETA 5 MIN</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleDispatchIntercept}
                className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-lg font-headline-sm text-body-md flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                Issue Intercept Command to Unit 12
              </button>
              <button
                onClick={handleEngageRedWave}
                className="w-full bg-surface-container-low text-on-surface hover:bg-surface-container py-2.5 px-4 rounded-lg font-body-md text-body-md flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">traffic</span>
                Engage Red-Wave at Hope Farm Signal
              </button>
            </div>
          </section>
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
