import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../context/TelemetryContext';

// Import Layout Components
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

// Import Dashboard Sub-Pages
import CommandCenter from './dashboards/CommandCenter';
import RiskPrediction from './dashboards/RiskPrediction';
import AccidentDetection from './dashboards/AccidentDetection';
import EmergencyResponse from './dashboards/EmergencyResponse';
import ProfileSettings from './dashboards/ProfileSettings';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('command');
  const { emergencyActive } = useTelemetry();

  // Auto redirect to Emergency view if SOS system trips
  useEffect(() => {
    if (emergencyActive) {
      setActiveTab('emergency');
    }
  }, [emergencyActive]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* 1. Dashboard Top Header Navbar */}
      <DashboardNavbar />

      {/* 2. Core Dashboard Layout with Sidebar */}
      <div className="flex-1 flex items-stretch">
        
        {/* Left Sidebar */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Scrollable Content Pane */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'command' && <CommandCenter />}
            {activeTab === 'risk' && <RiskPrediction />}
            {activeTab === 'accident' && <AccidentDetection />}
            {activeTab === 'emergency' && <EmergencyResponse />}
            {activeTab === 'profile' && <ProfileSettings />}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
