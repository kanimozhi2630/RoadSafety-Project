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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { emergencyActive } = useTelemetry();

  // Auto redirect to Emergency view if SOS system trips
  useEffect(() => {
    if (emergencyActive) {
      setActiveTab('emergency');
    }
  }, [emergencyActive]);

  // Close sidebar on tab change (mobile)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* 1. Dashboard Top Header Navbar */}
      <DashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* 2. Core Dashboard Layout with Sidebar */}
      <div className="flex-1 flex items-stretch relative">
        
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - hidden on mobile, slide-in when toggled */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:block
        `}>
          <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>

        {/* Right Scrollable Content Pane */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-thin w-full">
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
