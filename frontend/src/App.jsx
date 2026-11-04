import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import AlertBanner from './components/AlertBanner';
import MetricCards from './components/MetricCards';
import TankVisualizer from './components/TankVisualizer';
import HistoryChart from './components/HistoryChart';
import ReadingsTable from './components/ReadingsTable';
import ScenarioSimulator from './components/ScenarioSimulator';
import { EXACT_ASSIGNMENT_DATA } from './data/mockData';
import { calculateTankMetrics } from './utils/tankAnalytics';
import { Layers, Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [readings, setReadings] = useState(EXACT_ASSIGNMENT_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date().toISOString());

  // Pure dynamic metric calculations from current dataset
  const metrics = useMemo(() => {
    return calculateTankMetrics(readings);
  }, [readings]);

  // Telemetry refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedAt(new Date().toISOString());
    }, 600);
  };

  // Scenario switcher
  const handleDatasetChange = (newDataset) => {
    setReadings([...newDataset]);
    setLastRefreshedAt(new Date().toISOString());
  };

  // Custom reading adder
  const handleAddReading = (newReading) => {
    setReadings((prev) => [...prev, newReading]);
    setLastRefreshedAt(new Date().toISOString());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top SaaS Header */}
      <Navbar
        lastUpdated={lastRefreshedAt}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Scenario & Testing Sandbox Bar */}
        <section aria-label="Scenario Simulator">
          <ScenarioSimulator
            currentReadings={readings}
            onDatasetChange={handleDatasetChange}
            onAddReading={handleAddReading}
          />
        </section>

        {/* Dynamic Alert Banner (Active Low vs Historical Event notification) */}
        <section aria-label="Alert Status">
          <AlertBanner metrics={metrics} />
        </section>

        {/* Prominent Metric Cards (Latest, Min, Max, Average) */}
        <section aria-label="Key Performance Metrics">
          <MetricCards metrics={metrics} />
        </section>

        {/* Visualization & Chart Grid */}
        <section aria-label="Visualization and Analytics" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tank Level Visualizer (5 columns on large screen) */}
          <div className="lg:col-span-5 flex flex-col">
            <TankVisualizer
              level={metrics.latest ? metrics.latest.level_percent : 0}
              tankCapacityLitres={10000}
            />
          </div>

          {/* Time-Series Reading History Chart (7 columns on large screen) */}
          <div className="lg:col-span-7 flex flex-col">
            <HistoryChart readings={metrics.sortedReadings} />
          </div>
        </section>

        {/* Chronological Telemetry Log Table */}
        <section aria-label="Telemetry Records">
          <ReadingsTable readings={metrics.sortedReadings} />
        </section>
      </main>

      {/* Modern SaaS Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">AquaSense IoT Platform</span>
            <span className="text-slate-300">•</span>
            <span>Nivoryx Systems Pvt. Ltd. Internship Assignment</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Automated Telemetry Audit: Active
            </span>
            <span className="text-slate-300">•</span>
            <span>Stack: React 19 • Vite • Tailwind CSS • Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
