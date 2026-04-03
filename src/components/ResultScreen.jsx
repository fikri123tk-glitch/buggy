import { META } from "../constants";

const GAME_IDS = ["sequence","robot","pattern","typing","challenge"];

export default function ResultScreen({ result, scores, completed, doneCount, onPlayAgain, onHome }) {
  const { id, score } = result;
  const m = META[id];
  const allDone = doneCount === GAME_IDS.length; // 🔹 Fix: 4 → 5 games
  const totalScore = Object.values(scores).reduce((a,b)=>a+b, 0);

  const emoji = score >= 70 ? "🌟" : score >= 40 ? "😊" : "💪";
  const msg   = score >= 70 ? "Luar Biasa!" : score >= 40 ? "Bagus!" : "Terus Semangat!";

  return (
    <div className="screen" style={{
      display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh",
    }}>
      <div className="anim-pop" style={{
        background:"white", borderRadius:24, padding:"36px 32px",
        textAlign:"center", maxWidth:380, width:"100%",
        boxShadow:`0 12px 40px ${m.color}25`,
        border:`2.5px solid ${m.color}40`,
      }}>
        <div style={{ fontSize:60, marginBottom:12 }}>{emoji}</div>
        <h2 style={{ fontSize:26, fontWeight:900, color:"#1E2240", margin:"0 0 4px" }}>{msg}</h2>
        <p style={{ fontSize:14, fontWeight:700, color:"#9CA3AF", margin:"0 0 24px" }}>
          {m.icon} {m.title}
        </p>

        {/* Score */}
        <div style={{
          background:`${m.color}12`, border:`2px solid ${m.color}40`,
          borderRadius:16, padding:"20px 0", marginBottom:20,
        }}>
          <div style={{ fontSize:48, fontWeight:900, color:m.color, lineHeight:1 }}>{score}</div>
          <div style={{ fontSize:12, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:4 }}>Poin</div>
        </div>

        {/* Total */}
        <div style={{ fontSize:13, fontWeight:700, color:"#9CA3AF", marginBottom:24 }}>
          Total semua game: <strong style={{ color:"#1E2240" }}>{totalScore} poin</strong> · {doneCount}/{GAME_IDS.length} selesai
        </div>

        {allDone && (
          <div style={{
            background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)",
            border:"2px solid #FCD34D", borderRadius:12,
            padding:"10px 20px", fontSize:13, fontWeight:900, color:"#92400E",
            marginBottom:20,
          }}>
            Semua game selesai! Kamu hebat!
          </div>
        )}

        {/* Buttons */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onPlayAgain} style={{
            flex:1, background:m.color, color:"white", border:"none",
            borderRadius:12, padding:"13px 0",
            fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:900,
            cursor:"pointer", boxShadow:`0 4px 0 ${m.color}AA`,
          }}>
            Main Lagi
          </button>
          <button onClick={onHome} style={{
            flex:1, background:"#F0F4FF", color:"#1E2240", border:"2px solid #E2E8F0",
            borderRadius:12, padding:"13px 0",
            fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:900,
            cursor:"pointer",
          }}>
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}