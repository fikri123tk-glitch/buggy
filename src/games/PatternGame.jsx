import { useState } from "react";
import { PAT_LV } from "../constants";

export default function PatternGame({ score, onScore, onFinish }) {
  const [idx, setIdx]         = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const lv = PAT_LV[idx];

  function choose(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === lv.correct) {
      onScore(10);
      setLocalScore(prev => prev + 10);
    }
  }

  function next() {
    if (idx + 1 >= PAT_LV.length) {
      onFinish(localScore);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  const chipCls = lv.badge === "Mudah" ? "easy" : lv.badge === "Sedang" ? "medium" : "hard";
  const isCorrect = selected === lv.correct;

  return (
    <div className="anim-slide">
      {/* Progress */}
      <div style={{ height:5, background:"#E2E8F0", borderRadius:10, marginBottom:18, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(idx/PAT_LV.length)*100}%`, background:"#8B5CF6", borderRadius:10, transition:"width 0.4s" }}/>
      </div>

      <span className={`q-chip ${chipCls}`}>{lv.badge}</span>
      <div className="q-scene">{lv.sit}</div>

      {/* Pattern display */}
      {lv.pattern && (
        <div className="pat-row">
          {lv.pattern.map((cell, i) => (
            <div key={i} className={`pat-cell ${cell === "?" ? "unknown" : ""}`}>
              {cell}
            </div>
          ))}
        </div>
      )}

      {/* Visual row */}
      {lv.visual && (
        <div className="vis-row">
          {lv.visual.map((v, i) => (
            <div key={i} className="vis-item">{v}</div>
          ))}
        </div>
      )}

      <div className="q-label">❓ {lv.q}</div>

      {/* Options */}
      <div className="opts-grid">
        {lv.opts.map((opt, i) => {
          let cls = "btn-opt";
          if (answered) {
            if (i === lv.correct) cls += " correct";
            else if (i === selected) cls += " wrong";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`answer-box ${isCorrect ? "answer-ok" : "answer-err"}`}>
          <div className="ab-icon">{isCorrect ? "🎉" : "💡"}</div>
          <div className="ab-title">{isCorrect ? "Benar! +10 poin" : "Belum tepat!"}</div>
          <div className="ab-explain">{lv.explain}</div>
          <button className="btn-next" onClick={next}>
            {idx + 1 >= PAT_LV.length ? "Selesai 🏁" : "Soal Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}