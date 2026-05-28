import React from 'react';
import DetectionPhaseCard from '../../components/dashboard/DetectionPhaseCard';
import { ShieldCheck, HelpCircle, Activity, Sparkles, Cpu, GitBranch } from 'lucide-react';

const AccidentDetection = () => {
  return (
    <div className="space-y-6">
      {/* 1. ML Dual Phase Detection Engine */}
      <DetectionPhaseCard />

      {/* 2. Deep explanation cards of the Two-Phase Machine Learning Architecture */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-premium hover:shadow-premiumHover">
        <div className="mb-6">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">SYSTEM DOCUMENTATION</span>
          <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
            <Cpu className="w-4 h-4 text-lifelink-green" />
            Two-Phase Collision Verification Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phase 1 Explainer */}
          <div className="space-y-3.5 border-r border-gray-50 pr-0 md:pr-8">
            <div className="flex items-center space-x-2.5 bg-green-50 border border-green-100 text-lifelink-green px-3.5 py-1.5 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 text-lifelink-green" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider leading-none">PHASE 1: MULTI-VARIATE ANOMALY FILTER</span>
            </div>
            
            <h4 className="text-sm font-extrabold text-gray-800">
              Isolation Forest Outlier Separation
            </h4>
            
            <p className="text-xs font-semibold text-gray-500 leading-relaxed">
              Isolation Forests work by isolating anomalies instead of profiling normal patterns. By recursively partitioning multi-dimensional sensor variables (velocity slips, vibration surges, deceleration peaks), anomalous anomalies are pushed to the shallow nodes of decision paths.
            </p>

            <div className="text-[11px] font-bold text-gray-400 space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-gray-600 font-extrabold mb-1 uppercase tracking-wide text-[9px]">Sensors observed:</p>
              <p>✔ Wheel Speed angular slips (Cruising Decelerations)</p>
              <p>✔ Harsh Braking locking forces {"(Brake Pressure > 70%)"}</p>
              <p>✔ Sharp steering angular corrections (Lateral swerving)</p>
              <p>✔ Micro-shock vertical impacts (Potholes / minor bumps)</p>
            </div>
          </div>

          {/* Phase 2 Explainer */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2.5 bg-red-50 border border-red-100 text-lifelink-red px-3.5 py-1.5 rounded-xl w-fit">
              <GitBranch className="w-4 h-4 text-lifelink-red animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider leading-none">PHASE 2: PHYSICAL COLLISION VALIDATOR</span>
            </div>

            <h4 className="text-sm font-extrabold text-gray-800">
              Boolean Decision Tree Severity Classifier
            </h4>

            <p className="text-xs font-semibold text-gray-500 leading-relaxed">
              If Phase 1 flags an anomaly, Phase 2 executes a strict, deterministic physical boolean validation chain. This prevents false alarms (like dropping a phone in the car or navigating heavy potholes) by verifying heavy G-force thresholds and structural vehicle changes.
            </p>

            <div className="text-[11px] font-bold text-gray-400 space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-gray-600 font-extrabold mb-1 uppercase tracking-wide text-[9px]">Decision parameters:</p>
              <p>✔ True Impact Forces {"(Vibration index >= 3.0g)"}</p>
              <p>✔ Structural Rollovers {"(Roll tilt angles >= 30°)"}</p>
              <p>✔ Post-Impact Velocities (Immediate vehicle lock/seizure)</p>
              <p>✔ Biological Occupant vitals (Eye blink responsive patterns)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentDetection;
