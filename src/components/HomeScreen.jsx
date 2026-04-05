import { useState, useEffect } from "react"; // 🔹 Tambah useEffect
import { META } from "../constants";

const GAME_IDS = ["sequence","robot","pattern","typing","challenge"];
const COLORS = {
  sequence:  { accent:"#FF9F43", shadow:"#E07020" },
  robot:     { accent:"#3B82F6", shadow:"#1D4ED8" },
  pattern:   { accent:"#8B5CF6", shadow:"#6D28D9" },
  typing:    { accent:"#10B981", shadow:"#047857" },
  challenge: { accent:"#EF4444", shadow:"#B91C1C" },
};
const DESCS = {
  sequence:  "Drag & drop langkah-langkah ke urutan yang benar",
  robot:     "Beri perintah arah untuk gerakkan robot ke tujuan",
  pattern:   "Temukan pola dan hitung hasil loop",
  typing:    "Lihat contoh, lalu ketik kode sesuai instruksi",
  challenge: "Soal logika dengan timer — siapa cepat dia dapat!",
};
const TOTALS = { sequence:10, robot:16, pattern:10, typing:8, challenge:12 };

export default function HomeScreen({ avatar, username, user, scores, completed, totalScore, doneCount, onStart, onLogout, onLeaderboard }) {
  const [showProfile, setShowProfile] = useState(false);
  
  // 🔹 State untuk scroll hide/show tabs
  const [showTabs, setShowTabs] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 🔹 Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide saat scroll ke bawah, show saat scroll ke atas
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowTabs(false);
      } else {
        setShowTabs(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const allDone = doneCount === GAME_IDS.length;
  const progressPercent = Math.round((doneCount / GAME_IDS.length) * 100);

  return (
    <div className="screen" style={{ paddingTop:0 }}>

      {/* ── Fixed pojok kiri — Leaderboard ── */}
      <button 
        onClick={onLeaderboard} 
        style={{
          position:"fixed", 
          top: showTabs ? 20 : -100,  // 🔹 Hide saat scroll ke bawah
          left:24, 
          zIndex:50,
          background:"white", 
          border:"2.5px solid #E2E8F0",
          borderRadius:14, 
          padding:"10px 18px",
          fontFamily:"'Nunito', sans-serif", 
          fontSize:14,
          fontWeight:900, 
          color:"#1E2240", 
          cursor:"pointer",
          display:"flex", 
          alignItems:"center", 
          gap:6,
          boxShadow:"0 4px 16px rgba(0,0,0,0.08)", 
          transition:"top 0.3s ease",  // 🔹 Animasi smooth
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="#FF9F43"; e.currentTarget.style.boxShadow="0 4px 20px rgba(255,159,67,0.25)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)";}}
      >
        🏆 Leaderboard
      </button>

      {/* ── Fixed pojok kanan — Profil ── */}
      <div 
        style={{ 
          position:"fixed", 
          top: showTabs ? 20 : -100,  // 🔹 Hide saat scroll ke bawah
          right:24, 
          zIndex:50,
          transition:"top 0.3s ease",  // 🔹 Animasi smooth
        }}
      >
        <button onClick={() => setShowProfile(v => !v)} style={{
          background:"white",
          border:`2.5px solid ${showProfile ? "#3B82F6" : "#E2E8F0"}`,
          borderRadius:14, 
          padding:"8px 14px",
          cursor:"pointer", 
          display:"flex", 
          alignItems:"center", 
          gap:10,
          boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
          transition:"all 0.15s", 
          fontFamily:"'Nunito', sans-serif",
        }}>
          {/* 🔹 Avatar user (emoji) - ini avatar user, bukan logo app */}
          <div style={{ fontSize:26, lineHeight:1 }}>{avatar}</div>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:14, fontWeight:900, color:"#1E2240", fontFamily:"'Nunito', sans-serif" }}>{username}</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", fontFamily:"'Nunito', sans-serif" }}>Lihat profil</div>
          </div>
          <div style={{ fontSize:12, color:"#9CA3AF" }}>{showProfile ? "▲" : "▼"}</div>
        </button>

        {/* Profile popup */}
        {showProfile && (
          <>
            <div onClick={() => setShowProfile(false)}
              style={{ position:"fixed", inset:0, zIndex:49 }}/>
            <div style={{
              position:"absolute", 
              top:"calc(100% + 10px)", 
              right:0,
              background:"white", 
              borderRadius:20,
              border:"2px solid #E2E8F0",
              boxShadow:"0 8px 40px rgba(0,0,0,0.12)",
              padding:"20px", 
              width:290, 
              zIndex:51,
              animation:"popIn 0.2s ease",
            }}>
              <div style={{ textAlign:"center", marginBottom:16 }}>
                {/* 🔹 Avatar user di popup (emoji) */}
                <div style={{ fontSize:48, marginBottom:6 }}>{avatar}</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#1E2240", fontFamily:"'Nunito', sans-serif" }}>{username}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF", fontFamily:"'Nunito', sans-serif" }}>Pemain Logify</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {[
                  { label:"Total Poin", value:totalScore,                        color:"#FF9F43" },
                  { label:"Selesai",    value:`${doneCount}/${GAME_IDS.length}`, color:"#3B82F6" },
                  { label:"Progress",   value:`${progressPercent}%`,             color:"#8B5CF6" },
                  { label:"Rank",       value:user?.rank ?? "-",                 color:"#10B981" },
                ].map((s,i) => (
                  <div key={i} style={{
                    background:"#F8FAFC", 
                    borderRadius:12,
                    padding:"10px 12px", 
                    textAlign:"center",
                    border:`1.5px solid ${s.color}30`,
                  }}>
                    <div style={{ fontSize:18, fontWeight:900, color:s.color, fontFamily:"'Nunito', sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:"'Nunito', sans-serif" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", fontFamily:"'Nunito', sans-serif" }}>Progress</span>
                  <span style={{ fontSize:11, fontWeight:900, color:"#1E2240", fontFamily:"'Nunito', sans-serif" }}>{progressPercent}%</span>
                </div>
                <div style={{ height:8, background:"#F0F4FF", borderRadius:99, overflow:"hidden" }}>
                  <div style={{
                    height:"100%", 
                    borderRadius:99,
                    background:"linear-gradient(90deg,#FF9F43,#3B82F6,#8B5CF6)",
                    width:`${progressPercent}%`, 
                    transition:"width 0.5s ease",
                  }}/>
                </div>
              </div>
              <button 
                onClick={onLogout} 
                style={{
                  width:"100%", 
                  padding:"11px",
                  background:"white", 
                  border:"2px solid #EF4444",
                  borderRadius:12, 
                  color:"#EF4444",
                  fontSize:13, 
                  fontWeight:900, 
                  cursor:"pointer",
                  fontFamily:"'Nunito', sans-serif", 
                  transition:"all 0.15s",
                }}
                onMouseEnter={e=>e.currentTarget.style.background="#FEF2F2"}
                onMouseLeave={e=>e.currentTarget.style.background="white"}
              >
                🚪 Keluar
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 16px 40px" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", paddingBottom:24 }}>

          {/* Logo App */}
          <img
            src="/logo.png"
            alt="Logify"
            style={{
              width:260, 
              height:260,
              objectFit:"contain",
              marginBottom:1,
              filter:"drop-shadow(0 4px 20px rgba(0,0,0,0.12))",
              animation:"float 3s ease-in-out infinite",
            }}
            onError={e => {
              e.target.style.display="none";
              document.getElementById("logo-fallback").style.display="block";
            }}
          />
          {/* Fallback jika logo gagal load */}
          <div 
            id="logo-fallback" 
            style={{
              fontSize:80, 
              lineHeight:1, 
              marginBottom:4,
              display:"none",
              filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.15))",
              animation:"float 3s ease-in-out infinite",
            }}
          >
            🪲
          </div>

          {/* Tagline */}
          <p style={{
            fontSize:14, 
            fontWeight:700, 
            color:"#9CA3AF",
            margin:"0 0 20px", 
            letterSpacing:"0.01em",
            fontFamily:"'Nunito', sans-serif",
          }}>
            Belajar logika coding Bersama Logify!
          </p>

          {/* Stats card */}
          <div style={{
            display:"inline-flex", 
            gap:0, 
            background:"white",
            borderRadius:16, 
            overflow:"hidden", 
            border:"2px solid #E2E8F0",
            boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
            marginBottom:8,
          }}>
            <div style={{ padding:"14px 28px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#1E2240", fontFamily:"'Nunito', sans-serif" }}>{totalScore}</div>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:"'Nunito', sans-serif" }}>Total Poin</div>
            </div>
            <div style={{ width:2, background:"#F0F4FF" }}/>
            <div style={{ padding:"14px 28px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#1E2240", fontFamily:"'Nunito', sans-serif" }}>{doneCount}/{GAME_IDS.length}</div>
              <div style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:"'Nunito', sans-serif" }}>Selesai</div>
            </div>
          </div>

          {allDone && (
            <div style={{
              background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)",
              border:"2px solid #FCD34D", 
              borderRadius:12,
              padding:"10px 20px", 
              fontSize:14, 
              fontWeight:900, 
              color:"#92400E",
              maxWidth:320, 
              margin:"8px auto 0",
              fontFamily:"'Nunito', sans-serif",
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
              <div 
                key={id} 
                onClick={() => onStart(id)} 
                style={{
                  background:"white", 
                  borderRadius:16, 
                  padding:"16px 18px",
                  border:`2.5px solid ${done ? c.accent+"60" : "#E2E8F0"}`,
                  display:"flex", 
                  alignItems:"center", 
                  gap:14,
                  cursor:"pointer", 
                  position:"relative", 
                  overflow:"hidden",
                  transition:"all 0.2s",
                  boxShadow: done ? `0 4px 20px ${c.accent}25` : "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}
              >
                <div 
                  style={{ 
                    position:"absolute", 
                    left:0, 
                    top:0, 
                    bottom:0, 
                    width:5, 
                    background:c.accent, 
                    borderRadius:"16px 0 0 16px" 
                  }}
                />
                <div 
                  style={{ 
                    marginLeft:8, 
                    fontSize:11, 
                    fontWeight:900, 
                    color:c.accent, 
                    minWidth:26, 
                    opacity:0.7, 
                    fontFamily:"'JetBrains Mono', monospace" 
                  }}
                >
                  {String(GAME_IDS.indexOf(id)+1).padStart(2,"0")}
                </div>
                <div style={{ fontSize:28, lineHeight:1 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <div 
                    style={{ 
                      fontSize:15, 
                      fontWeight:900, 
                      color:"#1E2240", 
                      marginBottom:2, 
                      fontFamily:"'Grow Year', sans-serif" 
                    }}
                  >
                    {m.title}
                  </div>
                  <div 
                    style={{ 
                      fontSize:12, 
                      fontWeight:700, 
                      color:"#9CA3AF", 
                      fontFamily:"'Nunito', sans-serif" 
                    }}
                  >
                    {DESCS[id]}
                  </div>
                  {done
                    ? <div 
                        style={{ 
                          fontSize:11, 
                          fontWeight:800, 
                          color:c.accent, 
                          marginTop:3, 
                          fontFamily:"'Nunito', sans-serif" 
                        }}
                      >
                        ✓ Selesai · {scores[id]} poin
                      </div>
                    : <div 
                        style={{ 
                          fontSize:11, 
                          fontWeight:700, 
                          color:"#C4C9D8", 
                          marginTop:3, 
                          fontFamily:"'Nunito', sans-serif" 
                        }}
                      >
                        {TOTALS[id]} soal
                      </div>
                  }
                </div>
                <button 
                  style={{
                    background: done ? "white" : c.accent,
                    color: done ? c.accent : "white",
                    border: done ? `2px solid ${c.accent}` : "none",
                    borderRadius:10, 
                    padding:"9px 18px",
                    fontFamily:"'Nunito', sans-serif", 
                    fontSize:13, 
                    fontWeight:900,
                    cursor:"pointer", 
                    flexShrink:0,
                    boxShadow: done ? "none" : `0 3px 0 ${c.shadow}`,
                  }}
                >
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