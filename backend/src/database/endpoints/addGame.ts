import { Request, Response } from "express";
import Game from "../models/official_game.js";
import UserGame from "../models/user/userGame.js";

/**
 * Adds a game to a user's collection.
 * Expects `req.session.user` to be set and `req.body.gameId`.
 */
export default async function addGame(req: Request, res: Response) {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { gameId } = req.body;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId in request body" });
  }

  try {
    // Check if the game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Check if the user already has this game
    const existing = await UserGame.findOne({
      where: { user_id: user.id, game_id: gameId },
    });

    if (existing) {
      return res.status(409).json({ message: "Game already added" });
    }

    // Add the game for this user
    await UserGame.create({
      user_id: user.id,
      game_id: gameId,
    });

    return res.json({ message: "Game added successfully" });
  } catch (err) {
    console.error("Error adding game:", err);
    return res.status(500).json({ error: "Failed to add game" });
  }
}
