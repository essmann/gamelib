export const getGames = async (backend) => {
    try {
      const games = await window.api.getGames(backend); // Or window.electronAPI.invoke('get-games')
      return games;
    } catch (error) {
      console.error("Failed to get games:", error);
    }
  };

  export default getGames;