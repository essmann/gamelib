import GameCard from "./GameCard";
import AddGameCard from "./AddGameCard";
function GameGrid({ games }) {
    return (
        <div className="content_page game_grid flex flex-wrap gap-4 p-4 justify-start">
           <AddGameCard/>
            {Array.from(games).map((game, index) => (
                <GameCard key={index} game={game}/>
            ))}
        </div>
    );
}

export default GameGrid;
