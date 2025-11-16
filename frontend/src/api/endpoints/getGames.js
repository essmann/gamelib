import getBackendGames from "./getBackendGames";
export const getGames = async (backend) => {
  if (backend) {
    try {
      let games = await getBackendGames();
      return games;
    } catch (error) {
      console.error("Failed to get games:", error);
    }
  }
  else {
    try {
      const games = await window.api.getGames(backend); // Or window.electronAPI.invoke('get-games')
      return games;
    } catch (error) {
      console.error("Failed to get games:", error);
    }
  }
};

export default getGames;