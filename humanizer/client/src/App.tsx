import { useState } from 'react';
import axios from 'axios';
import './App.css';

interface DetectionResult {
  percentage: number;
  reasoning: string;
}

interface SentenceAnalysis {
  text: string;
  percentage: number;
  reasoning: string;
}

interface DetailedAnalysisResult {
  overallPercentage: number;
  sentences: SentenceAnalysis[];
}

interface HumanizeResult {
  humanizedText: string;
  explanation: string;
}

interface CodeHumanizeResult {
  humanizedCode: string;
  explanation: string;
}

function App() {
  const [mode, setMode] = useState<'text' | 'code'>('text');
  const [text, setText] = useState('');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [detailedResult, setDetailedResult] = useState<DetailedAnalysisResult | null>(null);
  const [humanizeResult, setHumanizeResult] = useState<HumanizeResult | null>(null);
  const [codeResult, setCodeResult] = useState<CodeHumanizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [humanizing, setHumanizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSentence, setHoveredSentence] = useState<SentenceAnalysis | null>(null);

  const handleDetect = async () => {
    const content = mode === 'text' ? text : code;
    if (!content.trim()) {
      setError(`Please enter some ${mode} to analyze.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDetailedResult(null);
    setHumanizeResult(null);
    setCodeResult(null);

    try {
      const endpoint = mode === 'text' ? 'analyze-detailed' : 'detect';
      const response = await axios.post(`http://localhost:3001/api/${endpoint}`, { text: content });
      
      if (mode === 'text') {
        setDetailedResult(response.data);
        setResult({
          percentage: response.data.overallPercentage,
          reasoning: "Analysis complete. Hover over sentences to see details."
        });
      } else {
        setResult(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during detection.');
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (percentage: number) => {
    // 0% (Human) = Greenish, 100% (AI) = Reddish
    const hue = 120 - (percentage * 1.2); 
    return `hsla(${hue}, 80%, 50%, 0.25)`;
  };

  const getHeatmapBorder = (percentage: number) => {
    const hue = 120 - (percentage * 1.2);
    return `1px solid hsla(${hue}, 80%, 40%, 0.4)`;
  };

  const handleHumanize = async () => {
    const content = mode === 'text' ? text : code;
    if (!content.trim()) {
      setError(`Please enter some ${mode} to humanize.`);
      return;
    }

    setHumanizing(true);
    setError(null);
    setHumanizeResult(null);
    setCodeResult(null);

    try {
      const endpoint = mode === 'text' ? 'humanize' : 'humanize-code';
      const payload = mode === 'text' ? { text: content } : { code: content };
      const response = await axios.post(`http://localhost:3001/api/${endpoint}`, payload);
      
      if (mode === 'text') {
        setHumanizeResult(response.data);
      } else {
        setCodeResult(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during humanization.');
    } finally {
      setHumanizing(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content-card">
        <header>
          <h1>Humanizer</h1>
          <p>Detect and refine AI-generated content with precision.</p>
          
          <div className="mode-toggle">
            <button 
              className={mode === 'text' ? 'active' : ''} 
              onClick={() => { setMode('text'); setError(null); }}
            >
              Text Mode
            </button>
            <button 
              className={mode === 'code' ? 'active' : ''} 
              onClick={() => { setMode('code'); setError(null); }}
            >
              Code Mode
            </button>
          </div>
        </header>

        <main>
          <div className="input-group">
            {mode === 'text' ? (
              <textarea
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
              />
            ) : (
              <textarea
                className="code-input"
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
              />
            )}
            <div className="actions">
              <button 
                className="btn-primary" 
                onClick={handleDetect} 
                disabled={loading || humanizing}
              >
                {loading ? 'Analyzing...' : `Detect AI ${mode === 'code' ? 'Code' : ''}`}
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleHumanize} 
                disabled={loading || humanizing}
              >
                {humanizing ? 'Refining...' : `Humanize ${mode === 'code' ? 'Code' : ''}`}
              </button>
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <div className="results-grid">
            {result && (
              <div className="result-card fade-in">
                <div className="score-header">
                  <span className="score-label">{mode === 'code' ? 'Code AI Score' : 'Overall AI Probability'}</span>
                  <span className="score-value">{result.percentage}%</span>
                </div>
                
                {detailedResult && mode === 'text' ? (
                  <div className="heatmap-container">
                    {detailedResult.sentences.map((s, i) => (
                      <span
                        key={i}
                        className="heatmap-sentence"
                        style={{
                          backgroundColor: getHeatmapColor(s.percentage),
                          borderBottom: getHeatmapBorder(s.percentage)
                        }}
                        onMouseEnter={() => setHoveredSentence(s)}
                        onMouseLeave={() => setHoveredSentence(null)}
                      >
                        {s.text}{' '}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="result-text">{result.reasoning}</p>
                )}

                {hoveredSentence && mode === 'text' && (
                  <div className="sentence-tooltip fade-in">
                    <div className="tooltip-header">
                      <span className="tooltip-score">{hoveredSentence.percentage}%</span>
                      <span className="tooltip-label">AI probability</span>
                    </div>
                    <p className="tooltip-reasoning">{hoveredSentence.reasoning}</p>
                  </div>
                )}
              </div>
            )}

            {humanizeResult && mode === 'text' && (
              <div className="result-card fade-in">
                <div className="score-header">
                  <span className="score-label">Humanized Text</span>
                  <button 
                    className="btn-text" 
                    onClick={() => navigator.clipboard.writeText(humanizeResult.humanizedText)}
                  >
                    Copy
                  </button>
                </div>
                <div className="humanized-box">
                  {humanizeResult.humanizedText}
                </div>
                <p className="explanation-text">{humanizeResult.explanation}</p>
              </div>
            )}

            {codeResult && mode === 'code' && (
              <div className="result-card fade-in">
                <div className="score-header">
                  <span className="score-label">Humanized Code</span>
                  <button 
                    className="btn-text" 
                    onClick={() => navigator.clipboard.writeText(codeResult.humanizedCode)}
                  >
                    Copy
                  </button>
                </div>
                <pre className="code-box">
                  <code>{codeResult.humanizedCode}</code>
                </pre>
                <p className="explanation-text">{codeResult.explanation}</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <footer>
        <p>&copy; 2026 Humanizer • Powered by Groq</p>
      </footer>
    </div>
  );
}

export default App;
