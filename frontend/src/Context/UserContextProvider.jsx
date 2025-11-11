import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(() => {
    const saved = localStorage.getItem("offline");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [gamesSynced, setGamesSynced] = useState(false);

  useEffect(() => {
    localStorage.setItem("offline", JSON.stringify(isOfflineMode));
    console.log("offline localStorage state has been updated: " + isOfflineMode);
  }, [isOfflineMode]);

  useEffect(() => {
    if (isLoggedIn) setIsOfflineMode(false);
  }, [isLoggedIn]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        isOfflineMode,
        setIsOfflineMode,
        gamesSynced,
        setGamesSynced,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
