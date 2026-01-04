async function getExternalGameById(id) {
  console.log("getExternalGameById called with id:", id);
  try {
    let game = await window.api.getExternalGameById(id);
    console.log("game response from backend:", game);

    if (typeof game === "string") {
      game = JSON.parse(game);
    }

    if (!game) {
      console.warn("Game not found for id:", id);
      return null;
    }

    console.log("External game fetched successfully.");
    return game;
  } catch (error) {
    console.error("Failed to fetch external game by id:", error.message, error);
    return null;
  }
}

export default getExternalGameById;
