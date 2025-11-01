export const deleteGame = async (id) => {
  
  console.log("Game you are trying to delete : " + JSON.stringify(id, 2, null));
    try {
      const gameDeleted = await window.api.deleteGame(id);
      console.log("Game Deleted.");
      return gameDeleted;
    } catch (error){
      console.error("Failed to delete game: ", error);
    }
  };

  export default deleteGame;