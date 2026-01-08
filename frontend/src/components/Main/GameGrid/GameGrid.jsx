import GameCard from "./GameCard";
import AddGameCard from "./AddGameCard";
import { useRef } from "react";

function GameGrid({ games, search }) {
    const renderStartRef = useRef(0);

    // mark render start
    renderStartRef.current = performance.now();

    let visibleGames = games;

    if (search) {
        const s = search.toLowerCase();
        visibleGames = visibleGames.filter(game =>
            game.title?.toLowerCase().startsWith(s)
        );
    }

    const cards = visibleGames.map((game, index) => (
        <GameCard key={game.id ?? index} game={game} />
    ));

    // mark render end (still sync)
    const renderEnd = performance.now();

    console.log(
        `[GameGrid] Rendered ${visibleGames.length} games in ${(renderEnd - renderStartRef.current).toFixed(2)} ms`
    );

    return (
        <div className="content_page game_grid flex flex-wrap gap-4 p-4 justify-start">
            <AddGameCard />
            {cards}
        </div>
    );
}

export default GameGrid;
