import GameCard from "./GameCard";
import AddGameCard from "./AddGameCard";
import ListIcon from '@mui/icons-material/List';
import WindowIcon from '@mui/icons-material/Window';
function GameGrid({ games }) {
    
    return (
        <> <div className="main_content_header">
            <span className="list_view"><ListIcon fontSize="large"/></span>
            <span className=""><WindowIcon fontSize="medium"/></span>
        </div>
        <div className="content_page game_grid flex flex-wrap gap-4 p-4 justify-start">
           <AddGameCard/>
            {games.map((game, index) => (
                <GameCard key={index} game={game}/>
            ))}
            
        </div>
        </>
    );
}

export default GameGrid;
