async function getExternalGames(prefix){
console.log("getExternalGames called with prefix: " + prefix);
    try {
      const games = await window.api.getExternalGames(prefix);
      console.log("External games fetched.");
      return games;
    } catch (error){
      console.error("Failed to fetch external games: ", error);
    }
}

export default getExternalGames;

