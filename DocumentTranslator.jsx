import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #12121a; --surface2: #1a1a26;
    --border: #2a2a3d; --accent: #7c6af7; --accent2: #f76a8a;
    --accent3: #6af7d4; --text: #e8e8f0; --muted: #7070a0;
    --mono: 'DM Mono', monospace; --sans: 'Syne', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }
  .app {
    min-height: 100vh; background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(124,106,247,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(247,106,138,0.10) 0%, transparent 60%);
    padding: 48px 24px; display: flex; flex-direction: column; align-items: center; gap: 32px;
  }
  .header { text-align: center; }
  .header-tag { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent3); margin-bottom: 16px; display: block; }
  .header h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; background: linear-gradient(135deg, var(--text) 30%, var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .header p { margin-top: 12px; color: var(--muted); font-size: 15px; }

  .backend-box {
    width: 100%; max-width: 760px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 16px;
    padding: 18px 24px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .backend-box .blabel { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; white-space: nowrap; }
  .backend-box input {
    flex: 1; min-width: 180px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 9px; padding: 9px 13px; font-family: var(--mono); font-size: 12px;
    color: var(--text); outline: none; transition: border-color 0.15s;
  }
  .backend-box input:focus { border-color: var(--accent); }
  .status-chip { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11px; white-space: nowrap; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); transition: all 0.3s; flex-shrink: 0; }
  .dot.online { background: var(--accent3); box-shadow: 0 0 7px var(--accent3); }
  .dot.offline { background: var(--accent2); box-shadow: 0 0 7px var(--accent2); }
  .dot.checking { background: var(--muted); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 760px; overflow: hidden; }
  .card-section { padding: 26px 32px; border-bottom: 1px solid var(--border); }
  .card-section:last-child { border-bottom: none; }
  .section-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }

  .upload-box { border: 1.5px dashed var(--border); border-radius: 14px; padding: 32px 24px; text-align: center; transition: border-color 0.2s, background 0.2s; }
  .upload-box.drag-over { border-color: var(--accent); background: rgba(124,106,247,0.05); }
  .upload-icon { font-size: 36px; margin-bottom: 10px; display: block; }
  .upload-box h3 { font-size: 15px; font-weight: 600; margin-bottom: 5px; }
  .upload-box .hint { font-size: 12px; color: var(--muted); font-family: var(--mono); margin-bottom: 18px; }
  .file-pick-label { display: inline-block; padding: 11px 28px; border-radius: 10px; background: rgba(124,106,247,0.15); border: 1px solid var(--accent); color: var(--accent); font-family: var(--mono); font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
  .file-pick-label:hover { background: rgba(124,106,247,0.28); }
  .file-pick-label input[type="file"] { display: none; }
  .file-badge { display: inline-flex; align-items: center; gap: 10px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 9px 14px; font-size: 13px; font-family: var(--mono); margin-top: 14px; }
  .file-badge .ext { background: var(--accent); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
  .file-badge .rm { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 17px; margin-left: 2px; padding: 0; line-height: 1; }
  .file-badge .rm:hover { color: var(--accent2); }

  .lang-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 8px; }
  .lang-btn { padding: 9px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); font-family: var(--mono); font-size: 12px; cursor: pointer; transition: all 0.15s; text-align: left; }
  .lang-btn:hover { border-color: var(--accent); color: var(--text); }
  .lang-btn.selected { border-color: var(--accent); background: rgba(124,106,247,0.15); color: var(--accent); }

  .translate-btn { width: 100%; padding: 15px; border-radius: 14px; border: none; background: linear-gradient(135deg, var(--accent), #a06af7); color: white; font-family: var(--sans); font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .translate-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(124,106,247,0.4); }
  .translate-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
  .progress-wrap { height: 3px; background: var(--surface2); border-radius: 99px; overflow: hidden; margin-top: 14px; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent3)); border-radius: 99px; transition: width 0.35s ease; }
  .status-txt { font-family: var(--mono); font-size: 12px; color: var(--accent3); margin-top: 7px; text-align: center; }

  .result-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
  .result-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
  .badge { font-family: var(--mono); font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .badge-det { background: rgba(106,247,212,0.15); color: var(--accent3); }
  .badge-lang { background: rgba(124,106,247,0.15); color: var(--accent); }
  .badge-deepl { background: rgba(106,247,212,0.12); color: var(--accent3); border: 1px solid rgba(106,247,212,0.2); }
  .result-actions { display: flex; gap: 8px; }
  .action-btn { padding: 7px 15px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); font-family: var(--mono); font-size: 11px; cursor: pointer; transition: all 0.15s; }
  .action-btn:hover { border-color: var(--accent); color: var(--accent); }
  .action-btn.primary { background: rgba(124,106,247,0.15); border-color: var(--accent); color: var(--accent); }
  .result-box { background: var(--surface2); border: 1px solid var(--border); border-radius: 13px; padding: 22px; font-size: 14px; line-height: 1.8; color: var(--text); white-space: pre-wrap; max-height: 480px; overflow-y: auto; font-family: var(--mono); font-weight: 300; }
  .result-box::-webkit-scrollbar { width: 5px; }
  .result-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  .error-box { background: rgba(247,106,138,0.07); border: 1px solid rgba(247,106,138,0.28); border-radius: 13px; padding: 15px 18px; color: var(--accent2); font-family: var(--mono); font-size: 13px; line-height: 1.6; }

  .hint-box { background: rgba(124,106,247,0.06); border: 1px solid rgba(124,106,247,0.2); border-radius: 13px; padding: 15px 18px; font-family: var(--mono); font-size: 12px; color: var(--muted); line-height: 1.7; }
  .hint-box code { color: var(--accent3); background: rgba(106,247,212,0.08); padding: 1px 5px; border-radius: 4px; }
  .hint-box strong { color: var(--text); }
