import React, { useState, useEffect, useRef } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Camera, Video, VideoOff, Square, Download, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoRecorder = () => {
  const { emergencySent, emergencyActive } = useTelemetry();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Auto trigger recording when SOS dispatch starts
  useEffect(() => {
    if (emergencySent && !recording && !recordedVideo) {
      startCameraAndRecord();
    }

    return () => {
      stopCameraStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [emergencySent]);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCameraAndRecord = async () => {
    chunksRef.current = [];
    setTimeElapsed(0);
    setRecordedVideo(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      setPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Initialize media recorder
      const recorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        toast.success('🎥 Cockpit emergency video stored locally for review!');
      };

      recorder.start(1000); // chunk every 1 sec
      setRecording(true);

      // Start 30 seconds capture limit timer
      if (timerRef.current) clearInterval(timerRef.current);
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setTimeElapsed(elapsed);
        if (elapsed >= 30) {
          stopRecording();
        }
      }, 1000);

    } catch (err) {
      console.warn('Webcam permission denied or webcam unavailable. Falling back to simulated feed.', err.message);
      setPermission(false);
      setRecording(true);
      
      // Simulate ticking timer for mock video recording
      if (timerRef.current) clearInterval(timerRef.current);
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setTimeElapsed(elapsed);
        if (elapsed >= 30) {
          setRecording(false);
          if (timerRef.current) clearInterval(timerRef.current);
          toast.success('🎥 Simulation cockpit video compiled and logged!');
        }
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    stopCameraStream();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium hover:shadow-premiumHover h-80 flex flex-col justify-between overflow-hidden relative">
      
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">VITALS CAPTURE</span>
          <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 mt-0.5">
            <Camera className="w-4 h-4 text-lifelink-green" />
            Automatic Cockpit Video Feed
          </h3>
        </div>

        {recording && (
          <div className="flex items-center space-x-1.5 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-red-600 animate-pulse text-[10px] font-bold">
            <Video className="w-3.5 h-3.5" />
            <span>REC {timeElapsed}s</span>
          </div>
        )}
      </div>

      {/* Main Video View Box */}
      <div className="flex-1 mt-4 rounded-xl border bg-gray-900 overflow-hidden flex items-center justify-center relative select-none">
        
        {/* Real video playback if recorded */}
        {recordedVideo ? (
          <video 
            src={recordedVideo} 
            controls 
            className="w-full h-full object-cover"
          />
        ) : permission && stream ? (
          // Real live webcam stream
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : recording ? (
          // Simulation Mock Vitals camera placeholder (Pure premium UX)
          <div className="flex flex-col items-center justify-center text-center p-4 text-white space-y-2">
            <div className="relative">
              <Video className="w-8 h-8 text-red-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight">Active Simulation Cockpit Camera</p>
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Vitals Analysis active</p>
            </div>
            
            {/* Visualizer wave mock */}
            <div className="flex items-center space-x-1 mt-3">
              <span className="w-1 h-3 bg-red-400 rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-red-400 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-7 bg-red-400 rounded-full animate-pulse delay-100" />
              <span className="w-1 h-4 bg-red-400 rounded-full animate-pulse delay-150" />
              <span className="w-1 h-2 bg-red-400 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        ) : (
          // Initial Offline display
          <div className="flex flex-col items-center justify-center text-center p-4 text-gray-400 space-y-1">
            <VideoOff className="w-8 h-8 text-gray-600 mb-1" />
            <p className="text-xs font-bold">Cockpit Camera Offline</p>
            <p className="text-[9px] text-gray-500 leading-snug max-w-[200px]">Camera automatically triggers for 30s vitals recording upon accident validation.</p>
          </div>
        )}
      </div>

      {/* Manual buttons */}
      {emergencySent && (recording || recordedVideo) && (
        <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
          {recording && (
            <button 
              onClick={stopRecording}
              className="bg-black/75 hover:bg-black p-2 rounded-lg text-white transition-colors"
              title="Stop Recording"
            >
              <Square className="w-4 h-4 text-red-500 fill-current" />
            </button>
          )}
          {recordedVideo && (
            <a 
              href={recordedVideo} 
              download="lifelink_cockpit_blackbox.webm"
              className="bg-lifelink-green hover:bg-green-700 p-2 rounded-lg text-white transition-colors flex items-center space-x-1 text-[10px] font-bold"
              title="Download Vitals File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>BLACKBOX FILE</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
