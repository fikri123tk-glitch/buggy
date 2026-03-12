import { useState, useEffect, useRef } from "react";
import { AVATARS, META } from "./constants";
import HomeScreen    from "./components/HomeScreen";
import GameScreen    from "./components/GameScreen";
import ResultScreen  from "./components/ResultScreen";
import BgCanvas      from "./components/BgCanvas";
import "./App.css";

export default function App() {
  // Pick random avatar once
  const [avatar] = useState(
    () => AVATARS[Math.floor(Math.random() * AVATARS.length)]
  );

  // Screen: "home" | "game" | "result"
  const [screen, setScreen] = useState("home");

  // Which game is active
  const [activeGame, setActiveGame] = useState(null);

  // Scores & completion per game
  const [scores, setScores] = useState(
    { sequence: 0, robot: 0, pattern: 0, typing: 0 }
  );
  const [completed, setCompleted] = useState(
    { sequence: false, robot: false, pattern: false, typing: false }
  );

  // Last result (for result screen)
  const [lastResult, setLastResult] = useState(null);

  function startGame(id) {
    setActiveGame(id);
    setScreen("game");
  }

  function finishGame(id, score) {
    setScores(prev => ({ ...prev, [id]: score }));
    setCompleted(prev => ({ ...prev, [id]: true }));
    setLastResult({ id, score });
    setScreen("result");
  }

  function playAgain() {
    setScreen("game");
  }

  function goHome() {
    setScreen("home");
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const doneCount  = Object.values(completed).filter(Boolean).length;

  return (
    <div className="app">
      <BgCanvas avatar={avatar} />

      {screen === "home" && (
        <HomeScreen
          avatar={avatar}
          scores={scores}
          completed={completed}
          totalScore={totalScore}
          doneCount={doneCount}
          onStart={startGame}
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