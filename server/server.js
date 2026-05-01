import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 SIMPLE SUMMARY (demo)
function makeSummary(text) {
  return text.split(". ").slice(0, 2).join(". ");
}

// 🧠 SUMMARY API
app.post("/summary", (req, res) => {
  const { text } = req.body;

  res.json({
    summary: makeSummary(text),
  });
});

// 🌍 TRANSLATE API (demo version)
app.post("/translate", (req, res) => {
  const { text, targetLang } = req.body;

  // real AI sonra əlavə ediləcək
  const translated = `[${targetLang}] ${text}`;

  res.json({
    translated,
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});