`;

const LANGUAGES = [
  { code: "FR",    label: "🇫🇷 French" },
  { code: "ES",    label: "🇪🇸 Spanish" },
  { code: "DE",    label: "🇩🇪 German" },
  { code: "ZH",    label: "🇨🇳 Chinese" },
  { code: "AR",    label: "🇸🇦 Arabic" },
  { code: "PT-BR", label: "🇧🇷 Portuguese" },
  { code: "JA",    label: "🇯🇵 Japanese" },
  { code: "RU",    label: "🇷🇺 Russian" },
  { code: "KO",    label: "🇰🇷 Korean" },
  { code: "IT",    label: "🇮🇹 Italian" },
  { code: "NL",    label: "🇳🇱 Dutch" },
  { code: "PL",    label: "🇵🇱 Polish" },
  { code: "SV",    label: "🇸🇪 Swedish" },
  { code: "TR",    label: "🇹🇷 Turkish" },
];

const CHUNK_SIZE = 4000;
const DEFAULT_URL = "http://localhost:3001";

function getExt(name) { return (name.split(".").pop() || "").toLowerCase(); }

function loadJSZip() {
  return new Promise((resolve, reject) => {
    if (window.JSZip) return resolve(window.JSZip);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => resolve(window.JSZip);
    s.onerror = () => reject(new Error("JSZip failed to load"));
    document.head.appendChild(s);
  });
}

async function extractDocxText(file) {
  const JSZip = await loadJSZip();
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) throw new Error("Invalid DOCX file.");
  return xml
    .replace(/<w:p[ >]/g, "\n<w:p ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n").trim();
}

function chunkText(text, max) {
  const chunks = [], paras = text.split(/\n+/);
  let cur = "";
  for (const p of paras) {
    if ((cur + "\n" + p).length > max) {
      if (cur) chunks.push(cur.trim());
      cur = p.length > max ? p.slice(0, max) : p;
    } else cur = cur ? cur + "\n" + p : p;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

async function translateChunk(text, targetLang, backendUrl) {
  const res = await fetch(`${backendUrl}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: [text], target_lang: targetLang }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
  return {
    translatedText: data.translations[0].text,
    detectedLang: data.translations[0].detected_source_language || null,
  };
}

async function translateAll(text, targetLang, backendUrl, onProgress) {
  const chunks = chunkText(text, CHUNK_SIZE);
  const out = [];
  let detectedLang = null;
  for (let i = 0; i < chunks.length; i++) {
    onProgress(`Translating… ${i + 1} / ${chunks.length}`, Math.round(25 + ((i + 1) / chunks.length) * 70));
    const { translatedText, detectedLang: dl } = await translateChunk(chunks[i], targetLang, backendUrl);
    out.push(translatedText);
    if (!detectedLang && dl) detectedLang = dl;
  }
  return { translatedText: out.join("\n\n"), detectedLang };
}

