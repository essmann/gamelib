export const deleteGame = async (game) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const id = game.id;
  console.log("Game you are trying to delete : " + JSON.stringify(id, 2, null));
  try {
    const gameDeleted = await window.api.deleteGame(id);
    console.log("Game Deleted.");
  } catch (error) {
    console.error("Failed to delete game: ", error);
  }

  try {
    let _game = { ...game };
    let body = JSON.stringify(_game);
    const res = await fetch(`${BACKEND_URL}/deleteGame`, {  // Fixed: was template literal
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!res.ok) throw new Error("Backend error");
    console.log("Added online.");
    return await res.json();
  }
  catch (e) {
     console.error("Failed online too:", err);
    throw err;
  }
};

export default deleteGame;