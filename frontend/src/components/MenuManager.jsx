import AddGameMenu from "./Main/GameGrid/Menu/AddGameMenu";
import { GameContext } from "../Context/ContextProvider";
import { useContext, useEffect } from "react";
import SearchMenu from "./Main/GameGrid/Menu/SearchMenu";
import GameMenu from "./Main/GameGrid/Menu/GameMenu";
import deleteGame from "../api/endpoints/deleteGame";
import updateGame from "../api/endpoints/updateGame";
import LoginMenu from "./LoginMenu";
import RegisterMenu from "./RegisterMenu";
import { UserContext } from "../Context/UserContextProvider";
import ProfileMenu from "./ProfileMenu";
import logout from "../api/endpoints/auth/logout";
function MenuManager() {
  const {
    previewGameData,
    setPreviewGameData,
    addGameMenu,
    searchMenu,
    setSearchMenu,
    loginMenu, setLoginMenu,
    registerMenu, setRegisterMenu,
    profileMenu, setProfileMenu
  } = useContext(GameContext);
  const handleCloseGameMenu = () => {
    setPreviewGameData(null);
  };
  const {user, setUser} = useContext(UserContext);
 
  useEffect(()=>{
    console.log("MenuManager re-rendered");
  })
  return (
    <>
    
      {addGameMenu && <AddGameMenu data={addGameMenu} />}
      {previewGameData && (
        <GameMenu
          gameData={previewGameData}
          onDelete={deleteGame}
          onClose={handleCloseGameMenu}
          onSave={updateGame}
        />
      )}
      {searchMenu && (
        <SearchMenu
          onClose={() => {
            setSearchMenu(false);
          }}
        />
      )}
      {loginMenu && <LoginMenu openRegisterMenu={setRegisterMenu} onClose={()=>{
        setLoginMenu(false);
      }} setUser={setUser} user={user}/>}
      {registerMenu && <RegisterMenu onClose={()=>{
        setRegisterMenu(false);
      }}/>}
      {profileMenu && <ProfileMenu onClose={()=>{
        setProfileMenu(false);
      }}
      user={user}
      setUser={setUser}
      onLogout={logout}
      />}

      
    </>
  );
}

export default MenuManager;
