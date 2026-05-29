import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShieldCheck, ShieldAlert, Cpu, GitBranch, Terminal } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const DetectionPhaseCard = () => {
  const { telemetry, isolationForestResult, decisionTreeResult } = useTelemetry();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
      {/* PHASE 1: Isolation Forest (Anomalous Event Detection) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium hover:shadow-premiumHover flex flex-col justify-between min-h-[360px]">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 leading-none">
              <Cpu className="w-3.5 h-3.5 text-lifelink-green" />
              Machine Learning Engine
            </span>
            <span className="text-[9px] font-extrabold text-gray-300 uppercase tracking-widest bg-gray-50 border px-2 py-0.5 rounded leading-none">
              PHASE 1
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-gray-800">
            Isolation Forest Anomaly Analyzer
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm leading-snug">
            Evaluates sensor covariance anomalies to immediately flag erratic driving behaviors, heavy brake locking, or sharp chassis swerves.
          </p>
        </div>

        {/* Dynamic status display */}
        <div className="my-5 border border-gray-50 rounded-xl bg-gray-50/50 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">ANOMALY STATE</span>
            <StatusBadge 
              status={isolationForestResult?.status || 'NORMAL'} 
              text={isolationForestResult?.status === 'NORMAL' ? 'NOMINAL BEHAVIOR' : 'ERRATIC ANOMALY'} 
            />
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">COVARIANCE SCORE</span>
            <span className={`text-2xl font-black ${
              isolationForestResult?.status === 'ABNORMAL' ? 'text-lifelink-red animate-pulse' : 'text-lifelink-green'
            }`}>
              {isolationForestResult ? Math.round(isolationForestResult.anomalyScore * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Feature checked indicators list */}
        <div className="space-y-2">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Terminal className="w-3.5 h-3.5 text-gray-400" />
            Isolator Target Logs:
          </span>
          <div className="bg-gray-900 rounded-lg p-3 text-[10px] font-mono text-green-400 overflow-y-auto max-h-[110px] space-y-1 scrollbar-thin">
            <p className="text-gray-500 font-semibold">[IntelSOS ML Kernel Online]</p>
            {isolationForestResult?.features ? (
              isolationForestResult.features.map((feature, i) => (
                <p key={i} className={isolationForestResult.status === 'ABNORMAL' ? 'text-red-400' : 'text-green-400'}>
                  ➔ {feature}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Awaiting sensor updates...</p>
            )}
          </div>
        </div>
      </div>

      {/* PHASE 2: Decision Tree (Accident Validation & Severity Class) */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium hover:shadow-premiumHover flex flex-col justify-between min-h-[360px]">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 leading-none">
              <GitBranch className="w-3.5 h-3.5 text-lifelink-green" />
              Boolean Logic Tree
            </span>
            <span className="text-[9px] font-extrabold text-gray-300 uppercase tracking-widest bg-gray-50 border px-2 py-0.5 rounded leading-none">
              PHASE 2
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-gray-800">
            Decision Tree Severity Classifier
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm leading-snug">
            Validates machine learning alerts using structural physical sensor telemetry (Vibration G-force, roll indices, velocity arrest, vital responsiveness).
          </p>
        </div>

        {/* Dynamic status display */}
        <div className="my-5 border border-gray-50 rounded-xl bg-gray-50/50 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">CRASH VALIDITY</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm ${
              decisionTreeResult?.isAccident 
                ? 'bg-red-100 text-red-800 border-red-300 animate-pulse' 
                : 'bg-green-50 text-green-700 border-green-200/60'
            }`}>
              {decisionTreeResult?.isAccident ? '🚨 COLLISION VERIFIED' : '✅ SAFETY ASSURED'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">SEVERITY INDEX</span>
            <StatusBadge status={decisionTreeResult?.severity || 'NORMAL'} />
          </div>
        </div>

        {/* Decision reasoning chain timeline */}
        <div className="space-y-2">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <Terminal className="w-3.5 h-3.5 text-gray-400" />
            Decision Reasoning Chain:
          </span>
          <div className="bg-gray-900 rounded-lg p-3 text-[10px] font-mono text-green-400 overflow-y-auto max-h-[110px] space-y-1.5 scrollbar-thin">
            {decisionTreeResult?.decisionReasoning ? (
              decisionTreeResult.decisionReasoning.map((step, i) => (
                <p 
                  key={i} 
                  className={
                    step.includes('🚨') || step.includes('CRITICAL') || step.includes('SEVERE') 
                      ? 'text-red-400 font-bold' 
                      : step.includes('✅') 
                      ? 'text-green-400 font-bold' 
                      : 'text-gray-400'
                  }
                >
                  {step}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Awaiting ML verification...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionPhaseCard;
