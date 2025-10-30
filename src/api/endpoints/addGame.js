export const addGame = async (game) => {
  if(game.id == null){
    game.id = Math.random()*1e9;
  }
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