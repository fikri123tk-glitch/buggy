import { useState } from "react";
import { META } from "../constants";

const GAME_IDS = ["sequence","robot","pattern","typing"];
const COLORS = {
  sequence: { accent:"#FF9F43", shadow:"#E07020" },
  robot:    { accent:"#3B82F6", shadow:"#1D4ED8" },
  pattern:  { accent:"#8B5CF6", shadow:"#6D28D9" },
  typing:   { accent:"#10B981", shadow:"#047857" },
};
const DESCS = {
  sequence: "Drag & drop langkah-langkah ke urutan yang benar",
  robot:    "Beri perintah arah untuk gerakkan robot ke tujuan",
  pattern:  "Temukan pola dan hitung hasil loop",
  typing:   "Lihat contoh, lalu ketik kode sesuai instruksi",
};
const TOTALS = { sequence:10, robot:8, pattern:10, typing:8 };

export default function HomeScreen({ avatar, username, user, scores, completed, totalScore, doneCount, onStart, onLogout, onLeaderboard }) {
  const [showProfile, setShowProfile] = useState(false);
  const allDone = doneCount === 4;
  const progressPercent = Math.round((doneCount / 4) * 100);

  return (
    <div className="screen">
      <div style={{ maxWidth:640, margin:"0 auto" }}>

        {/* Top navbar */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 4px 8px", position:"relative",
        }}>
          {/* Kiri — Leaderboard */}
          <button onClick={onLeaderboard} style={{
            background:"white", border:"2.5px solid #E2E8F0",
            borderRadius:14, padding:"10px 18px",
            fontFamily:"'Nunito',sans-serif", fontSize:14,
            fontWeight:900, color:"#1E2240", cursor:"pointer",
            display:"flex", alignItems:"center", gap:6,
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.15s",
          }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="#FF9F43"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="#E2E8F0"}
          >🏆 Leaderboard</button>

          {/* Kanan — Profil */}
          <button onClick={() => setShowProfile(v => !v)} style={{
            background:"white",
            border:`2.5px solid ${showProfile ? "#3B82F6" : "#E2E8F0"}`,
            borderRadius:14, padding:"8px 14px",
            cursor:"pointer", display:"flex", alignItems:"center", gap:10,
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.15s",
            fontFamily:"'Nunito',sans-serif",
          }}>
            <div style={{ fontSize:30, lineHeight:1 }}>{avatar}</div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:900, color:"#1E2240" }}>{username}</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#9CA3AF" }}>Lihat profil</div>
            </div>
            <div style={{ fontSize:12, color:"#9CA3AF" }}>{showProfile ? "▲" : "▼"}</div>
          </button>

          {/* Profile popup */}
          {showProfile && (
            <>
              <div onClick={() => setShowProfile(false)}
                style={{ position:"fixed", inset:0, zIndex:99 }}/>
              <div style={{
                position:"absolute", top:"calc(100% + 8px)", right:4,
                background:"white", borderRadius:20,
                border:"2px solid #E2E8F0",
                boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
                padding:"20px", width:280, zIndex:100,
                animation:"popIn 0.2s ease",
              }}>
                {/* Header */}
                <div style={{ textAlign:"center", marginBottom:16 }}>
                  <div style={{ fontSize:52, marginBottom:6 }}>{avatar}</div>
                  <div style={{ fontSize:18, fontWeight:900, color:"#1E2240" }}>{username}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>Pemain Logify</div>
                </div>

                {/* Stats grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                  {[
                    { label:"Total Poin",    value:totalScore,        color:"#FF9F43" },
                    { label:"Game Selesai",  value:`${doneCount}/4`,  color:"#3B82F6" },
                    { label:"Progress",      value:`${progressPercent}%`, color:"#8B5CF6" },
                    { label:"Rank",          value:"-",               color:"#10B981" },
                  ].map((s,i) => (
                    <div key={i} style={{
                      background:"#F8FAFC", borderRadius:12,
                      padding:"10px 12px", textAlign:"center",
                      border:`1.5px solid ${s.color}30`,
                    }}>
                      <div style={{ fontSize:18, fontWeight:900, color:s.color }}>{s.value}</div>
                      <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase" }}>Progress</span>
                    <span style={{ fontSize:11, fontWeight:900, color:"#1E2240" }}>{progressPercent}%</span>
                  </div>
                  <div style={{ height:8, background:"#F0F4FF", borderRadius:99, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:99,
                      background:"linear-gradient(90deg,#FF9F43,#3B82F6,#8B5CF6)",
                      width:`${progressPercent}%`, transition:"width 0.5s ease",
                    }}/>
                  </div>
                </div>

                {/* Logout */}
                <button onClick={onLogout} style={{
                  width:"100%", padding:"11px",
                  background:"white", border:"2px solid #EF4444",
                  borderRadius:12, color:"#EF4444",
                  fontSize:13, fontWeight:900, cursor:"pointer",
                  fontFamily:"'Nunito',sans-serif",
                }}>🚪 Keluar</button>
              </div>
            </>
          )}
        </div>

        {/* Hero */}
        <div style={{ textAlign:"center", padding:"20px 0 24px" }}>
          <div style={{
            fontSize:88, lineHeight:1, marginBottom:12,
            filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.15))",
            animation:"float 3s ease-in-out infinite",
          }}>{avatar}</div>
          <h1 style={{ fontSize:32, fontWeight:900, color:"#1E2240", margin:"0 0 6px", fontFamily:"'Grow Year', cursive" }}>
            Logify
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
            }}>🌟 Kamu sudah selesaikan semua game!</div>
          )}
        </div>

        {/* Game cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {GAME_IDS.map(id => {
            const c = COLORS[id];
            const m = META[id];
            const done = completed[id];
            return (
              <div key={id} onClick={() => onStart(id)} style={{
                background:"white", borderRadius:16, padding:"16px 18px",
                border:`2.5px solid ${done ? c.accent+"60" : "#E2E8F0"}`,
                display:"flex", alignItems:"center", gap:14,
                cursor:"pointer", position:"relative", overflow:"hidden",
                transition:"all 0.2s", boxShadow: done ? `0 4px 20px ${c.accent}25` : "none",
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}
              >
                <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:c.accent, borderRadius:"16px 0 0 16px" }}/>
                <div style={{ marginLeft:8, fontSize:11, fontWeight:900, color:c.accent, minWidth:26, opacity:0.7, fontFamily:"'JetBrains Mono',monospace" }}>
                  {String(GAME_IDS.indexOf(id)+1).padStart(2,"0")}
                </div>
                <div style={{ fontSize:28, lineHeight:1 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:900, color:"#1E2240", marginBottom:2, fontFamily:"'Grow Year', cursive" }}>{m.title}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>{DESCS[id]}</div>
                  {done
                    ? <div style={{ fontSize:11, fontWeight:800, color:c.accent, marginTop:3 }}>✓ Selesai · {scores[id]} poin</div>
                    : <div style={{ fontSize:11, fontWeight:700, color:"#C4C9D8", marginTop:3 }}>{TOTALS[id]} soal</div>
                  }
                </div>
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