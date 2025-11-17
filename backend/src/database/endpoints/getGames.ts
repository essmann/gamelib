import CustomGame from "../models/customGame";
import Official_Game from "../models/official_game";
import UserGame from "../models/user/userGame";
import db from "../connection.js";
import { Request, Response } from "express";
import sequelize from "../connection.js";
import { Sequelize, QueryTypes } from "sequelize";
import GameResponse from "../models/DTO/game";
async function getGames(req: Request, res: Response) {
  console.log("Get games called");

  let user_id = req?.session?.user?.id ||  1;
  const t1 = Date.now();

  //   const games = await UserGame.findAll({
  //     where: { user_id: user_id },
  //   });

  const games = await sequelize.query(
    `
SELECT
    ug.id AS id,
    ug.user_id,
   
    ug.favorite,
    ug.rating,
    ug.date_added,
    
    COALESCE(og.title, cg.title) AS title,
    COALESCE(op.poster, cp.poster) AS poster,
    
    -- Corrected to use 'release' column name
    COALESCE(og.release, cg.release) AS release_date,
    
    COALESCE(og.publishers, cg.publishers) AS publishers,
    COALESCE(og.developers, cg.developers) AS developers,
    COALESCE(og.genres, cg.genres) AS genres
FROM official_usergames ug
LEFT JOIN official_games og
    ON ug.game_id = og.id
LEFT JOIN official_posters op
    ON og.id = op.game_id
LEFT JOIN custom_games cg
    ON ug.user_id = cg.user_id
LEFT JOIN custom_posters cp
    ON cg.id = cp.game_id
WHERE ug.user_id = :userId
  AND (ug.game_id IS NOT NULL);

`,
    {
      replacements: { userId: user_id },
      type: QueryTypes.SELECT,
    }
  );

  const time = (Date.now() - t1) / 1000;

  const _games = games.map((g) => {
    return new GameResponse(g);
  });
  console.log(_games);
  console.log("Time taken: " + time + " seconds.");
  console.log(`Fetched ${_games.length} games.`);

  return _games;
}

export default getGames;
