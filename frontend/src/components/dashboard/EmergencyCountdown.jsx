import React, { useEffect, useRef, useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useAuth } from '../../context/AuthContext';
import { Send, ShieldCheck, Siren, AlertTriangle, Mic, Video } from 'lucide-react';

// ── Regional Voicebot Messages ──────────────────────────────────────────
const VOICEBOT_MESSAGES = {
  English: {
    SEVERE: [
      'Please stay calm.',
      'Avoid sudden movement.',
      'Help can be dispatched if required.',
      'Emergency contact has been notified.'
    ],
    CRITICAL: [
      'Please remain still.',
      'Emergency assistance has been initiated.',
      'Try to remain conscious.',
      'Help is arriving.'
    ]
  },
  Tamil: {
    SEVERE: [
      'அமைதியாக இருங்கள்.',
      'திடீரென நகர வேண்டாம்.',
      'உதவி விரைவில் வரும்.',
      'அவசர உதவி தொடர்பு கொள்ளப்பட்டுள்ளது.'
    ],
    CRITICAL: [
      'அசையாமல் இருங்கள்.',
      'அவசர உதவி தொடங்கப்பட்டது.',
      'நினைவுடன் இருக்க முயற்சி செய்யுங்கள்.',
      'உதவி வருகிறது.'
    ]
  },
  Hindi: {
    SEVERE: [
      'कृपया शांत रहें।',
      'अचानक हिलें नहीं।',
      'जरूरत पड़ने पर मदद भेजी जा सकती है।',
      'आपातकालीन संपर्क को सूचित किया गया है।'
    ],
    CRITICAL: [
      'कृपया स्थिर रहें।',
      'आपातकालीन सहायता शुरू की गई है।',
      'होश में रहने की कोशिश करें।',
      'मदद आ रही है।'
    ]
  },
  Malayalam: {
    SEVERE: [
      'ദയവായി ശാന്തമായിരിക്കൂ.',
      'പെട്ടെന്ന് ചലിക്കരുത്.',
      'ആവശ്യമെങ്കിൽ സഹായം അയയ്ക്കാം.',
      'എമർജൻസി കോൺടാക്ടിനെ അറിയിച്ചു.'
    ],
    CRITICAL: [
      'ദയവായി അനങ്ങാതിരിക്കൂ.',
      'എമർജൻസി സഹായം ആരംഭിച്ചു.',
      'ബോധം നിലനിർത്താൻ ശ്രമിക്കൂ.',
      'സഹായം വരുന്നു.'
    ]
  },
  Telugu: {
    SEVERE: [
      'దయచేసి ప్రశాంతంగా ఉండండి.',
      'అకస్మాత్తుగా కదలకండి.',
      'అవసరమైతే సహాయం పంపబడుతుంది.',
      'అత్యవసర సంపర్కం తెలియజేయబడింది.'
    ],
    CRITICAL: [
      'దయచేసి కదలకుండా ఉండండి.',
      'అత్యవసర సహాయం ప్రారంభమైంది.',
      'స్పృహలో ఉండటానికి ప్రయత్నించండి.',
      'సహాయం వస్తోంది.'
    ]
  },
  Kannada: {
    SEVERE: [
      'ದಯವಿಟ್ಟು ಶಾಂತವಾಗಿರಿ.',
      'ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಚಲಿಸಬೇಡಿ.',
      'ಅಗತ್ಯವಿದ್ದರೆ ಸಹಾಯ ಕಳುಹಿಸಬಹುದು.',
      'ತುರ್ತು ಸಂಪರ್ಕಕ್ಕೆ ತಿಳಿಸಲಾಗಿದೆ.'
    ],
    CRITICAL: [
      'ದಯವಿಟ್ಟು ಅಲುಗಾಡಬೇಡಿ.',
      'ತುರ್ತು ಸಹಾಯ ಪ್ರಾರಂಭವಾಗಿದೆ.',
      'ಪ್ರಜ್ಞೆಯಲ್ಲಿ ಇರಲು ಪ್ರಯತ್ನಿಸಿ.',
      'ಸಹಾಯ ಬರುತ್ತಿದೆ.'
    ]
  }
};

// BCP-47 language tags for SpeechSynthesis
const LANG_CODES = {
  English: 'en-IN',
  Tamil: 'ta-IN',
  Hindi: 'hi-IN',
  Malayalam: 'ml-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN'
};

