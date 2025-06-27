import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function Lobby({ session, onCreate, onJoin }) {
  /** Lobby UI: create game, join existing game, shows instructions.
   * @param session - {nickname, session_id}
   * @param onCreate - callback(game) after create
   * @param onJoin - callback(game) after join
   */
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Create new game
  const handleCreate = async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch("http://localhost:3001/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: session.session_id })
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Create failed");
      }
      const data = await res.json();
      onCreate(data);
    } catch (e) {
      setErr(e.message || "Create failed");
    }
    setLoading(false);
  };

  // Join game
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!gameId.trim()) return setErr("Enter game id.");
    setLoading(true); setErr("");
    try {
      const res = await fetch(`http://localhost:3001/game/${gameId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: session.session_id })
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Join failed");
      }
      const data = await res.json();
      onJoin(data);
    } catch (e) {
      setErr(e.message || "Join failed");
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth: 500, margin: "auto", padding: 24}}>
      <h2>Game Lobby</h2>
      <p>Welcome <strong>{session.nickname}</strong>!</p>
      <div style={{margin: "16px 0"}}>
        <button
          className="theme-toggle"
          disabled={loading}
          onClick={handleCreate}
          style={{width: "100%", marginBottom: 10}}
        >{loading ? "Creating..." : "Create New Game"}</button>
      </div>
      <form onSubmit={handleJoin} style={{display: "flex", gap: 8, marginBottom: 16}}>
        <input
          type="text"
          placeholder="Enter Game ID to join"
          value={gameId}
          disabled={loading}
          onChange={e => setGameId(e.target.value)}
          style={{flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16}}
        />
        <button type="submit" className="theme-toggle" disabled={loading || !gameId.trim()}>
          {loading ? "Joining..." : "Join"}
        </button>
      </form>
      <div>
        <small>Invite a friend by sharing the Game ID after creating, or join an active game.</small>
      </div>
      {err && <div style={{color: "red", marginTop: 10}}>{err}</div>}
    </div>
  );
}
