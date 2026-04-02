import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  // === LOGIKA SEHARI-HARI ===
  { cat:"🧠 Logika", q:"Jika hari ini Senin, 3 hari lagi hari apa?", opts:["Rabu","Kamis","Jumat","Selasa"], correct:1 },
  { cat:"🧠 Logika", q:"Deret berikutnya: 2, 4, 8, 16, ...", opts:["24","28","32","30"], correct:2 },
  { cat:"🧠 Logika", q:"Ada 10 orang dalam lift. 3 keluar, 5 masuk. Berapa orang sekarang?", opts:["12","13","8","15"], correct:0 },
  { cat:"🧠 Logika", q:"Jika semua A adalah B, dan C adalah A, maka C adalah...?", opts:["Bukan B","Pasti B","Mungkin B","Tidak bisa ditentukan"], correct:1 },
  { cat:"🧠 Logika", q:"Deret: 1, 1, 2, 3, 5, 8, ...", opts:["11","12","13","14"], correct:2 },
  { cat:"🧠 Logika", q:"Manakah yang BERBEDA dari yang lain?", opts:["Dokter","Guru","Polisi","Rumah Sakit"], correct:3 },
  { cat:"🧠 Logika", q:"Sebuah kamar punya 4 sudut. Di tiap sudut ada 1 kucing. Tiap kucing melihat 3 kucing lain. Ada berapa kucing?", opts:["12","16","4","8"], correct:2 },
  { cat:"🧠 Logika", q:"Jika 1 lusin = 12, berapa 2,5 lusin?", opts:["24","28","30","36"], correct:2 },

  // === CODING STANDAR ===
  { cat:"💻 Coding", q:"Apa output dari: print(2 + 3 * 4)?", opts:["20","14","24","10"], correct:1,
    hint:"Ingat aturan matematika: perkalian didahulukan sebelum penjumlahan. 3×4=12, lalu 2+12=14" },
  { cat:"💻 Coding", q:"Variabel mana yang benar untuk menyimpan nama?", opts:["1nama = 'Budi'","nama = 'Budi'","nama == 'Budi'","'Budi' = nama"], correct:1,
    hint:"Nama variabel tidak boleh diawali angka, dan = dipakai untuk assignment bukan ==" },
  { cat:"💻 Coding", q:"Apa output dari: print(10 % 3)?", opts:["3","1","0","2"], correct:1,
    hint:"% adalah sisa bagi. 10 dibagi 3 = 3 sisa 1, jadi hasilnya 1" },
  { cat:"💻 Coding", q:"Berapa panjang string 'Logify'?", opts:["5","6","7","4"], correct:1,
    hint:"L-o-g-i-f-y = 6 huruf" },
  { cat:"💻 Coding", q:"Apa output dari kode ini?\nx = 5\nif x > 3:\n    print('Besar')\nelse:\n    print('Kecil')", opts:["Kecil","Besar","Error","x"], correct:1,
    hint:"x=5, dan 5 > 3 adalah True, maka blok if yang dijalankan" },
  { cat:"💻 Coding", q:"Manakah tipe data yang BENAR untuk angka desimal?", opts:["int","string","float","bool"], correct:2,
    hint:"float digunakan untuk angka desimal seperti 3.14, sedangkan int untuk bilangan bulat" },
  { cat:"💻 Coding", q:"Apa output dari:\nfor i in range(3):\n    print(i)", opts:["1 2 3","0 1 2","0 1 2 3","1 2"], correct:1,
    hint:"range(3) menghasilkan 0, 1, 2 — dimulai dari 0 dan tidak termasuk 3" },
  { cat:"💻 Coding", q:"Manakah cara yang benar untuk membuat komentar di Python?", opts:["// komentar","/* komentar */","# komentar","<!-- komentar -->"], correct:2,
    hint:"Python menggunakan tanda # untuk komentar satu baris" },
  { cat:"💻 Coding", q:"Apa hasil dari: len([1, 2, 3, 4, 5])?", opts:["4","5","6","3"], correct:1,
    hint:"len() menghitung jumlah elemen dalam list. Ada 5 elemen: 1,2,3,4,5" },
  { cat:"💻 Coding", q:"Apa output dari:\nx = 10\ny = 3\nprint(x // y)", opts:["3","3.33","4","1"], correct:0,
    hint:"// adalah pembagian bulat (floor division). 10 // 3 = 3 (dibulatkan ke bawah)" },
  { cat:"💻 Coding", q:"Manakah yang merupakan boolean?", opts:['"True"',"1.0","True","'1'"], correct:2,
    hint:"Boolean adalah True atau False (tanpa tanda kutip). 'True' dengan kutip adalah string!" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const TIMER = 15;

export default function ChallengeGame({ score, onScore, onFinish }) {
  const [questions] = useState(() => shuffle(QUESTIONS).slice(0, 12));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [streak, setStreak] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const timerRef = useRef(null);

  const lv = questions[idx];

  useEffect(() => {
    if (showResult) return;
    setTimeLeft(TIMER);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowResult(true);
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx]);

  function handleSelect(i) {
    if (showResult) return;
    clearInterval(timerRef.current);
    setSelected(i);
    setShowResult(true);

    if (i === lv.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const timePts = Math.floor((timeLeft / TIMER) * 10);
      const streakPts = Math.min(newStreak * 2, 10);
      const pts = 10 + timePts + streakPts;
      onScore(pts);
      setLocalScore(prev => prev + pts);
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    if (idx + 1 >= questions.length) {
      onFinish(localScore);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  const isCorrect = selected === lv.correct;
  const timedOut = showResult && selected === null;
  const timerPct = (timeLeft / TIMER) * 100;
  const timerColor = timeLeft > 8 ? "#10B981" : timeLeft > 4 ? "#FF9F43" : "#EF4444";
  const isCoding = lv.cat === "💻 Coding";

  return (
    <div className="anim-slide">

      {/* Progress */}
      <div style={{ height:5, background:"#E2E8F0", borderRadius:10, marginBottom:16, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:10, transition:"width 0.4s",
          width:`${(idx/questions.length)*100}%`,
          background:"linear-gradient(90deg,#EF4444,#FF9F43)",
        }}/>
      </div>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{
            background: isCoding ? "#EFF6FF" : "#FEF2F2",
            color: isCoding ? "#3B82F6" : "#EF4444",
            borderRadius:100, padding:"4px 12px",
            fontSize:12, fontWeight:900,
          }}>{lv.cat}</span>
          {streak >= 2 && (
            <span style={{
              background:"linear-gradient(135deg,#FF9F43,#EF4444)",
              color:"white", borderRadius:100, padding:"4px 12px",
              fontSize:12, fontWeight:900,
            }}>🔥 {streak}x Streak!</span>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>{idx+1}/{questions.length}</span>
          <div style={{
            fontSize:13, fontWeight:900, color:"#1E2240",
            background:"white", border:"2px solid #E2E8F0",
            borderRadius:100, padding:"4px 14px",
          }}>⭐ {localScore}</div>
        </div>
      </div>

      {/* Timer */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.06em" }}>⏱️ Waktu</span>
          <span style={{ fontSize:16, fontWeight:900, color:timerColor,
            animation: timeLeft <= 4 && !showResult ? "bump 0.5s ease infinite" : "none",
          }}>{timeLeft}s</span>
        </div>
        <div style={{ height:10, background:"#F0F4FF", borderRadius:99, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:99, background:timerColor,
            width:`${timerPct}%`, transition:"width 1s linear, background 0.3s",
            boxShadow:`0 0 8px ${timerColor}80`,
          }}/>
        </div>
      </div>

      {/* Question */}
      <div style={{
        background:"white", border:"2px solid #E2E8F0",
        borderRadius:16, padding:"16px 18px", marginBottom:14,
        boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
      }}>
        {/* Kalau soal coding, tampilkan kode dengan style berbeda */}
        {lv.q.includes("\n") ? (
          <>
            <div style={{ fontSize:15, fontWeight:800, color:"#1E2240", marginBottom:10, lineHeight:1.5 }}>
              {lv.q.split("\n")[0]}
            </div>
            <div style={{
              background:"#1E2240", borderRadius:10, padding:"12px 14px",
              fontFamily:"'JetBrains Mono',monospace", fontSize:13,
              color:"#CDD6F4", lineHeight:1.8, whiteSpace:"pre",
            }}>
              {lv.q.split("\n").slice(1).join("\n")}
            </div>
          </>
        ) : (
          <div style={{ fontSize:15, fontWeight:800, color:"#1E2240", lineHeight:1.5 }}>{lv.q}</div>
        )}
      </div>

      {/* Options */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        {lv.opts.map((opt, i) => {
          let bg = "white", border = "2px solid #E2E8F0", color = "#1E2240";
          if (showResult) {
            if (i === lv.correct) { bg="#ECFDF5"; border="2px solid #10B981"; color="#065F46"; }
            else if (i === selected && i !== lv.correct) { bg="#FEF2F2"; border="2px solid #EF4444"; color="#991B1B"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={showResult} style={{
              background:bg, border, borderRadius:14, padding:"13px 12px",
              fontFamily: isCoding ? "'JetBrains Mono',monospace" : "'Nunito',sans-serif",
              fontSize:13, fontWeight:800, color, textAlign:"center",
              cursor: showResult ? "default" : "pointer", transition:"all 0.15s",
              boxShadow: showResult ? "none" : "0 2px 6px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e=>{ if(!showResult) e.currentTarget.style.borderColor="#EF4444"; }}
            onMouseLeave={e=>{ if(!showResult) e.currentTarget.style.borderColor="#E2E8F0"; }}
            >{opt}</button>
          );
        })}
      </div>

      {/* Result */}
      {showResult && (
        <div className={`answer-box ${!timedOut && isCorrect ? "answer-ok" : "answer-err"}`}
          style={{ animation:"popIn 0.3s ease" }}>
          <div className="ab-icon">{timedOut ? "⏰" : isCorrect ? "🎉" : "💡"}</div>
          <div className="ab-title">
            {timedOut
              ? `Waktu habis! Jawaban: ${lv.opts[lv.correct]}`
              : isCorrect
                ? `Benar! +${10 + Math.floor((timeLeft/TIMER)*10) + Math.min(streak*2,10)} poin${streak>=2?" 🔥":""}`
                : `Salah! Jawaban: ${lv.opts[lv.correct]}`}
          </div>
          {lv.hint && (
            <div className="ab-explain">{lv.hint}</div>
          )}
          <button className="btn-next"
            style={{ background: !timedOut && isCorrect ? "#10B981" : "#EF4444" }}
            onClick={handleNext}>
            {idx+1 >= questions.length ? "Lihat Hasil 🏁" : "Soal Berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}