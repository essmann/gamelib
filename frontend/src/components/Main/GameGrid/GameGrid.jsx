import GameCard from "./GameCard";
import AddGameCard from "./AddGameCard";
import ListIcon from '@mui/icons-material/List';
import WindowIcon from '@mui/icons-material/Window';
import { Slider } from "@mui/material";
function GameGrid({ games, search }) {
    if(search){
        search = search.toLowerCase();
        games = games.filter((game)=>game.title?.toLowerCase().startsWith(search));
    }
    return (
        <> 
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
