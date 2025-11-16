import { Request, Response } from "express";
import UserGame from "../models/user/userGame";
import CustomGame from "../models/customGame";
async function addGame(req: Request, res: Response) {
  console.log("📥 addGame request received");

  const user = req.session.user;
  if (!user) {
    console.log("❌ Unauthorized: No user session");
    return res.status(401).json({ error: "Not authenticated" });
  }

  console.log(`✅ Authenticated user: ${user.username || user.id}`);

  // Parse game data from JSON body
  try {
    const gameData = req.body;

    console.log("📦 Game data received:");
    console.log(`   Title: ${gameData.title || "N/A"}`);
    console.log(`   Release: ${gameData.release || "N/A"}`);
    console.log(`   Custom: ${gameData.isCustom ? "Yes" : "No"}`);
    console.log(
      `   Poster: ${
        gameData.poster ? `Base64 (${gameData.poster.length} chars)` : "None"
      }`
    );
    console.log(`   Genres: ${gameData.genres || "N/A"}`);

    // TODO: Save gameData to database here

    if (gameData.isCustom) {
      CustomGame.create({
        user_id: user.id,
        ...gameData,
      });
    } else {
    }
    console.log("✅ Game added successfully");
    return res.status(200).json({
      success: true,
      message: "Game added successfully",
      gameData,
    });
  } catch (error) {
    console.error("❌ Error processing game data:", error);
    return res.status(400).json({ error: "Invalid game data" });
  }
}

export default addGame;
