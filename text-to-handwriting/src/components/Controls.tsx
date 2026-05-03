import React from 'react';
import { type Settings } from '../types';
import { Download, Type, Move, FileText } from 'lucide-react';

interface ControlsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onDownload: () => void;
}

const Controls: React.FC<ControlsProps> = ({ settings, setSettings, onDownload }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : val
    }));
  };

  return (
    <div className="sidebar">
      <h1>Text to Handwriting</h1>
      
      <div className="control-group">
        <label className="control-label">Your Text</label>
        <textarea
          name="text"
          className="input-field"
          placeholder="Type or paste your text here..."
          value={settings.text}
          onChange={handleChange}
        />
      </div>

      <div className="control-group">
        <label className="control-label"><Type size={14} style={{marginRight: '4px'}}/> Font Style</label>
        <select 
          name="fontFamily" 
          className="select-field" 
          value={settings.fontFamily}
          onChange={handleChange}
        >
          <option value="Project Note">Project Note</option>
          <option value="Nostalgic Letter">Nostalgic Letter</option>
          <option value="Romantic Sunrise">Romantic Sunrise</option>
          <option value="Silent People">Silent People</option>
          <option value="Homemade Apple">Homemade Apple</option>
          <option value="Caveat">Caveat</option>
          <option value="Dancing Script">Dancing Script</option>
          <option value="Shadows Into Light">Shadows Into Light</option>
        </select>
      </div>

      <div className="settings-row">
        <div className="control-group">
          <label className="control-label">Font Size</label>
          <input
            type="number"
            name="fontSize"
            className="input-field"
            value={settings.fontSize}
            onChange={handleChange}
            min="10"
            max="100"
          />
        </div>
        <div className="control-group">
          <label className="control-label">Ink Color</label>
          <input
            type="color"
            name="inkColor"
            className="input-field"
            style={{height: '42px', padding: '4px'}}
            value={settings.inkColor}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label"><Move size={14} style={{marginRight: '4px'}}/> Line Height ({settings.lineHeight})</label>
        <input
          type="range"
          name="lineHeight"
          className="range-input"
          min="1"
          max="3"
          step="0.1"
          value={settings.lineHeight}
          onChange={handleChange}
        />
      </div>

      <div className="control-group">
        <label className="control-label"><FileText size={14} style={{marginRight: '4px'}}/> Paper Type</label>
        <div className="settings-row">
          <button 
            className={`button ${settings.paperType === 'lined' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSettings(prev => ({...prev, paperType: 'lined'}))}
            style={{padding: '0.5rem'}}
          >
            Lined
          </button>
          <button 
            className={`button ${settings.paperType === 'blank' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setSettings(prev => ({...prev, paperType: 'blank'}))}
            style={{padding: '0.5rem'}}
          >
            Blank
          </button>
        </div>
      </div>

      <div className="control-group" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <label className="control-label" style={{marginBottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <input 
            type="checkbox" 
            name="scannerEffect" 
            checked={settings.scannerEffect} 
            onChange={handleChange}
          />
          Scanner Effect
        </label>
        <label className="control-label" style={{marginBottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <input 
            type="checkbox" 
            name="shadowEffect" 
            checked={settings.shadowEffect} 
            onChange={handleChange}
          />
          Shadow Effect
        </label>
      </div>

      <div className="actions">
        <button className="button button-primary" onClick={onDownload}>
          <Download size={18} /> Export PDF
        </button>
      </div>
    </div>
  );
};

export default Controls;
