import { useState, useEffect } from "react";

const API = "http://localhost:3001";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen({ user, onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/leaderboard`)
      .then(r => r.json())
      .then(res => {
        if (res.success) setData(res.data);
        else setError("Gagal memuat leaderboard!");
      })
      .catch(() => setError("Tidak bisa konek ke server!"))
      .finally(() => setLoading(false));
  }, []);

  // Cari rank user yang sedang login
  const myRank = data.findIndex(d => d.username === user.username) + 1;

  return (
    <div className="screen" style={{ padding:"20px 16px 60px" }}>
      <div style={{ maxWidth:480, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <button onClick={onBack} style={{
            background:"white", border:"2px solid #E2E8F0",
            borderRadius:12, padding:"8px 14px",
            fontFamily:"'Nunito',sans-serif", fontSize:13,
            fontWeight:800, color:"#6B7280", cursor:"pointer",
          }}>← Kembali</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#1E2240" }}>🏆 Leaderboard</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>Top pemain Logify</div>
          </div>
        </div>

        {/* Profil card user */}
        <div style={{
          background:"linear-gradient(135deg, #3B82F6, #8B5CF6)",
          borderRadius:20, padding:"20px 20px",
          marginBottom:24, color:"white",
          boxShadow:"0 8px 24px rgba(59,130,246,0.3)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:52, lineHeight:1 }}>{user.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:800, opacity:0.8, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>
                Profil Kamu
              </div>
              <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>{user.username}</div>
              <div style={{ display:"flex", gap:16 }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:900 }}>{user.total_score || 0}</div>
                  <div style={{ fontSize:10, fontWeight:800, opacity:0.75 }}>TOTAL POIN</div>
                </div>
                <div style={{ width:1, background:"rgba(255,255,255,0.3)" }}/>
                <div>
                  <div style={{ fontSize:18, fontWeight:900 }}>{user.progress_percent || 0}%</div>
                  <div style={{ fontSize:10, fontWeight:800, opacity:0.75 }}>PROGRESS</div>
                </div>
                <div style={{ width:1, background:"rgba(255,255,255,0.3)" }}/>
                <div>
                  <div style={{ fontSize:18, fontWeight:900 }}>#{myRank || "-"}</div>
                  <div style={{ fontSize:10, fontWeight:800, opacity:0.75 }}>RANK</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop:14 }}>
            <div style={{ height:6, background:"rgba(255,255,255,0.2)", borderRadius:99, overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:99,
                background:"rgba(255,255,255,0.9)",
                width:`${user.progress_percent || 0}%`,
                transition:"width 0.5s ease",
              }}/>
            </div>
          </div>
        </div>

        {/* Leaderboard list */}
        <div style={{
          background:"white", borderRadius:20,
          border:"2px solid #E2E8F0", overflow:"hidden",
          boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            padding:"14px 18px",
            borderBottom:"2px solid #F0F4FF",
            display:"flex", justifyContent:"space-between",
            alignItems:"center",
          }}>
            <span style={{ fontSize:14, fontWeight:900, color:"#1E2240" }}>🏅 Ranking</span>
            <span style={{ fontSize:11, fontWeight:800, color:"#9CA3AF" }}>
              {data.length} pemain
            </span>
          </div>

          {loading && (
            <div style={{ padding:"32px", textAlign:"center", color:"#9CA3AF", fontWeight:800 }}>
               Memuat...
            </div>
          )}

          {error && (
            <div style={{ padding:"24px", textAlign:"center", color:"#EF4444", fontWeight:800, fontSize:13 }}>
              ❌ {error}
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div style={{ padding:"32px", textAlign:"center", color:"#9CA3AF", fontWeight:800 }}>
              Belum ada pemain. Jadilah yang pertama! 
            </div>
          )}

          {!loading && data.map((item, idx) => {
            const isMe = item.username === user.username;
            return (
              <div key={idx} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"14px 18px",
                borderBottom: idx < data.length - 1 ? "1px solid #F0F4FF" : "none",
                background: isMe ? "#EFF6FF" : "white",
                transition:"background 0.2s",
              }}>
                {/* Rank */}
                <div style={{
                  width:32, textAlign:"center",
                  fontSize: idx < 3 ? 22 : 14,
                  fontWeight:900,
                  color: idx < 3 ? "inherit" : "#9CA3AF",
                }}>
                  {idx < 3 ? MEDAL[idx] : `#${idx + 1}`}
                </div>

                {/* Avatar */}
                <div style={{ fontSize:28, lineHeight:1 }}>{item.avatar}</div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{
                    fontSize:14, fontWeight:900,
                    color: isMe ? "#3B82F6" : "#1E2240",
                    display:"flex", alignItems:"center", gap:6,
                  }}>
                    {item.username}
                    {isMe && (
                      <span style={{
                        fontSize:10, fontWeight:900,
                        background:"#3B82F6", color:"white",
                        borderRadius:99, padding:"1px 8px",
                      }}>KAMU</span>
                    )}
                  </div>
                  {/* Progress bar mini */}
                  <div style={{ height:4, background:"#F0F4FF", borderRadius:99, marginTop:4, overflow:"hidden", maxWidth:120 }}>
                    <div style={{
                      height:"100%", borderRadius:99,
                      background: isMe ? "#3B82F6" : "#8B5CF6",
                      width:`${item.progress_percent}%`,
                    }}/>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:15, fontWeight:900, color:"#1E2240" }}>
                    {item.total_score} <span style={{ fontSize:11, color:"#9CA3AF" }}>poin</span>
                  </div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#9CA3AF" }}>
                    {item.progress_percent}% selesai
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}