import { Request, Response } from "express";
import UserGame from "../models/user/userGame";
import CustomGame from "../models/customGame";
import CustomPoster from "../models/customPoster";
import CustomUserGame from "../models/user/custom_userGame";
import GameResponse from "../models/DTO/game";

async function updateGame(game: GameResponse, req: Request, res: Response) {
  console.log("📥 updateGame request received");
  const user = req.session.user;

  if (!user) {
    console.log("❌ Unauthorized: No user session");
    return res.status(401).json({ error: "Not authenticated" });
  }

  console.log(`✅ Authenticated user: ${user.username || user.id}`);

  try {
    if (game.isCustom) {
      // Update the custom game itself
      await CustomGame.update(
        {
          title: game.title,
          release: game.release,
          description: game.description,
          genres: game.genres,
          developers: game.developers,
          publishers: game.publishers,
          categories: game.categories,
        },
        { where: { id: game.id } }
      );
      console.log(`📝 Custom game updated: ID ${game.id}`);

      // Update the poster if provided
      if (game.poster) {
        await CustomPoster.upsert({
          game_id: game.id,
          poster: game.poster,
        });
        console.log(`🖼️ Poster updated for game ID: ${game.id}`);
      }

      // Update the user-game link (favorite/rating)
      await CustomUserGame.update(
        {
          favorite: game.favorite ?? false,
          rating: game.rating ?? null,
        },
        {
          where: {
            user_id: user.id,
            game_id: game.id,
          },
        }
      );
      console.log("🔗 User-game link updated for custom game.");

    } else {
      // Official/external game: update user-game link
      await UserGame.update(
        {
          favorite: game.favorite ?? false,
          rating: game.rating ?? null,
        },
        {
          where: {
            user_id: user.id,
            game_id: game.id,
          },
        }
      );
      console.log("🔗 User-game link updated for official game.");
    }

    return res.status(200).json({
      success: true,
      message: "Game updated successfully",
      gameId: game.id,
    });

  } catch (error) {
    console.error("❌ Error updating game:", error);
    return res.status(400).json({
      error: "Failed to update game",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default updateGame;
