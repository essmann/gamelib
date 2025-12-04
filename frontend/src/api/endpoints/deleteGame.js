const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const deleteGame = async (game) => {
  console.log("Deleting game:", game);

  // 1️⃣ Delete locally
  await localDelete(game);

  // 2️⃣ Delete on backend
  // await backendDelete(game);
};

export default deleteGame;

// --- Local delete ---
async function localDelete(game) {
  try {
    await window.api.deleteGame(game.id);
    console.log("✅ Deleted locally.");
  } catch (err) {
    console.warn("⚠️ Local delete failed:", err);
  }
}

// --- Backend delete ---
async function backendDelete(game) {
  try {
    const body = JSON.stringify(game);

    const res = await fetch(`${BACKEND_URL}/deleteGame`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!res.ok) throw new Error("Backend deleteGame failed");
    console.log("✅ Deleted on backend.");
  } catch (err) {
    console.error("❌ Failed to delete game on backend:", err);
  }
};
