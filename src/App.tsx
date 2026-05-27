/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AudioEngineProvider, useAudioEngine } from "./components/AudioEngine";
import LandingIntro from "./components/LandingIntro";
import AestheticCRT from "./components/AestheticCRT";
import CyberGrid3D from "./components/CyberGrid3D";
import AsciiProcessor from "./components/AsciiProcessor";
import LyricsOverlay from "./components/LyricsOverlay";

import { 
  NEON_THEMES, 
  ColorTheme, 
  AsciiStyleMode, 
  SongData 
} from "./types";

import { 
  Terminal, 
  Radio, 
  Sliders, 
  Wifi, 
  HelpCircle, 
  LogOut, 
  Settings, 
  Layers, 
  Volume2, 
  Eye, 
  Sparkles,
  Info
} from "lucide-react";

function WebGridPortal() {
  const [hasEnteredGrid, setHasEnteredGrid] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(NEON_THEMES[0]);
  const [asciiStyle, setAsciiStyle] = useState<AsciiStyleMode>('matrix');
  const [glitchIntensity, setGlitchIntensity] = useState<number>(35);
  const [lyricStyle, setLyricStyle] = useState<'typing' | 'glitch' | 'pulse' | 'subtitles'>('glytch');

  // Unified global music sync tracking states
  const [trackProgressPercent, setTrackProgressPercent] = useState(0);
  const [activeSongTitle, setActiveSongTitle] = useState("NO FLOW ACTIVE");
  const [activeSongArtist, setActiveSongArtist] = useState("CYBERNETIC STANDBY");
  const [activeLyrics, setActiveLyrics] = useState<any[]>([]);
  const [currentProgressMs, setCurrentProgressMs] = useState(0);

  // Local clock ticker
  const [localClock, setLocalClock] = useState("00:00:00 LOCAL");

  const { activeInputSource, currentBuiltInTrack, currentTrackProgressMs, toggleMicInput, bassValue, averageVolume } = useAudioEngine();

  // 1. Tick Local time of the user
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      
      let tzLabel = "LOCAL";
      try {
        const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tzName) {
          tzLabel = tzName.split('/').pop()?.replace('_', ' ').toUpperCase() || "LOCAL";
        }
      } catch (e) {
        tzLabel = "LOCAL";
      }

      setLocalClock(`${timeString} ${tzLabel}`);
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // 2. Map music states depending on active source (built-in synthesized sequencer & mic)
  useEffect(() => {
    if (activeInputSource === 'synth' && currentBuiltInTrack) {
      setActiveSongTitle(currentBuiltInTrack.title);
      setActiveSongArtist(currentBuiltInTrack.artist);
      setActiveLyrics(currentBuiltInTrack.lyrics);
      setCurrentProgressMs(currentTrackProgressMs);
      
      const percent = (currentTrackProgressMs / currentBuiltInTrack.durationMs) * 100;
      setTrackProgressPercent(percent);
    } else if (activeInputSource === 'none') {
      setActiveSongTitle("STILL STATIC");
      setActiveSongArtist("GRID_IDLE_CODA");
      setActiveLyrics([]);
      setCurrentProgressMs(0);
      setTrackProgressPercent(0);
    } else if (activeInputSource === 'mic') {
      setActiveSongTitle("SPECTRUM CAPTURE");
      setActiveSongArtist("LIVE ENVIRONMENT MIC");
      setActiveLyrics([
        { timeMs: 0, text: ">> SPECTRUM MIC PORT INITIATED <<" },
        { timeMs: 4000, text: "Sing, talk or play external music to sync shaders!" },
        { timeMs: 12000, text: "Sobel edge contours mapping frequency spectrums..." },
        { timeMs: 22000, text: "Synthesized VHS glitched scanlines nominal." }
      ]);
      const simulatedPercent = (Date.now() % 30000) / 300;
      setTrackProgressPercent(simulatedPercent);
    }
  }, [activeInputSource, currentBuiltInTrack, currentTrackProgressMs]);

  if (!hasEnteredGrid) {
    return <LandingIntro onEnter={() => setHasEnteredGrid(true)} />;
  }

  return (
    <AestheticCRT 
      glitchIntensity={glitchIntensity} 
      themeColor={currentTheme.primary}
      isAudioReactiveGlitched={true}
    >
      <div className="relative w-full h-full min-h-screen grid grid-cols-1 xl:grid-cols-4 bg-[#040406] overflow-y-auto text-zinc-100 font-mono text-[11px] select-none selection:bg-[#ff007f] selection:text-black">
        
        {/* Deep 3D Wireframe landscape grids background */}
        <CyberGrid3D theme={currentTheme} glitchIntensity={glitchIntensity} />

        {/* 1. TOP STATS HUD RAIL */}
        <div className="xl:col-span-4 border-b border-zinc-900/80 bg-[#07070a]/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-30">
          
          <div className="space-y-1">
            <div className="text-sm font-black tracking-[0.2em] flex items-center gap-2">
              <span className="bg-[#ff007f] text-black px-1.5 py-0.5 text-[9px] font-bold rounded-sm animate-pulse selection:bg-white text-shadow-sm leading-none">OS</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400">NEON//ASCII</span>
              <span className="text-zinc-600 font-light text-[10px] tracking-tight">SYS_V4.9.2</span>
            </div>
            <div className="text-[9.5px] opacity-70 uppercase tracking-widest text-[#00f0ff] flex items-center gap-1.5 select-none">
              <Wifi className="w-3 h-3 animate-pulse text-[#00f0ff]" />
              SECURE PORTAL LINKED TO GHOST_CODA
            </div>
          </div>

          {/* Running music details bar */}
          <div className="flex-1 max-w-md w-full bg-zinc-950/75 border border-zinc-900/60 p-2 rounded flex flex-col gap-1 text-[9px] text-zinc-400 select-none">
            <div className="flex justify-between items-center px-1">
              <span className="text-[#00ff66] font-bold tracking-widest uppercase">TUNER STABILIZER TYPE-A</span>
              <span className="text-zinc-600 font-bold">{Math.floor(trackProgressPercent)}% SYNCED</span>
            </div>
            
            {/* Core horizontal audio progress bars */}
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${trackProgressPercent}%`,
                  backgroundImage: `linear-gradient(90deg, ${currentTheme.secondary}, ${currentTheme.primary})`
                }}
              />
            </div>
            
            <div className="flex justify-between text-[8px] opacity-50 px-0.5 text-zinc-500">
              <span>{activeSongTitle}</span>
              <span>{activeSongArtist}</span>
            </div>
          </div>

          <div className="text-left md:text-right font-mono flex flex-col items-start md:items-end select-none">
            <div className="text-sm font-bold text-[#00f0ff] filter drop-shadow-[0_0_4px_#00f0ff] tracking-widest leading-none tab-nums">
              {localClock}
            </div>
            <div className="text-[8px] text-[#ff007f] font-black tracking-widest uppercase mt-1">
              SECURE CRYPTO CODA // TRUE
            </div>
          </div>
        </div>

        {/* 2. LEFT DIAGNOSTICS COLUMN (Telemetry & Instruction manuals) */}
        <div className="p-4 md:p-6 border-r border-zinc-900/70 bg-[#060608]/90 backdrop-blur-md flex flex-col gap-6 relative z-20 xl:col-span-1 select-none">
          
          {/* Aesthetic HUD brackets decoration */}
          <div className="p-3 bg-zinc-950/90 border border-zinc-900 rounded relative">
            <div className="absolute top-1 left-2 text-[8px] text-zinc-600 font-bold tracking-wider">// LOCAL TELEMETRY</div>
            
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest">ASCII Matrix Quality</div>
                <div className="text-base text-zinc-200 tabular-nums font-bold">120 x 90 GRID</div>
                <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                  <div className="w-11/12 h-full bg-[#ff007f]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest">GPU Shader Overhead</div>
                <div className="text-base text-zinc-200 tabular-nums font-bold">12% ACTIVE</div>
                <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                  <div className="w-2/12 h-full bg-[#00f0ff]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Grid Wave Jitter</div>
                <div className="text-base text-zinc-200 tabular-nums font-bold">0.0034 SEC</div>
                <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                  <div className="w-1/12 h-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Audio Reactive parameters info */}
          <div className="p-3 bg-zinc-950/90 border border-zinc-900 rounded relative text-[10px]">
            <p className="font-bold text-[#ff007f] mb-2 uppercase tracking-widest flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              MICROPHONE SPECTRUM
            </p>
            <p className="text-zinc-500 leading-relaxed uppercase mb-3 text-[9.5px]">
              Tapping microphone activates our Web Audio FFT analyzer. Play music out loud or speak to test realtime aesthetic glitched visuals!
            </p>
            
            <button
              onClick={toggleMicInput}
              className={`w-full py-2 border font-mono font-bold tracking-wider rounded text-center transition-all duration-200 cursor-pointer text-[10px] ${
                activeInputSource === 'mic'
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 bg-zinc-950"
              }`}
            >
              {activeInputSource === 'mic' ? "[ SPECTRUM MIC: ONLINE ]" : "[ ACTIVATE MICROPHONE ]"}
            </button>
          </div>

          {/* Section C: Visualizer User Manual */}
          <div className="p-3 bg-zinc-950/90 border border-zinc-900 rounded relative text-[9px] leading-relaxed text-zinc-400 space-y-2">
            <p className="font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              CYBER SPECTRUM MANUAL
            </p>
            <p className="uppercase text-zinc-500">
              1. Tap <span className="text-[#ff007f] font-bold">ACTIVATE MICROPHONE</span> to analyze dynamic external vocal waves.
            </p>
            <p className="uppercase text-zinc-500">
              2. select built-in synthesized beats under <span className="text-zinc-300 font-bold">GRID_SYNTH_TUNERS</span> inside the tuning module.
            </p>
            <p className="uppercase text-zinc-500">
              3. Preset aspect layouts down to <span className="text-[#00f0ff] font-bold">9:16 Reels</span> format to preview and record high-contrast social clips instantly!
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-zinc-900/50 text-[9px] text-zinc-600 text-center uppercase tracking-widest">
            CODENAME: GHOST_IN_SHELL // HK-808
          </div>

        </div>

        {/* 3. CENTER VIEWPORT COLUMN (Webcam visualizer and live text overlay) */}
        <div className="xl:col-span-2 flex flex-col items-center justify-center relative min-h-[500px]">
          
          {/* Main ASCII web camera core frame */}
          <AsciiProcessor 
            currentStyle={asciiStyle} 
            theme={currentTheme} 
            glitchIntensity={glitchIntensity} 
          />

          {/* Live scrolling synchronized lyric subtitles overlay */}
          <LyricsOverlay 
            lyrics={activeLyrics} 
            progressMs={currentProgressMs} 
            theme={currentTheme} 
            lyricStyle={lyricStyle === 'glytch' ? 'glitch' : lyricStyle} 
          />

        </div>

        {/* 4. RIGHT CONTROLS COLUMN (Interactive sliders and state tuners) */}
        <div className="p-4 md:p-6 border-l border-zinc-900/70 bg-[#060608]/90 backdrop-blur-md flex flex-col gap-5 relative z-20 xl:col-span-1 select-none">
          
          {/* Modifiers section header */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5 mb-2">
            <Sliders className="w-4 h-4 text-[#ff007f]" />
            <p className="font-bold tracking-widest text-[#00f0ff] uppercase text-[11px]">GRID COMPILER PRESETS</p>
          </div>

          {/* Selector 1: ASCII rendering style */}
          <div className="space-y-2">
            <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              ASCII Render Styles
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
              {(['classic', 'matrix', 'dense', 'edge', 'pixel', 'hologram'] as AsciiStyleMode[]).map((mode) => {
                const isActive = asciiStyle === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setAsciiStyle(mode)}
                    className={`py-2 rounded border uppercase font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff]" 
                        : "bg-zinc-950/60 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector 2: Cyber aesthetics Color Theme */}
          <div className="space-y-2">
            <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              Cyber Aesthetics Color presets
            </p>
            <div className="flex flex-col gap-2">
              {NEON_THEMES.map((themeItem) => {
                const isActive = currentTheme.id === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    onClick={() => setCurrentTheme(themeItem)}
                    className={`w-full flex items-center justify-between p-2.5 rounded border transition-all duration-200 cursor-pointer text-left ${
                      isActive 
                        ? "bg-[#ff007f]/10 border-[#ff007f] text-[#ff007f]" 
                        : "bg-zinc-950/60 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[10px] uppercase font-mono">{themeItem.name}</span>
                      <span className="text-[8.5px] opacity-60 uppercase">{themeItem.id === 'cyberpunk' ? "AURA GLOW ENABLED" : "SOLID MATRIX_LITE"}</span>
                    </div>

                    <div className="flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeItem.primary }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeItem.secondary }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modul 3: Glitch Intensity Slider */}
          <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded space-y-2.5">
            <div className="flex justify-between items-center text-[9.5px] text-zinc-400 uppercase tracking-widest font-mono">
              <span className="font-bold">VHS Shader Glitch Intensity</span>
              <span className="font-bold text-[#ff007f] tracking-normal">{glitchIntensity}%</span>
            </div>
            
            <input 
              type="range"
              min="0"
              max="100"
              value={glitchIntensity}
              onChange={(e) => setGlitchIntensity(Number(e.target.value))}
              className="w-full accent-[#ff007f] h-1 bg-zinc-900 rounded-lg cursor-ew-resize py-1"
            />
            
            <p className="text-[8px] text-zinc-500 uppercase leading-relaxed text-center">
              Increasing slider values causes random chromatic lens shifts, vertical skew jittering and VHS matrix noise
            </p>
          </div>

          {/* Selector 4: Lyric overlay format styles */}
          <div className="space-y-2">
            <p className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              Live Lyrics overlay format
            </p>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[9.5px]">
              {(['typing', 'glytch', 'pulse', 'subtitles'] as string[]).map((style) => {
                const isActive = lyricStyle === style;
                return (
                  <button
                    key={style}
                    onClick={() => setLyricStyle(style as any)}
                    className={`py-1.5 rounded border uppercase text-[8.5px] font-bold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-zinc-100 text-black border-white font-extrabold" 
                        : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom active spectrum sequencer fallback */}
          <div className="p-3 bg-zinc-950/80 border border-zinc-900 space-y-1.5 mt-auto rounded">
            <div className="flex items-center justify-between text-[9px] text-[#ff007f] font-bold tracking-widest uppercase mb-1">
              <span>// MATRIX ARPEGGIATORS</span>
              <span className="text-[#00f0ff] animate-pulse">ACTIVE_OFFLINE</span>
            </div>
            <div className="h-6 w-full flex items-end gap-0.5 bg-black/40 rounded p-1 border border-zinc-900">
              {Array.from({ length: 28 }).map((_, i) => {
                const height = Math.abs(Math.sin(i * 0.35 + Date.now() * 0.003) * 14) + (i % 3 === 0 ? bassValue * 8 : averageVolume * 4);
                return (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-zinc-800 to-[#ff007f] rounded-t-xs transition-all duration-100"
                    style={{ height: `${Math.min(18, Math.max(1.5, height))}px` }}
                  />
                );
              })}
            </div>
            <div className="text-[7.5px] text-zinc-600 uppercase flex justify-between select-none">
              <span>RATE: 120BPM</span>
              <span>LFO: FEEDBACK_OSC</span>
            </div>
          </div>

        </div>

      </div>
    </AestheticCRT>
  );
}

export default function App() {
  return (
    <AudioEngineProvider>
      <WebGridPortal />
    </AudioEngineProvider>
  );
}
