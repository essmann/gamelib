import { createContext, useState } from "react";
import { useContext } from "react";
export const UserGameContext = createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);        // current user info
 const [isLoggedIn, setIsLoggedIn] = useState(null);
 const [gamesSynced, setGamesSynced] = useState(null);
  return (
    <UserGameContext.Provider value={{ 
      user, setUser,
      isLoggedIn, setIsLoggedIn,
      gamesSynced, setGamesSynced
      
    }}>
      {children}
    </UserGameContext.Provider>
  );
}

export default UserContextProvider;


