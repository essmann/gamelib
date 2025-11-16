class GameResponse {
    id: number;
    title: string;
    release: string | null;
    description: string | null;
    isCustom: boolean | null;
    poster: string | null; // now as base64 string
    
    // user data
    rating: number | null;
    favorite: number | null;
    date_added: string | null;

    // external games
    genres: string | null;
    developers: string | null;
    publishers: string | null;
    categories: string | null;


    constructor(game_object: any) {
        this.id = game_object.id;
        this.title = game_object.title;
        this.release = game_object.release ?? null;
        this.description = game_object.description ?? null;

        // Convert poster buffer to base64 if it exists
        this.poster = game_object.poster ? this.convertToBase64(game_object.poster) : null;

        this.rating = game_object.rating != null ? parseFloat(game_object.rating) : null;
        this.favorite = game_object.favorite ?? null;
        this.date_added = game_object.date_added ?? null;

        this.genres = game_object.genres ?? null;
        this.developers = game_object.developers ?? null;
        this.publishers = game_object.publishers ?? null;
        this.categories = game_object.categories ?? null;
        this.isCustom = game_object.custom ?? false;

        console.log("Game instantiated");
        console.log("Poster type:", Object.prototype.toString.call(this.poster));
    }

    private convertToBase64(poster: Buffer): string {
        return poster.toString("base64");
    }
}

export default GameResponse;
