//response object when fetching a game also used to convert the incoming object to a standardized object.
class GameResponse {
    id : number;
    title : string;
    release : string | null;
    description : string | null;
    poster : Uint8Array | null;
    
    //user data
    rating : number | null;
    favorite : number | null;
    date_added : string | null;

    //external games
    genres: string | null;
    developers: string | null;
    publishers: string | null;
    categories: string | null;


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
        this.categories = game_object.categories;
        
        console.log("Game instantiated");
        console.log("Poster: " + Object.prototype.toString.call(this.poster));

        //
    }


    
}

}
export default GameResponse;