const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const addGame = async (game) => {
  console.log("Adding game:", game);

  // Generate ID for custom games if missing
  if (game.isCustom && game.id == null) {
    game.id = Math.floor(Math.random() * 1_000_000);
    console.log("Assigned new custom game ID:", game.id);
  }

  // 1️⃣ Add locally
  await localAdd(game);

  // 2️⃣ Add to backend
  await backendAdd(game);
};

export default addGame;

// --- Local add ---
async function localAdd(game) {
  try {
    await window.api.addGame(game);
    console.log("✅ Added locally.");
  } catch (err) {
    console.warn("⚠️ Local add failed:", err);
  }
}

// --- Backend add ---
async function backendAdd(game) {
  try {
    // Convert poster to Base64 if needed
    const gameToSend = { ...game };
    if (game.poster && typeof game.poster !== "string") {
      gameToSend.poster = game.getPosterAsBase64
        ? game.getPosterAsBase64()
        : (typeof game.poster.getPosterAsBase64 === "function"
          ? game.poster.getPosterAsBase64()
          : game.poster);
    }

    const res = await fetch(`${BACKEND_URL}/addGame`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameToSend),
    });

    if (!res.ok) throw new Error("Backend addGame failed");
    console.log("✅ Added online.");
  } catch (err) {
    console.error("❌ Failed to add game on backend:", err);
  }
};
