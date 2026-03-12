import { useState } from "react";
import { META } from "../constants";
import SequenceGame from "../games/SequenceGame";
import RobotGame    from "../games/RobotGame";
import PatternGame  from "../games/PatternGame";
import TypingGame   from "../games/TypingGame";

export default function GameScreen({ gameId, onFinish, onHome }) {
  const [score, setScore] = useState(0);
  const m = META[gameId];

  function handleScore(pts) {
    setScore(prev => prev + pts);
  }
  function handleFinish(finalScore) {
    onFinish(gameId, finalScore);
  }

  const GAME = { sequence: SequenceGame, robot: RobotGame, pattern: PatternGame, typing: TypingGame };
  const GameComp = GAME[gameId];

  return (
    <div className="screen" style={{ padding:"0 0 40px" }}>
      {/* Nav bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:12,
        padding:"14px 16px", background:"white",
        borderBottom:"2px solid #E2E8F0", marginBottom:16,
        position:"sticky", top:0, zIndex:10,
      }}>
        <button onClick={onHome} style={{
          background:"#F0F4FF", border:"none", borderRadius:10,
          width:38, height:38, cursor:"pointer", fontSize:18,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>‹</button>

        <span style={{ fontSize:22 }}>{m.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:900, color:"#1E2240", lineHeight:1 }}>{m.title}</div>
          <div style={{ fontSize:11, fontWeight:700, color:"#9CA3AF" }}>Logify</div>
        </div>

        <div style={{
          background: m.color, color:"white",
          borderRadius:100, padding:"6px 16px",
          fontSize:13, fontWeight:900,
        }}>
          🏆 {score}
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"0 16px" }}>
        <GameComp
          score={score}
          onScore={handleScore}
          onFinish={handleFinish}
        />
      </div>
    </div>
  );
}