// ── Component ───────────────────────────────────────────────────────────
const EmergencyCountdown = () => {
  const { 
    emergencyTimer, 
    emergencySeverity,
    emergencySent,
    cancelEmergencySOS, 
    forceEmergencyDispatchNow 
  } = useTelemetry();
  const { user } = useAuth();

  const beepIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [voicebotActive, setVoicebotActive] = useState(false);
  const [voicebotLine, setVoicebotLine] = useState('');
  const cleanedUpRef = useRef(false);

  const isCritical = emergencySeverity === 'CRITICAL';
  const lang = user?.preferredLanguage || 'English';

  // ── TASK 2: Continuous Emergency Beep ─────────────────────────────
  useEffect(() => {
    cleanedUpRef.current = false;

    // Create AudioContext once
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not available');
    }

    const playBeep = () => {
      if (!audioCtxRef.current || cleanedUpRef.current) return;
      try {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        // CRITICAL: higher pitch, SEVERE: softer pitch
        osc.frequency.setValueAtTime(isCritical ? 880 : 660, ctx.currentTime);
        gain.gain.setValueAtTime(isCritical ? 0.12 : 0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        // Silently ignore audio errors
      }
    };

    // Play first beep immediately
    playBeep();

    // Set interval: CRITICAL = 1s, SEVERE = 2.5s
    const interval = isCritical ? 1000 : 2500;
    beepIntervalRef.current = setInterval(playBeep, interval);

    return () => {
      cleanedUpRef.current = true;
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [isCritical]);

  // Stop beep when countdown finishes or SOS is sent
  useEffect(() => {
    if (emergencyTimer <= 0 || emergencySent) {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }
  }, [emergencyTimer, emergencySent]);

  // Cleanup on cancel/dispatch
  const handleCancel = () => {
    cancelEmergencySOS('I am safe and uninjured.');
  };

  const handleDispatch = () => {
    forceEmergencyDispatchNow();
  };

  // ── Severity-aware config ─────────────────────────────────────────
  const config = isCritical ? {
    overlayBg: 'bg-red-900/50',
    headerBg: 'bg-red-50 border-red-100 text-red-600',
    headerIcon: <Siren className="w-5 h-5 animate-spin" />,
    headerText: 'CRITICAL ACCIDENT DETECTED',
    subtitle: 'Critical trauma risk. Immediate emergency intervention required.',
    medicalBadge: 'bg-red-600 text-white',
    medicalText: 'CRITICAL TRAUMA RISK',
    countdownBg: 'bg-red-50 border-red-200',
    countdownText: 'text-red-600',
    dispatchBtnClass: 'bg-red-600 hover:bg-red-700 border-red-700',
    animate: 'animate-pulse'
  } : {
    overlayBg: 'bg-amber-900/30',
    headerBg: 'bg-amber-50 border-amber-200 text-amber-700',
    headerIcon: <AlertTriangle className="w-5 h-5" />,
    headerText: 'SEVERE IMPACT DETECTED',
    subtitle: 'Possible major injury risk. Emergency services standby initiated.',
    medicalBadge: 'bg-amber-500 text-white',
    medicalText: 'MODERATE TRAUMA RISK',
    countdownBg: 'bg-amber-50 border-amber-200',
    countdownText: 'text-amber-600',
    dispatchBtnClass: 'bg-amber-600 hover:bg-amber-700 border-amber-700',
    animate: ''
  };

  // ── TASK 1: Compact Square Emergency Modal ────────────────────────
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${config.overlayBg} backdrop-blur-md ${config.animate} select-none`}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-[95vw] max-w-[700px] mx-4 p-5 flex flex-col items-center gap-3 max-h-[95vh] overflow-hidden">
        
        {/* Row 1: Header Badge */}
        <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-full ${config.headerBg} ${isCritical ? 'animate-bounce' : ''}`}>
          {config.headerIcon}
          <span className="font-extrabold text-xs uppercase tracking-widest leading-none">{config.headerText}</span>
        </div>

        {/* Row 2: Severity + Medical Classification */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${config.medicalBadge}`}>
            SEVERITY: {emergencySeverity}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${isCritical ? 'bg-red-50 text-red-500 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
            {config.medicalText}
          </span>
        </div>

        {/* Row 3: Subtitle */}
        <p className="text-[11px] text-gray-500 font-medium text-center max-w-md leading-relaxed">
          {config.subtitle}
        </p>

        {/* Row 4: Countdown Circle */}
        <div className={`relative flex items-center justify-center w-28 h-28 rounded-full border-4 ${config.countdownBg}`}>
          <span className={`text-4xl font-black tracking-tighter ${config.countdownText}`}>
            {emergencyTimer}s
          </span>
          <span className={`absolute bottom-1.5 text-[8px] font-extrabold uppercase tracking-widest ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
            UNTIL SOS
          </span>
        </div>

        {/* Row 5: Compact Status Row (Voicebot + Comms + Webcam) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-md">
          {/* Voicebot */}
          <div className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[10px] font-bold ${voicebotActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <Mic className="w-3.5 h-3.5 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="uppercase tracking-wider">Voicebot</span>
              <span className="text-[9px] font-medium truncate opacity-75">
                {voicebotActive ? voicebotLine || 'Speaking...' : emergencyTimer > 0 ? 'Standby' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Communications */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border bg-gray-50 border-gray-200 text-[10px] font-bold text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="uppercase tracking-wider">Comms</span>
              <span className="text-[9px] font-medium opacity-75">
                ✓ SMS · Police · Ambulance
              </span>
            </div>
          </div>

          {/* Webcam */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border bg-gray-50 border-gray-200 text-[10px] font-bold text-gray-500">
            <Video className="w-3.5 h-3.5 flex-shrink-0" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <span className="uppercase tracking-wider">Recording</span>
            </div>
          </div>
        </div>

        {/* Row 6: Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-1">
          <button
            onClick={handleCancel}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-lifelink-green" />
            <span>I'M OKAY — CANCEL SOS</span>
          </button>
          <button
            onClick={handleDispatch}
            className={`w-full border py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 text-white ${config.dispatchBtnClass}`}
          >
            <Send className="w-4 h-4 text-white" />
            <span>DISPATCH SOS NOW</span>
          </button>
        </div>

        {/* Row 7: Footer */}
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide text-center">
          Police, ambulance & SMS alerts auto-dispatch in {emergencyTimer}s · Language: {lang}
        </p>
      </div>
    </div>
  );
};

export default EmergencyCountdown;
