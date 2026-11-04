import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import AlertBanner from './components/AlertBanner';
import MetricCards from './components/MetricCards';
import TankVisualizer from './components/TankVisualizer';
import HistoryChart from './components/HistoryChart';
import ReadingsTable from './components/ReadingsTable';
import DevicePanel from './components/DevicePanel';
import ScenarioSimulator from './components/ScenarioSimulator';
import { EXACT_ASSIGNMENT_DATA } from './data/mockData';
import { calculateTankMetrics } from './utils/tankAnalytics';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [readings, setReadings] = useState(EXACT_ASSIGNMENT_DATA);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date().toISOString());

  // Dynamic metric calculations directly from telemetry dataset
  const metrics = useMemo(() => {
    return calculateTankMetrics(readings);
  }, [readings]);

  // Telemetry refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedAt(new Date().toISOString());
    }, 500);
  };

  // Scenario switcher
  const handleDatasetChange = (newDataset) => {
    setReadings([...newDataset]);
    setLastRefreshedAt(new Date().toISOString());
  };

  // Custom reading injector
  const handleAddReading = (newReading) => {
    setReadings((prev) => [...prev, newReading]);
    setLastRefreshedAt(new Date().toISOString());
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased">
      {/* Industrial Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lastUpdated={lastRefreshedAt}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Control Console Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* QA Diagnostic Console & Scenario Bar */}
        <section aria-label="Diagnostic Simulator">
          <ScenarioSimulator
            onDatasetChange={handleDatasetChange}
            onAddReading={handleAddReading}
          />
        </section>

        {/* Dynamic Alarm Annunciator Banner */}
        <section aria-label="Alarm Annunciator">
          <AlertBanner metrics={metrics} />
        </section>

        {/* TAB 1: DASHBOARD (Main Industrial Control Center) */}
        {activeTab === 'dashboard' && (
          <>
            {/* Asymmetric Core Layout: Tank Vessel + Asymmetric Key Metrics */}
            <section aria-label="Primary Telemetry" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Industrial Vertical Tank Vessel (5 Columns) */}
              <div className="lg:col-span-5 h-full">
                <TankVisualizer
                  level={metrics.latest ? metrics.latest.level_percent : 0}
                  tankCapacityLitres={10000}
                />
              </div>

              {/* Right Column: Key Statistics + Device Telemetry Node (7 Columns) */}
              <div className="lg:col-span-7 space-y-5">
                <MetricCards metrics={metrics} />
                <DevicePanel latestReading={metrics.latest} />
              </div>
            </section>

            {/* Time-Series History Chart */}
            <section aria-label="Reading History Chart">
              <HistoryChart readings={metrics.sortedReadings} />
            </section>

            {/* Telemetry Log Records */}
            <section aria-label="Telemetry Log Table">
              <ReadingsTable readings={metrics.sortedReadings} />
            </section>
          </>
        )}

        {/* TAB 2: DEVICE OVERVIEW */}
        {activeTab === 'device' && (
          <section aria-label="Device Overview" className="space-y-6">
            <DevicePanel latestReading={metrics.latest} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <TankVisualizer
                  level={metrics.latest ? metrics.latest.level_percent : 0}
                  tankCapacityLitres={10000}
                />
              </div>
              <div className="lg:col-span-6">
                <MetricCards metrics={metrics} />
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: READING HISTORY */}
        {activeTab === 'history' && (
          <section aria-label="Telemetry History and Records" className="space-y-6">
            <HistoryChart readings={metrics.sortedReadings} />
            <ReadingsTable readings={metrics.sortedReadings} />
          </section>
        )}
      </main>

      {/* Industrial Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-12 py-5 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">AquaSense Industrial OS</span>
            <span className="text-slate-600">•</span>
            <span>Nivoryx Systems Assignment</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="inline-flex items-center text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Node AS-001 • Telemetry Verified
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">React 19 + Tailwind CSS + Recharts + Python/pytest</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
