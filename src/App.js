import { useState, useRef } from "react";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // 🎤 SPEECH
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      if (transcript) {
        setText((prev) => (prev + " " + transcript).trim());
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  // 🧠 SUMMARY
  const generateSummary = async () => {
    const res = await fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setSummary(data.summary);
  };

  // 🌍 TRANSLATE
  const translateText = async () => {
    const res = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLang: "az",
      }),
    });

    const data = await res.json();
    setTranslated(data.translated);
  };

  // 📄 PDF (simple text download)
  const download = () => {
    const content = `
NOTES:
${text}

SUMMARY:
${summary}

TRANSLATION:
${translated}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.txt";
    a.click();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎤 NoteMind AI</h1>

      {/* BUTTONS */}
      <button onClick={startListening}>
        {listening ? "Listening..." : "Start"}
      </button>

      <button onClick={stopListening}>Stop</button>

      <button onClick={generateSummary}>🧠 Summary</button>

      <button onClick={translateText}>🌍 Translate</button>

      <button onClick={download}>📄 Download</button>

      <hr />

      {/* EDITOR */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: 150 }}
      />

      <h3>Notes</h3>
      <p>{text}</p>

      <h3>Summary</h3>
      <p>{summary}</p>

      <h3>Translation</h3>
      <p>{translated}</p>
    </div>
  );
}

export default App;