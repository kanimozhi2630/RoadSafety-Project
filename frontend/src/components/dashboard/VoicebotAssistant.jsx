import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Mic, Activity, PhoneCall, CheckSquare, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const VoicebotAssistant = () => {
  const { emergencySent } = useTelemetry();
  const [operatorPrompt, setOperatorPrompt] = useState('Standby — establishing trauma link...');
  const [operatorTick, setOperatorTick] = useState(0);
  const [conscious, setConscious] = useState(true);
  const [painLevel, setPainLevel] = useState('none');
  const [bleeding, setBleeding] = useState(false);

  const prompts = [
    "Operator: Standby. LifeLink Emergency Trauma Command center has established voice link. Rescue teams have your GPS.",
    "Operator: We detect severe deceleration forces. Do not move your neck or spine. Keep breathing slowly.",
    "Operator: Emergency SMS alerts have successfully reached your contacts list.",
    "Operator: Ambulance is currently mapping routing. If you can hear me, please blink twice or tap the screen.",
    "Operator: Vitals feedback synchronized. Remain calm. Dispatch crew is 8 minutes out. Help is on the way."
  ];

  // Tick through operator instructions
  useEffect(() => {
    if (!emergencySent) return;

    setOperatorPrompt(prompts[0]);
    const timer = setInterval(() => {
      setOperatorTick(prev => {
        const next = Math.min(prompts.length - 1, prev + 1);
        setOperatorPrompt(prompts[next]);
        return next;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [emergencySent]);

  const handleResponseSubmit = () => {
    toast.success('🩺 Vitals updated and transmitted directly to paramedics!');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium hover:shadow-premiumHover h-80 flex flex-col justify-between overflow-hidden relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">MEDICAL RESPONSE</span>
          <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
            <Mic className="w-4 h-4 text-lifelink-red animate-pulse" />
            Trauma Dispatch Voicebot Assistant
          </h3>
        </div>
        
        {emergencySent && (
          <div className="flex items-center space-x-1 text-green-600 font-extrabold text-[9px] uppercase tracking-wider bg-green-50 border border-green-100 px-2 py-0.5 rounded animate-pulse">
            <PhoneCall className="w-3 h-3" />
            <span>LIVE LINK</span>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mt-4 overflow-y-auto pr-1 scrollbar-thin">
        {/* Left: Operator prompt display */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-between h-[155px]">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 leading-none">
            <Activity className="w-3 h-3 text-red-500 animate-pulse" />
            OPERATOR VOICE EMULATOR
          </span>
          
          <p className="text-xs font-bold text-gray-700 leading-relaxed italic my-2">
            "{emergencySent ? operatorPrompt : 'Trauma link offline. Will connect instantly after crash validation.'}"
          </p>

          <div className="flex items-center space-x-1.5 mt-1 border-t border-gray-200/50 pt-2 text-[9px] font-bold text-gray-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>VOICE DATA STREAM ENCRYPTED</span>
          </div>
        </div>

        {/* Right: Vitals quick checkboxes panel (Trauma center sync) */}
        <div className="border border-gray-100 rounded-xl p-3 flex flex-col justify-between h-[155px]">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 leading-none">
            <CheckSquare className="w-3 h-3 text-lifelink-green" />
            PARAMEDIC PRE-DISPATCH VITALS Check
          </span>

          <div className="space-y-1.5 my-2">
            <label className="flex items-center space-x-2 text-[10px] font-semibold text-gray-600">
              <input 
                type="checkbox" 
                checked={conscious} 
                onChange={(e) => setConscious(e.target.checked)}
                className="rounded border-gray-300 text-lifelink-green focus:ring-lifelink-green" 
              />
              <span>Conscious & able to respond</span>
            </label>

            <label className="flex items-center space-x-2 text-[10px] font-semibold text-gray-600">
              <input 
                type="checkbox" 
                checked={bleeding} 
                onChange={(e) => setBleeding(e.target.checked)}
                className="rounded border-gray-300 text-lifelink-green focus:ring-lifelink-green" 
              />
              <span>Active bleeding present</span>
            </label>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold text-gray-500">Pain Level:</span>
              <select 
                value={painLevel} 
                onChange={(e) => setPainLevel(e.target.value)}
                className="text-[10px] font-bold border rounded p-0.5 text-gray-700 bg-white"
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleResponseSubmit}
            disabled={!emergencySent}
            className="w-full bg-gray-900 hover:bg-black text-white py-1 px-3 rounded-lg text-[9px] font-bold transition-all disabled:opacity-50"
          >
            TRANSMIT TO DISPATCH
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-[9px] font-medium text-gray-400 z-10">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-lifelink-amber" />
          <span>Smart AI triage analyzer online</span>
        </div>
        <span>Channel: 88.5 MHz</span>
      </div>
    </div>
  );
};

export default VoicebotAssistant;
