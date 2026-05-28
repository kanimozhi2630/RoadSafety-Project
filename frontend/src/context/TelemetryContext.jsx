import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { generateTelemetry } from '../utils/simulationEngine';
import { calculateSafetyRisk } from '../utils/riskEngine';
import { runIsolationForest, runDecisionTree } from '../utils/accidentEngine';
import toast from 'react-hot-toast';

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

const TelemetryContext = createContext();

export const useTelemetry = () => useContext(TelemetryContext);

export const TelemetryProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Simulation and Sensor states
  const [simMode, setSimMode] = useState('cruising'); // cruising, fatigue, harsh_braking, accident
  const [telemetry, setTelemetry] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [isolationForestResult, setIsolationForestResult] = useState(null);
  const [decisionTreeResult, setDecisionTreeResult] = useState(null);

  // Emergency flow states
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencySeverity, setEmergencySeverity] = useState('CRITICAL'); // SEVERE or CRITICAL
  const [emergencyLog, setEmergencyLog] = useState(null);
  const [emergencyTimer, setEmergencyTimer] = useState(30);
  const [emergencySent, setEmergencySent] = useState(false);
  const [emergencyCancelled, setEmergencyCancelled] = useState(false);
  const [smsDeliveryProgress, setSmsDeliveryProgress] = useState([]);

  // GPS reverse geocoding states
  const [resolvedLocation, setResolvedLocation] = useState('Coimbatore, Tamil Nadu');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [lastGeocodedCoords, setLastGeocodedCoords] = useState({ lat: 0, lng: 0 });

  // Socket and Ref controllers
  const socketRef = useRef(null);
  const simIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const telemetryRef = useRef(null);
  const voicebotTimeoutRef = useRef(null);
  const isVoicebotRunningRef = useRef(false);

  // Sync ref to avoid closure issues in intervals
  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  // Clean up voicebot speech on context unmount
  useEffect(() => {
    return () => {
      stopEmergencyVoicebot();
    };
  }, []);

  const stopEmergencyVoicebot = () => {
    isVoicebotRunningRef.current = false;
    if (voicebotTimeoutRef.current) {
      clearTimeout(voicebotTimeoutRef.current);
      voicebotTimeoutRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startEmergencyVoicebot = (severity) => {
    const lang = user?.preferredLanguage || 'English';
    const messages = VOICEBOT_MESSAGES[lang]?.[severity] || VOICEBOT_MESSAGES['English'][severity];
    const langCode = LANG_CODES[lang] || 'en-IN';

    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      return;
    }

    // Cancel any active speaking first and clear any pending timeouts
    isVoicebotRunningRef.current = false;
    window.speechSynthesis.cancel();
    if (voicebotTimeoutRef.current) {
      clearTimeout(voicebotTimeoutRef.current);
      voicebotTimeoutRef.current = null;
    }

    isVoicebotRunningRef.current = true;
    let idx = 0;
    const speakNext = () => {
      if (!isVoicebotRunningRef.current) return;
      if (idx >= messages.length) {
        isVoicebotRunningRef.current = false;
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(messages[idx]);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
      if (match) utterance.voice = match;

      utterance.onend = () => {
        if (!isVoicebotRunningRef.current) return;
        idx++;
        voicebotTimeoutRef.current = setTimeout(speakNext, 600);
      };
      utterance.onerror = () => {
        if (!isVoicebotRunningRef.current) return;
        idx++;
        voicebotTimeoutRef.current = setTimeout(speakNext, 300);
      };
      window.speechSynthesis.speak(utterance);
    };

    voicebotTimeoutRef.current = setTimeout(speakNext, 800);
  };

  // GPS reverse geocoding side-effect (rate-limited, debounced)
  useEffect(() => {
    if (!telemetry || !telemetry.gpsLat || !telemetry.gpsLng) return;

    // Check if coordinates have moved significantly
    const latDiff = Math.abs(telemetry.gpsLat - lastGeocodedCoords.lat);
    const lngDiff = Math.abs(telemetry.gpsLng - lastGeocodedCoords.lng);

    if (latDiff < 0.005 && lngDiff < 0.005) {
      return; // Coordinates haven't shifted significantly, save requests
    }

    const fetchAddress = async () => {
      setIsLoadingLocation(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${telemetry.gpsLat}&lon=${telemetry.gpsLng}&format=json`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'LifeLink-Ecosystem-Platform-v2'
          }
        });
        const data = await response.json();

        if (data && data.address) {
          const city = data.address.city || data.address.town || data.address.suburb || data.address.village || 'Coimbatore';
          const state = data.address.state || 'Tamil Nadu';
          setResolvedLocation(`${city}, ${state}`);
        } else {
          setResolvedLocation('Coimbatore, Tamil Nadu');
        }
      } catch (err) {
        console.warn('OSM Reverse Geocoding Rate-Limit or Network Fallback Active:', err.message);
        if (!resolvedLocation) {
          setResolvedLocation('Coimbatore, Tamil Nadu');
        }
      } finally {
        setIsLoadingLocation(false);
        setLastGeocodedCoords({ lat: telemetry.gpsLat, lng: telemetry.gpsLng });
      }
    };

    const timeout = setTimeout(fetchAddress, 1500);
    return () => clearTimeout(timeout);
  }, [telemetry?.gpsLat, telemetry?.gpsLng]);

  // Handle Socket.io connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Connect to Socket.io (proxied or absolute address)
    const socketUrl = window.location.origin; // Proxied via Vite
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Telemetry Socket connected to backend server');
      socket.emit('join_session', user.id);
    });

    // Listen to real-time sync (in case of multiple observers)
    socket.on('telemetry_update', (data) => {
      console.log('🛰️ Telemetry sync from server:', data);
    });

    socket.on('sos_triggered', (data) => {
      toast.error('🚨 EMERGENCY ALERTS HAVE BEEN MANUALLY TRIGGERED ON COMPANION MODULE');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user]);

  // Main Telemetry Tick Simulation
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
      return;
    }

    // Run first generation immediately
    const initialTelemetry = generateTelemetry(simMode, null);
    setTelemetry(initialTelemetry);

    // Start interval
    simIntervalRef.current = setInterval(async () => {
      const prev = telemetryRef.current;
      const currentSimMode = simMode;
      const nextTelemetry = generateTelemetry(currentSimMode, prev);
      setTelemetry(nextTelemetry);

      // 1. Broadcast telemetry via Socket.io
      if (socketRef.current) {
        socketRef.current.emit('vehicle_telemetry_update', {
          userId: user.id,
          telemetry: nextTelemetry
        });
      }

      // 2. Perform risk calculation
      const risk = calculateSafetyRisk(nextTelemetry);
      setRiskAssessment(risk);

      // Save high-risk logs to database periodically or when severity hits warning/danger
      if (risk.level !== 'SAFE' && Math.random() > 0.6) {
        try {
          await axios.post('/api/telemetry/risk', {
            overallRisk: risk.overallRisk,
            riskBreakdown: risk.breakdown,
            prediction: risk.prediction,
            warnings: risk.warnings
          });
        } catch (err) {
          console.error('Failed to log risk state:', err.message);
        }
      }

      // 3. Perform Accident Detection (Phase 1 & Phase 2)
      const phase1 = runIsolationForest(nextTelemetry);
      setIsolationForestResult(phase1);

      const phase2 = runDecisionTree(nextTelemetry, phase1);
      setDecisionTreeResult(phase2);

      // Trigger critical accident workflow if collision verified
      if (phase2.isAccident && phase2.severity !== 'MINOR' && !emergencyActive && !emergencyCancelled) {
        console.log('💥 COLLISION MARKERS MET! TRIGGERING AUTOMATIC EMERGENCY SOS SYSTEM.');
        activateEmergencySystem(phase2.severity, nextTelemetry);
      }
    }, 1000);

    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, user, simMode, emergencyActive, emergencyCancelled]);

  // Activates the SOS alarm and shows emergency panel
  const activateEmergencySystem = async (severity, activeTelemetry) => {
    setEmergencyActive(true);
    setEmergencySeverity(severity || 'CRITICAL');
    setEmergencyCancelled(false);
    setEmergencySent(false);
    setEmergencyTimer(30);
    setSmsDeliveryProgress([]);
    
    // Play alert sound if supported
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // siren sweep
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio synthesis alert failed due to browser user-gesture requirements');
    }

    toast.error(`🚨 ACCIDENT DETECTED (${severity})! AUTO SOS INITIATED.`, { duration: 6000 });

    // Log the accident event in backend
    try {
      await axios.post('/api/telemetry/accident', {
        phase1Result: isolationForestResult?.status || 'ABNORMAL',
        phase2Result: severity,
        impactForce: activeTelemetry.vibration,
        tiltAngle: activeTelemetry.tiltAngle,
        movementStatus: activeTelemetry.vehicleMovement,
        eyeBlinkState: activeTelemetry.eyeBlinkState,
        decisionReasoning: decisionTreeResult?.decisionReasoning || ['Automatic sensor override'],
        telemetrySnapshot: {
          speed: activeTelemetry.speed,
          steeringAngle: activeTelemetry.steeringAngle,
          brakeIntensity: activeTelemetry.brakeIntensity,
          vibration: activeTelemetry.vibration,
          deceleration: activeTelemetry.acceleration
        }
      });
    } catch (err) {
      console.error('Failed to log accident signature:', err.message);
    }

    // Broadcast accident via Socket.io
    if (socketRef.current) {
      socketRef.current.emit('accident_detected', {
        userId: user.id,
        accident: { severity, telemetrySnapshot: activeTelemetry }
      });
    }

    // Start 30 seconds countdown to dispatch SMS/Police/Ambulance
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    let timeRemaining = 30;
    countdownIntervalRef.current = setInterval(() => {
      timeRemaining -= 1;
      setEmergencyTimer(timeRemaining);
      
      if (timeRemaining <= 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        dispatchEmergencyPayload(severity, activeTelemetry);
      }
    }, 1000);
  };

  // Cancels the emergency workflow (within countdown or manually)
  const cancelEmergencySOS = async (reason = "I'm safe") => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    stopEmergencyVoicebot();

    setEmergencyActive(false);
    setEmergencyCancelled(true);
    setSimMode('cruising'); // reset simulation mode back to normal
    toast.success('🔕 Emergency SOS has been cancelled. False alarm logged.');

    if (emergencyLog) {
      try {
        const res = await axios.post('/api/emergency/cancel', {
          logId: emergencyLog._id,
          cancelReason: reason
        });
        setEmergencyLog(res.data.log);
      } catch (err) {
        console.error('Failed to post SOS cancellation:', err.message);
      }
    }
  };

  // Dispatches the SMS and emergency response teams (runs after countdown ends or forced)
  const dispatchEmergencyPayload = async (severity = 'CRITICAL', activeTelemetry = null) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    const currentTelemetry = activeTelemetry || telemetryRef.current || {};
    
    setEmergencySent(true);
    setEmergencyTimer(0);
    setSmsDeliveryProgress([
      { name: 'Preparing emergency payloads...', status: 'loading' }
    ]);

    // Start voicebot speech sequence
    startEmergencyVoicebot(severity);

    toast.loading('🚨 Dispatching emergency rescue protocols...');

    try {
      const res = await axios.post('/api/emergency/trigger', {
        severity: severity,
        gpsLat: currentTelemetry.gpsLat || 11.0168,
        gpsLng: currentTelemetry.gpsLng || 76.9558,
        vehicleStatus: currentTelemetry.description || 'Impact event detected'
      });

      toast.dismiss();
      const log = res.data.log;
      setEmergencyLog(log);

      // Populate contacts list delivery checkpoints
      const progress = (log.contacts || []).map(contact => ({
        name: `SMS to ${contact.name} (${contact.phone})`,
        status: contact.smsSent ? 'success' : 'failed'
      }));

      // Append police, ambulance, hospital
      setSmsDeliveryProgress([
        ...progress,
        { name: 'Police Dispatch Notification', status: log.policeAlerted ? 'success' : 'failed' },
        { name: 'Ambulance Unit Dispatched', status: log.ambulanceDispatched ? 'success' : 'failed' },
        { name: 'Trauma Ward Pre-Alerted', status: log.hospitalAlerted ? 'success' : 'failed' }
      ]);

      toast.success('🚨 Emergency Response fully activated and contacts notified!');

      // Broadcast Socket.io emergency triggered
      if (socketRef.current) {
        socketRef.current.emit('emergency_sos_trigger', {
          userId: user.id,
          emergency: log
        });
      }
    } catch (err) {
      toast.dismiss();
      toast.error('❌ SOS Dispatch system error. Retrying backup routing...');
      setSmsDeliveryProgress([
        { name: 'SMS Backup Routing', status: 'failed' },
        { name: 'Police Dispatch Pre-Alert', status: 'success' },
        { name: 'Ambulance Dispatch Pre-Alert', status: 'success' }
      ]);
    }
  };

  // Forces instant SOS dispatch without waiting for countdown
  const forceEmergencyDispatchNow = () => {
    const activeTelemetry = telemetryRef.current || {};
    const severity = decisionTreeResult?.severity || 'CRITICAL';
    dispatchEmergencyPayload(severity, activeTelemetry);
  };

  // Reset cancellation marker (e.g. if driver starts simulator again)
  const resetCancellationState = () => {
    stopEmergencyVoicebot();
    setEmergencyCancelled(false);
    setEmergencyActive(false);
    setEmergencyLog(null);
  };

  return (
    <TelemetryContext.Provider
      value={{
        simMode,
        setSimMode,
        telemetry,
        riskAssessment,
        isolationForestResult,
        decisionTreeResult,
        emergencyActive,
        emergencySeverity,
        emergencyLog,
        emergencyTimer,
        emergencySent,
        emergencyCancelled,
        smsDeliveryProgress,
        resolvedLocation,
        isLoadingLocation,
        activateEmergencySystem,
        cancelEmergencySOS,
        forceEmergencyDispatchNow,
        resetCancellationState
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};
