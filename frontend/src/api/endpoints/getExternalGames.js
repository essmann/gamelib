async function getExternalGames(prefix) {
  console.log("getExternalGames called with prefix:", prefix);
  try {
    let games = await window.api.getExternalGames(prefix);
    console.log("game response from backend:", games);

    if (typeof games === "string") {
      games = JSON.parse(games);
    }

    console.log("External games fetched.");
    return games;
  } catch (error) {
    console.error("Failed to fetch external games:", error.message, error);
  }
}

export default getExternalGames;
