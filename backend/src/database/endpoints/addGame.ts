import { Request, Response } from "express";
import UserGame from "../models/user/userGame";
import CustomGame from "../models/customGame";
import CustomPoster from "../models/customPoster";
import GameResponse from "../models/DTO/game";

async function addGame(game : GameResponse, req: Request, res: Response) {
  console.log("📥 addGame request received");
  const user = req.session.user;
  
  if (!user) {
    console.log("❌ Unauthorized: No user session");
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  console.log(`✅ Authenticated user: ${user.username || user.id}`);
  
  try {
    
    console.log("📦 Game data received:");
    console.log(`   Title: ${game.title || "N/A"}`);
    console.log(`   Release: ${game.release || "N/A"}`);
    console.log(`   Custom: ${game.isCustom ? "Yes" : "No"}`);
    console.log(`   Poster: ${game.poster ? `Base64 (${game.poster.length} chars)` : "None"}`);
    console.log(`   Genres: ${game.genres || "N/A"}`);
    
    if (game.isCustom) {
      // Remove poster and isCustom from game before creating CustomGame
      const { poster, isCustom, ...gameData } = game;
      
      const customGame = await CustomGame.create({
        user_id: user.id,
        ...gameData,
      });
      
      console.log(`📝 Custom game created with ID: ${customGame.dataValues.id}`);
      
      if (poster) {
        const posterEntry = await CustomPoster.create({
          poster: poster,
          game_id: customGame.dataValues.id,
        });
        console.log(`🖼️ Poster created with ID: ${posterEntry.dataValues.poster_id}`);
      }
      
      // Create UserGame link
      await UserGame.create({
        user_id: user.id,
        custom_game_id: cust.id,
        favorite: game.favorite || false,
        rating: game.rating || null,
      });
      
      console.log("✅ Game added successfully");
      return res.status(200).json({
        success: true,
        message: "Game added successfully",
        gameId: cust.id,
      });
      
    } else {
      // External game
      await UserGame.create({
        user_id: user.id,
        game_id: game.id,
        favorite: game.favorite || false,
        rating: game.rating || null,
      });
      
      console.log("✅ Game added successfully");
      return res.status(200).json({
        success: true,
        message: "Game added successfully",
        gameId: game.id,
      });
    }
    
  } catch (error) {
    console.error("❌ Error processing game data:", error);
    console.error("❌ Error details:", error instanceof Error ? error.message : error);
    return res.status(400).json({ 
      error: "Invalid game data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default addGame;