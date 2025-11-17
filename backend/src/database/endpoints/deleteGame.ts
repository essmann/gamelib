import { Request, Response } from "express";
import UserGame from "../models/user/userGame";
import CustomGame from "../models/customGame";
import CustomPoster from "../models/customPoster";
import CustomUserGame from "../models/user/custom_userGame";
import GameResponse from "../models/DTO/game";

async function deleteGame(game: GameResponse, req: Request, res: Response) {
  console.log("📥 deleteGame request received");
  const user = req.session.user;

  if (!user) {
    console.log("❌ Unauthorized: No user session");
    return res.status(401).json({ error: "Not authenticated" });
  }

  console.log(`✅ Authenticated user: ${user.username || user.id}`);

  try {
    if (game.isCustom) {
      // Custom game: delete poster, user link, then custom game
      await CustomPoster.destroy({
        where: { game_id: game.id }
      });
      console.log(`🖼️ Custom poster(s) deleted for game ID: ${game.id}`);

      await CustomUserGame.destroy({
        where: {
          user_id: user.id,
          game_id: game.id
        }
      });
      console.log(`🔗 Custom user-game link deleted for user ${user.id} and game ${game.id}`);

      await CustomGame.destroy({
        where: { id: game.id }
      });
      console.log(`📝 Custom game deleted with ID: ${game.id}`);

    } else {
      // Official/external game: just delete user-game link
      await UserGame.destroy({
        where: {
          user_id: user.id,
          game_id: game.id
        }
      });
      console.log(`🔗 User-game link deleted for user ${user.id} and game ${game.id}`);
    }

    return res.status(200).json({
      success: true,
      message: "Game deleted successfully",
      gameId: game.id
    });

  } catch (error) {
    console.error("❌ Error deleting game:", error);
    return res.status(400).json({
      error: "Failed to delete game",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default deleteGame;
