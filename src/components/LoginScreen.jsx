import { useState } from "react";

const AVATARS = ["🐱","🪲","🐸","🦊","🐼","🐨","🦁","🐯"];
const API = "http://localhost:3001";

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "avatar"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🐱");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState(null);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi!"); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("logify_token", data.token);
      localStorage.setItem("logify_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError("Tidak bisa konek ke server!");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi!"); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, avatar: selectedAvatar }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setRegisterData(data);
      setMode("avatar");
    } catch {
      setError("Tidak bisa konek ke server!");
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarDone() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, avatar: selectedAvatar }),
      });
      const data = await res.json();
      if (data.success || registerData) {
        const userData = registerData || data;
        localStorage.setItem("logify_token", userData.token);
        const user = { ...userData.user, avatar: selectedAvatar };
        localStorage.setItem("logify_user", JSON.stringify(user));
        onLogin(user);
      }
    } catch {
      // pakai data register sebelumnya
      if (registerData) {
        const user = { ...registerData.user, avatar: selectedAvatar };
        localStorage.setItem("logify_token", registerData.token);
        localStorage.setItem("logify_user", JSON.stringify(user));
        onLogin(user);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Avatar selection screen ──────────────────────────
  if (mode === "avatar") {
    return (
      <div style={{
        minHeight:"100vh", background:"#F0F4FF",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20, fontFamily:"'Nunito',sans-serif",
      }}>
        <div style={{
          background:"white", borderRadius:24, padding:"32px 24px",
          maxWidth:400, width:"100%",
          boxShadow:"0 8px 40px rgba(0,0,0,0.08)",
          border:"2px solid #E2E8F0",
        }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:56, marginBottom:12 }}>{selectedAvatar}</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#1E2240", marginBottom:6 }}>
              Pilih Avatarmu!
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#9CA3AF" }}>
              Avatar ini akan muncul di leaderboard
            </div>
          </div>

          <div style={{
            display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            gap:12, marginBottom:28,
          }}>
            {AVATARS.map(av => (
              <div key={av} onClick={() => setSelectedAvatar(av)} style={{
                fontSize:36, textAlign:"center", padding:"12px 0",
                borderRadius:16, cursor:"pointer",
                border:`3px solid ${selectedAvatar === av ? "#3B82F6" : "#E2E8F0"}`,
                background: selectedAvatar === av ? "#EFF6FF" : "white",
                boxShadow: selectedAvatar === av ? "0 4px 12px rgba(59,130,246,0.2)" : "none",
                transition:"all 0.15s",
                transform: selectedAvatar === av ? "scale(1.08)" : "scale(1)",
              }}>{av}</div>
            ))}
          </div>

          <button onClick={() => {
            // langsung save dan login dengan avatar yang dipilih
            if (registerData) {
              const user = { ...registerData.user, avatar: selectedAvatar };
              localStorage.setItem("logify_token", registerData.token);
              localStorage.setItem("logify_user", JSON.stringify(user));
              onLogin(user);
            }
          }} style={{
            width:"100%", padding:"14px",
            background:"#3B82F6", border:"none", borderRadius:14,
            color:"white", fontSize:15, fontWeight:900,
            cursor:"pointer", fontFamily:"'Nunito',sans-serif",
            boxShadow:"0 4px 0 #1D4ED8",
          }}>
            Mulai Bermain! 🚀
          </button>
        </div>
      </div>
    );
  }

  // ── Login / Register screen ──────────────────────────
  return (
    <div style={{
      minHeight:"100vh", background:"#F0F4FF",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, fontFamily:"'Nunito',sans-serif",
      position:"relative", overflow:"hidden",
    }}>
      {/* Background symbols */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        {["if","for","{}","=>","()","[]","!=","==","while","true","false","print"].map((s,i) => (
          <div key={i} style={{
            position:"absolute",
            left:`${(i*17+7)%90}%`,
            top:`${(i*23+5)%85}%`,
            fontSize: 14 + (i%3)*6,
            fontWeight:800, opacity:0.12,
            color:["#3B82F6","#8B5CF6","#10B981","#FF9F43"][i%4],
            fontFamily:"'JetBrains Mono',monospace",
            transform:`rotate(${(i%3-1)*15}deg)`,
          }}>{s}</div>
        ))}
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:400, width:"100%" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:56, marginBottom:8 }}>🪲</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#1E2240", marginBottom:4 }}>
            Logify
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:"#9CA3AF" }}>
            Belajar logika coding bersama Logify!
          </div>
        </div>

        {/* Card */}
        <div style={{
          background:"white", borderRadius:24, padding:"28px 24px",
          boxShadow:"0 8px 40px rgba(0,0,0,0.08)",
          border:"2px solid #E2E8F0",
        }}>
          {/* Tab toggle */}
          <div style={{
            display:"flex", background:"#F0F4FF",
            borderRadius:12, padding:4, marginBottom:24,
          }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex:1, padding:"10px 0",
                background: mode === m ? "white" : "transparent",
                border:"none", borderRadius:10,
                fontFamily:"'Nunito',sans-serif", fontSize:14,
                fontWeight:900, cursor:"pointer",
                color: mode === m ? "#1E2240" : "#9CA3AF",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition:"all 0.2s",
              }}>
                {m === "login" ? "🔑 Masuk" : "✨ Daftar"}
              </button>
            ))}
          </div>

          {/* Username */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#6B7280", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Username
            </div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
              placeholder="Masukkan username..."
              style={{
                width:"100%", padding:"12px 14px",
                border:"2px solid #E2E8F0", borderRadius:12,
                fontFamily:"'Nunito',sans-serif", fontSize:14,
                fontWeight:700, outline:"none", boxSizing:"border-box",
                transition:"border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor="#3B82F6"}
              onBlur={e => e.target.style.borderColor="#E2E8F0"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: mode === "register" ? 20 : 24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#6B7280", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
              placeholder="Masukkan password..."
              style={{
                width:"100%", padding:"12px 14px",
                border:"2px solid #E2E8F0", borderRadius:12,
                fontFamily:"'Nunito',sans-serif", fontSize:14,
                fontWeight:700, outline:"none", boxSizing:"border-box",
                transition:"border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor="#3B82F6"}
              onBlur={e => e.target.style.borderColor="#E2E8F0"}
            />
          </div>

          {/* Avatar preview for register */}
          {mode === "register" && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#6B7280", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                Pilih Avatar
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {AVATARS.map(av => (
                  <div key={av} onClick={() => setSelectedAvatar(av)} style={{
                    fontSize:28, padding:"6px 8px", borderRadius:10,
                    border:`2.5px solid ${selectedAvatar === av ? "#3B82F6" : "#E2E8F0"}`,
                    background: selectedAvatar === av ? "#EFF6FF" : "white",
                    cursor:"pointer", transition:"all 0.15s",
                    transform: selectedAvatar === av ? "scale(1.15)" : "scale(1)",
                  }}>{av}</div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background:"#FEF2F2", border:"2px solid #EF4444",
              borderRadius:10, padding:"10px 14px", marginBottom:16,
              fontSize:13, fontWeight:800, color:"#991B1B",
            }}>❌ {error}</div>
          )}

          {/* Submit button */}
          <button
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
            style={{
              width:"100%", padding:"14px",
              background: loading ? "#9CA3AF" : "#3B82F6",
              border:"none", borderRadius:14,
              color:"white", fontSize:15, fontWeight:900,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily:"'Nunito',sans-serif",
              boxShadow: loading ? "none" : "0 4px 0 #1D4ED8",
              transition:"all 0.2s",
            }}
          >
            {loading ? "⏳ Memproses..." : mode === "login" ? "🔑 Masuk" : "✨ Buat Akun"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:16, fontSize:12, fontWeight:700, color:"#9CA3AF" }}>
          Logify · Belajar coding dengan seru! 🪲
        </div>
      </div>
    </div>
  );
}