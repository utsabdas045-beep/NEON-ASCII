/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Activity, Cpu, Disc } from "lucide-react";

interface LandingIntroProps {
  onEnter: () => void;
}

export default function LandingIntro({ onEnter }: LandingIntroProps) {
  const [bootStep, setBootStep] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const logs = [
    "NEON//ASCII CORE PROTOCOL STABLE V4.9.2...",
    "CONNECTING CRYPTOGRAPHIC GRID SOCKETS...",
    "LOCATING LOCAL WEB CAMERA PORTS...",
    "INITIALIZING REAL-TIME GPU PIXEL SCALE MATRIX...",
    "SCANNING FOR INPUT AUDIO SPECTRUMS...",
    "DECRYPTING FLOATING INTERACTIVE TELEMETRY HUD...",
    "OPTIMIZING GLITCH SHADER BUFFERS...",
    "SYSTEM LOAD COMPLETE. SYSTEM STATUS: LIVE_GRID"
  ];

  useEffect(() => {
    if (bootStep < logs.length) {
      const timeout = setTimeout(() => {
        setBootLogs((prev) => [...prev, logs[bootStep]]);
        setBootStep((prev) => prev + 1);
      }, 350 + Math.random() * 250);
      return () => clearTimeout(timeout);
    } else {
      setIsDone(true);
    }
  }, [bootStep]);

  const handleEnterClick = () => {
    // Generate an aesthetic low synth-pulse synth sound to unlock Web Audio API immediately
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        
        // Quick digital cyber confirmation sound
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(80, audioCtx.currentTime); // low sub
        osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context unlock error:", e);
    }
    
    onEnter();
  };

  return (
    <div id="landing-screen" className="relative flex flex-col justify-center items-center min-h-screen w-full bg-black overflow-hidden font-mono text-xs select-none">
      {/* Background Matrix/Subgrid Glitch Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,20,1)_0%,rgba(0,0,0,1)_100%)] z-0" />
      
      {/* Laser grids / horizontal neon visual matrix lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Cyberpunk CRT Scanline Swivel */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[length:100%_4px]" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl mx-4 p-6 border border-zinc-800 bg-[#07070a]/90 backdrop-blur-md rounded shadow-[0_0_40px_rgba(255,0,127,0.06)] relative z-20"
      >
        {/* Holographic Header Corners */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#ff007f]" />
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]" />
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]" />
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#ff007f]" />

        {/* Corporate Grid Identity Tags */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-pulse" />
            <p className="text-zinc-400 uppercase tracking-widest text-[10px]">MAIN TERMINAL ID: NEON_ASCII_422</p>
          </div>
          <p className="text-[#00f0ff] font-mono font-bold tracking-wider text-[10px]">CODENAME: GHOST_GRID</p>
        </div>

        {/* Aesthetic Center Decrypting Graphic */}
        <div className="flex flex-col items-center justify-center my-6 py-6 border-b border-zinc-900/50">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="relative w-24 h-24 flex items-center justify-center border border-dashed border-zinc-700 rounded-full"
          >
            <div className="absolute inset-2 border border-[#ff007f]/40 rounded-full animate-pulse" />
            <div className="absolute inset-4 border border-dashed border-[#00f0ff]/50 rounded-full" />
            <Disc className="w-8 h-8 text-[#00f0ff]" />
          </motion.div>
          
          <h1 className="mt-4 text-2xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#00f0ff] uppercase scale-95 select-none font-sans filter drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            NEON//ASCII
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase mt-1">CYBERNETIC WEB INTERFACE ENGINE</p>
        </div>

        {/* Terminal Boot logs feed */}
        <div className="h-44 bg-black/90 p-4 rounded border border-zinc-900 overflow-y-auto mb-6 scrollbar-thin text-[10.5px]">
          <div className="flex flex-col gap-1.5 text-zinc-400 font-mono">
            {bootLogs.map((log, index) => {
              const hasSuccess = log.includes("STATUS") || log.includes("COMPLETE");
              const hasVector = log.includes("SOCKETS") || log.includes("GPU");
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-1"
                >
                  <span className="text-[#ff007f] mr-1 select-none">&gt;</span>
                  <p className={hasSuccess ? "text-[#00ff66]" : hasVector ? "text-[#00f0ff]" : "text-zinc-300"}>
                    {log}
                  </p>
                </motion.div>
              );
            })}
            
            {!isDone && (
              <div className="flex items-center gap-1 mt-1 text-[#ff007f] animate-pulse text-[10px]">
                <span>&gt;</span>
                <span className="w-2 h-4 bg-[#ff007f]" />
                <span className="text-zinc-500 tracking-wider">COMPILING SUB-FUNCTIONS...</span>
              </div>
            )}
          </div>
        </div>

        {/* System parameters checklist */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 mb-6 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2 p-1.5 bg-zinc-950/50 rounded border border-zinc-900/40">
            <Cpu className="w-3.5 h-3.5 text-[#ff007f]" />
            <div className="flex flex-col">
              <span className="text-zinc-500 uppercase text-[8px]">CORE GRAPHICS</span>
              <span className="font-bold text-zinc-300">GPU_WEBGL_ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-zinc-950/50 rounded border border-zinc-900/40">
            <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
            <div className="flex flex-col">
              <span className="text-zinc-500 uppercase text-[8px]">AUDIO LATENCY</span>
              <span className="font-bold text-zinc-300">BUFF_128_LOW</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-zinc-950/50 rounded border border-zinc-900/40">
            <Shield className="w-3.5 h-3.5 text-[#00ff66]" />
            <div className="flex flex-col">
              <span className="text-zinc-500 uppercase text-[8px]">SECURITY ENCRYPTION</span>
              <span className="font-bold text-zinc-300">OAUTH_SEC_CODA</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-zinc-950/50 rounded border border-zinc-900/40">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <div className="flex flex-col">
              <span className="text-zinc-500 uppercase text-[8px]">DEPRECIATED NODES</span>
              <span className="font-bold text-zinc-300">NONE_DETECTED</span>
            </div>
          </div>
        </div>

        {/* Activation Buttons */}
        <div className="flex flex-col items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.button
                id="btn-enter-grid"
                key="enter-btn"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: [1, 1.02, 1], opacity: 1 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnterClick}
                className="w-full py-3 tracking-[0.25em] font-bold text-center border border-[#00f0ff] hover:bg-[#00f0ff]/10 text-[#00f0ff] uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer select-none transition-all duration-300 text-xs rounded z-50 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
              >
                [ ENTER THE GRID ]
              </motion.button>
            ) : (
              <motion.div
                key="loader-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-3 h-10 border border-zinc-800 text-zinc-500 rounded text-center flex items-center justify-center gap-2 uppercase tracking-wide bg-zinc-950/30 font-mono text-[10px]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" />
                Dumping Core Packets... Wait
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-[9px] text-zinc-500 text-center tracking-widest uppercase mt-3">
            WARNING: CAMERA & MICROPHONE ACCESS GRANTED SECURELY INSIDE YOUR SANDBOX PORTAL.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