export default function App() {
  const [backendUrl, setBackendUrl] = useState(DEFAULT_URL);
  const [pingStatus, setPingStatus] = useState("checking"); // checking | online | offline
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [lang, setLang] = useState("FR");
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const pingRef = useRef(null);

  useEffect(() => { loadJSZip().catch(() => {}); }, []);

  useEffect(() => {
    setPingStatus("checking");
    clearTimeout(pingRef.current);
    pingRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`${backendUrl.replace(/\/$/, "")}/health`, { signal: AbortSignal.timeout(3000) });
        setPingStatus(r.ok ? "online" : "offline");
      } catch { setPingStatus("offline"); }
    }, 600);
    return () => clearTimeout(pingRef.current);
  }, [backendUrl]);

  const langLabel = LANGUAGES.find(l => l.code === lang)?.label.slice(2) || "French";

  const handleFile = (f) => {
    if (!["docx", "txt"].includes(getExt(f.name))) {
      setError("Please upload a DOCX or TXT file."); return;
    }
    setFile(f); setResult(null); setError(null);
  };

  const translate = async () => {
    if (!file) return;
    setTranslating(true); setProgress(10); setStatusMsg("Reading document…"); setResult(null); setError(null);
    try {
      let text = "";
      if (getExt(file.name) === "docx") {
        setProgress(18); setStatusMsg("Extracting DOCX text…");
        text = await extractDocxText(file);
        if (!text?.trim()) throw new Error("Could not extract text from this DOCX.");
      } else {
        setProgress(18); setStatusMsg("Reading file…");
        text = await file.text();
        if (!text?.trim()) throw new Error("The file is empty.");
      }

      const url = backendUrl.replace(/\/$/, "");
      const { translatedText, detectedLang } = await translateAll(
        text, lang, url,
        (msg, pct) => { setStatusMsg(msg); setProgress(pct); }
      );

      setProgress(100); setStatusMsg("Done!");
      setResult({ text: translatedText, detectedLang, targetLang: langLabel });
    } catch (err) {
      setError(err.message.includes("fetch") || err.message.includes("Failed")
        ? "Could not reach backend. Is it running? Check the URL above."
        : err.message);
    } finally {
      setTranslating(false);
      setTimeout(() => { setProgress(0); setStatusMsg(""); }, 1500);
    }
  };

  const download = () => {
    if (!result?.text) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([result.text], { type: "text/plain;charset=utf-8" }));
    a.download = `${file?.name.replace(/\.[^.]+$/, "") || "translation"}_${result.targetLang.toLowerCase()}.txt`;
    a.click();
  };

  const copy = () => result?.text && navigator.clipboard.writeText(result.text);

  const btnLabel = translating ? "Translating…"
    : pingStatus === "offline" ? "⚠ Backend offline"
    : pingStatus === "checking" ? "Checking backend…"
    : `✦ Translate to ${langLabel}`;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="header">
          <span className="header-tag">Powered by DeepL · Free tier · 500k chars/month</span>
          <h1>Document Translator</h1>
          <p>Professional-grade translation via your own DeepL proxy.</p>
        </div>

        {/* Backend URL */}
        <div className="backend-box">
          <span className="blabel">Backend</span>
          <input
            value={backendUrl}
            onChange={e => setBackendUrl(e.target.value)}
            placeholder="http://localhost:3001"
            spellCheck={false}
          />
          <div className="status-chip">
            <div className={`dot ${pingStatus}`} />
            <span style={{color: pingStatus === "online" ? "var(--accent3)" : pingStatus === "offline" ? "var(--accent2)" : "var(--muted)"}}>
              {pingStatus === "online" ? "Online" : pingStatus === "offline" ? "Offline" : "Checking…"}
            </span>
          </div>
        </div>

        {pingStatus === "offline" && (
          <div style={{width:"100%", maxWidth:"760px"}}>
            <div className="hint-box">
              <strong>Backend not running.</strong> Start it with:<br/>
              <code>cd deepl-proxy &amp;&amp; npm install &amp;&amp; npm start</code><br/><br/>
              Or deploy to Railway/Render — see <strong>README.md</strong> in the backend files.
            </div>
          </div>
        )}

        <div className="card">
          {/* Upload */}
          <div className="card-section">
            <div className="section-label">01 — Upload Document</div>
            <div
              className={`upload-box${dragOver ? " drag-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            >
              <span className="upload-icon">📄</span>
              <h3>Choose a document to translate</h3>
              <p className="hint">DOCX · TXT</p>
              <label className="file-pick-label">
                📂 Browse Files
                <input type="file" accept=".docx,.txt" onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
              </label>
            </div>
            {file && (
              <div className="file-badge">
                <span className="ext">{getExt(file.name).toUpperCase()}</span>
                <span>{file.name}</span>
                <button className="rm" onClick={() => { setFile(null); setResult(null); setError(null); }}>×</button>
              </div>
            )}
          </div>

          {/* Language */}
          <div className="card-section">
            <div className="section-label">02 — Target Language</div>
            <div className="lang-grid">
              {LANGUAGES.map(l => (
                <button key={l.code} className={`lang-btn${lang === l.code ? " selected" : ""}`} onClick={() => setLang(l.code)}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Go */}
          <div className="card-section">
            <button className="translate-btn" disabled={!file || translating || pingStatus !== "online"} onClick={translate}>
              {btnLabel}
            </button>
            {translating && (
              <>
                <div className="progress-wrap"><div className="progress-bar" style={{width:`${progress}%`}} /></div>
                <div className="status-txt">{statusMsg}</div>
              </>
            )}
          </div>

          {error && <div className="card-section"><div className="error-box">⚠ {error}</div></div>}

          {result && (
            <div className="card-section">
              <div className="result-header">
                <div className="result-meta">
                  {result.detectedLang && <span className="badge badge-det">Detected: {result.detectedLang}</span>}
                  <span className="badge badge-lang">→ {result.targetLang}</span>
                  <span className="badge badge-deepl">⚡ DeepL</span>
                </div>
                <div className="result-actions">
                  <button className="action-btn" onClick={copy}>Copy</button>
                  <button className="action-btn primary" onClick={download}>↓ Download</button>
                </div>
              </div>
              <div className="result-box">{result.text}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}