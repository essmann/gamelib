import { createContext, useState } from "react";

export const GameContext = createContext();

function ContextProvider({ children }) {
  const [games, setGames] = useState([]);        // list of games
  const [addGameMenu, setAddGameMenu] = useState(null);        // current open menu
  const [gameMenu, setGameMenu] = useState(null);
  const [user, setUser] = useState(null);        // current user info

  return (
    <GameContext.Provider value={{ 
      games, setGames,
      addGameMenu, setAddGameMenu,
      gameMenu, setGameMenu,
      user, setUser
    }}>
      {children}
    </GameContext.Provider>
  );
}

export default ContextProvider;
