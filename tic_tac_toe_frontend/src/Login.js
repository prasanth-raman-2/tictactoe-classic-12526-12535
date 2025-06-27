import React, { useState } from "react";
import { login as apiLogin } from "./api";

// PUBLIC_INTERFACE
export default function Login({ onLogin }) {
  /** Login screen for user to enter nickname
   * @param {function} onLogin - callback with {nickname, session_id}
   */
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return setErr("Enter a nickname.");
    setLoading(true);
    setErr("");
    try {
      const data = await apiLogin(nickname);
      onLogin(data);
    } catch (ex) {
      setErr(ex.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth: 400, margin: "auto", padding: 32}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 16}}>
        <input
          type="text"
          placeholder="Enter a nickname"
          value={nickname}
          minLength={2}
          maxLength={32}
          disabled={loading}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{padding: 10, fontSize: 18, borderRadius: 8, border: "1px solid #ccc"}}
        />
        <button
          className="theme-toggle"
          type="submit"
          style={{width: "100%"}}
          disabled={loading}
        >{loading ? "Logging in..." : "Start"}</button>
        {err && <div style={{color: "red"}}>{err}</div>}
      </form>
    </div>
  );
}
