/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { BUILT_IN_TRACKS, SongData } from "../types";

export interface AudioDeviceState {
  isInitialized: boolean;
  bassValue: number;      // 0.0 to 1.0 (clamped energy level)
  midValue: number;       // 0.0 to 1.0
  trebleValue: number;    // 0.0 to 1.0
  averageVolume: number;  // 0.0 to 1.0
  frequencyData: Uint8Array;
  analyzerNode: AnalyserNode | null;
  audioCtx: AudioContext | null;
  activeInputSource: 'mic' | 'synth' | 'none';
  isPlayingSynth: boolean;
  currentBuiltInTrack: SongData | null;
  currentTrackProgressMs: number;
  toggleMicInput: () => Promise<boolean>;
  toggleSynthInput: (track: SongData | null) => void;
  stopAllAudio: () => void;
}

const AudioEngineContext = createContext<AudioDeviceState | null>(null);

export const useAudioEngine = () => {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error("useAudioEngine must be used within an AudioEngineProvider");
  }
  return context;
};

interface AudioEngineProviderProps {
  children: React.ReactNode;
}

export function AudioEngineProvider({ children }: AudioEngineProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [bassValue, setBassValue] = useState(0);
  const [midValue, setMidValue] = useState(0);
  const [trebleValue, setTrebleValue] = useState(0);
  const [averageVolume, setAverageVolume] = useState(0);
  const [activeInputSource, setActiveInputSource] = useState<'mic' | 'synth' | 'none'>('none');
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const [currentBuiltInTrack, setCurrentBuiltInTrack] = useState<SongData | null>(null);
  const [currentTrackProgressMs, setCurrentTrackProgressMs] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Custom synthesizer variables for cyber loops
  const synthNodesRef = useRef<any[]>([]);
  const synthTimerRef = useRef<any | null>(null);
  const lyricTimerRef = useRef<any | null>(null);
  const fftArrayRef = useRef<Uint8Array>(new Uint8Array(64));
  const trackStartTimeRef = useRef<number>(0);

  // Initialize Audio Context on demand (lazy loading safely)
  const initContext = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        
        const analyzer = ctx.createAnalyser();
        analyzer.fftSize = 128; // small size for quick real-time canvas refresh
        analyzerRef.current = analyzer;
        
        fftArrayRef.current = new Uint8Array(analyzer.frequencyBinCount);
        setIsInitialized(true);
        return ctx;
      }
    } catch (e) {
      console.error("Web Audio initialization failure:", e);
    }
    return null;
  };

  // 1. Microphone input toggling
  const toggleMicInput = async (): Promise<boolean> => {
    const ctx = initContext();
    if (!ctx || !analyzerRef.current) return false;

    // Release current nodes if active
    stopAllAudio();

    // If already mic, turn it off and set to none
    if (activeInputSource === 'mic') {
      setActiveInputSource('none');
      return false;
    }

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      micSourceRef.current = source;
      source.connect(analyzerRef.current);

      setActiveInputSource('mic');
      return true;
    } catch (err) {
      console.warn("Camera or microphone linkage rejected:", err);
      // Fallback: Enable simulated auto synth if mic fails, so we always have reactivity
      toggleSynthInput(BUILT_IN_TRACKS[0]);
      return false;
    }
  };

  // 2. Synthesizer simulation sequence - generates gorgeous cyberpunk arpeggios
  const toggleSynthInput = (track: SongData | null) => {
    const ctx = initContext();
    if (!ctx || !analyzerRef.current) return;

    stopAllAudio();

    if (activeInputSource === 'synth' && currentBuiltInTrack?.title === track?.title) {
      setActiveInputSource('none');
      setIsPlayingSynth(false);
      return;
    }

    if (!track) {
      setActiveInputSource('none');
      setIsPlayingSynth(false);
      return;
    }

    // Unsuspend audio context if needed
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    setActiveInputSource('synth');
    setIsPlayingSynth(true);
    setCurrentBuiltInTrack(track);
    setCurrentTrackProgressMs(0);
    trackStartTimeRef.current = Date.now();

    // Setup active lyric increments
    lyricTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - trackStartTimeRef.current;
      if (elapsed >= track.durationMs) {
        // Loop song
        trackStartTimeRef.current = Date.now();
        setCurrentTrackProgressMs(0);
      } else {
        setCurrentTrackProgressMs(elapsed);
      }
    }, 100);

    // Dynamic cyber synth sequencer loop using standard oscillators
    let beatStep = 0;
    const notes = [110, 130, 146, 164, 220, 261, 293, 329, 440]; // Blade keys
    
    // Low rumble oscillator directly to output
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.value = notes[1] / 2; // sub bass (65Hz)
    subGain.gain.setValueAtTime(0.3, ctx.currentTime);
    subOsc.connect(subGain);
    
    // Connect to analyzer for visuals, but also to output so the user hears a sci-fi hum
    subGain.connect(analyzerRef.current);
    subGain.connect(ctx.destination);
    
    subOsc.start();
    synthNodesRef.current.push(subOsc, subGain);

    // Sequencing trigger
    const triggerNextNote = () => {
      if (!audioCtxRef.current || activeInputSource !== 'synth') return;

      const time = ctx.currentTime;
      const stepIdx = beatStep % 8;
      
      // Determine note pitch
      let pitch = notes[stepIdx % notes.length];
      if (stepIdx % 3 === 0) pitch *= 1.5; // harmony shift
      
      const pluck = ctx.createOscillator();
      const pluckGain = ctx.createGain();
      
      pluck.type = stepIdx % 4 === 0 ? "sawtooth" : "square";
      pluck.frequency.setValueAtTime(pitch, time);
      
      pluckGain.gain.setValueAtTime(0.3, time);
      pluckGain.gain.exponentialRampToValueAtTime(0.005, time + 0.35);
      
      pluck.connect(pluckGain);
      pluckGain.connect(analyzerRef.current);
      
      // Only blend slightly into output destination so it's pleasant and non-intrusive
      const audioPluckGain = ctx.createGain();
      audioPluckGain.gain.setValueAtTime(0.12, time);
      pluckGain.connect(audioPluckGain);
      audioPluckGain.connect(ctx.destination);

      pluck.start(time);
      pluck.stop(time + 0.4);

      beatStep++;
      
      // Schedule next plucks
      synthTimerRef.current = setTimeout(triggerNextNote, 240); // 125BPM rhythm
    };

    triggerNextNote();
  };

  // 3. Clear all active inputs and audio tracks
  const stopAllAudio = () => {
    // Media mic stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }

    // Clean timers
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (lyricTimerRef.current) {
      clearInterval(lyricTimerRef.current);
      lyricTimerRef.current = null;
    }

    // Terminate oscillators
    synthNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e){}
      try { node.disconnect(); } catch(e){}
    });
    synthNodesRef.current = [];

    setIsPlayingSynth(false);
    setCurrentBuiltInTrack(null);
    setCurrentTrackProgressMs(0);
  };

  // 4. Animation loop gathering FFT analyses from Analyzer bytes
  useEffect(() => {
    let animationFrameId: number;

    const analyzeLoop = () => {
      if (analyzerRef.current) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);
        fftArrayRef.current = dataArray;

        // Process frequency buckets
        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;
        let total = 0;

        const count = dataArray.length;
        const bassEnd = Math.floor(count * 0.2);
        const midEnd = Math.floor(count * 0.6);

        for (let i = 0; i < count; i++) {
          const val = dataArray[i];
          total += val;
          if (i < bassEnd) {
            bassSum += val;
          } else if (i < midEnd) {
            midSum += val;
          } else {
            trebleSum += val;
          }
        }

        const avg = total / count;
        setAverageVolume(avg / 255);
        setBassValue((bassSum / (bassEnd || 1)) / 255);
        setMidValue((midSum / ((midEnd - bassEnd) || 1)) / 255);
        setTrebleValue((trebleSum / ((count - midEnd) || 1)) / 255);
      } else {
        // Safe simulated values when user isn't linking audio
        const pulse = Math.abs(Math.sin(Date.now() * 0.003)) * 0.15;
        setAverageVolume(pulse);
        setBassValue(pulse * 1.5);
        setMidValue(pulse * 0.85);
        setTrebleValue(pulse * 0.5);
      }

      animationFrameId = requestAnimationFrame(analyzeLoop);
    };

    analyzeLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeInputSource]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <AudioEngineContext.Provider
      value={{
        isInitialized,
        bassValue: Math.min(1, Math.max(0, bassValue)),
        midValue: Math.min(1, Math.max(0, midValue)),
        trebleValue: Math.min(1, Math.max(0, trebleValue)),
        averageVolume: Math.min(1, Math.max(0, averageVolume)),
        frequencyData: fftArrayRef.current,
        analyzerNode: analyzerRef.current,
        audioCtx: audioCtxRef.current,
        activeInputSource,
        isPlayingSynth,
        currentBuiltInTrack,
        currentTrackProgressMs,
        toggleMicInput,
        toggleSynthInput,
        stopAllAudio
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}
