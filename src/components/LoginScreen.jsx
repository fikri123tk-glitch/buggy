import { useState } from "react";
import "../App.css";

const AVATARS = ["🐱",,"🐸","🦊","🐼","🐨","🦁","🐯"];
const API = "http://localhost:3001";
const LOGO_URL = "/logo.png";

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🐱");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!username.trim() || !password.trim()) { setError("Username dan password wajib diisi!"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("logify_token", data.token);
      localStorage.setItem("logify_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch { setError("Tidak bisa konek ke server!"); }
    finally { setLoading(false); }
  }

  async function handleRegister() {
    if (!username.trim() || !password.trim()) { setError("Username dan password wajib diisi!"); return; }
    if (username.length < 3) { setError("Username minimal 3 karakter!"); return; }
    if (password.length < 4) { setError("Password minimal 4 karakter!"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/register`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username, password, avatar: selectedAvatar }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("logify_token", data.token);
      localStorage.setItem("logify_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch { setError("Tidak bisa konek ke server!"); }
    finally { setLoading(false); }
  }

  return (
    <div className="screen" style={{
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{ position:"relative", zIndex:1, maxWidth:420, width:"100%" }}>
        
        {/* LOGO DENGAN FOTO */}
         <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ 
            marginBottom:8, 
            display: "inline-block",
            padding: 8,
            background: "transparent", // 🔹 Transparan
            borderRadius: 20,
            // 🔹 Hapus boxShadow agar bersih
            border: "none"
          }}>
            <img 
              src={LOGO_URL} 
              alt="Logify Logo" 
              style={{
                width: 250, // 🔹 Logo lebih besar
                height: "auto",
                objectFit: "contain",
                display: "block",
                background: "transparent",
                borderRadius: 12,
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML = "🪲";
                e.currentTarget.parentElement.style.fontSize = "56px";
              }}
              loading="lazy"
            />
          </div>
          
          
          {/* 🔹 Subtitle - Font Default (Nunito) */}
          <p style={{ 
            fontSize:13, 
            fontWeight:700, 
            color:"var(--muted)",
            fontFamily: "var(--f)",
          }}>
            Belajar logika coding bersama Logify!
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:"var(--white)", borderRadius:24, padding:"28px 24px",
          boxShadow:"0 8px 40px rgba(0,0,0,0.08)", border:"2px solid var(--border)",
        }}>
          {/* Tab */}
          <div style={{ display:"flex", background:"var(--bg)", borderRadius:12, padding:4, marginBottom:24 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex:1, padding:"10px 0",
                background: mode===m ? "var(--white)" : "transparent",
                border:"none", borderRadius:10,
                fontFamily: "var(--f)",
                fontSize:14, fontWeight:900,
                cursor:"pointer", color: mode===m ? "var(--text)" : "var(--muted)",
                boxShadow: mode===m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition:"all 0.2s",
              }}>
                {m==="login" ? " Masuk" : " Daftar"}
              </button>
            ))}
          </div>

          {/* Username */}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:800, color:"var(--muted)", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.06em", fontFamily: "var(--f)" }}>Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():handleRegister())}
              placeholder="Masukkan username..."
              style={{ 
                width:"100%", padding:"12px 14px", border:"2px solid var(--border)", borderRadius:12,
                fontFamily: "var(--f)", fontSize:14, fontWeight:700, outline:"none", boxSizing:"border-box" 
              }}
              onFocus={e=>e.target.style.borderColor="var(--blue)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:800, color:"var(--muted)", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:"0.06em", fontFamily: "var(--f)" }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&(mode==="login"?handleLogin():handleRegister())}
              placeholder="Masukkan password..."
              style={{ 
                width:"100%", padding:"12px 14px", border:"2px solid var(--border)", borderRadius:12,
                fontFamily: "var(--f)", fontSize:14, fontWeight:700, outline:"none", boxSizing:"border-box" 
              }}
              onFocus={e=>e.target.style.borderColor="var(--blue)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
            />
          </div>

          {/* Avatar — hanya saat register */}
          {mode==="register" && (
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:800, color:"var(--muted)", marginBottom:8, display:"block", textTransform:"uppercase", letterSpacing:"0.06em", fontFamily: "var(--f)" }}>Pilih Avatar</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {AVATARS.map(av => (
                  <div key={av} onClick={()=>setSelectedAvatar(av)} style={{
                    fontSize:32, textAlign:"center", padding:"10px 0",
                    borderRadius:14, cursor:"pointer",
                    border:`2.5px solid ${selectedAvatar===av ? "var(--blue)" : "var(--border)"}`,
                    background: selectedAvatar===av ? "#EFF6FF" : "var(--white)",
                    boxShadow: selectedAvatar===av ? "0 4px 12px rgba(59,130,246,0.2)" : "none",
                    transition:"all 0.15s",
                    transform: selectedAvatar===av ? "scale(1.08)" : "scale(1)",
                  }}>{av}</div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background:"#FEF2F2", border:"2px solid var(--red)",
              borderRadius:10, padding:"10px 14px", marginBottom:16,
              fontSize:13, fontWeight:800, color:"#991B1B",
              fontFamily: "var(--f)",
            }}>❌ {error}</div>
          )}

          {/* Submit */}
          <button onClick={mode==="login" ? handleLogin : handleRegister} disabled={loading} style={{
            width:"100%", padding:"14px",
            background: loading ? "var(--muted)" : "var(--blue)",
            border:"none", borderRadius:14, color:"white",
            fontSize:15, fontWeight:900, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--f)",
            boxShadow: loading ? "none" : "0 4px 0 var(--blue-d)",
            transition:"all 0.2s",
          }}>
            {loading ? " Memproses..." : mode==="login" ? " Masuk" : " Buat Akun"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:16, fontSize:12, fontWeight:700, color:"var(--muted)", fontFamily: "var(--f)" }}>
          Logify · Belajar coding dengan seru! 
        </div>
      </div>
    </div>
  );
}