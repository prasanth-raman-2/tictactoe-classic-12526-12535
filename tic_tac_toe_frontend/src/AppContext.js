import React, { createContext, useContext, useState } from "react";

// Initial context
const AppContext = createContext();

// PUBLIC_INTERFACE
export function AppProvider({children}) {
  // Holds user session and optionally active game
  const [session, setSession] = useState(null);
  const [game, setGame] = useState(null);

  return (
    <AppContext.Provider value={{ session, setSession, game, setGame }}>
      {children}
    </AppContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAppContext() {
  return useContext(AppContext);
}
