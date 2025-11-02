import AddGameMenu from "./Main/GameGrid/Menu/AddGameMenu";
import { GameContext } from "../Context/ContextProvider";
import { useContext } from "react";
import SearchMenu from "./Main/GameGrid/Menu/SearchMenu";
import GameMenu from "./Main/GameGrid/Menu/GameMenu";
import deleteGame from "../api/endpoints/deleteGame";

function MenuManager() {
  const {
    previewGameData,
    setPreviewGameData,
    addGameMenu,
    games,
    setGames,
    searchMenu,
    setSearchMenu,
  } = useContext(GameContext);
  const handleCloseGameMenu = () => {
    setPreviewGameData(null);
  };

  return (
    <>
      {addGameMenu && <AddGameMenu />}
      {previewGameData && (
        <GameMenu
          gameData={previewGameData}
          onDelete={deleteGame}
          onClose={handleCloseGameMenu}
        />
      )}
      {!searchMenu && (
        <SearchMenu
          onClose={() => {
            setSearchMenu(false);
          }}
        />
      )}
    </>
  );
}

export default MenuManager;
