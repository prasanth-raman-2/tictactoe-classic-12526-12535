import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export default function Leaderboard({ visible = true }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetch("http://localhost:3001/leaderboard")
      .then(r => r.json())
      .then(d => setItems(d.leaderboard || []))
      .catch(e => setErr("Could not fetch leaderboard"))
      .finally(() => setLoading(false));
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        minWidth: 230, maxWidth: 320,
        padding: "16px 8px",
        borderRadius: 12,
        color: "var(--text-primary)",
        margin: "20px auto"
      }}
    >
      <h3 style={{marginTop: 0}}>🏆 Leaderboard</h3>
      {loading ? <div>Loading...</div> :
        err ? <div style={{color: "red"}}>{err}</div> :
        <table style={{width: "100%"}}>
          <thead>
            <tr>
              <th style={{textAlign: "left"}}>Name</th>
              <th>Won</th>
              <th>Played</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, i) =>
              <tr key={row.nickname} style={{background: i === 0 ? "#ffe08222" : "inherit"}}>
                <td>{row.nickname}</td>
                <td style={{textAlign: "center"}}>{row.games_won}</td>
                <td style={{textAlign: "center"}}>{row.games_played}</td>
              </tr>
            )}
          </tbody>
        </table>
      }
    </div>
  );
}
