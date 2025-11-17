export const updateGame = async (game) => {
  console.log("Game you are trying to update:", JSON.stringify(game, null, 2));

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  let localResult = null;
  let backendResult = null;

  // Convert poster to Base64 if it's not already a string
  let gameToSend = { ...game };
  if (game.poster && typeof game.poster !== "string") {
    gameToSend.poster = game.getPosterAsBase64
      ? game.getPosterAsBase64()
      : (typeof game.poster.getPosterAsBase64 === "function"
        ? game.poster.getPosterAsBase64()
        : game.poster);
  }

  // 1️⃣ Update locally
  try {
    localResult = await window.api.updateGame(gameToSend);
    console.log("✅ Updated locally.");
  } catch (err) {
    console.warn("⚠️ Local update failed:", err);
  }

  // 2️⃣ Always update backend
  try {
    const res = await fetch(`${BACKEND_URL}/updateGame`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameToSend),
    });

    if (!res.ok) throw new Error("Backend update failed");

    backendResult = await res.json();
    console.log("✅ Updated on backend.");
  } catch (err) {
    console.error("❌ Failed to update game on backend:", err);
  }

  return { localResult, backendResult };
};

export default updateGame;
