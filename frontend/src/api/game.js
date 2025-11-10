class Game {
    constructor(game_object) {
        this.id = game_object?.id || null;
        this.title = game_object.title || '';
        this.release = game_object.release || null;
        this.description = game_object.description || null;
        this.poster = game_object.poster || null; // can be Base64 or Uint8Array
        this.date_added = Date.now().toString();
        this.favorite = game_object.favorite || null;
        this.rating = game_object.rating || null;

        // external game data
        this.genres = game_object.genres || null;
        this.publishers = game_object.publishers || null;
        this.developers = game_object.developers || null;
        this.categories = game_object.categories || null;
    }

    getGenres() {
        if (!this.genres) return '';
        return this.genres.replace(/[\[\]']+/g, '');
    }

    getPosterURL() {
        if (!this.poster) return null;

        // Case 1: Poster is a Base64 string
        if (typeof this.poster === 'string') {
            return `data:image/png;base64,${this.poster}`;
        }

        // Case 2: Poster is a Uint8Array / ArrayBuffer
        if (this.poster instanceof Uint8Array || this.poster instanceof ArrayBuffer) {
            const blob = new Blob([this.poster], { type: 'image/png' });
            return URL.createObjectURL(blob);
        }

        return null;
    }
}

export default Game;
