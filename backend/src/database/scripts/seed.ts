import connection from "../connection.js";
import Game from "../models/game.js";
import Poster from "../models/poster.js";
(async () => {
    const game = Game.create({
        id: 4400,
        genres: "test_genre",
        title: "Resident Evil 4"
    })
    console.log(game);
})();