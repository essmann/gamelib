export const addGame = async (game, backend=false) => {

  console.log("Game you are trying to add : " + JSON.stringify(game, 2, null));
  if (!backend) {
    try {
      const gameAdded = await window.api.addGame(game);
      console.log("Game added.");
      return gameAdded;
    } catch (error) {
      console.error("Failed to add game: ", error);
      return;
    }
  }

  try {

  }
  catch (error) {

    await fetch(`${BACKEND_URL}/addGame`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(game),
    });
  }
};

export default addGame;