import { Op } from "sequelize";
import GameResponse from "../models/DTO/gameResponse";
import { Request, Response } from "express";
import Game from "../models/game";
async function getExternalGames(req: Request, res: Response) : Promise<GameResponse[] | void>  {
  let search = req.query.search || null;
  if (search == null) {
    return;
  }
  console.log("externalGames called with search: " + search);
  let games = await Game.findAll({
    where: {
      title: {
        [Op.like]: `%${search}%`,
      },
    },
  });

  let gamesArray: GameResponse[] = [];
  games.forEach((row) => {
    gamesArray.push(new GameResponse(row));
  });
  return gamesArray;
//   res.setHeader("Content-Type", "application/json");
//   res.end(JSON.stringify(gamesArray, null, 2));
}

export default getExternalGames;
