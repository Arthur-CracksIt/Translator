import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f4f3f0;
    --surface: #ffffff;
    --surface2: #f9f8f6;
    --border: #e2e0db;
    --border-strong: #c8c5be;
    --accent: #1a1a1a;
    --accent-muted: #4a4a4a;
    --accent-light: #e8e6e1;
    --highlight: #2563eb;
    --highlight-muted: #dbeafe;
    --danger: #dc2626;
    --danger-muted: #fef2f2;
    --success: #16a34a;
    --success-muted: #f0fdf4;
    --warning: #d97706;
    --text: #1a1a1a;
    --text-muted: #6b6b6b;
    --text-light: #9a9a9a;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
    --radius: 4px;
    --radius-lg: 8px;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    line-height: 1.6;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    min-height: 100vh;
    padding: 40px 24px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* Header */
  .header {
    width: 100%;
    max-width: 720px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
  }
  .header-eyebrow {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 10px;
  }
  .header h1 {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text);
    line-height: 1.2;
  }
  .header p {
    margin-top: 6px;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 300;
  }

  /* Sections */
  .section {
    width: 100%;
    max-width: 720px;
    margin-bottom: 24px;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .section-num {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    color: var(--text-light);
    letter-spacing: 0.1em;
    min-width: 24px;
  }
  .section-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }

  /* Backend row */
  .backend-row {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .backend-label {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }
  .backend-input {
    flex: 1;
    min-width: 200px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 7px 10px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text);
    outline: none;
    transition: border-color 0.15s;
  }
  .backend-input:focus { border-color: var(--highlight); }
  .status-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--mono);
    font-size: 11px;
    white-space: nowrap;
  }
  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--border-strong);
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .status-dot.online { background: var(--success); box-shadow: 0 0 0 2px var(--success-muted); }
  .status-dot.offline { background: var(--danger); box-shadow: 0 0 0 2px var(--danger-muted); }
  .status-dot.checking { animation: blink 1.2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* Offline notice */
  .notice {
    background: var(--danger-muted);
    border: 1px solid #fca5a5;
    border-radius: var(--radius-lg);
    padding: 12px 16px;
    font-size: 13px;
    color: var(--danger);
    margin-top: 8px;
  }
  .notice code {
    font-family: var(--mono);
    font-size: 12px;
    background: rgba(220,38,38,0.08);
    padding: 1px 5px;
    border-radius: 3px;
  }

  /* Upload zone */
  .upload-zone {
    background: var(--surface);
    border: 1.5px dashed var(--border-strong);
    border-radius: var(--radius-lg);
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--highlight);
    background: var(--highlight-muted);
  }
  .upload-zone-icon {
    width: 40px; height: 40px;
    margin: 0 auto 14px;
    border: 1.5px solid var(--border-strong);
    border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center;
    background: var(--surface2);
  }
  .upload-zone-icon svg { width: 20px; height: 20px; stroke: var(--text-muted); fill: none; stroke-width: 1.5; }
  .upload-zone h3 { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .upload-zone p { font-size: 12px; color: var(--text-light); font-family: var(--mono); margin-bottom: 16px; }
  .upload-btn {
    display: inline-block;
    padding: 8px 20px;
    border-radius: var(--radius);
    border: 1px solid var(--accent);
    background: var(--accent);
    color: #fff;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .upload-btn:hover { background: var(--accent-muted); border-color: var(--accent-muted); }
  .upload-btn input[type="file"] { display: none; }

  /* File badge */
  .file-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 8px 12px;
    font-family: var(--mono);
    font-size: 12px;
    margin-top: 12px;
  }
  .file-ext {
    background: var(--accent);
    color: #fff;
    font-size: 9px;
    font-weight: 600;
    padding: 2px 5px;
    border-radius: 2px;
    letter-spacing: 0.05em;
  }
  .file-name { flex: 1; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-rm {
    background: none; border: none;
    color: var(--text-light);
    cursor: pointer;
    font-size: 16px;
    padding: 0; line-height: 1;
    transition: color 0.15s;
  }
  .file-rm:hover { color: var(--danger); }

  /* Language grid */
  .lang-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 6px;
  }
  .lang-btn {
    padding: 8px 12px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }
  .lang-btn:hover { border-color: var(--highlight); color: var(--text); }
  .lang-btn.selected {
    border-color: var(--highlight);
    background: var(--highlight-muted);
    color: var(--highlight);
    font-weight: 500;
  }

  /* Translate button */
  .translate-btn {
    width: 100%;
    padding: 12px;
    border-radius: var(--radius);
    border: none;
    background: var(--accent);
    color: #fff;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .translate-btn:hover:not(:disabled) { background: var(--accent-muted); }
  .translate-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Progress */
  .progress-track {
    height: 2px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 12px;
  }
  .progress-fill {
    height: 100%;
    background: var(--highlight);
    border-radius: 99px;
    transition: width 0.35s ease;
  }
  .progress-label {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-light);
    margin-top: 6px;
    text-align: center;
  }

  /* Result */
  .result-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .result-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
    flex-wrap: wrap;
    gap: 8px;
  }
  .result-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .tag {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 2px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .tag-detected { background: var(--success-muted); color: var(--success); }
  .tag-lang { background: var(--highlight-muted); color: var(--highlight); }
  .tag-engine { background: var(--accent-light); color: var(--accent-muted); }
  .copy-btn {
    padding: 5px 12px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    font-family: var(--mono);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .copy-btn:hover { border-color: var(--highlight); color: var(--highlight); }
  .result-text {
    padding: 20px;
    font-size: 14px;
    line-height: 1.8;
    color: var(--text);
    white-space: pre-wrap;
    max-height: 420px;
    overflow-y: auto;
    font-weight: 300;
  }
  .result-text::-webkit-scrollbar { width: 4px; }
  .result-text::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

  /* Download grid */
  .download-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border-top: 1px solid var(--border);
  }
  .dl-btn {
    padding: 12px 8px;
    background: var(--surface2);
    border: none;
    color: var(--text-muted);
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-align: center;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .dl-btn:hover:not(:disabled) { background: var(--surface); color: var(--highlight); }
  .dl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .dl-btn .dl-fmt { display: block; font-size: 10px; color: var(--text-light); margin-top: 2px; font-weight: 400; }

  /* Error */
  .error-msg {
    background: var(--danger-muted);
    border: 1px solid #fca5a5;
    border-radius: var(--radius-lg);
    padding: 12px 16px;
    color: var(--danger);
    font-size: 13px;
    line-height: 1.6;
  }

  /* Divider */
  .divider { width: 100%; max-width: 720px; height: 1px; background: var(--border); margin-bottom: 24px; }

  @media (max-width: 480px) {
    .download-row { grid-template-columns: repeat(2, 1fr); }
    .lang-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
  }
`;

const LANGUAGES = [
  { code: "FR",    label: "French" },
  { code: "ES",    label: "Spanish" },
  { code: "DE",    label: "German" },
  { code: "ZH",    label: "Chinese" },
  { code: "AR",    label: "Arabic" },
  { code: "PT-BR", label: "Portuguese" },
  { code: "JA",    label: "Japanese" },
  { code: "RU",    label: "Russian" },
  { code: "KO",    label: "Korean" },
  { code: "IT",    label: "Italian" },
  { code: "NL",    label: "Dutch" },
  { code: "PL",    label: "Polish" },
  { code: "SV",    label: "Swedish" },
  { code: "TR",    label: "Turkish" },
];

// Security constants
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const CHUNK_SIZE = 4000;
const MAX_TEXT_LENGTH = 500000; // 500k chars max per translation session
const DEFAULT_URL = "https://translator-production-5690.up.railway.app";

// Security: sanitize text to prevent XSS / injection before displaying
function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\0/g, "")           // remove null bytes
    .replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "") // strip control chars
    .slice(0, MAX_TEXT_LENGTH);
}

// Security: validate file before processing
function validateFile(file) {
  if (!file) return "No file selected.";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return `File type .${ext} is not supported. Please upload a PDF, DOCX, or TXT file.`;
  if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== "")
    return `MIME type "${file.type}" is not permitted.`;
  if (file.size > MAX_FILE_SIZE_BYTES)
    return `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`;
  if (file.size === 0)
    return "The file is empty.";
  return null;
}

// Security: validate backend URL
function validateUrl(url) {
  try {
    const u = new URL(url);
    if (!["https:", "http:"].includes(u.protocol)) return false;
    if (u.hostname === "") return false;
    return true;
  } catch { return false; }
}

function getExt(name) { return (name.split(".").pop() || "").toLowerCase(); }

function loadScript(src, globalName) {
  return new Promise((resolve, reject) => {
    if (window[globalName]) return resolve(window[globalName]);
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(window[globalName]);
    s.onerror = () => reject(new Error(`Failed to load dependency: ${globalName}`));
    document.head.appendChild(s);
  });
}

function loadJSZip() { return loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", "JSZip"); }
function loadDocxLib() { return loadScript("https://unpkg.com/docx@8.5.0/build/index.umd.js", "docx"); }
function loadJsPDF() { return loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jspdf"); }

function loadPDFJS() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPDFJS();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(" "));
  }
  return sanitizeText(pages.join("\n\n"));
}

async function extractDocxData(file) {
  const JSZip = await loadJSZip();
  const zipData = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(zipData);
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) throw new Error("Invalid DOCX file.");

  // Extract paragraphs with their text, preserving order
  const paraMatches = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];
  const paragraphs = paraMatches.map(m => {
    const paraXml = m[0];
    const text = paraXml
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&apos;/g, "'").replace(/&quot;/g, '"')
      .trim();
    return { xml: paraXml, text };
  });

  const plainText = sanitizeText(paragraphs.map(p => p.text).join("\n"));
  return { plainText, paragraphs, zip, originalXml: xml };
}

// Keep a simple text-only extractor for the translate pipeline
async function extractDocxText(file) {
  const data = await extractDocxData(file);
  return data.plainText;
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
  // Security: validate URL before each request
  if (!validateUrl(backendUrl)) throw new Error("Invalid backend URL.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const res = await fetch(`${backendUrl}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: [text], target_lang: targetLang }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Server responded with ${res.status}`);
    return {
      translatedText: sanitizeText(data.translations[0].text),
      detectedLang: data.translations[0].detected_source_language || null,
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") throw new Error("Request timed out. Please try again.");
    throw err;
  }
}

async function translateAll(text, targetLang, backendUrl, onProgress) {
  const chunks = chunkText(text, CHUNK_SIZE);
  const out = [];
  let detectedLang = null;
  for (let i = 0; i < chunks.length; i++) {
    onProgress(`Translating segment ${i + 1} of ${chunks.length}`, Math.round(25 + ((i + 1) / chunks.length) * 70));
    const { translatedText, detectedLang: dl } = await translateChunk(chunks[i], targetLang, backendUrl);
    out.push(translatedText);
    if (!detectedLang && dl) detectedLang = dl;
  }
  return { translatedText: out.join("\n\n"), detectedLang };
}

// Download helpers
function downloadTxt(text, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.download = filename + ".txt";
  a.click();
}

async function downloadDocx(translatedText, filename, originalFile, originalExt) {
  // If original was DOCX, preserve structure by injecting translated paragraphs back into the XML
  if (originalExt === "docx" && originalFile) {
    try {
      const { paragraphs, zip, originalXml } = await extractDocxData(originalFile);

      // Split translated text back into paragraphs (same count ideally)
      const translatedParas = translatedText.split(/\n+/);

      // Build a map: for each original paragraph that had text, replace its w:t content
      let paraIndex = 0;
      let newXml = originalXml.replace(/<w:p[ >][\s\S]*?<\/w:p>/g, (match) => {
        const hasText = match.replace(/<[^>]+>/g, "").trim().length > 0;
        if (!hasText) return match; // keep empty/structural paragraphs as-is

        const translated = translatedParas[paraIndex] ?? "";
        paraIndex++;

        // Escape the translated text for XML
        const escaped = translated
          .replace(/&/g, "&amp;").replace(/</g, "&lt;")
          .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

        // Preserve paragraph properties (pPr = formatting like heading style, alignment)
        const pPrMatch = match.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
        const pPr = pPrMatch ? pPrMatch[0] : "";

        // Preserve run properties from first run (bold, italic, font size etc.)
        const rPrMatch = match.match(/<w:rPr>[\s\S]*?<\/w:rPr>/);
        const rPr = rPrMatch ? rPrMatch[0] : "";

        return `<w:p><w:pPr>${pPr ? pPr.replace(/^<w:pPr>|<\/w:pPr>$/g, "") : ""}</w:pPr><w:r>${rPr}<w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
      });

      zip.file("word/document.xml", newXml);
      const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename + ".docx";
      a.click();
      return;
    } catch (e) {
      // Fall through to plain docx if structure preservation fails
    }
  }

  // Fallback: plain DOCX from translated text
  const { Document, Packer, Paragraph, TextRun } = await loadDocxLib();
  const paragraphs = translatedText.split(/\n+/).map(p =>
    new Paragraph({ children: [new TextRun({ text: p, size: 24 })] })
  );
  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename + ".docx";
  a.click();
}

