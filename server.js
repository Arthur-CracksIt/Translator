import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DEEPL_KEY = process.env.DEEPL_API_KEY;

if (!DEEPL_KEY) {
  console.error("DEEPL_API_KEY is not set. Copy .env.example to .env and add your key.");
  process.exit(1);
}

const DEEPL_URL = DEEPL_KEY.trim().endsWith(":fx")
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/translate", async (req, res) => {
  const { text, target_lang } = req.body;
  if (!text || !target_lang)
    return res.status(400).json({ error: "Missing text or target_lang" });

  try {
    const r = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: Array.isArray(text) ? text : [text], target_lang }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message || "DeepL error" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`DeepL proxy running → http://localhost:${PORT}`));