const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const updateGame = async (game) => {
  console.log("Updating game:", game);

  // 1️⃣ Update locally
  await localUpdate(game);

  // 2️⃣ Update on backend
  // await backendUpdate(game);
};

export default updateGame;

// --- Local update ---
async function localUpdate(game) {
  try {
    let gameToSend = prepareGameForBackend(game);
    await window.api.updateGame(gameToSend);
    console.log("✅ Updated locally.");
  } catch (err) {
    console.warn("⚠️ Local update failed:", err);
  }
}

// --- Backend update ---
async function backendUpdate(game) {
  try {
    let gameToSend = prepareGameForBackend(game);

    const res = await fetch(`${BACKEND_URL}/updateGame`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameToSend),
    });

    if (!res.ok) throw new Error("Backend update failed");
    console.log("✅ Updated on backend.");
  } catch (err) {
    console.error("❌ Failed to update game on backend:", err);
  }
}

// --- Helper: prepare poster ---
function prepareGameForBackend(game) {
  const gameCopy = { ...game };
  if (gameCopy.poster && typeof gameCopy.poster !== "string") {
    gameCopy.poster = gameCopy.getPosterAsBase64
      ? gameCopy.getPosterAsBase64()
      : (typeof gameCopy.poster.getPosterAsBase64 === "function"
        ? gameCopy.poster.getPosterAsBase64()
        : gameCopy.poster);
  }
  return gameCopy;
}
