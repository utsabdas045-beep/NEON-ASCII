/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { 
  Camera, 
  Image as ImageIcon, 
  Video, 
  StopCircle, 
  RefreshCw, 
  CameraOff, 
  Maximize2, 
  Heart, 
  MessageCircle, 
  Send, 
  MoreVertical,
  Sliders,
  Sparkles,
  Music,
  Tv
} from "lucide-react";
import { useAudioEngine } from "./AudioEngine";
import { AsciiStyleMode, ColorTheme, AspectRatioMode } from "../types";

interface AsciiProcessorProps {
  currentStyle: AsciiStyleMode;
  theme: ColorTheme;
  glitchIntensity: number;
}

export default function AsciiProcessor({ currentStyle, theme, glitchIntensity }: AsciiProcessorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const visualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { bassValue, averageVolume, audioCtx, analyzerNode, currentBuiltInTrack, activeInputSource } = useAudioEngine();

  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLabel, setCameraLabel] = useState("ESTABLISHING LINK...");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [qualityScale, setQualityScale] = useState<'high' | 'medium' | 'low'>('high');
  const [isMirrored, setIsMirrored] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('9:16'); // default to 9:16 for trendy instagram reel aesthetic

  // Interactive Reels simulation states (for aesthetic social engagement)
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1337);

  // Recording streams references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);

  // Target FPS tracker
  const [canvasFps, setCanvasFps] = useState(60);

  // 1. Initialize Webcam Stream
  const restartCamera = async () => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop());
      currentStreamRef.current = null;
    }

    setCameraError(null);
    setCameraLabel("CONNECTING GRID LINK...");

    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.log("video play suspended temporarily", err));
        setHasCamera(true);
        setCameraLabel("CYBER CAM ONLINE");
      }
    } catch (err: any) {
      console.warn("Webcam activation error:", err);
      setCameraError(
        "Camera stream not detected. Interface is running on default arpeggiator spectrum tracers."
      );
      setHasCamera(false);
      setCameraLabel("SIMULATING CORE SPECTRA");
    }
  };

  useEffect(() => {
    restartCamera();
    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Main ASCII Draw & Processing Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now();
    let frameCount = 0;

    const charSets = {
      classic: "@#S%?*+;:,. ".split(""),
      matrix: "█▓▒░01アイウエオ#$%&".split(""),
      dense: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\\\"`'  ".split(""),
      edge: " .:-=+*#%@".split(""), // used as luminance fallback, Sobel handles characters sequentially
      pixel: "█▓▒░ ".split(""),
      hologram: "█▓▒░+=:-_ ".split("")
    };

    const processLoop = () => {
      const video = videoRef.current;
      const mainCanvas = visualCanvasRef.current;
      const offscreen = offscreenCanvasRef.current;

      if (!mainCanvas || !offscreen) {
        animationFrameId = requestAnimationFrame(processLoop);
        return;
      }

      const mainCtx = mainCanvas.getContext("2d");
      const offscreenCtx = offscreen.getContext("2d");

      if (!mainCtx || !offscreenCtx) {
        animationFrameId = requestAnimationFrame(processLoop);
        return;
      }

      // Track relative FPS
      const now = performance.now();
      frameCount++;
      if (now - lastFrameTime >= 1000) {
        setCanvasFps(Math.round((frameCount * 1000) / (now - lastFrameTime)));
        frameCount = 0;
        lastFrameTime = now;
      }

      const hasLiveStream = hasCamera && video && video.readyState === video.HAVE_ENOUGH_DATA;

      // Quality Downsampling logic
      let gridWidth = 90;
      if (aspectRatio === '9:16') {
        gridWidth = qualityScale === 'high' ? 80 : qualityScale === 'medium' ? 64 : 48;
      } else {
        gridWidth = qualityScale === 'high' ? 115 : qualityScale === 'medium' ? 85 : 55;
      }

      // Sound volume pulses grid scaling slightly for dynamic vibration
      if (bassValue > 0.65) {
        gridWidth = Math.floor(gridWidth * 1.08);
      }

      // Adjust height based on target aspect ratios
      let multiplier = 0.58; // Classic 4:3
      if (aspectRatio === '16:9') multiplier = 0.44;
      if (aspectRatio === '9:16') multiplier = 1.35; // Tall vertical ratio for Reels

      const gridHeight = Math.floor(gridWidth * multiplier);

      offscreen.width = gridWidth;
      offscreen.height = gridHeight;

      // Stretch main canvas output resolution to parent dimensions
      const outWidth = mainCanvas.parentElement?.clientWidth || 640;
      const outHeight = mainCanvas.parentElement?.clientHeight || 480;
      mainCanvas.width = outWidth;
      mainCanvas.height = outHeight;

      // 1. Draw camera to downsampling canvas
      offscreenCtx.save();
      if (isMirrored) {
        offscreenCtx.translate(gridWidth, 0);
        offscreenCtx.scale(-1, 1);
      }

      if (hasLiveStream) {
        offscreenCtx.drawImage(video, 0, 0, gridWidth, gridHeight);
      } else {
        // Grid Simulation mode: draw cyber holographic matrices
        offscreenCtx.fillStyle = "#020204";
        offscreenCtx.fillRect(0, 0, gridWidth, gridHeight);

        // Render dynamic neon orb rings
        const time = Date.now() * 0.0025;
        offscreenCtx.fillStyle = "#ffffff";
        offscreenCtx.beginPath();
        offscreenCtx.arc(
          gridWidth / 2 + Math.cos(time) * (gridWidth * 0.22),
          gridHeight / 2 + Math.sin(time * 0.8) * (gridHeight * 0.18),
          gridWidth * 0.12 + averageVolume * 15,
          0,
          Math.PI * 2
        );
        offscreenCtx.fill();

        // Secondary cross orbits
        offscreenCtx.fillStyle = "#777777";
        offscreenCtx.beginPath();
        offscreenCtx.arc(
          gridWidth / 2 - Math.cos(time * 0.6) * (gridWidth * 0.25),
          gridHeight / 2 - Math.sin(time * 1.2) * (gridHeight * 0.2),
          gridWidth * 0.05 + bassValue * 12,
          0,
          Math.PI * 2
        );
        offscreenCtx.fill();

        // Vertical scanning grid laser line
        offscreenCtx.fillStyle = "#cccccc";
        const laserY = Math.floor(((time * 12) % gridHeight));
        offscreenCtx.fillRect(0, laserY, gridWidth, 1.5);
      }
      offscreenCtx.restore();

      // Get downsampled pixels
      const imgData = offscreenCtx.getImageData(0, 0, gridWidth, gridHeight);
      const data = imgData.data;

      // 2. Clear main canvas output
      mainCtx.fillStyle = "#000000";
      mainCtx.fillRect(0, 0, outWidth, outHeight);

      // Character font sizing metric
      const charWidth = outWidth / gridWidth;
      const charHeight = outHeight / gridHeight;
      mainCtx.font = `bold ${Math.max(7, charWidth * 1.2)}px monospace`;
      mainCtx.textAlign = "center";
      mainCtx.textBaseline = "middle";

      const chars = charSets[currentStyle] || charSets.classic;
      const glyphCount = chars.length;

      // PRE-COMPUTE grayscale array for Sobel-outline calculations
      const grayData = new Float32Array(gridWidth * gridHeight);
      for (let idx = 0; idx < gridWidth * gridHeight; idx++) {
        const pIdx = idx * 4;
        grayData[idx] = (0.299 * data[pIdx] + 0.587 * data[pIdx + 1] + 0.114 * data[pIdx + 2]) / 255;
      }

      // Render cells
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const idx = y * gridWidth + x;
          const pIdx = idx * 4;
          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];

          let brightness = grayData[idx];

          // Dynamic reactive luminosity boost on bass sounds
          if (averageVolume > 0.3) {
            brightness = Math.min(1.0, brightness * (1.0 + averageVolume * 0.45));
          }

          let char = " ";
          let charColor = `rgba(${theme.rgbaHex}, 0.8)`;

          if (currentStyle === 'edge') {
            // == SOBEL OUTLINE EDGE TRACER ALGORITHM (Directly matches cool aesthetic Insta Reels) ==
            if (x > 0 && x < gridWidth - 1 && y > 0 && y < gridHeight - 1) {
              // 3x3 pixel kernel neighborhood
              const tl = grayData[(y - 1) * gridWidth + (x - 1)];
              const t  = grayData[(y - 1) * gridWidth + x];
              const tr = grayData[(y - 1) * gridWidth + (x + 1)];
              const l  = grayData[y * gridWidth + (x - 1)];
              const r  = grayData[y * gridWidth + (x + 1)];
              const bl = grayData[(y + 1) * gridWidth + (x - 1)];
              const b  = grayData[(y + 1) * gridWidth + x];
              const br = grayData[(y + 1) * gridWidth + (x + 1)];

              // Gx (Horizontal gradient kernel)
              const gx = -1 * tl - 2 * l - 1 * bl + 1 * tr + 2 * r + 1 * br;
              // Gy (Vertical gradient kernel)
              const gy = -1 * tl - 2 * t - 1 * tr + 1 * bl + 2 * b + 1 * br;

              const edgeStrength = Math.sqrt(gx * gx + gy * gy);

              // If edge strength exceeds cyberpunk threshold, draw directional glyphs
              if (edgeStrength > 0.35) {
                const absGx = Math.abs(gx);
                const absGy = Math.abs(gy);

                if (absGx > absGy * 2) {
                  char = "|"; // Vertical-leaning edges
                } else if (absGy > absGx * 2) {
                  char = "-"; // Horizontal-leaning edges
                } else if (gx * gy > 0) {
                  char = "\\"; // Diagonal-down edges
                } else {
                  char = "/"; // Diagonal-up edges
                }

                // Lead neon highlights
                const isEdgePeak = edgeStrength > 0.8;
                if (isEdgePeak) {
                  char = "#";
                  charColor = `rgba(255, 255, 255, ${0.9 + averageVolume * 0.1})`;
                } else {
                  charColor = `rgba(${theme.rgbaHex}, ${0.55 + edgeStrength * 0.45})`;
                }
              } else {
                // Dim scan points in quiet fields
                if (brightness > 0.65 && Math.random() < 0.04) {
                  char = ".";
                  charColor = `rgba(${theme.rgbaSecondary}, 0.2)`;
                }
              }
            }
          } else {
            // == STANDARD MATRIX/PIXEL LUMA CHAR MAPPING ==
            let charIdx = Math.floor(brightness * (glyphCount - 1));
            
            // Random glitch tracer replacement based on intensity
            if (glitchIntensity > 35 && Math.random() < (glitchIntensity * 0.002)) {
              charIdx = Math.floor(Math.random() * glyphCount);
            }

            char = chars[charIdx];
            if (char === " ") continue;

            // Compute appropriate coloring
            switch (currentStyle) {
              case "matrix": {
                const isLead = Math.random() < 0.02 + (bassValue * 0.08);
                charColor = isLead ? "#ffffff" : `rgba(0, 255, 102, ${0.5 + brightness * 0.5})`;
                if (!isLead && averageVolume > 0.35) {
                  charColor = `rgba(50, 255, 190, ${0.6 + brightness * 0.4})`;
                }
                break;
              }
              case "classic":
              case "dense": {
                charColor = `rgba(${theme.rgbaHex}, ${0.35 + brightness * 0.65})`;
                break;
              }
              case "pixel": {
                charColor = `rgba(${theme.rgbaHex}, ${0.25 + brightness * 0.75})`;
                break;
              }
              case "hologram": {
                charColor = `rgba(${theme.rgbaSecondary}, ${0.3 + brightness * 0.7})`;
                break;
              }
              default:
                charColor = `rgba(${theme.rgbaHex}, 0.85)`;
            }
          }

          if (char === " ") continue;

          // Compute absolute rendering positions
          const px = x * charWidth + charWidth / 2;
          const py = y * charHeight + charHeight / 2;

          mainCtx.fillStyle = charColor;

          // Bass sound adds direct text shadows for beautiful glowing halo bloom
          if (bassValue > 0.7) {
            mainCtx.shadowColor = theme.primary;
            mainCtx.shadowBlur = 5;
          } else {
            mainCtx.shadowBlur = 0;
          }

          mainCtx.fillText(char, px, py);
        }
      }

      mainCtx.shadowBlur = 0;

      // Overlay cybernetic HUD brackets
      mainCtx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      mainCtx.lineWidth = 1;
      mainCtx.strokeRect(15, 15, outWidth - 30, outHeight - 30);

      // Top Header tech values
      mainCtx.font = "bold 8px monospace";
      mainCtx.fillStyle = `${theme.secondary}99`;
      mainCtx.fillText(`[ COMPILER_FEED: ${cameraLabel} ]`, 75, 25);
      mainCtx.fillText(`FPS: ${canvasFps}`, outWidth - 35, 25);

      animationFrameId = requestAnimationFrame(processLoop);
    };

    processLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentStyle, theme, glitchIntensity, hasCamera, isMirrored, qualityScale, aspectRatio, bassValue, averageVolume]);

  // 3. Take High Contrast Snapshot Action
  const triggerSnapshot = () => {
    const canvas = visualCanvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `CYBER_OUTLINE_REEL_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // Snap synthesizer sound effect
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch (e) {
      console.warn("Screenshot snapshot failed:", e);
    }
  };

  // 4. Video webm/ogg recording controller (combined with synthesize track stream)
  const handleRecordToggle = async () => {
    const canvas = visualCanvasRef.current;
    if (!canvas) return;

    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      return;
    }

    recordedChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const canvasStream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!canvasStream) {
        alert("Recording elements are not fully supported on this web-sandbox setup.");
        return;
      }

      let combinedStream = new MediaStream();
      canvasStream.getVideoTracks().forEach((track: any) => combinedStream.addTrack(track));

      if (audioCtx && analyzerNode) {
        const dest = audioCtx.createMediaStreamDestination();
        audioDestinationRef.current = dest;
        analyzerNode.connect(dest);
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) {
          combinedStream.addTrack(audioTrack);
        }
      }

      let options = { mimeType: "video/webm;codecs=vp9,opus" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm;codecs=vp8,opus" };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm" };
      }

      const recorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `NEON_CYBER_REELS_${Date.now()}.webm`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      recorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (e) {
      console.error("Recording action fail:", e);
      setIsRecording(false);
    }
  };

  const renderRecordedTime = () => {
    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 md:p-4 select-none relative z-10 font-mono">
      
      {/* Hidden processing nodes */}
      <video ref={videoRef} className="hidden" playsInline muted autoPlay />
      <canvas ref={offscreenCanvasRef} className="hidden" />

      {/* Main Container dynamically styled on Aspect Ratio State */}
      <div 
        className={`bg-[#020203] relative border border-zinc-900 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-300 ${
          aspectRatio === '9:16' 
            ? "aspect-[9/16] w-[295px] h-[525px] sm:w-[320px] sm:h-[570px] rounded-[36px] border-[10px] border-[#0c0c0f]" // Smartphone phone bezel simulation
            : aspectRatio === '16:9'
              ? "w-full max-w-2xl aspect-[16/9] rounded-md"
              : "w-full max-w-2xl aspect-[4/3] rounded-md"
        }`}
        style={{
          boxShadow: `0 0 60px rgba(${theme.rgbaHex}, 0.05), 0 25px 60px rgba(0,0,0,0.95)`
        }}
      >
        {/* Dynamic Scanline Grid pattern on camera */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_90%)]" />

        {/* Smartphone bezel speaker details in vertical Reels view */}
        {aspectRatio === '9:16' && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40 w-24 h-4 bg-black rounded-b-xl flex items-center justify-center">
            <span className="w-10 h-1 rounded-full bg-zinc-800" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 ml-2" />
          </div>
        )}

        {/* Live Artwork Canvas rendered directly */}
        <canvas
          ref={visualCanvasRef}
          className="w-full h-full block"
        />

        {/* Simulated Instagram Social overlay in 9:16 vertical mode */}
        {aspectRatio === '9:16' && (
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-4">
            
            {/* Upper Reels HUD details */}
            <div className="absolute top-10 left-4 flex items-center gap-1.5 text-[8.5px] text-zinc-400 uppercase tracking-widest font-black select-none">
              <span className="px-1 py-0.5 bg-[#ff007f] text-black rounded-sm font-bold text-[8px] animate-pulse">REELS LIVE</span>
              <span className="text-[#00f0ff] animate-pulse">// 01_ASCII_TRACER</span>
            </div>

            {/* Right Side Social Floating Interaction tools */}
            <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-5 pointer-events-auto z-40">
              
              {/* Heart controller (Simulate interactive like peak) */}
              <button 
                onClick={() => {
                  setIsLiked(!isLiked);
                  setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                }}
                className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:scale-115 transition-all text-white border border-zinc-900 group"
              >
                <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500 animate-ping" : "text-zinc-300 group-hover:text-red-400"}`} />
                <span className="text-[8px] font-bold text-zinc-300">{likeCount}</span>
              </button>

              {/* Comment bubble link */}
              <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur-sm p-2 rounded-full border border-zinc-900 text-white">
                <MessageCircle className="w-4 h-4 text-zinc-300" />
                <span className="text-[8px] font-bold text-zinc-300">42</span>
              </div>

              {/* Paperplane share */}
              <div className="flex flex-col items-center gap-1 bg-black/60 backdrop-blur-sm p-2 rounded-full border border-zinc-900 text-white">
                <Send className="w-4 h-4 text-zinc-300" />
                <span className="text-[8.5px] font-bold text-zinc-300">&gt;</span>
              </div>

              {/* Rotating Musical Disc Badge inside phone frame */}
              <div className="flex flex-col items-center justify-center p-1 bg-zinc-900/80 rounded-full border border-[#ff007f]/50 relative mt-1.5">
                <div className={`w-7 h-7 rounded-full bg-zinc-950 flex items-center justify-center ${activeInputSource === 'synth' ? "animate-spin" : ""}`} style={{ animationDuration: '4s' }}>
                  <Music className="w-3.5 h-3.5 text-[#ff007f] animate-pulse" />
                </div>
                {/* Embedded reactive pulsing ripple */}
                <span className="absolute -inset-1.5 border border-[#00f0ff]/20 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
              </div>

            </div>

            {/* Left Side Audio & Metadata label stack */}
            <div className="text-left space-y-1.5 max-w-[210px] bg-gradient-to-t from-black/85 via-black/45 to-transparent p-2.5 rounded-lg border border-zinc-900/30 backdrop-blur-xs select-none">
              <p className="text-[10px] text-white font-black tracking-wider uppercase truncate">
                @ghost_coda_ascii
              </p>
              <p className="text-[8.5px] text-zinc-400 leading-normal uppercase line-clamp-2">
                Experiencing digital life stream using Sobel contour matrix operators. Peak audio triggers visual overdrive aesthetics.
              </p>
              
              {/* Dynamic playing status line with reactive waveform ticker */}
              <div className="flex items-center gap-1 text-[#00ff66] font-extrabold text-[8.5px] tracking-widest pl-0.5">
                <Music className="w-3 h-3 animate-pulse" />
                <span className="uppercase truncate">
                  {currentBuiltInTrack ? currentBuiltInTrack.title : "AMBIENT NOISE SPECTRA"}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Recording Visual overlay indicator */}
        {isRecording && (
          <div className="absolute top-12 right-4 z-30 flex items-center gap-2 bg-black/90 px-2.5 py-1.5 rounded-sm border border-red-500 animate-pulse font-mono text-[9px] text-red-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            REC: {renderRecordedTime()}
          </div>
        )}

      </div>

      {/* Floating Aspect Ratio selection controllers row */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl p-2.5 bg-[#0a0a0d]/90 rounded border border-zinc-900/80">
        <span className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1 px-1">
          <Tv className="w-3.5 h-3.5 text-[#ff007f]" />
          SCREEN MOCKUP FORMAT
        </span>
        
        <div className="flex border border-zinc-900 rounded bg-black/50 p-0.5 overflow-hidden text-[9px] font-bold">
          {(['4:3', '16:9', '9:16'] as AspectRatioMode[]).map((mode) => {
            const isActive = aspectRatio === mode;
            return (
              <button
                key={mode}
                onClick={() => setAspectRatio(mode)}
                className={`px-3 py-1.5 rounded-sm transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-[#ff007f] text-black font-black uppercase shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {mode === '9:16' ? "9:16 INSTA REELS" : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Hardware Actions toolbar bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 w-full max-w-2xl p-3 bg-zinc-950/90 rounded border border-zinc-900">
        
        {/* Mirror Reflection toggle */}
        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded border text-[9.5px] tracking-wider transition-all duration-200 cursor-pointer ${
            isMirrored 
              ? "border-[#00f0ff]/50 text-[#00f0ff] bg-[#00f0ff]/5" 
              : "border-zinc-900 text-zinc-500 hover:text-zinc-200"
          }`}
          title="Invert webcam horizontal coordinates"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>MIRROR</span>
        </button>

        {/* Quality preset downsampler selectors */}
        <div className="flex border border-zinc-900 rounded bg-black/80 overflow-hidden text-[9px] font-extrabold p-0.5">
          {(['high', 'medium', 'low'] as const).map((q) => {
            const isActive = qualityScale === q;
            return (
              <button
                key={q}
                onClick={() => setQualityScale(q)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#00f0ff] text-black font-extrabold uppercase"
                    : "text-zinc-500 hover:text-zinc-400"
                }`}
              >
                {q.substring(0, 2).toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Restart camera link portal */}
        <button
          onClick={restartCamera}
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800 text-[9.5px] tracking-wider transition-all cursor-pointer"
        >
          {hasCamera ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
          <span>LINK FEED</span>
        </button>

        {/* Click PNG snapshot */}
        <button
          onClick={triggerSnapshot}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded border border-[#00f0ff]/40 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-[9.5px] font-bold tracking-wider transition-all cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>TAK_PIC</span>
        </button>

        {/* Recording actions block */}
        <button
          onClick={handleRecordToggle}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded border text-[9.5px] font-bold tracking-widest transition-all cursor-pointer ${
            isRecording
              ? "border-red-500 bg-red-500/10 text-red-500 animate-pulse hover:bg-red-500/20"
              : "border-[#ff007f]/40 bg-[#ff007f]/10 text-[#ff007f] hover:bg-[#ff007f]/20"
          }`}
        >
          {isRecording ? <StopCircle className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
          <span>{isRecording ? "STOP_REC" : "REC_REEL"}</span>
        </button>

      </div>
    </div>
  );
}
