import { useState, useEffect } from "react";
import { META } from "./constants";
import HomeScreen   from "./components/HomeScreen";
import GameScreen   from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import BgCanvas     from "./components/BgCanvas";
import LoginScreen  from "./components/loginscreen";
import LeaderboardScreen from "./components/leaderboardscreen";
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
 
  // ── Active game ───────────────────────────────────────
  const [activeGame, setActiveGame] = useState(null);
 
  // ── Game state ────────────────────────────────────────
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem("logify_scores");
    return saved ? JSON.parse(saved) : { sequence:0, robot:0, pattern:0, typing:0, challenge:0 };
  });
  
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("logify_completed");
    return saved ? JSON.parse(saved) : { sequence:false, robot:false, pattern:false, typing:false, challenge:false };
  });
  
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Persist scores & completed ke localStorage ────────
  useEffect(() => {
    localStorage.setItem("logify_scores", JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem("logify_completed", JSON.stringify(completed));
  }, [completed]);

  // ── Load user data dari backend saat app mount ────────
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("logify_token");
      const storedUser = localStorage.getItem("logify_user");

      if (token && storedUser) {
        try {
          const response = await fetch(`${API}/api/user`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          
          const data = await response.json();
          
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("logify_user", JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn("Failed to fetch from backend, using localStorage:", err);
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // ── Helper: Reset scores ke initial ───────────────────
  function resetScores() {
    const initialScores = { sequence:0, robot:0, pattern:0, typing:0, challenge:0 };
    const initialCompleted = { sequence:false, robot:false, pattern:false, typing:false, challenge:false };
    setScores(initialScores);
    setCompleted(initialCompleted);
    localStorage.setItem("logify_scores", JSON.stringify(initialScores));
    localStorage.setItem("logify_completed", JSON.stringify(initialCompleted));
  }

  // ── Login handler ─────────────────────────────────────
  async function handleLogin(userData) {
    const token = localStorage.getItem("logify_token");
    
    // 1. Fetch data user terbaru dari backend
    let finalUser = userData;
    
    if (token) {
      try {
        const response = await fetch(`${API}/api/user`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.user) {
          finalUser = data.user;
          console.log("✅ User data loaded from database:", data.user);
        }
      } catch (err) {
        console.warn("Failed to fetch user data, using login response:", err);
      }
    }
    
    // 2. Update user state
    setUser(finalUser);
    localStorage.setItem("logify_user", JSON.stringify(finalUser));
    
    // 3. Load scores dari localStorage jika user sudah punya progress
    const savedScores = localStorage.getItem("logify_scores");
    const savedCompleted = localStorage.getItem("logify_completed");
    
    if (savedScores && savedCompleted && finalUser.total_score > 0) {
      try {
        setScores(JSON.parse(savedScores));
        setCompleted(JSON.parse(savedCompleted));
        console.log("✅ Scores loaded from localStorage");
      } catch (err) {
        console.warn("Failed to parse saved scores:", err);
        resetScores();
      }
    } else {
      resetScores();
    }
    
    setScreen("home");
  }
 
  // ── Logout handler ────────────────────────────────────
  async function handleLogout() {
    const token = localStorage.getItem("logify_token");
    
    // Submit progress terakhir ke backend SEBELUM logout
    if (token && user) {
      const doneCount = Object.values(completed).filter(Boolean).length;
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
      const progressPercent = Math.round((doneCount / 5) * 100);
      
      try {
        const response = await fetch(`${API}/api/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            total_score: totalScore,
            games_completed: doneCount,
            progress_percent: progressPercent,
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log("✅ Progress saved to database before logout");
        } else {
          console.error("❌ Failed to save progress:", result.error);
        }
      } catch (err) {
        console.error("❌ Network error:", err);
      }
    }
    
    // Hapus localStorage & reset state
    localStorage.removeItem("logify_user");
    localStorage.removeItem("logify_token");
    localStorage.removeItem("logify_scores");
    localStorage.removeItem("logify_completed");
    
    setUser(null);
    resetScores();
    setScreen("home");
  }
 
  // ── Game handlers ─────────────────────────────────────
  function startGame(id) {
    setActiveGame(id);
    setScreen("game");
  }
 
  async function finishGame(id, score) {
    const newScores = { ...scores, [id]: score };
    const newCompleted = { ...completed, [id]: true };

    setScores(newScores);
    setCompleted(newCompleted);
    setLastResult({ id, score });
    setScreen("result");

    // Update progress ke backend
    const doneCount = Object.values(newCompleted).filter(Boolean).length;
    const totalScore = Object.values(newScores).reduce((a, b) => a + b, 0);
    const progressPercent = Math.round((doneCount / 5) * 100);

    const token = localStorage.getItem("logify_token");
    if (token && user) {
      try {
        const response = await fetch(`${API}/api/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            total_score: totalScore,
            games_completed: doneCount,
            progress_percent: progressPercent,
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          const updatedUser = {
            ...user,
            total_score: totalScore,
            games_completed: doneCount,
            progress_percent: progressPercent,
          };
          setUser(updatedUser);
          localStorage.setItem("logify_user", JSON.stringify(updatedUser));
          console.log("✅ Progress updated after game");
        }
      } catch (err) {
        console.error("❌ Failed to update progress:", err);
      }
    }
  }
 
  function playAgain() { setScreen("game"); }
  function goHome() { setScreen("home"); }
 
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;

  // ── Loading screen ────────────────────────────────────
  if (loading) {
    return (
      <div className="app" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#F0F4FF"
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 900,
          color: "#3B82F6",
          fontFamily: "'GrowYear', 'Nunito', sans-serif"
        }}>
          Loading Logify...
        </div>
      </div>
    );
  }
 
  // ── Belum login → tampilkan LoginScreen ───────────────
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
          user={user}
          scores={scores}
          completed={completed}
          totalScore={totalScore}
          doneCount={doneCount}
          onStart={startGame}
          onLogout={handleLogout}
          onLeaderboard={() => setScreen("leaderboard")}
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
          completed={completed}
          doneCount={doneCount}
          onPlayAgain={playAgain}
          onHome={goHome}
        />
      )}
 
      {screen === "leaderboard" && (
        <LeaderboardScreen
          user={user}
          onBack={goHome}
        />
      )}
    </div>
  );
}