async function getExternalGames(prefix) {
  console.log("getExternalGames called with prefix:", prefix);
  try {
    let games = await window.api.getExternalGames(prefix);
    console.log("game response from backend:", games?.length || 0, "games");

    if (typeof games === "string") {
      games = JSON.parse(games);
    }

    // Ensure we return an array, not an object
    if (!Array.isArray(games)) {
      console.warn("Expected array, got:", typeof games);
      games = [];
    }

    console.log("External games fetched.");
    return games;
  } catch (error) {
    console.error("Failed to fetch external games:", error.message, error);
    return []; // Return empty array instead of undefined
  }
}

export default getExternalGames;
