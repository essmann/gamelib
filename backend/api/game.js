//response object when fetching a game also used to convert the incoming object to a standardized object.
class Game {
    constructor(game_object) {
       
        this.id = game_object.id;
        this.title = game_object.title;
        this.release = game_object.release;
        this.description = game_object.description;
        this.poster = game_object.poster;
        this.rating = parseFloat(game_object.rating);
        this.favorite = game_object.favorite;
        this.date_added = game_object.date_added;
        
        console.log("Game instantiated");
        console.log("Poster: " + Object.prototype.toString.call(this.poster));
    }
    
}

class ExternalGame{
    constructor (game_object){
        this.id = game_object.id;
    }
}
module.exports.Game = Game;