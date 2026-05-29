import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import StatusBadge from '../shared/StatusBadge';
import { Shield, MapPin, User, LogOut, Settings, Bell, Menu, X } from 'lucide-react';

const DashboardNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { telemetry, riskAssessment } = useTelemetry();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getProfileInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-14 md:h-16 border-b border-gray-100 bg-white px-3 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left: Hamburger + Brand name */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <img src="/logo.png" alt="IntelSOS Logo" className="h-7 md:h-9 w-auto object-contain" />
        <div className="hidden sm:block">
          <span className="font-bold text-gray-900 tracking-tight text-base md:text-lg">IntelSOS</span>
          <span className="text-[10px] text-gray-400 font-medium ml-1.5 md:ml-2 uppercase tracking-widest bg-gray-50 px-1.5 md:px-2 py-0.5 rounded border hidden md:inline">V2.0 PRO</span>
        </div>
      </div>

      {/* Center: Live status indicators directly in topbar */}
      {telemetry && (
        <div className="hidden lg:flex items-center space-x-4 bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-gray-500 font-medium">GPS:</span>
            <span className="flex items-center text-xs font-semibold text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-lifelink-green mr-0.5" />
              {telemetry.gpsLat.toFixed(4)}, {telemetry.gpsLng.toFixed(4)}
            </span>
          </div>

          <div className="h-4 w-px bg-gray-200" />

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <StatusBadge status={telemetry.riskLevel} text={telemetry.riskLevel === 'SAFE' ? 'SYSTEM OK' : telemetry.riskLevel} />
          </div>

          {riskAssessment && (
            <>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-gray-500 font-medium">Risk Score:</span>
                <span className={`text-xs font-bold ${
                  riskAssessment.overallRisk > 70 ? 'text-lifelink-red' : riskAssessment.overallRisk > 40 ? 'text-lifelink-amber' : 'text-lifelink-green'
                }`}>
                  {riskAssessment.overallRisk}%
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Right: Notification bell + User profile menu dropdown */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Alerts count warning button */}
        {riskAssessment && riskAssessment.overallRisk > 40 && (
          <button className="relative p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors text-lifelink-amber animate-bounce">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-lifelink-red rounded-full ring-2 ring-white" />
          </button>
        )}

        {/* User profile dropdown container */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 md:space-x-3 p-1 md:p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            {user && user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-lifelink-green/20"
              />
            ) : (
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-lifelink-green text-white flex items-center justify-center font-bold text-xs md:text-sm ring-2 ring-lifelink-green/20">
                {getProfileInitials()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-none">{user?.name || 'Driver Profile'}</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 leading-none">{user?.plateNumber || 'Car Mode'}</p>
            </div>
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay background to close */}
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg py-2 z-40 animate-float">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs font-bold text-gray-800">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="py-1">
                  <div className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-600">
                    <span className="font-semibold text-gray-400 uppercase tracking-widest text-[9px]">Medical Details</span>
                  </div>
                  <div className="px-4 py-1 flex flex-wrap gap-1.5">
                    <span className="bg-red-50 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold border border-red-100">
                      Blood: {user?.bloodGroup || 'O+'}
                    </span>
                    {user?.allergies && (
                      <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-100 truncate max-w-[120px]">
                        Allergy: {user?.allergies}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-50 my-1.5" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Logout from IntelSOS</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
