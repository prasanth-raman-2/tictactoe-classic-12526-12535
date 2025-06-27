const BASE_URL = "http://localhost:3001";

// Utility for handling requests and JSON/HTTP errors
async function _request(path, { method = "GET", body = null } = {}) {
  const opts = { method, headers: {} };
  if (body !== null) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  let resp;
  try {
    resp = await fetch(BASE_URL + path, opts);
  } catch (e) {
    throw new Error("Unable to connect to server.");
  }
  let data = null;
  try {
    data = await resp.json();
  } catch {}
  if (!resp.ok) {
    throw new Error(data?.detail || data?.message || "API error");
  }
  return data;
}

// PUBLIC_INTERFACE
export async function login(nickname) {
  /** Log in a user and create a session. */
  return _request("/login", { method: "POST", body: { nickname } });
}

// PUBLIC_INTERFACE
export async function createGame(session_id) {
  /** Create a new game as the creator. */
  return _request("/game", { method: "POST", body: { session_id } });
}

// PUBLIC_INTERFACE
export async function joinGame(game_id, session_id) {
  /** Join an existing game as an opponent. */
  return _request(`/game/${game_id}/join`, { method: "POST", body: { session_id } });
}

// PUBLIC_INTERFACE
export async function submitMove(game_id, session_id, x, y) {
  /** Submit a move for a game. */
  return _request(`/game/${game_id}/move`, { method: "POST", body: { session_id, x, y } });
}

// PUBLIC_INTERFACE
export async function fetchGameStatus(game_id) {
  /** Fetch the status and board of a given game. */
  return _request(`/game/${game_id}/status`);
}

// PUBLIC_INTERFACE
export async function fetchLeaderboard() {
  /** Get the leaderboard stats. */
  return _request("/leaderboard");
}
