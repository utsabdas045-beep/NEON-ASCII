/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { useAudioEngine } from "./AudioEngine";
import { ColorTheme } from "../types";

interface CyberGrid3DProps {
  theme: ColorTheme;
  glitchIntensity: number;
}

export default function CyberGrid3D({ theme, glitchIntensity }: CyberGrid3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { bassValue, averageVolume } = useAudioEngine();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);
    
    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Grid coordinates parameters
    const cols = 26;
    const rows = 18;
    const depth = 600;
    let speedOffset = 0;

    // Generated Star particles floating in space
    const particles: { x: number; y: number; z: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: -Math.random() * height * 0.5 - 50,
        z: Math.random() * depth,
        speed: 1.5 + Math.random() * 2,
        size: 0.8 + Math.random() * 1.2
      });
    }

    const drawGrid = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // dynamic motion trailing fade
      ctx.fillRect(0, 0, width, height);

      // Slow drift movement based on audio volume
      const speed = (0.8 + averageVolume * 5) * (1 + glitchIntensity * 0.05);
      speedOffset -= speed;
      if (speedOffset < -50) speedOffset = 0;

      // 1. Draw Star Particles
      ctx.fillStyle = `rgba(${theme.rgbaHex}, 0.6)`;
      particles.forEach((p) => {
        p.z -= speed * 1.5;
        if (p.z <= 0) {
          p.z = depth;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = -Math.random() * height * 0.4 - 20;
        }

        // Perspective projection formula
        const fov = 350;
        const scale = fov / (fov + p.z);
        const px = width / 2 + p.x * scale;
        const py = height * 0.35 + p.y * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = p.size * scale * (1 + bassValue * 2);
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Draw 3D Wireframe Cyber Horizon Terrain
      // Projection center (vanishing point)
      const centerX = width / 2;
      const centerY = height * 0.55; 

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(${theme.rgbaHex}, 0.25)`;

      // Draw longitudinal projection perspective rays
      for (let c = 0; c <= cols; c++) {
        const xPercent = c / cols;
        const startX = (xPercent - 0.5) * width * 4 + centerX;
        const endX = (xPercent - 0.5) * width * 0.3 + centerX;
        
        ctx.beginPath();
        ctx.moveTo(startX, height);
        ctx.lineTo(endX, centerY);
        ctx.stroke();
      }

      // Draw latitude transverse speedlines
      for (let r = 0; r <= rows; r++) {
        const z = (r * (depth / rows) + speedOffset) % depth;
        if (z < 10) continue;
        
        const fov = 300;
        const scale = fov / (fov + z);
        const gridY = centerY + (height - centerY) * scale;
        
        // Dynamic music physical displacement height logic (synth terrain ridge bumps)
        ctx.strokeStyle = `rgba(${theme.rgbaHex}, ${0.1 + (1 - z / depth) * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(0, gridY);
        
        const step = 20;
        for (let x = 0; x <= width + step; x += step) {
          // Add terrain ripples responding to the audio spectrum
          const distFromCenter = Math.abs(x - centerX) / centerX;
          const terrainElevation = Math.max(0, distFromCenter - 0.15) * 60;
          const ripple = Math.sin(x * 0.05 + speedOffset * 0.1) * (bassValue * 24) * (1 - z / depth);
          
          const finalY = gridY - (terrainElevation * (1 - z / depth) + ripple);
          if (x === 0) {
            ctx.moveTo(x, finalY);
          } else {
            ctx.lineTo(x, finalY);
          }
        }
        ctx.stroke();
      }

      // 3. Draw cyber neon core sun at the vanishing line
      const sunGradient = ctx.createRadialGradient(
        centerX, centerY - 10, 0,
        centerX, centerY - 10, 80 + bassValue * 30
      );
      sunGradient.addColorStop(0, `rgba(${theme.rgbaSecondary}, 0.85)`);
      sunGradient.addColorStop(0.3, `rgba(${theme.rgbaHex}, 0.25)`);
      sunGradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 10, 85 + bassValue * 30, Math.PI, 0, false);
      ctx.fill();

      // Sun horizontal synthwave matrix cuts
      ctx.fillStyle = "#000000";
      for (let sy = centerY - 90; sy < centerY; sy += 8) {
        const h = 2 + (centerY - sy) * 0.04;
        ctx.fillRect(centerX - 120, sy, 240, h);
      }

      // Render aesthetic border glitch stripes
      if (glitchIntensity > 30 && Math.random() < 0.05) {
        ctx.fillStyle = `rgba(${theme.rgbaSecondary}, 0.45)`;
        ctx.fillRect(0, Math.random() * height, width, Math.random() * 3);
      }

      animationId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme, glitchIntensity, bassValue, averageVolume]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
