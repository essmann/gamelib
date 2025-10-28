export const addGame = async (game) => {
    try {
      const gameAdded = await window.api.addGame(game);
      console.log("Game added.");
      return gameAdded;
    } catch (error){
      console.error("Failed to add game: ", error);
    }
  };

  export default addGame;