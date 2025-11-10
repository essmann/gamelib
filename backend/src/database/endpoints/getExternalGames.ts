import { Op, Sequelize } from "sequelize";
import GameResponse from "../models/DTO/gameResponse";
import { Request, Response } from "express";
import Game from "../models/game";
import Poster from "../models/poster";
import db from "../connection.js";
async function getExternalGames(
  req: Request,
  res: Response
): Promise<GameResponse[] | void> {
  let search = req.query.search || null;
  if (search == null) {
    return;
  }

  const [results] = await db.query(
    `SELECT games.*, posters.poster 
     FROM games
     LEFT JOIN posters ON games.id = posters.game_id
     WHERE games.title LIKE ?`,
    {
      replacements: [`${search}%`], // safe user input
    }
  );

  console.log(results);
  console.log("externalGames called with search: " + search);
  // Map results to DTO
  const gamesArray = results.map((row: any) => new GameResponse(row));

  return gamesArray;
}

export default getExternalGames;
