import { useState } from "react";
import { META } from "./constants";
import HomeScreen   from "./components/HomeScreen";
import GameScreen   from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import BgCanvas     from "./components/BgCanvas";
import LoginScreen  from "./components/loginscreen";
import "./App.css";

const API = "http://localhost:3001";

export default function App() {
  // ── User / auth ──────────────────────────────────────
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("logify_user");
    return saved ? JSON.parse(saved) : null;
  });

  // ── Screen ────────────────────────────────────────────
  const [screen, setScreen] = useState("home");

  // ── Game state ────────────────────────────────────────
  const [activeGame, setActiveGame] = useState(null);
  const [scores, setScores] = useState(
    { sequence: 0, robot: 0, pattern: 0, typing: 0 }
  );
  const [completed, setCompleted] = useState(
    { sequence: false, robot: false, pattern: false, typing: false }
  );
  const [lastResult, setLastResult] = useState(null);

  // ── Login handler ────────────────────────────────────
  function handleLogin(userData) {
    setUser(userData);
    setScreen("home");
  }

  // ── Logout handler ───────────────────────────────────
  function handleLogout() {
    localStorage.removeItem("logify_user");
    localStorage.removeItem("logify_token");
    setUser(null);
    setScreen("home");
    setScores({ sequence: 0, robot: 0, pattern: 0, typing: 0 });
    setCompleted({ sequence: false, robot: false, pattern: false, typing: false });
  }

  // ── Game handlers ─────────────────────────────────────
  function startGame(id) {
    setActiveGame(id);
    setScreen("game");
  }

  async function finishGame(id, score) {
    const newScores    = { ...scores,    [id]: score };
    const newCompleted = { ...completed, [id]: true  };

    setScores(newScores);
    setCompleted(newCompleted);
    setLastResult({ id, score });
    setScreen("result");

    // Update progress ke backend
    const doneCount = Object.values(newCompleted).filter(Boolean).length;
    const totalScore = Object.values(newScores).reduce((a, b) => a + b, 0);
    const progressPercent = Math.round((doneCount / 4) * 100);

    const token = localStorage.getItem("logify_token");
    if (token) {
      try {
        await fetch(`${API}/api/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            total_score: totalScore,
            games_completed: doneCount,
            progress_percent: progressPercent,
          }),
        });
        // Update local user data
        const updatedUser = { ...user, total_score: totalScore, games_completed: doneCount, progress_percent: progressPercent };
        setUser(updatedUser);
        localStorage.setItem("logify_user", JSON.stringify(updatedUser));
      } catch {
        console.log("Gagal update progress ke server");
      }
    }
  }

  function playAgain() { setScreen("game"); }
  function goHome()    { setScreen("home"); }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const doneCount  = Object.values(completed).filter(Boolean).length;

  // ── Belum login → tampilkan LoginScreen ──────────────
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // ── Sudah login → tampilkan app ───────────────────────
  return (
    <div className="app">
      <BgCanvas avatar={user.avatar} />

      {screen === "home" && (
        <HomeScreen
          avatar={user.avatar}
          username={user.username}
          scores={scores}
          completed={completed}
          totalScore={totalScore}
          doneCount={doneCount}
          onStart={startGame}
          onLogout={handleLogout}
        />
      )}

      {screen === "game" && (
        <GameScreen
          gameId={activeGame}
          onFinish={finishGame}
          onHome={goHome}
        />
      )}

      {screen === "result" && lastResult && (
        <ResultScreen
          result={lastResult}
          scores={scores}
          doneCount={doneCount}
          onPlayAgain={playAgain}
          onHome={goHome}
        />
      )}
    </div>
  );
}