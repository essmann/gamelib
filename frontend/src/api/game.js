class Game{
    
    constructor(game_object){
        this.id = game_object?.id || null;
        this.title = game_object.title;
        this.release = game_object.release;
        this.description = game_object.description;
        this.poster = game_object.poster;
        this.date_added = Date.now().toString();
        this.favorite = game_object.favorite;
        this.rating = game_object.rating;
        //data for external games only
        this.genres = game_object.genres || null;
        this.publisher = game_object.publisher || null;
        this.developer = game_object.developer || null;
        this.platforms = game_object.platforms || null;

    }

   getPosterURL() {
    if(this.poster == null){return;}
    if (this.poster instanceof Uint8Array) {
        const blob = new Blob([this.poster], { type: 'image/png' });
        return URL.createObjectURL(blob);
    }
    return URL.createObjectURL(this.poster);
}


    
}

export default Game;