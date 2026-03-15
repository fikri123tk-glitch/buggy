import { useState } from "react";

const LEVELS = [
  { grid:5, robot:[0,0], goal:[4,4], walls:[], badge:"Mudah" },
  { grid:5, robot:[0,0], goal:[4,3], walls:[[2,1],[2,2],[2,3]], badge:"Mudah" },
  { grid:6, robot:[0,0], goal:[5,5], walls:[[2,0],[2,1],[2,2],[4,3],[4,4]], badge:"Mudah" },
  { grid:6, robot:[0,2], goal:[5,2], walls:[[2,2],[2,3],[3,0],[3,1]], badge:"Sedang" },
  { grid:6, robot:[0,0], goal:[5,4], walls:[[1,1],[1,2],[3,2],[3,3],[3,4]], badge:"Sedang" },
  { grid:7, robot:[0,0], goal:[6,6], walls:[[2,1],[2,2],[4,4],[4,5],[3,0],[3,1]], badge:"Sedang" },
  { grid:7, robot:[0,3], goal:[6,3], walls:[[2,2],[2,3],[2,4],[4,2],[4,3],[4,4]], badge:"Susah" },
  { grid:7, robot:[0,0], goal:[6,5], walls:[[1,1],[2,2],[2,3],[3,4],[4,0],[4,1],[5,3]], badge:"Susah" },
  { grid:5, robot:[4,0], goal:[0,4], walls:[[2,1],[2,2],[2,3]], badge:"Mudah" },
  { grid:6, robot:[0,5], goal:[5,0], walls:[[2,2],[2,3],[3,2],[3,3]], badge:"Mudah" },
  { grid:6, robot:[0,0], goal:[5,5], walls:[[1,0],[1,1],[3,3],[3,4],[3,5]], badge:"Sedang" },
  { grid:6, robot:[3,0], goal:[3,5], walls:[[1,2],[1,3],[2,1],[4,1],[4,2],[5,3]], badge:"Sedang" },
  { grid:7, robot:[0,6], goal:[6,0], walls:[[2,3],[2,4],[2,5],[4,1],[4,2],[4,3]], badge:"Sedang" },
  { grid:7, robot:[0,0], goal:[6,6], walls:[[1,2],[2,1],[2,4],[3,3],[4,2],[4,5],[5,1]], badge:"Susah" },
  { grid:7, robot:[6,0], goal:[0,6], walls:[[1,1],[2,3],[3,2],[3,4],[4,3],[5,2],[5,5]], badge:"Susah" },
  { grid:8, robot:[0,0], goal:[7,7], walls:[[2,1],[2,2],[3,4],[4,3],[4,6],[5,1],[5,5],[6,3]], badge:"Susah" },
];

const DIR = {
  "⬆️": [0,-1], "⬇️": [0,1], "⬅️": [-1,0], "➡️": [1,0],
};
const DIR_LABELS = ["⬆️","⬇️","⬅️","➡️"];

