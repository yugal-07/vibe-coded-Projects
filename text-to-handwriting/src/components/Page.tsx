import React, { useRef, useEffect } from 'react';
import { type Settings } from '../types';

interface PageProps {
  text: string;
  settings: Settings;
  pageNumber: number;
}

const Page: React.FC<PageProps> = ({ text, settings, pageNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // A4 Ratio (approximately)
      const width = 800;
      const height = 1131;
      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = settings.paperColor;
      ctx.fillRect(0, 0, width, height);

      // Drawing Lines
      if (settings.paperType === 'lined') {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        const startY = settings.margin * 2;
        const lineSpacing = settings.fontSize * settings.lineHeight;
        
        for (let y = startY; y < height - settings.margin; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(settings.margin, y);
          ctx.lineTo(width - settings.margin, y);
          ctx.stroke();
        }

        // Vertical Margin Line
        ctx.strokeStyle = '#fca5a5';
        ctx.beginPath();
        ctx.moveTo(settings.margin * 1.5, 0);
        ctx.lineTo(settings.margin * 1.5, height);
        ctx.stroke();
      }

      // Text Rendering
      ctx.fillStyle = settings.inkColor;
      ctx.font = `${settings.fontSize}px "${settings.fontFamily}"`;
      ctx.textBaseline = 'bottom';

      const lines = text.split('\n');
      let y = settings.margin * 2;
      const startX = settings.margin * 1.8;
      const lineSpacing = settings.fontSize * settings.lineHeight;

      lines.forEach((line) => {
        ctx.fillText(line, startX, y);
        y += lineSpacing;
      });

      // Shadow Effect
      if (settings.shadowEffect) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.5, 'rgba(0,0,0,0.02)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Scanner Effect (Grain/Noise)
      if (settings.scannerEffect) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 15;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
          data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      }
    };

    document.fonts.ready.then(draw);
  }, [text, settings, pageNumber]);

  return (
    <div className="page-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Page;
