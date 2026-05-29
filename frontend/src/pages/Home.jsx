import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Cpu, 
  Flame, 
  Activity, 
  TrendingUp, 
  Map, 
  CheckCircle,
  Siren, 
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Accident Prediction',
      desc: 'Simulated Random Forest models analyze real-time driving patterns to predict hazard probabilities before they escalate.',
      icon: TrendingUp,
      color: 'text-lifelink-green bg-green-50'
    },
    {
      title: 'Accident Detection',
      desc: 'Isolation Forests flag anomalies while Boolean Decision Trees classify structural impact forces and passenger status.',
      icon: Activity,
      color: 'text-lifelink-red bg-red-50'
    },
    {
      title: 'Emergency Response',
      desc: 'Initiates a 30s countdown to automatically trigger SMS notifications with GPS maps, dispatching Police and Ambulance.',
      icon: Flame,
      color: 'text-lifelink-amber bg-amber-50'
    },
    {
      title: 'Safety Monitoring',
      desc: 'Telemetry indicators continuously observe brake lock spikes, swerving angles, weather slickness, and driver drowsiness.',
      icon: Map,
      color: 'text-blue-500 bg-blue-50'
    }
  ];

  const steps = [
    {
      title: '1. AI Prediction Hub',
      desc: 'Continuous observation of speeds, lane weave steering deviations, and weather logs to calculate safety thresholds.',
      icon: Cpu
    },
    {
      title: '2. Isolation Forest Anomaly',
      desc: 'G-force vibration spikes or sharp deceleration events trip immediate Isolation Forest anomaly classifiers.',
      icon: ShieldAlert
    },
    {
      title: '3. Decision Tree Verification',
      desc: 'Roll tilt sensors and vitals assess crash severity (MINOR, SEVERE, CRITICAL) within milliseconds.',
      icon: CheckCircle
    },
    {
      title: '4. Critical Dispatch & Rescue',
      desc: 'Launches cockpit vitals cameras, establishes paramedic operator links, and alerts emergency units.',
      icon: Siren
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Sticky Header Navbar */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <img src="/logo.png" alt="IntelSOS Logo" className="h-9 w-auto object-contain" />
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">IntelSOS</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-gray-900 transition-colors">Home</a>
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-gray-900 transition-colors">Workflow</a>
          <a href="#about" className="hover:text-gray-900 transition-colors">About Us</a>
        </nav>

        <div className="flex items-center space-x-3">
          <Link 
            to="/login" 
            className="text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-xl transition-all"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-lifelink-green hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-green-100"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Sections Wrapper */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-1.5 bg-green-50 border border-green-100 px-3 py-1 rounded-full text-lifelink-green text-[10px] font-bold uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 bg-lifelink-green rounded-full" />
              <span>Smart Transportation Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-none tracking-tight">
              The Golden Minute Saves Lives.<br />
              <span className="text-lifelink-green">IntelSOS Assures It.</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-lg leading-relaxed font-medium">
              An AI-powered emergency management ecosystem connecting vehicle sensors to paramedic trauma networks. Predicting risks, verifying impacts, and automating dispatches in milliseconds.
            </p>
            <div className="flex items-center space-x-4">
              <Link 
                to="/register" 
                className="bg-lifelink-green hover:bg-green-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-100 flex items-center gap-1.5"
              >
                <span>Initialize Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#features" 
                className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-white border px-6 py-3 rounded-xl transition-all"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Hero Premium SVG Visualization (Tesla-style Autopilot Radar Sweep) */}
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-gray-100 bg-[#E5E7EB] flex items-center justify-center shadow-lg">
            {/* Animated SVG highway */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" preserveAspectRatio="none">
              <rect x="120" y="0" width="160" height="320" fill="#374151" />
              <line x1="120" y1="0" x2="120" y2="320" className="stroke-gray-300 stroke-2" />
              <line x1="280" y1="0" x2="280" y2="320" className="stroke-gray-300 stroke-2" />
              {/* Lane Dividers */}
              <line x1="173" y1="0" x2="173" y2="320" className="stroke-green-300 stroke-2 stroke-dasharray-[10,15] animate-[laneMove_1.5s_linear_infinite]" strokeDasharray="10 15" />
              <line x1="226" y1="0" x2="226" y2="320" className="stroke-green-300 stroke-2 stroke-dasharray-[10,15] animate-[laneMove_1.5s_linear_infinite]" strokeDasharray="10 15" />
            </svg>

            {/* Radar sweep overlay */}
            <div className="absolute inset-0 pointer-events-none radar-sweep-bg" />

            {/* Vehicle Dot centered */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center bg-white/95 p-3.5 rounded-full border border-gray-100 shadow-lg w-20 h-20">
              <img src="/logo.png" alt="IntelSOS Logo" className="w-10 h-10 object-contain animate-pulse" />
              <span className="bg-gray-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">IntelSOS</span>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="bg-white border-y border-gray-100 py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[10px] font-bold text-lifelink-green uppercase tracking-widest">ECOSYSTEM MATRIX</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
                AI-Driven Safe Transportation Architecture
              </h2>
              <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                Complete integration from sensor-level predictive risk assessments to automated vital broadcasts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div key={index} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl space-y-4 hover:shadow-premiumHover hover:border-gray-200 transition-all duration-300">
                    <div className={`p-3 rounded-xl w-fit ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900">{feat.title}</h3>
                    <p className="text-xs font-semibold text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TIMELINE WORKFLOW SECTION */}
        <section id="workflow" className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-lifelink-green uppercase tracking-widest">OPERATIONAL PROTOCOL</span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
              How IntelSOS Automates Emergency Management
            </h2>
            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
              Step-by-step breakdown of active crash predictive assessments and dispatch logistics.
            </p>
          </div>

          {/* Workflow vertical line connectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white border p-6 rounded-2xl shadow-premium relative z-10 flex flex-col justify-between h-44 hover:shadow-premiumHover transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-lifelink-greenLight p-2.5 rounded-xl text-lifelink-green">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">PHASE {index+1}</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 leading-none mb-1.5">{step.title}</h3>
                    <p className="text-[11px] font-medium text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="bg-white border-t border-gray-100 py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[10px] font-bold text-lifelink-green uppercase tracking-widest">ABOUT INTELSOS</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
                Pioneering Intelligent Emergency Response
              </h2>
              <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                Empowering safety ecosystems with real-time predictive analytics and immediate crisis orchestration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-4 hover:shadow-premiumHover hover:border-gray-200 transition-all duration-300">
                <div className="p-3 bg-green-50 text-lifelink-green rounded-xl w-fit">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">What is IntelSOS?</h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                  IntelSOS is an AI-powered smart transportation emergency platform designed to predict hazards, detect collisions, and automate first-responder alerts. Synthesizing cutting-edge machine learning with immediate vehicle telemetry, IntelSOS eliminates the critical delays that occur during transit crises.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-4 hover:shadow-premiumHover hover:border-gray-200 transition-all duration-300">
                <div className="p-3 bg-red-50 text-lifelink-red rounded-xl w-fit">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">The Golden Minute</h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                  The "Golden Minute" refers to the initial 60 seconds directly following a high-impact crash. Medical intervention within this brief window decreases mortality rates exponentially. IntelSOS’s high-speed collision validation initiates countdowns and broadcasts precise coordinates in milliseconds, preserving vital time.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-4 hover:shadow-premiumHover hover:border-gray-200 transition-all duration-300">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl w-fit">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">AI Safety Intelligence</h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                  By tracking driving telemetry (G-force spikes, swerving angles, heavy braking, drowsiness), our integrated Random Forest models forecast risk levels. If an anomaly is identified, automated Isolation Forests verify structural impact forces to immediately classify crash severity.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-8 rounded-2xl space-y-4 hover:shadow-premiumHover hover:border-gray-200 transition-all duration-300">
                <div className="p-3 bg-amber-50 text-lifelink-amber rounded-xl w-fit">
                  <Siren className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">Autonomous Synchronization</h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                  In severe accidents, the application links directly to municipal dispatch units, sending emergency contacts instant Google Maps visual paths and vital reports via SMS. Our built-in voice assistant and interactive webcams enable paramedics to consult with passengers in real time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="IntelSOS Logo" className="h-8 w-auto object-contain" />
            <span className="font-extrabold text-md text-gray-900 tracking-tight">IntelSOS</span>
          </div>
          
          <p className="text-xs font-bold text-gray-400 tracking-wide text-center">
            © 2026 IntelSOS Systems Inc. All rights reserved. Platform optimized for Google Chrome.
          </p>

          <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Link to="/login" className="hover:text-gray-900">Sign In</Link>
            <span className="h-3 w-px bg-gray-200" />
            <Link to="/register" className="hover:text-gray-900">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