export default function RobotGame({ score, onScore, onFinish }) {
  const [idx, setIdx]       = useState(0);
  const [cmds, setCmds]     = useState([]);
  const [pos, setPos]       = useState(null); // null = not run yet
  const [running, setRunning] = useState(false);
  const [won, setWon]       = useState(false);
  const [failed, setFailed] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const lv = LEVELS[idx];
  const robotStart = lv.robot;
  const goal = lv.goal;
  const currentPos = pos || robotStart;

  function addCmd(d) {
    if (running || won || failed) return;
    setCmds(prev => [...prev, d]);
  }
  function removeCmd(i) {
    if (running || won || failed) return;
    setCmds(prev => prev.filter((_,j) => j !== i));
  }
  function clearCmds() { setCmds([]); }

  async function runCmds() {
    if (running || cmds.length === 0) return;
    setRunning(true);
    setWon(false);
    setFailed(false);

    let [x, y] = robotStart;
    setPos([x, y]);

    for (let i = 0; i < cmds.length; i++) {
      await new Promise(r => setTimeout(r, 380));
      const [dx, dy] = DIR[cmds[i]];
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= lv.grid || ny >= lv.grid) { setFailed(true); setRunning(false); return; }
      if (lv.walls.some(([wx,wy]) => wx===nx && wy===ny)) { setFailed(true); setRunning(false); return; }
      x = nx; y = ny;
      setPos([x, y]);
    }

    await new Promise(r => setTimeout(r, 300));
    if (x === goal[0] && y === goal[1]) {
      setWon(true);
      onScore(10);
      setLocalScore(prev => prev + 10);
    } else {
      setFailed(true);
    }
    setRunning(false);
  }

  function reset() {
    setPos(null); setWon(false); setFailed(false);
  }

  function next() {
    if (idx + 1 >= LEVELS.length) {
      onFinish(localScore);
    } else {
      setIdx(idx+1);
      setCmds([]); setPos(null); setWon(false); setFailed(false);
    }
  }

  const chipCls = lv.badge === "Mudah" ? "easy" : lv.badge === "Sedang" ? "medium" : "hard";
  const cellSize = Math.min(48, Math.floor(300 / lv.grid));

  return (
    <div className="anim-slide">
      {/* Progress */}
      <div style={{ height:5, background:"#E2E8F0", borderRadius:10, marginBottom:18, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(idx/LEVELS.length)*100}%`, background:"#3B82F6", borderRadius:10, transition:"width 0.4s" }}/>
      </div>

      <span className={`q-chip ${chipCls}`}>{lv.badge} · Level {idx+1}</span>
      <div className="q-scene">Gerakkan robot 🤖 ke tujuan 🎯 tanpa menabrak tembok!</div>

      {/* Grid */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:`repeat(${lv.grid}, ${cellSize}px)`,
          gap:3, padding:10,
          background:"#1E2240", borderRadius:14,
        }}>
          {Array.from({length: lv.grid * lv.grid}, (_,i) => {
            const cx = i % lv.grid, cy = Math.floor(i / lv.grid);
            const isRobot = currentPos[0]===cx && currentPos[1]===cy;
            const isGoal  = goal[0]===cx && goal[1]===cy;
            const isWall  = lv.walls.some(([wx,wy])=>wx===cx&&wy===cy);
            return (
              <div key={i} style={{
                width:cellSize, height:cellSize,
                background: isWall ? "#374151" : "#2D3748",
                borderRadius:6, display:"flex",
                alignItems:"center", justifyContent:"center",
                fontSize: cellSize * 0.5,
                border: isGoal ? "2px solid #10B981" : "2px solid transparent",
                transition:"all 0.3s",
              }}>
                {isRobot ? "🤖" : isGoal ? "🎯" : isWall ? "🧱" : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direction buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
        {DIR_LABELS.map(d => (
          <button key={d} onClick={()=>addCmd(d)} disabled={running||won}
            style={{
              padding:"12px 0", fontSize:20, background:"white",
              border:"2.5px solid #E2E8F0", borderRadius:12, cursor:"pointer",
              fontFamily:"'Nunito',sans-serif", fontWeight:900,
              transition:"all 0.15s",
            }}
            onMouseEnter={e=>{if(!running&&!won)e.target.style.borderColor="#3B82F6"}}
            onMouseLeave={e=>e.target.style.borderColor="#E2E8F0"}
          >{d}</button>
        ))}
      </div>

      {/* Command queue */}
      <div style={{
        minHeight:46, background:"white", border:"2px solid #E2E8F0",
        borderRadius:12, padding:"8px 12px", marginBottom:12,
        display:"flex", flexWrap:"wrap", gap:6, alignItems:"center",
      }}>
        {cmds.length === 0 && <span style={{ fontSize:13, color:"#C4C9D8", fontWeight:700 }}>Tambahkan perintah arah di atas...</span>}
        {cmds.map((c,i) => (
          <span key={i} onClick={()=>removeCmd(i)} style={{
            background:"#EEF2FF", border:"2px solid #3B82F6",
            borderRadius:8, padding:"4px 10px",
            fontSize:16, cursor:"pointer", userSelect:"none",
          }} title="Klik untuk hapus">{c}</span>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        <button onClick={runCmds} disabled={running||cmds.length===0||won}
          className="btn-primary" style={{ flex:2 }}>
          {running ? "⏳ Berjalan..." : "▶️ Jalankan"}
        </button>
        <button onClick={()=>{reset();clearCmds();}}
          style={{
            flex:1, background:"white", color:"#6B7280",
            border:"2px solid #E2E8F0", borderRadius:14, padding:"13px 0",
            fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:900, cursor:"pointer",
          }}>🔄 Reset</button>
      </div>

      {won && (
        <div className="answer-box answer-ok">
          <div className="ab-icon">🎉</div>
          <div className="ab-title">Robot sampai tujuan! +10 poin</div>
          <div className="ab-explain">Perintah kamu berhasil memandu robot ke tujuan dengan selamat! 🤖✨</div>
          <button className="btn-next" onClick={next}>
            {idx+1>=LEVELS.length ? "Selesai 🏁" : "Level Berikutnya →"}
          </button>
        </div>
      )}

      {failed && !running && (
        <div className="answer-box answer-err">
          <div className="ab-icon">💥</div>
          <div className="ab-title">Robot tidak sampai tujuan!</div>
          <div className="ab-explain">Coba lagi! Perhatikan arah dan tembok yang menghalangi. 🧱</div>
          <button className="btn-next" style={{ background:"#EF4444" }}
            onClick={()=>{reset();clearCmds();}}>
            🔄 Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}