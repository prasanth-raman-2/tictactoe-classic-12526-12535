import React from "react";

// PUBLIC_INTERFACE
export default function StatusBar({ game, session, onExit }) {
  /** Show current game status and actions.
   * @param game: latest game state
   * @param session: your session info ({nickname, session_id})
   */
  let mySymbol = null, oppName = null;
  if (game) {
    if (session.session_id === game.creator.session_id) {
      mySymbol = "X";
      oppName = game.opponent ? game.opponent.nickname : "- waiting -";
    } else if (game.opponent && session.session_id === game.opponent.session_id) {
      mySymbol = "O";
      oppName = game.creator.nickname;
    }
  }
  let statusMsg = "";
  if (!game) statusMsg = "";
  else if (game.status === "waiting") statusMsg = "Waiting for an opponent to join...";
  else if (game.status === "in_progress") {
    if (mySymbol === game.current_turn)
      statusMsg = "Your turn!";
    else
      statusMsg = "Opponent's turn";
  } else if (game.status === "finished") {
    if (game.winner_session_id === session.session_id)
      statusMsg = "🎉 You won!";
    else if (game.winner_session_id === null)
      statusMsg = "Draw!";
    else
      statusMsg = "Lost. Better luck next time!";
  }

  return (
    <div style={{
      margin: "16px auto", padding: 16, maxWidth: 420,
      borderRadius: 10, background: "var(--bg-secondary)", color: "var(--text-primary)", boxShadow: "0 2px 6px #0001"
    }}>
      <div>
        <strong>Game ID:</strong> <code>{game?.game_id || "?"}</code> &nbsp;
        <button className="theme-toggle" style={{padding: "4px 14px"}} onClick={() => {
          navigator.clipboard.writeText(game?.game_id || "");
        }}>Copy</button>
      </div>
      <div><strong>You:</strong> {session.nickname} (<b>{mySymbol}</b>)</div>
      <div><strong>Opponent:</strong> {oppName}</div>
      <div><strong>Status:</strong> {statusMsg}</div>
      <div style={{marginTop: 8}}>
        <button className="theme-toggle" style={{background: "#d33"}} onClick={onExit}>Exit Game</button>
      </div>
    </div>
  );
}
