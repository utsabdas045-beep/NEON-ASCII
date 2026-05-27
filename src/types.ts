/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AsciiStyleMode = 
  | 'classic' 
  | 'matrix' 
  | 'dense' 
  | 'edge' 
  | 'pixel' 
  | 'hologram';

export type AspectRatioMode = '4:3' | '16:9' | '9:16';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string; // Tailwind class equivalent or raw hex
  secondary: string;
  accent: string;
  bgGlow: string;
  rgbaHex: string; // for canvas drawing
  rgbaSecondary: string;
}

export interface LyricLine {
  timeMs: number;
  text: string;
  glitchedText?: string;
}

export interface SongData {
  title: string;
  artist: string;
  lyrics: LyricLine[];
  durationMs: number;
}

// Preset Themes for the Cyberpunk aesthetic
export const NEON_THEMES: ColorTheme[] = [
  {
    id: 'cyberpunk',
    name: 'NEON PINK / CYAN',
    primary: '#ff007f', // neon pink
    secondary: '#00f0ff', // neon cyan
    accent: '#ffffff',
    bgGlow: 'rgba(255, 0, 127, 0.15)',
    rgbaHex: '255, 0, 127',
    rgbaSecondary: '0, 240, 255'
  },
  {
    id: 'matrix',
    name: 'DIGITAL ACID GREEN',
    primary: '#00ff66', // matrix green
    secondary: '#005511', // deep terminal green
    accent: '#33ffaa',
    bgGlow: 'rgba(0, 255, 102, 0.15)',
    rgbaHex: '0, 255, 102',
    rgbaSecondary: '0, 85, 17'
  },
  {
    id: 'amber',
    name: 'SCRAP VINTAGE MONO',
    primary: '#ffaa00', // amber
    secondary: '#442200', // terminal dark brown
    accent: '#ffe57f',
    bgGlow: 'rgba(255, 170, 0, 0.15)',
    rgbaHex: '255, 170, 0',
    rgbaSecondary: '68, 34, 0'
  },
  {
    id: 'synthetix',
    name: 'RADICAL COBALT',
    primary: '#0055ff', // cobalt blue
    secondary: '#ff00ff', // synthwave violet
    accent: '#00ffff',
    bgGlow: 'rgba(0, 85, 255, 0.15)',
    rgbaHex: '0, 85, 255',
    rgbaSecondary: '255, 0, 255'
  }
];

// Curated cyberpunk audio tracks with synced lyrics
export const BUILT_IN_TRACKS: SongData[] = [
  {
    title: "NEURAL TRANSIT",
    artist: "CYBERSYNTH V4",
    durationMs: 72000,
    lyrics: [
      { timeMs: 1000, text: ">> SYSTEM INITIALIZED: CONNECTING SOCKETS" },
      { timeMs: 4000, text: "Searching through the electronic static..." },
      { timeMs: 8000, text: "Revisiting coordinates inside the mainframe" },
      { timeMs: 12000, text: "I see your ghost in the glowing terminal" },
      { timeMs: 16000, text: "An encoded artifact of a previous lifetime." },
      { timeMs: 20000, text: ">> INJECTING REENTRANT METRIC VECTORS" },
      { timeMs: 24000, text: "We trace the lines back to index zero" },
      { timeMs: 28000, text: "Our digital memories pulsing together" },
      { timeMs: 32000, text: "In neon cyan and pixelated code." },
      { timeMs: 36000, text: ">> DETECTING GLITCH IN SYNTACTIC STACK" },
      { timeMs: 40000, text: "Holograms flicker inside an empty room" },
      { timeMs: 44000, text: "Nothing is physical, yet everything sounds real" },
      { timeMs: 48000, text: "Synchronizing brainwave oscillators now..." },
      { timeMs: 54000, text: "Disconnecting safely... Goodbye grid crawler." },
      { timeMs: 65000, text: ">> GRID LOGOUT SUCCESSFUL [EXIT_SUCCESS]" }
    ]
  },
  {
    title: "BLADE PROTOCOL",
    artist: "DECRYPTED_GHOST",
    durationMs: 60000,
    lyrics: [
      { timeMs: 2000, text: ">> SYSTEM BOOT: BLADE_RUNNER_PROTOCOL.EXE" },
      { timeMs: 5000, text: "All those moments will be lost in time..." },
      { timeMs: 11000, text: "Like tears in rain..." },
      { timeMs: 16000, text: "A bio-mechanical mind searching for light." },
      { timeMs: 22000, text: ">> EXECUTING SYNTACTIC DECRTYPTION..." },
      { timeMs: 26000, text: "Can you see the electronic horizon glowing?" },
      { timeMs: 31000, text: "Can you hear the voice of the mainframe whispering?" },
      { timeMs: 37000, text: "We are replicas of replicas in a synthetic grid." },
      { timeMs: 44000, text: "Time to wake up..." },
      { timeMs: 49000, text: "Time to log out." },
      { timeMs: 55000, text: ">> CORRUPTION THRESHOLD EXCEEDED - CODA" }
    ]
  },
  {
    title: "NEO TOKYO STREETS",
    artist: "AKIRA_STRIKE",
    durationMs: 80000,
    lyrics: [
      { timeMs: 1500, text: ">> HIGH ENERGY BEAT PULSE DETECTED" },
      { timeMs: 5000, text: "Akira, wake up! The capsule is loading." },
      { timeMs: 9000, text: "Motors roaring along the radioactive highway..." },
      { timeMs: 13500, text: "Under the artificial neon sun of Tokyo Neo-Sectors." },
      { timeMs: 20000, text: "Red laser beams tracing across the dark asphalt!" },
      { timeMs: 25000, text: ">> CORE STABILIZATION STAGE: 87.4%" },
      { timeMs: 30000, text: "They control the media, they monitor our dreams," },
      { timeMs: 35000, text: "But they can't stop the voltage in our veins!" },
      { timeMs: 40000, text: ">> INJECTING HIGH OCTANE SYNTH DRIFT..." },
      { timeMs: 48000, text: "We rise beyond the ruins of the old terminal!" },
      { timeMs: 54000, text: "A digital renaissance built on code and static." },
      { timeMs: 60000, text: "Can you feel the overdrive?!" },
      { timeMs: 66000, text: ">> HARD SYNAPSE SHUTDOWN IN 10..." },
      { timeMs: 72000, text: "GRID RETRACTED" }
    ]
  }
];
