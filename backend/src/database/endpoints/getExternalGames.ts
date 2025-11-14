import { Op, Sequelize } from "sequelize";
import GameResponse from "../models/DTO/gameResponse";
import { Request, Response } from "express";
import Game from "../models/official_game";
import Poster from "../models/official_poster";
import db from "../connection.js";
async function getExternalGames(
  req: Request,
  res: Response
): Promise<GameResponse[] | void> {
  const search = req.query.search;
  if (!search) return;

  const results = await Game.findAll({
    where: {
      title: {
        [Op.like]: `${search}%`,
      },
    },
    include: [
      {
        model: Poster,
        attributes: ["poster"], // keep only poster column
        required: false, // LEFT JOIN
      },
    ],
    raw: true, // flattens the result so poster comes as Buffer
    nest: true, // keeps included models nested correctly
  });

  // Map to DTO
  const gamesArray = results.map((row: any) => {
    // row.Poster.poster is a Buffer
    if (row.Poster) {
      row.poster = row.Poster.poster;
    } else {
      row.poster = null;
    }
    delete row.Poster; // optional cleanup
    return new GameResponse(row);
  });

  return gamesArray;
}

export default getExternalGames;