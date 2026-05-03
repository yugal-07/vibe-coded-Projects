import { useState } from 'react';
import Controls from './components/Controls';
import Preview from './components/Preview';
import { type Settings, DEFAULT_SETTINGS } from './types';
import jsPDF from 'jspdf';
import './index.css';

function App() {
  const [settings, setSettings] = useState<Settings>({
    ...DEFAULT_SETTINGS,
    text: "Hello!\n\nYou can type anything here and it will be converted into handwriting. \n\nYou can change the font style, size, ink color, and even add a scanner effect to make it look like a real document.\n\nTry it out by typing your own text!"
  });

  const handleDownload = () => {
    const canvases = document.querySelectorAll('canvas');
    if (canvases.length === 0) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [800, 1131]
    });

    canvases.forEach((canvas, index) => {
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      if (index > 0) {
        pdf.addPage([800, 1131], 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, 800, 1131);
    });

    pdf.save('handwriting.pdf');
  };

  return (
    <div className="app-container">
      <Controls 
        settings={settings} 
        setSettings={setSettings} 
        onDownload={handleDownload}
      />
      <Preview settings={settings} />
    </div>
  );
}

export default App;
