"use client";

import React, { useEffect, useRef } from "react";

export const WavyBackground = ({
  className,
  containerClassName,
  colors = ["#5EBBB4", "#01ABB6", "#018E97", "#017D84", "#015C61"],
  waveWidth = 50,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.3,
  ...props
}: {
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    let w: number, h: number;
    let nt = 0;
    const speedValue = speed === "slow" ? 0.001 : 0.002;

    const resizeHandler = () => {
      const rect = container.getBoundingClientRect();
      w = ctx.canvas.width = rect.width;
      h = ctx.canvas.height = rect.height * 1.2; // Make canvas slightly taller
      ctx.filter = `blur(${blur}px)`;
    };

    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    const drawWave = () => {
      // Clear the canvas with transparent background
      ctx.clearRect(0, 0, w, h);

      nt += speedValue;
      
      // Draw multiple waves with increasing amplitude
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = colors[i % colors.length];
        ctx.globalAlpha = waveOpacity * (1 - i * 0.15); // Decrease opacity for each wave

        // Create wave pattern
        for (let x = -100; x < w + 100; x += 5) {
          // Increase amplitude for each wave
          const amplitude = 30 + i * 10;
          const y = Math.sin(x * 0.003 + nt + i * 0.5) * amplitude;
          
          if (x === -100) {
            ctx.moveTo(x, y + h * 0.6); // Start waves higher up
          } else {
            ctx.lineTo(x, y + h * 0.6);
          }
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    // Animation loop
    let animationId: number;
    const render = () => {
      drawWave();
      animationId = requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationId);
    };
  }, [blur, colors, speed, waveOpacity, waveWidth]);

  return (
    <div 
      className={containerClassName} 
      style={{ 
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <canvas
        ref={canvasRef}
        className={className}
        style={{ 
          position: 'absolute',
          bottom: '-20%', // Move canvas down to show only top portion
          left: 0,
          right: 0,
          width: '100%',
          height: '100%'
        }}
      />
      {props.children}
    </div>
  );
};

export default WavyBackground;