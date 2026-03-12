import { useState, useEffect } from "react";
import { SEQ_LV } from "../constants";

export default function SequenceGame({ score, onScore, onFinish }) {
  const [idx, setIdx]       = useState(0);
  const [items, setItems]   = useState([]);
  const [drag, setDrag]     = useState(null);
  const [done, setDone]     = useState(false);
  const [answered, setAnswered] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const lv = SEQ_LV[idx];

  useEffect(() => {
    // Shuffle steps
    const shuffled = [...lv.steps].map((s,i)=>({ id:i, text:s }))
      .sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setDone(false);
    setAnswered(false);
  }, [idx]);

  function handleDragStart(i) { setDrag(i); }
  function handleDragOver(e, i) {
    e.preventDefault();
    if (drag === null || drag === i) return;
    const next = [...items];
    const [moved] = next.splice(drag, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDrag(i);
  }
  function handleDrop() { setDrag(null); }

  function checkAnswer() {
    const correctOrder = lv.correct.map(i => lv.steps[i]);
    const userOrder    = items.map(it => it.text);
    const isCorrect    = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
    const pts = isCorrect ? 10 : 0;
    setDone(isCorrect);
    setAnswered(true);
    if (pts > 0) {
      onScore(pts);
      setLocalScore(prev => prev + pts);
    }
  }

  function next() {
    if (idx + 1 >= SEQ_LV.length) {
      onFinish(localScore + (done ? 0 : 0)); // already counted
    } else {
      setIdx(idx + 1);
    }
  }

  const chipCls = lv.badge === "Mudah" ? "easy" : lv.badge === "Sedang" ? "medium" : "hard";

  return (
    <div className="anim-slide">
      {/* Progress */}
      <div style={{ height:5, background:"#E2E8F0", borderRadius:10, marginBottom:18, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${((idx)/SEQ_LV.length)*100}%`, background:"#FF9F43", borderRadius:10, transition:"width 0.4s" }}/>
      </div>

      <span className={`q-chip ${chipCls}`}>{lv.badge}</span>
      <div className="q-scene">{lv.story}</div>

      {/* Draggable steps */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
        {items.map((item, i) => (
          <div key={item.id}
            draggable={!answered}
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={handleDrop}
            style={{
              background: answered
                ? (lv.correct[i] === item.id ? "#ECFDF5" : "#FEF2F2")
                : "white",
              border: `2.5px solid ${answered
                ? (lv.correct[i] === item.id ? "#10B981" : "#EF4444")
                : drag === i ? "#3B82F6" : "#E2E8F0"}`,
              borderRadius:12, padding:"13px 16px",
              display:"flex", alignItems:"center", gap:12,
              cursor: answered ? "default" : "grab",
              transition:"all 0.15s",
              userSelect:"none",
            }}
          >
            <span style={{ fontSize:16, color:"#D1D5DB" }}>⠿</span>
            <span style={{
              minWidth:24, height:24, borderRadius:"50%",
              background:"#F0F4FF", color:"#3B82F6",
              fontSize:12, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            }}>{i+1}</span>
            <span style={{ fontSize:14, fontWeight:800, color:"#1E2240", flex:1 }}>{item.text}</span>
            {answered && (
              <span style={{ fontSize:16 }}>
                {lv.correct[i] === item.id ? "✅" : "❌"}
              </span>
            )}
          </div>
        ))}
      </div>

      {!answered && (
        <button className="btn-primary" onClick={checkAnswer} style={{ width:"100%" }}>
          ✅ Cek Urutan
        </button>
      )}

      {answered && (
        <div className={`answer-box ${done ? "answer-ok" : "answer-err"}`}>
          <div className="ab-icon">{done ? "🎉" : "💡"}</div>
          <div className="ab-title">{done ? "Urutan Benar!" : "Belum Tepat!"}</div>
          <div className="ab-explain">
            {done
              ? "Kamu berhasil menyusun urutan yang benar! +10 poin 🌟"
              : `Urutan yang benar: ${lv.correct.map(i=>lv.steps[i]).join(" → ")}`
            }
          </div>
          <button className="btn-next" onClick={next}>
            {idx + 1 >= SEQ_LV.length ? "Selesai 🏁" : "Soal Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}