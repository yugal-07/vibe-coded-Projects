import React, { useMemo, useState, useEffect } from 'react';
import { type Settings } from '../types';
import Page from './Page';

interface PreviewProps {
  settings: Settings;
}

const Preview: React.FC<PreviewProps> = ({ settings }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  const pages = useMemo(() => {
    if (!settings.text || !fontsLoaded) return [settings.text || ''];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [settings.text];

    const width = 800;
    const height = 1131;
    const maxWidth = width - settings.margin * 3;
    const maxHeight = height - settings.margin * 4; // Extra padding for the bottom
    const lineSpacing = settings.fontSize * settings.lineHeight;
    
    ctx.font = `${settings.fontSize}px "${settings.fontFamily}"`;

    const lines = settings.text.split('\n');
    const pagesList: string[][] = [[]]; // Start with the first page (array of lines)
    let currentY = 0;

    lines.forEach((line) => {
      const words = line.split(' ');
      let currentLineWords: string[] = [];
      let currentX = 0;

      words.forEach((word) => {
        const wordWidth = ctx.measureText(word + ' ').width;
        
        if (currentX + wordWidth > maxWidth && currentLineWords.length > 0) {
          // Push current line to the current page
          pagesList[pagesList.length - 1].push(currentLineWords.join(' '));
          currentLineWords = [word];
          currentX = wordWidth;
          currentY += lineSpacing;

          // If the page is full, start a new page
          if (currentY > maxHeight) {
            pagesList.push([]);
            currentY = 0;
          }
        } else {
          currentLineWords.push(word);
          currentX += wordWidth;
        }
      });

      // Handle the last line of a paragraph
      if (currentLineWords.length > 0) {
        pagesList[pagesList.length - 1].push(currentLineWords.join(' '));
        currentY += lineSpacing;

        if (currentY > maxHeight) {
          pagesList.push([]);
          currentY = 0;
        }
      }
    });

    // Convert array of line arrays back to array of strings (one string per page)
    return pagesList.map(p => p.join('\n')).filter(p => p.length > 0);
  }, [settings, fontsLoaded]);

  return (
    <div className="preview-area">
      {pages.length > 0 ? pages.map((pageText, index) => (
        <Page 
          key={index} 
          text={pageText} 
          settings={settings} 
          pageNumber={index + 1} 
        />
      )) : (
        <Page 
          key={0} 
          text="" 
          settings={settings} 
          pageNumber={1} 
        />
      )}
    </div>
  );
};

export default Preview;
