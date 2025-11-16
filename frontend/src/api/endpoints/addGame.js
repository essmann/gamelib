export const addGame = async (game, backend = false) => {
  console.log("Adding game:", game);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  try {
    if (!backend) {
      // Local-first
      const added = await window.api.addGame(game);
      console.log("Added locally.");
      return added;
    }
  } catch (err) {
    console.warn("Local add failed, falling back to backend…", err);
  }
  
  // Online version
  try {
    let body;
    let gameToSend = { ...game };
    
    // Convert poster to base64 if it's not already a string
    if (game.poster && typeof game.poster !== 'string') {
      gameToSend.poster = game.getPosterAsBase64 
        ? game.getPosterAsBase64() 
        : (typeof game.poster.getPosterAsBase64 === 'function' 
            ? game.poster.getPosterAsBase64() 
            : game.poster);
    }
    
    body = JSON.stringify(gameToSend);
    
    const res = await fetch(`${BACKEND_URL}/addGame`, {  // Fixed: was template literal
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body,
    });
    
    if (!res.ok) throw new Error("Backend error");
    console.log("Added online.");
    return await res.json();
  } catch (err) {
    console.error("Failed online too:", err);
    throw err;
  }
};

export default addGame;