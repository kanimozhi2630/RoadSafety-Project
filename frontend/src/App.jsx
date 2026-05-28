import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './pages/DashboardLayout';

// Loading Spinner for Route Guards
import LoadingSpinner from './components/shared/LoadingSpinner';

// Route Guards

// 1. Private Route: Ensures user is logged in
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage size="lg" />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 2. Onboarding Route: Directs logged-in users to finish onboarding
const OnboardingRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage size="lg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isOnboarded) return <Navigate to="/dashboard" replace />;
  return children;
};

// 3. Dashboard Route: Requires complete onboarding before accessing cockpit dashboard
const DashboardRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage size="lg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <Router>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<Home />} />
            
            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Onboarding steps */}
            <Route 
              path="/onboarding" 
              element={
                <OnboardingRoute>
                  <Onboarding />
                </OnboardingRoute>
              } 
            />

            {/* Core telemetry dashboards dashboard router */}
            <Route 
              path="/dashboard" 
              element={
                <DashboardRoute>
                  <DashboardLayout />
                </DashboardRoute>
              } 
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Custom professional toast container */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#374151',
                border: '1px solid #F3F4F6',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }
            }}
          />
        </Router>
      </TelemetryProvider>
    </AuthProvider>
  );
}

export default App;
