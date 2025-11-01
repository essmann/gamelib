export const addGame = async (game) => {
  
  console.log("Game you are trying to add : " + JSON.stringify(game, 2, null));
    try {
      const gameAdded = await window.api.addGame(game);
      console.log("Game added.");
      return gameAdded;
    } catch (error){
      console.error("Failed to add game: ", error);
    }
  };

  export default addGame;