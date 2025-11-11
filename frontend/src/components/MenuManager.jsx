import AddGameMenu from "./Main/GameGrid/Menu/AddGameMenu";
import { GameContext } from "../Context/ContextProvider";
import { useContext, useEffect } from "react";
import SearchMenu from "./Main/GameGrid/Menu/SearchMenu";
import GameMenu from "./Main/GameGrid/Menu/GameMenu";
import deleteGame from "../api/endpoints/deleteGame";
import updateGame from "../api/endpoints/updateGame";
import LoginMenu from "./LoginMenu";
import RegisterMenu from "./RegisterMenu";
function MenuManager() {
  const {
    previewGameData,
    setPreviewGameData,
    addGameMenu,
    searchMenu,
    setSearchMenu,
  } = useContext(GameContext);
  const handleCloseGameMenu = () => {
    setPreviewGameData(null);
  };
 
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
      <LoginMenu/>
    </>
  );
}

export default MenuManager;
