import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import RiskGauge from '../../components/dashboard/RiskGauge';
import RiskBreakdownCard from '../../components/dashboard/RiskBreakdownCard';
import { AlertCircle, ShieldCheck, HelpCircle, Activity } from 'lucide-react';

const RiskPrediction = () => {
  const { telemetry, riskAssessment } = useTelemetry();

  if (!telemetry || !riskAssessment) return null;

  const matrix = [
    { name: 'Driver Fatigue Index', weight: '25%', value: `${telemetry.fatigueLevel}%`, desc: 'Monitors drowsiness, blink frequencies, and steering lapses.' },
    { name: 'Velocity Risk Gradient', weight: '20%', value: `${telemetry.speed} km/h`, desc: 'Monitors speeds against safety thresholds and weather slickness.' },
    { name: 'Hydroplaning Weather Coeff', weight: '15%', value: `${telemetry.rainCondition}%`, desc: 'Evaluates wet road surface conditions and hydroplane hazards.' },
    { name: 'Steering Drift Volatility', weight: '15%', value: `${telemetry.steeringAngle}°`, desc: 'Evaluates lane weaving drift profiles and rapid steering swerves.' },
    { name: 'Chassis Stability Risk', weight: '15%', value: `${telemetry.vibration}g`, desc: 'Evaluates micro-shock vibrations and vertical chassis force jumps.' },
    { name: 'G-Force Decelerometer', weight: '10%', value: telemetry.motionAnomaly ? 'Active' : 'Nominal', desc: 'Checks sharp forward braking anomalies or roll shifts.' }
  ];

  const getOverallStateBadge = (level) => {
    if (level === 'DANGER') return 'bg-red-50 text-red-700 border-red-100';
    if (level === 'WARNING') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-green-50 text-green-700 border-green-100';
  };

  return (
    <div className="space-y-6">
      {/* Upper Grid: circular gauge + progressive risk breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <RiskGauge score={riskAssessment.overallRisk} />
        </div>
        <div className="md:col-span-2">
          <RiskBreakdownCard breakdown={riskAssessment.breakdown} />
        </div>
      </div>

      {/* Actionable Warning Notifications banner */}
      {riskAssessment.level !== 'SAFE' && (
        <div className={`p-4 border rounded-xl flex items-start space-x-3 shadow-sm select-none ${
          riskAssessment.level === 'DANGER' ? 'bg-red-50 border-red-200/50 text-red-800' : 'bg-amber-50 border-amber-200/50 text-amber-800'
        }`}>
          <AlertCircle className={`w-5 h-5 shrink-0 ${riskAssessment.level === 'DANGER' ? 'text-lifelink-red animate-bounce' : 'text-lifelink-amber animate-pulse'}`} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider leading-none mb-1">
              Active Hazard Warnings Issued By IntelSOS ML
            </h4>
            <div className="text-[11px] font-semibold space-y-1 mt-1.5">
              {riskAssessment.warnings.map((warn, i) => (
                <p key={i}>• {warn}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Explainability Table: Random Forest Parameter explainability Matrix */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium hover:shadow-premiumHover">
        <div className="mb-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">AI ALGORITHMS</span>
          <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
            <Activity className="w-4 h-4 text-lifelink-green" />
            Random Forest Parameter Explainability Matrix
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-50 bg-gray-50/20">
          <table className="w-full text-left text-xs font-semibold text-gray-600">
            <thead className="bg-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b">
              <tr>
                <th className="px-4 py-3">Safety Parameters</th>
                <th className="px-4 py-3">Forest Weight</th>
                <th className="px-4 py-3">Live Value</th>
                <th className="px-4 py-3">Covariance Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {matrix.map((row, index) => (
                <tr key={index} className="hover:bg-white transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-extrabold">{row.name}</td>
                  <td className="px-4 py-3 text-lifelink-green font-black">{row.weight}</td>
                  <td className="px-4 py-3 font-bold text-gray-700 bg-gray-100/30 px-2 py-0.5 rounded w-fit">{row.value}</td>
                  <td className="px-4 py-3 text-[11px] font-medium text-gray-400">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskPrediction;
