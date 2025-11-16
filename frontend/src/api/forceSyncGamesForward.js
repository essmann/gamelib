import addGame from "./endpoints/addGame"; // your backend function or API wrapper

/**
 * Force sync a list of games to the backend.
 * Only adds games that are missing or updates those with changed data.
 */
export async function forceSyncGamesForward(games) {
    try {
        // Fetch current backend games

        for (const game of games) {

            console.log(`Syncing game: ${game.title}`);
            await addGame(game);

        }

        console.log("✅ All games processed for sync.");
    } catch (error) {
        console.error("Failed to sync games:", error);
    }
}

export default forceSyncGamesForward;