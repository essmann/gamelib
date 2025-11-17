// import UserGame from "../models/user/userGame";
// import GameResponse from "../models/DTO/game";
// import CustomGame from "../models/customGame";
// import CustomPoster from "../models/customPoster";
// import db from "../connection.js";
// async function updateGame(game: GameResponse, userId: any) {
//   if (game.isCustom) {
//     // Update UserGame
//     await db.query(
//       `
//         UPDATE UserGames
//         SET
//             custom_game_id = :id,
//             isCustom = 1,
//             rating = :rating,
//             favorite = :favorite
//         WHERE user_id = :userId
//           AND custom_game_id = :id
//         `,
//       {
//         replacements: {
//           id: game.id,
//           rating: game.rating,
//           favorite: game.favorite,
//           userId: userId,
//         },
//       }
//     );

//     // Update CustomGame
//     await db.query(
//       `
//         UPDATE CustomGames
//         SET
//             title = :title,
//             release = :release,
//             description = :description,
//             poster = :poster,
//             genres = :genres,
//             developers = :developers,
//             publishers = :publishers,
//             categories = :categories
//         WHERE id = :id
//         `,
//       {
//         replacements: {
//           id: game.id,
//           title: game.title,
//           release: game.release,
//           description: game.description,
//           poster: game.poster,
//           genres: game.genres,
//           developers: game.developers,
//           publishers: game.publishers,
//           categories: game.categories,
//         },
//       }
//     );
//     await db.query(`
//         UPDATE custom_posters
//         SET
//             poster = :poster,
//             game_id = :game_id
//         WHERE game_id = :game_id
//         `,
//     {
//         replacements: {
//             game_id: game.
//         }
//     })
//   }
// }
