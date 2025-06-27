import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import Lobby from "./Lobby";
import Board from "./Board";
import StatusBar from "./StatusBar";
import Leaderboard from "./Leaderboard";
import { AppProvider, useAppContext } from "./AppContext";

// PUBLIC_INTERFACE
function App() {
  // Theme state (unchanged)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <AppProvider>
      <div className="App">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{ position: "fixed", top: 18, right: 18, zIndex: 50 }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <MainContent />
      </div>
    </AppProvider>
  );
}

// MainContent decides which screen to show: login, lobby, game, etc.
function MainContent() {
  const { session, setSession, game, setGame } = useAppContext();
  // local view state: "login" | "lobby" | "game"
  const [screen, setScreen] = useState("login");

  // On login
  function handleLogin(sess) {
    setSession(sess);
    setScreen("lobby");
  }
  // On game created/joined
  function handleGameStart(g) {
    setGame(g);
    setScreen("game");
  }
  // Exit to lobby
  function handleExitGame() {
    setGame(null);
    setScreen("lobby");
  }

  // Poll game status every 2s if in game/in_progress, refresh only if in game
  useEffect(() => {
    let timer;
    if (screen === "game" && game?.game_id && game.status !== "finished") {
      timer = setInterval(() => {
        fetch(`http://localhost:3001/game/${game.game_id}/status`)
          .then((r) => r.json())
          .then(setGame)
          .catch(() => {}); // tolerate errors (e.g. if ended)
      }, 2000);
    }
    return () => timer && clearInterval(timer);
  }, [game, screen, setGame]);

  // Move handler for the Board
  async function handleMove(x, y) {
    if (!game || !session) return;
    try {
      const res = await fetch(
        `http://localhost:3001/game/${game.game_id}/move`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: session.session_id, x, y }),
        }
      );
      if (!res.ok) {
        const d = await res.json();
        alert(d.detail || "Invalid move");
        return;
      }
      const updated = await res.json();
      setGame(updated);
    } catch (e) {
      alert("Move failed.");
    }
  }

  // Which view to show?
  if (!session) return <Login onLogin={handleLogin} />;
  if (screen === "lobby")
    return (
      <div>
        <Lobby session={session} onCreate={handleGameStart} onJoin={handleGameStart} />
        <Leaderboard visible={true} />
      </div>
    );
  if (screen === "game" && game)
    return (
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, alignItems: "flex-start"}}>
        <div>
          <StatusBar game={game} session={session} onExit={handleExitGame} />
          <Board
            board={game.board}
            onMove={handleMove}
            disabled={
              game.status !== "in_progress" ||
              (game.creator.session_id === session.session_id
                ? game.current_turn !== "X"
                : game.current_turn !== "O")
            }
          />
          <div style={{marginTop: 30}}>
            <button className="theme-toggle" onClick={handleExitGame}>Back to Lobby</button>
          </div>
        </div>
        <Leaderboard visible={true} />
      </div>
    );
  return <div>Loading...</div>;
}

export default App;
