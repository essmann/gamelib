import { createContext, useState } from "react";

export const GameContext = createContext();

function ContextProvider({ children }) {
  const [games, setGames] = useState([]);        // list of games
  const [menu, setMenu] = useState(null);        // current open menu
  const [user, setUser] = useState(null);        // current user info

  return (
    <GameContext.Provider value={{ 
      games, setGames,
      menu, setMenu,
      user, setUser
    }}>
      {children}
    </GameContext.Provider>
  );
}

export default ContextProvider;
