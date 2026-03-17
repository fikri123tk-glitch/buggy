import { META } from "../constants";

const GAME_IDS = ["sequence","robot","pattern","typing"];
const COLORS = {
  sequence: { cls:"gcard-orange", accent:"#FF9F43", shadow:"#E07020" },
  robot:    { cls:"gcard-blue",   accent:"#3B82F6", shadow:"#1D4ED8" },
  pattern:  { cls:"gcard-purple", accent:"#8B5CF6", shadow:"#6D28D9" },
  typing:   { cls:"gcard-green",  accent:"#10B981", shadow:"#047857" },
};
const DESCS = {
  sequence: "Drag & drop langkah-langkah ke urutan yang benar",
  robot:    "Beri perintah arah untuk gerakkan robot ke tujuan",
  pattern:  "Temukan pola dan hitung hasil loop",
  typing:   "Lihat contoh, lalu ketik kode sesuai instruksi",
};
const TOTALS = { sequence:10, robot:8, pattern:10, typing:8 };

export default function HomeScreen({ avatar, scores, completed, totalScore, doneCount, onStart }) {
  const allDone = doneCount === 4;

  return (
    <div className="screen">
      <div style={{ maxWidth:640, margin:"0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", padding:"32px 0 28px" }}>
          <div style={{
            fontSize:88, lineHeight:1, marginBottom:12,
            filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.15))",
            animation:"float 3s ease-in-out infinite",
          }}>{avatar}</div>
          <h1 style={{ fontSize:32, fontWeight:900, color:"#1E2240", margin:"0 0 6px",
             fontFamily: "'Grow Year', cursive"
           }}>
            Logify <span></span>
          </h1>
          <p style={{ fontSize:14, fontWeight:700, color:"#6B7280", margin:"0 0 20px" }}>
            Belajar logika coding Bersama Logify!
          </p>

          {/* Stats */}
          <div style={{ display:"flex", justifyContent:"center", gap:0, background:"white",
            borderRadius:16, overflow:"hidden", border:"2px solid #E2E8F0",
            maxWidth:260, margin:"0 auto 8px" }}>
            <div style={{ flex:1, padding:"14px 0", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#1E2240" }}>{totalScore}</div>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em" }}>Total Poin</div>
            </div>
            <div style={{ width:2, background:"#F0F4FF" }}/>
            <div style={{ flex:1, padding:"14px 0", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#1E2240" }}>{doneCount}/4</div>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em" }}>Selesai</div>
            </div>
          </div>

          {allDone && (
            <div style={{
              background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)",
              border:"2px solid #FCD34D", borderRadius:12,
              padding:"10px 20px", fontSize:14, fontWeight:900, color:"#92400E",
              maxWidth:320, margin:"8px auto 0",
            }}>
              🌟 Kamu sudah selesaikan semua game!
            </div>
          )}
        </div>

        {/* Game cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {GAME_IDS.map(id => {
            const c = COLORS[id];
            const m = META[id];
            const done = completed[id];
            return (
              <div key={id}
                onClick={() => onStart(id)}
                style={{
                  background:"white", borderRadius:16, padding:"16px 18px",
                  border:`2.5px solid ${done ? c.accent+"60" : "#E2E8F0"}`,
                  display:"flex", alignItems:"center", gap:14,
                  cursor:"pointer", position:"relative", overflow:"hidden",
                  transition:"all 0.2s", boxShadow: done ? `0 4px 20px ${c.accent}25` : "none",
                }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform=""}
              >
                {/* Color strip */}
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:c.accent, borderRadius:"16px 0 0 16px" }}/>

                {/* Number */}
                <div style={{ marginLeft:8, fontSize:11, fontWeight:900, color:c.accent, minWidth:26,
                  opacity:0.7, fontFamily:"'JetBrains Mono',monospace" }}>
                  {String(GAME_IDS.indexOf(id)+1).padStart(2,"0")}
                </div>

                {/* Icon */}
                <div style={{ fontSize:28, lineHeight:1 }}>{m.icon}</div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:1000, color:"#1E2240", marginBottom:2, fontFamily: "'Grow Year', cursive" }}>{m.title}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>{DESCS[id]}</div>
                  {done && (
                    <div style={{ fontSize:11, fontWeight:800, color:c.accent, marginTop:3 }}>
                      ✓ Selesai · {scores[id]} poin
                    </div>
                  )}
                  {!done && (
                    <div style={{ fontSize:11, fontWeight:700, color:"#C4C9D8", marginTop:3 }}>
                      {TOTALS[id]} soal
                    </div>
                  )}
                </div>

                {/* Button */}
                <button style={{
                  background: done ? "white" : c.accent,
                  color: done ? c.accent : "white",
                  border: done ? `2px solid ${c.accent}` : "none",
                  borderRadius:10, padding:"9px 18px",
                  fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:900,
                  cursor:"pointer", flexShrink:0,
                  boxShadow: done ? "none" : `0 3px 0 ${c.shadow}`,
                }}>
                  {done ? "Ulangi" : "Mulai"}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}