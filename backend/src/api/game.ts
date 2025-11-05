//response object when fetching a game also used to convert the incoming object to a standardized object.
class Game {
    id : string | number;
    title : string;
    release : string;
    description : string;
    poster : Uint8Array
    rating : number;
    favorite : number;
    date_added : string;

    //external games
    genres: string;
    developers: string;
    publishers: string;
    platforms: string;


    constructor(game_object : any){ {
       
        this.id = game_object.id;
        this.title = game_object.title;
        this.release = game_object.release;
        this.description = game_object.description;
        this.poster = game_object.poster;
        this.rating = parseFloat(game_object.rating);
        this.favorite = game_object.favorite;
        this.date_added = game_object.date_added;
        //external games
        this.genres = game_object.genres;
        this.developers = game_object.developers;
        this.publishers = game_object.publishers;
        this.platforms = game_object.platforms;
        
        console.log("Game instantiated");
        console.log("Poster: " + Object.prototype.toString.call(this.poster));

        //
    }


    
}

}
export default Game;