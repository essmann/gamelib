export const getGames = async (isLocal) => {
    try {
      const games = await window.api.getGames(isLocal); // Or window.electronAPI.invoke('get-games')
      return games;
    } catch (error) {
      console.error("Failed to get games:", error);
    }
  };

  export default getGames;