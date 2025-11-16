export const getBackendGames = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", BACKEND_URL);

  try {
    const response = await fetch(`${BACKEND_URL}/myGames`, {
      method: "GET",           // optional, but explicit
      credentials: "include",  // send cookies for session
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.statusText}`);
    }

    const games = await response.json();
    return games;
  } catch (error) {
    console.error("Failed to get games:", error);
    return []; // fallback
  }
};

export default getBackendGames;