async function downloadPdf(text, filename) {
  const { jsPDF } = await loadJsPDF();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const margin = 18, lineH = 6.5, maxW = 210 - margin * 2, maxY = 297 - margin;
  const lines = doc.splitTextToSize(text, maxW);
  let y = margin;
  for (const line of lines) {
    if (y + lineH > maxY) { doc.addPage(); y = margin; }
    doc.text(line, margin, y);
    y += lineH;
  }
  doc.save(filename + ".pdf");
}

async function downloadPptx(text, filename) {
  const JSZip = await loadJSZip();
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim());
  const zip = new JSZip();

  // [Content_Types].xml
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  ${paragraphs.map((_, i) => `<Override PartName="/ppt/slides/slide${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("\n  ")}
</Types>`);

  // _rels/.rels
  zip.folder("_rels").file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

  const ppt = zip.folder("ppt");
  const slides = ppt.folder("slides");
  const slidesRels = slides.folder("_rels");
  const slideLayouts = ppt.folder("slideLayouts");
  const slideLayoutsRels = slideLayouts.folder("_rels");
  const slideMasters = ppt.folder("slideMasters");
  const slideMastersRels = slideMasters.folder("_rels");

  // Slide master (minimal)
  slideMasters.file("slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>`);
  slideMastersRels.file("slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`);

  // Slide layout (minimal)
  slideLayouts.file("slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" type="blank">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>`);
  slideLayoutsRels.file("slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`);

  // presentation.xml
  const slideIdList = paragraphs.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i+1}"/>`).join("\n    ");
  const slideRels = paragraphs.map((_, i) => `<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i+1}.xml"/>`).join("\n  ");
  ppt.file("presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" saveSubsetFonts="1">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId${paragraphs.length + 1}"/></p:sldMasterIdLst>
  <p:sldIdLst>${slideIdList}</p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`);
  ppt.folder("_rels").file("presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${slideRels}
  <Relationship Id="rId${paragraphs.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
</Relationships>`);

  // Individual slides
  function escapeXml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
  }

  paragraphs.forEach((para, i) => {
    const lines = escapeXml(para.trim()).split("\n");
    const runs = lines.map(l => `<a:r><a:rPr lang="en-US" sz="1600" b="0"/><a:t>${l} </a:t></a:r><a:br/>`).join("");
    const pageNum = `${i+1} / ${paragraphs.length}`;

    slides.file(`slide${i+1}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
       xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    <p:sp>
      <p:nvSpPr><p:cNvPr id="2" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
      <p:spPr><a:xfrm><a:off x="457200" y="457200"/><a:ext cx="8229600" cy="4114800"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>
      <p:txBody><a:bodyPr wrap="square" lIns="91440" rIns="91440" tIns="91440" bIns="91440"><a:normAutofit/></a:bodyPr><a:lstStyle/>
        <a:p>${runs}</a:p>
      </p:txBody>
    </p:sp>
    <p:sp>
      <p:nvSpPr><p:cNvPr id="3" name="PageNum"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
      <p:spPr><a:xfrm><a:off x="457200" y="4800600"/><a:ext cx="8229600" cy="342900"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>
      <p:txBody><a:bodyPr/><a:lstStyle/>
        <a:p><a:pPr algn="r"/><a:r><a:rPr lang="en-US" sz="900" b="0"><a:solidFill><a:srgbClr val="aaaaaa"/></a:solidFill></a:rPr><a:t>${escapeXml(pageNum)}</a:t></a:r></a:p>
      </p:txBody>
    </p:sp>
  </p:spTree></p:cSld>
</p:sld>`);

    slidesRels.file(`slide${i+1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>`);
  });

  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename + ".pptx";
  a.click();
}

