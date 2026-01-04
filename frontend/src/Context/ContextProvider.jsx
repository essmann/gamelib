import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
export const GameContext = createContext();

function ContextProvider({ children }) {
  const [games, setGames] = useState([]);        // list of games
  const [addGameMenu, setAddGameMenu] = useState(null);        // current open menu
  const [previewGameData, setPreviewGameData] = useState(null);
  const [user, setUser] = useState(null);        // current user info
  const [searchMenu, setSearchMenu] = useState(false);
  const [loginMenu, setLoginMenu] = useState(false);
  const [registerMenu, setRegisterMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [lists, setLists] = useState([]);
  const [listMenu, setListMenu] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState(false);
  return (
    <GameContext.Provider value={{ 
      games, setGames,
      lists, setLists,
      addGameMenu, setAddGameMenu,
      previewGameData, setPreviewGameData,
      user, setUser,
      searchMenu, setSearchMenu,
      loginMenu, setLoginMenu,
      registerMenu, setRegisterMenu,
      profileMenu, setProfileMenu,
      listMenu, setListMenu,
      settingsMenu, setSettingsMenu
    }}>
      {children}
    </GameContext.Provider>
  );
}

export default ContextProvider;


