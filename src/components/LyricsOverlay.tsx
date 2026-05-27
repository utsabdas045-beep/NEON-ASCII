/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useAudioEngine } from "./AudioEngine";
import { LyricLine, ColorTheme } from "../types";

interface LyricsOverlayProps {
  lyrics: LyricLine[];
  progressMs: number;
  theme: ColorTheme;
  lyricStyle: 'typing' | 'glitch' | 'pulse' | 'subtitles';
}

export default function LyricsOverlay({ lyrics, progressMs, theme, lyricStyle }: LyricsOverlayProps) {
  const { bassValue } = useAudioEngine();
  const [currentLineText, setCurrentLineText] = useState("");
  const [scrambledText, setScrambledText] = useState("");
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  // Keep track of current text typing animation letter counts
  const [typingLength, setTypingLength] = useState(0);

  // 1. Locate current lyric index depending on playback progress milliseconds
  useEffect(() => {
    if (!lyrics || lyrics.length === 0) {
      setCurrentLineText("");
      setActiveLineIndex(-1);
      return;
    }

    // Locate the last line whose timestamp is less than or equal to current progress
    let matchedIdx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (progressMs >= lyrics[i].timeMs) {
        matchedIdx = i;
      }
    }

    if (matchedIdx !== activeLineIndex) {
      setActiveLineIndex(matchedIdx);
      if (matchedIdx !== -1) {
        const textToDisplay = lyrics[matchedIdx].text;
        setCurrentLineText(textToDisplay);
        setTypingLength(0); // Reset typing sequence
      } else {
        setCurrentLineText("");
      }
    }
  }, [lyrics, progressMs, activeLineIndex]);

  // 2. Terminal letter typing animation loop
  useEffect(() => {
    if (!currentLineText) {
      setScrambledText("");
      return;
    }

    if (lyricStyle === "typing") {
      if (typingLength < currentLineText.length) {
        const timeout = setTimeout(() => {
          setTypingLength((prev) => prev + 1);
        }, 30 + Math.random() * 30);
        return () => clearTimeout(timeout);
      }
    } else {
      setTypingLength(currentLineText.length);
    }
  }, [currentLineText, typingLength, lyricStyle]);

  // 3. Cyber text bin scrambling animation
  useEffect(() => {
    if (!currentLineText) {
      setScrambledText("");
      return;
    }

    const targetText = currentLineText.substring(0, typingLength);

    if (lyricStyle === "glitch") {
      // Periodic scramble of letter characters with random cybersecurity metrics
      const scrambleLetters = "!@#$%^&*()_+-=[]{}|;':\",./<>?█▓▒░01";
      let iteration = 0;

      const scrambleInterval = setInterval(() => {
        const scrambled = targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            // Randomly scramble with higher chance for recently typed text
            const shouldScramble = Math.random() < 0.25 - (iteration * 0.04);
            if (shouldScramble) {
              return scrambleLetters[Math.floor(Math.random() * scrambleLetters.length)];
            }
            return char;
          })
          .join("");

        setScrambledText(scrambled);
        iteration++;

        if (iteration > 6) {
          clearInterval(scrambleInterval);
          setScrambledText(targetText);
        }
      }, 55);

      return () => clearInterval(scrambleInterval);
    } else {
      setScrambledText(targetText);
    }
  }, [currentLineText, typingLength, lyricStyle]);

  if (!currentLineText) return null;

  // Custom text pulsing scaling style based on bass thresholds
  const pulseScale = lyricStyle === "pulse" ? 1.0 + bassValue * 0.16 : 1.0;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end items-center p-8 pb-32">
      <div 
        className="w-full max-w-lg px-6 py-4.5 bg-black/80 border border-zinc-900 rounded backdrop-blur-md text-center transform transition-all duration-300 relative"
        style={{
          boxShadow: `0 8px 30px rgba(0,0,0,0.91), 0 0 15px rgba(${theme.rgbaHex}, 0.08)`,
          borderLeft: `4px solid ${theme.primary}`,
          scale: `${pulseScale}`
        }}
      >
        {/* Neon scanline accent for lyrictile */}
        <div 
          className="absolute top-0 left-0 w-full h-[1px] opacity-40"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, transparent)`
          }}
        />

        {/* Decorative micro tags */}
        <div className="flex justify-between items-center text-[8px] text-zinc-600 font-mono tracking-widest uppercase mb-1.5 select-none">
          <span>// TRAN_RECEIVER_SYNC</span>
          <span>MODE: {lyricStyle.toUpperCase()}</span>
        </div>

        {/* Render Text */}
        <p 
          className="font-mono text-xs md:text-sm font-extrabold tracking-wider leading-relaxed uppercase selection:bg-white"
          style={{
            color: theme.accent,
            textShadow: `0 0 10px rgba(${theme.rgbaHex}, 0.7)`
          }}
        >
          {scrambledText}
          {lyricStyle === "typing" && typingLength < currentLineText.length && (
            <span className="inline-block w-2.5 h-4 ml-1 bg-[#00f0ff] animate-pulse">█</span>
          )}
        </p>

        {/* Mini reactive visual level bar embedded inside overlay popup */}
        <div className="mt-2.5 flex items-center justify-center gap-1">
          <div className="w-8 h-[2px] bg-zinc-900 rounded">
            <div 
              className="h-full rounded transition-all duration-100"
              style={{
                width: `${Math.min(100, bassValue * 100)}%`,
                backgroundColor: theme.primary
              }}
            />
          </div>
          <span className="text-[7.5px] font-mono text-zinc-600 tracking-wider">AUDIO_VOL: {Math.floor(bassValue * 100)}DB</span>
          <div className="w-8 h-[2px] bg-zinc-900 rounded">
            <div 
              className="h-full rounded transition-all duration-100"
              style={{
                width: `${Math.min(100, bassValue * 100)}%`,
                backgroundColor: theme.secondary
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
