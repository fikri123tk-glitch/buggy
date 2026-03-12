import { useState } from "react";
import { TYP_LV } from "../constants";

export default function TypingGame({ score, onScore, onFinish }) {
  const [idx, setIdx]       = useState(0);
  const [input, setInput]   = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect]   = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const lv = TYP_LV[idx];

  function check() {
    if (!input.trim()) return;
    const ok = input.trim() === lv.answer.trim();
    setCorrect(ok);
    setAnswered(true);
    if (ok) {
      onScore(10);
      setLocalScore(prev => prev + 10);
    }
  }

  function next() {
    if (idx + 1 >= TYP_LV.length) {
      onFinish(localScore);
    } else {
      setIdx(idx + 1);
      setInput("");
      setAnswered(false);
      setCorrect(false);
    }
  }

  const chipCls = lv.badge === "Mudah" ? "easy" : lv.badge === "Sedang" ? "medium" : "hard";

  return (
    <div className="anim-slide">
      {/* Progress */}
      <div style={{ height:5, background:"#E2E8F0", borderRadius:10, marginBottom:18, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(idx/TYP_LV.length)*100}%`, background:"#10B981", borderRadius:10, transition:"width 0.4s" }}/>
      </div>

      <span className={`q-chip ${chipCls}`}>{lv.badge}</span>
      <div className="q-scene">📖 {lv.story}</div>

      {/* Example */}
      <div className="typing-example">
        <div className="typing-ex-label">Contoh kode</div>
        <pre>{lv.example}</pre>
      </div>

      {/* Task */}
      <div className="typing-task">
        <div className="typing-task-label">🎯 Tugasmu</div>
        <div className="typing-task-text">{lv.task}</div>
      </div>

      {/* Input */}
      <textarea
        className={`typing-input${answered ? (correct ? " ok-input" : " err-input") : ""}`}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ketik kodenya di sini..."
        disabled={answered}
        rows={lv.answer.split("\n").length + 1}
        spellCheck={false}
        autoCapitalize="none"
      />

      {!answered && (
        <button className="btn-submit" onClick={check} disabled={!input.trim()}>
          ✅ Cek Jawaban
        </button>
      )}

      {answered && (
        <div className={`answer-box ${correct ? "answer-ok" : "answer-err"}`}>
          <div className="ab-icon">{correct ? "🎉" : "💡"}</div>
          <div className="ab-title">{correct ? "Benar! +10 poin" : "Belum tepat!"}</div>
          <div className="ab-explain">{lv.explain}</div>
          {!correct && (
            <>
              <div style={{ fontSize:12, fontWeight:800, color:"#991B1B", marginTop:8, marginBottom:4 }}>Jawaban yang benar:</div>
              <div className="ab-code">{lv.answer}</div>
            </>
          )}
          <button className="btn-next" onClick={next}>
            {idx + 1 >= TYP_LV.length ? "Selesai 🏁" : "Soal Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}