// SVG icons (no emojis)
const IconUpload = () => (
  <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
);

export default function App() {
  const [pingStatus, setPingStatus] = useState("checking");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [lang, setLang] = useState("FR");
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [copied, setCopied] = useState(false);
  const pingRef = useRef(null);

  useEffect(() => { loadJSZip().catch(() => {}); }, []);

  useEffect(() => {
    setPingStatus("checking");
    clearTimeout(pingRef.current);
    pingRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`${DEFAULT_URL}/health`, { signal: AbortSignal.timeout(4000) });
        setPingStatus(r.ok ? "online" : "offline");
      } catch { setPingStatus("offline"); }
    }, 700);
    return () => clearTimeout(pingRef.current);
  }, []);

  const langLabel = LANGUAGES.find(l => l.code === lang)?.label || "French";

  const handleFile = (f) => {
    const validationError = validateFile(f);
    if (validationError) { setError(validationError); return; }
    setFile(f); setResult(null); setError(null);
  };

  const translate = async () => {
    if (!file) return;
    setTranslating(true); setProgress(10); setStatusMsg("Reading document..."); setResult(null); setError(null);
    try {
      const ext = getExt(file.name);
      let text = "";

      if (ext === "pdf") {
        setProgress(15); setStatusMsg("Extracting text from PDF...");
        text = await extractPdfText(file);
        if (!text?.trim()) throw new Error("No readable text found. The PDF may be image-based or scanned.");
      } else if (ext === "docx") {
        setProgress(15); setStatusMsg("Extracting text from DOCX...");
        text = await extractDocxText(file);
        if (!text?.trim()) throw new Error("No readable text found in this document.");
      } else {
        setProgress(15); setStatusMsg("Reading file...");
        text = sanitizeText(await file.text());
        if (!text?.trim()) throw new Error("The file is empty.");
      }

      if (text.length > MAX_TEXT_LENGTH)
        throw new Error(`Document exceeds the ${(MAX_TEXT_LENGTH / 1000).toFixed(0)}k character limit. Please use a shorter document.`);

      const { translatedText, detectedLang } = await translateAll(
        text, lang, DEFAULT_URL,
        (msg, pct) => { setStatusMsg(msg); setProgress(pct); }
      );

      setProgress(100); setStatusMsg("Translation complete.");
      const baseName = file.name.replace(/\.[^.]+$/, "") + `_${langLabel.toLowerCase()}`;
      setResult({ text: translatedText, detectedLang, targetLang: langLabel, baseName, originalFile: file, originalExt: ext });
    } catch (err) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg.includes("fetch") || msg.includes("Failed to fetch")
        ? "Unable to reach the translation backend. Verify the URL and ensure the server is running."
        : msg);
    } finally {
      setTranslating(false);
      setTimeout(() => { setProgress(0); setStatusMsg(""); }, 2000);
    }
  };

  const handleDownload = async (format) => {
    if (!result?.text || downloading) return;
    setDownloading(format);
    try {
      if (format === "txt") downloadTxt(result.text, result.baseName);
      else if (format === "docx") await downloadDocx(result.text, result.baseName, result.originalFile, result.originalExt);
      else if (format === "pdf") await downloadPdf(result.text, result.baseName);
      else if (format === "pptx") await downloadPptx(result.text, result.baseName);
    } catch (e) {
      setError(`Export failed: ${e.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const copy = async () => {
    if (!result?.text) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnLabel = translating ? `Translating...`
    : pingStatus === "offline" ? "Backend Unavailable"
    : pingStatus === "checking" ? "Connecting..."
    : `Translate to ${langLabel}`;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="header-eyebrow">
            Document Translation System
            <span style={{marginLeft:"12px", display:"inline-flex", alignItems:"center", gap:"5px"}}>
              <span className={`status-dot ${pingStatus}`} style={{display:"inline-block"}} />
              <span style={{fontSize:"10px", color: pingStatus === "online" ? "var(--success)" : pingStatus === "offline" ? "var(--danger)" : "var(--text-light)"}}>
                {pingStatus === "online" ? "Service online" : pingStatus === "offline" ? "Service unavailable" : "Connecting..."}
              </span>
            </span>
          </div>
          <h1>Translate Documents</h1>
          <p>Upload a document and translate it with DeepL. Supports PDF, DOCX, and TXT.</p>
        </div>

        {/* Upload */}
        <div className="section">
          <div className="section-header">
            <span className="section-num">01</span>
            <span className="section-title">Upload Document</span>
          </div>
          <div
            className={`upload-zone${dragOver ? " drag-over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault(); setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
          >
            <div className="upload-zone-icon"><IconUpload /></div>
            <h3>Drop a file here or click to browse</h3>
            <p>PDF · DOCX · TXT — Max {MAX_FILE_SIZE_MB}MB</p>
            <label className="upload-btn">
              Select File
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
              />
            </label>
          </div>
          {file && (
            <div className="file-badge">
              <span className="file-ext">{getExt(file.name).toUpperCase()}</span>
              <span className="file-name">{file.name}</span>
              <span style={{fontFamily:"var(--mono)", fontSize:"11px", color:"var(--text-light)", marginLeft:"auto", marginRight:"8px"}}>
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button className="file-rm" onClick={() => { setFile(null); setResult(null); setError(null); }}>×</button>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="section">
          <div className="section-header">
            <span className="section-num">02</span>
            <span className="section-title">Target Language</span>
          </div>
          <div className="lang-grid">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`lang-btn${lang === l.code ? " selected" : ""}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Translate */}
        <div className="section">
          <button
            className="translate-btn"
            disabled={!file || translating || pingStatus !== "online"}
            onClick={translate}
          >
            {btnLabel}
          </button>
          {translating && (
            <>
              <div className="progress-track">
                <div className="progress-fill" style={{width:`${progress}%`}} />
              </div>
              <div className="progress-label">{statusMsg}</div>
            </>
          )}
        </div>

        {error && (
          <div className="section">
            <div className="error-msg">{error}</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="section">
            <div className="section-header">
              <span className="section-num">03</span>
              <span className="section-title">Translation Result</span>
            </div>
            <div className="result-block">
              <div className="result-toolbar">
                <div className="result-meta">
                  {result.detectedLang && (
                    <span className="tag tag-detected">Source: {result.detectedLang}</span>
                  )}
                  <span className="tag tag-lang">Target: {result.targetLang}</span>
                  <span className="tag tag-engine">DeepL</span>
                </div>
                <button className="copy-btn" onClick={copy}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="result-text">{result.text}</div>
              <div className="download-row">
                {[
                  { fmt: "txt",  label: "TXT",  sub: "Plain text" },
                  { fmt: "docx", label: "DOCX", sub: "Word document" },
                  { fmt: "pdf",  label: "PDF",  sub: "Portable" },
                  { fmt: "pptx", label: "PPTX", sub: "Presentation" },
                ].map(({ fmt, label, sub }) => (
                  <button
                    key={fmt}
                    className="dl-btn"
                    onClick={() => handleDownload(fmt)}
                    disabled={!!downloading}
                  >
                    {downloading === fmt ? "Saving..." : `Download ${label}`}
                    <span className="dl-fmt">{downloading === fmt ? "please wait" : sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}