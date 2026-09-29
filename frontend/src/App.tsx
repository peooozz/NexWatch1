import React, { useState, useEffect } from "react";
import { OverviewScreen } from "./components/OverviewMap/OverviewScreen";
import { VehicleSearchScreen } from "./components/VehicleSearch/VehicleSearchScreen";
import { AlertDetailScreen } from "./components/AlertDetail/AlertDetailScreen";
import { AnalyticsScreen } from "./components/Analytics/AnalyticsScreen";
import {
  Anomaly,
  fetchAnomalies,
  getWebSocketAlertsUrl,
} from "./api/client";

export type NavTab = "overview" | "vehicle-search" | "alert-detail" | "analytics";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | null>(null);
  const [searchTargetPlate, setSearchTargetPlate] = useState<string>("KA 01 MJ 5521");
  const [currentTime, setCurrentTime] = useState<string>("14:38:09 IST");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load anomalies
  const refreshAnomalies = async () => {
    try {
      const data = await fetchAnomalies();
      setAnomalies(data);
      if (data.length > 0 && selectedAnomalyId === null) {
        setSelectedAnomalyId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch anomalies:", err);
    }
  };

  useEffect(() => {
    refreshAnomalies();
  }, []);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket for Live Alerts
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;

    const connectWs = () => {
      try {
        ws = new WebSocket(getWebSocketAlertsUrl());

        ws.onopen = () => {
          console.log("Connected to Live Anomaly WebSocket");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "new_anomaly") {
              const newAnomaly: Anomaly = data.payload;
              setAnomalies((prev) => [newAnomaly, ...prev.filter((a) => a.id !== newAnomaly.id)]);
              setSelectedAnomalyId(newAnomaly.id);
              setToastMessage(
                `🚨 NEW CLONE ALERT: Plate ${newAnomaly.plate_text} flagged at ${Math.round(
                  newAnomaly.implied_speed_kmh
                )} km/h!`
              );
              setTimeout(() => setToastMessage(null), 7000);
            }
          } catch (e) {
            console.error("Error parsing WS message:", e);
          }
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWs, 3000);
        };

        ws.onerror = (err) => {
          console.warn("WebSocket connection warning:", err);
        };
      } catch (err) {
        console.error("Failed to establish WebSocket connection:", err);
      }
    };

    connectWs();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  const openAnomaliesCount = anomalies.filter((a) => a.status === "open").length || 3;
  const currentAnomaly = anomalies.find((a) => a.id === selectedAnomalyId) || anomalies[0] || null;

  return (
    <div className="bg-gradient-to-br from-[#f1f5f9] via-[#edf2f9] to-[#e8eef7] text-slate-800 font-sans min-h-screen selection:bg-blue-100 selection:text-blue-900 antialiased overflow-x-hidden">
      {/* Stitch Design System Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] h-16">
        <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 max-w-[1920px] mx-auto">
          {/* Logo & Operational Status */}
          <div
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none"
            onClick={() => setActiveTab("overview")}
          >
            <img
              alt="CivicFlow Traffic Operations Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VDHne-4qFSUzG9sYkLTcUUJVqSjkzipIzl86DYlvSfbgBI06dZl_8EjnzW2XQSb4JDHnYUCpY-gTMx50XEmo0oR4uoA6GafiuTPxxxpy32js3mIUDUlzaK9J4lBpNPxMeYZ9emfyisPjbJjHUgCYbbFUgv04wGcYjHwaoEeoPLZMd_ITChJLZqAVrIk269xMbbp_U41R8KK7gWOTSK1QePLg7DrC2qNR2Zix6olxhda86ZQ7A8QCx3W4Un"
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px] sm:text-[16px] text-slate-900 tracking-tight whitespace-nowrap">CivicFlow ATCS</span>
              <span className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-teal-800 text-[11px] font-semibold border border-slate-200/60 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                Live Operations • Bengaluru Metropolitan
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-200/60 backdrop-blur-md p-1 rounded-full border border-slate-300/60 shadow-inner shrink-0">
            <button
              id="nav-tab-overview"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              Overview Map
            </button>
            <button
              id="nav-tab-vehicle-search"
              onClick={() => setActiveTab("vehicle-search")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "vehicle-search"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              Vehicle Search &amp; Trajectory
            </button>
            <button
              id="nav-tab-alert-detail"
              onClick={() => setActiveTab("alert-detail")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "alert-detail"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              <span>Cloned Plate Alerts</span>
              {openAnomaliesCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                    activeTab === "alert-detail" ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {openAnomaliesCount}
                </span>
              )}
            </button>
            <button
              id="nav-tab-analytics"
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              Traffic Analytics
            </button>
          </nav>

          {/* Right Action Icons & Officer Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-slate-700 text-xs whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              <span className="font-semibold text-teal-700">99.4% Network Health</span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/70 text-slate-700 font-mono text-xs font-medium whitespace-nowrap">
              <span className="material-symbols-outlined text-[15px] text-slate-500">schedule</span>
              <span>{currentTime}</span>
            </div>
            <button
              onClick={() => setActiveTab("alert-detail")}
              className="relative p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              type="button"
              title="Active Alerts"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {openAnomaliesCount}
              </span>
            </button>
            <div className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/60 shrink-0">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[16px]">person</span>
              </div>
              <div className="text-left hidden sm:block whitespace-nowrap">
                <p className="text-xs font-bold text-slate-800 leading-tight">Insp. Rajesh Sharma</p>
                <p className="text-[10px] text-slate-500 leading-tight">Desk 04 • Central Control</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          onClick={() => {
            setActiveTab("alert-detail");
            setToastMessage(null);
          }}
          className="fixed top-20 right-6 z-50 glass-panel px-4 py-3 rounded-2xl shadow-glass-modal border border-rose-300 bg-white/95 text-rose-800 text-xs font-bold flex items-center gap-3 cursor-pointer animate-bounce hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-rose-600 text-[20px]">warning</span>
          <span>{toastMessage}</span>
          <span className="underline ml-1 text-blue-600">Review &gt;</span>
        </div>
      )}

      {/* Main Screen Body */}
      <main className="w-full pt-16 min-h-screen">
        {activeTab === "overview" && (
          <OverviewScreen
            onSelectAnomaly={(id) => {
              setSelectedAnomalyId(id);
              setActiveTab("alert-detail");
            }}
            onSearchPlate={(plate) => {
              setSearchTargetPlate(plate);
              setActiveTab("vehicle-search");
            }}
            realtimeAnomalies={anomalies}
          />
        )}

        {activeTab === "vehicle-search" && (
          <VehicleSearchScreen initialPlate={searchTargetPlate} />
        )}

        {activeTab === "alert-detail" && (
          <AlertDetailScreen
            anomaly={currentAnomaly}
            onRefresh={refreshAnomalies}
            onBackToOverview={() => setActiveTab("overview")}
          />
        )}

        {activeTab === "analytics" && <AnalyticsScreen />}
      </main>
    </div>
  );
};

export default App;
