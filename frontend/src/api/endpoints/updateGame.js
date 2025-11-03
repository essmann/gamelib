export const updateGame = async (game) => {
  
  console.log("Game you are trying to update : " + JSON.stringify(game, 2, null));
    try {
      const updatedGame = await window.api.updateGame(game);
      console.log("Game updated.");
      return updatedGame;
    } catch (error){
      console.error("Failed to update game: ", error);
    }
  };

  export default updateGame;