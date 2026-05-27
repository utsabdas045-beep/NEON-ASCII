/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";

interface AestheticCRTProps {
  children: React.ReactNode;
  glitchIntensity: number; // 0 (none) to 100 (high)
  themeColor: string; // Hex for shadow colors
  isAudioReactiveGlitched: boolean;
}

export default function AestheticCRT({ children, glitchIntensity, themeColor, isAudioReactiveGlitched }: AestheticCRTProps) {
  const [glitchStyle, setGlitchStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (glitchIntensity === 0) {
      setGlitchStyle({});
      return;
    }

    const interval = setInterval(() => {
      // Periodic trigger of visual VHS distortion
      const shouldGlitch = Math.random() * 100 < (glitchIntensity * 0.4 + 10);
      if (shouldGlitch) {
        const xOffset = (Math.random() - 0.5) * (glitchIntensity * 0.15);
        const yOffset = (Math.random() - 0.5) * (glitchIntensity * 0.08);
        const skew = (Math.random() - 0.5) * (glitchIntensity * 0.2);
        const chromaticSplit = (Math.random() * (glitchIntensity * 0.08));

        setGlitchStyle({
          transform: `translate(${xOffset}px, ${yOffset}px) skewX(${skew}deg)`,
          filter: `hue-rotate(${Math.random() * 10}deg) contrast(1.1)`,
          textShadow: `${chromaticSplit}px 0 rgba(255,0,0,0.8), -${chromaticSplit}px 0 rgba(0,0,255,0.8)`
        });

        // Resolve glitch quickly
        setTimeout(() => {
          setGlitchStyle({});
        }, 50 + Math.random() * 100);
      }
    }, 180 - (glitchIntensity * 1.5));

    return () => clearInterval(interval);
  }, [glitchIntensity]);

  return (
    <div 
      className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none"
      style={{
        boxShadow: `inset 0 0 100px rgba(0,0,0,0.9)`,
      }}
    >
      {/* Immersive CRT Convex Curved Glare Screen Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.025] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,rgba(0,0,0,0.99)_100%)] blend-screen" />

      {/* Retro Horizontal Sweep Line */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-scanner-line opacity-[0.2]" />

      {/* Standard scanline density styling */}
      <div 
        className="absolute inset-0 z-40 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 6px 100%"
        }}
      />

      {/* Cyberpunk Vignette & Side Screen Shadows */}
      <div 
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 120px rgba(0,0,0,0.95)`,
          background: "radial-gradient(circle_at_center, transparent 40%, rgba(0,0,0,0.7) 100%)"
        }}
      />

      {/* Container holding children. Glitches apply directly to coordinates on change */}
      <div 
        className="w-full h-full min-h-screen transition-all duration-75 relative z-10"
        style={glitchStyle}
      >
        {children}
      </div>

      {/* Custom Styles for scanner effect */}
      <style>{`
        @keyframes scanline-sweep {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .bg-scanner-line {
          height: 8px;
          background: linear-gradient(to bottom, transparent, ${themeColor || '#ff007f'}, transparent);
          animation: scanline-sweep 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
