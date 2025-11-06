import GameGrid from "./GameGrid/GameGrid.jsx";
import dummyGames from "../../test_data/dummyGames.jsx";
import WindowIcon from '@mui/icons-material/Window';
import ReorderIcon from '@mui/icons-material/Reorder';
import { useState } from "react";
function MainContent({games, setGames, sidebarIndex}){
    const [selectedHeaderItem, setSelectedHeaderItem] = useState(0);
    return (
        <div className="main_content">
           <div className="main_content_header">
                       <span className="list_view selected"><ReorderIcon fontSize="large"/></span>
                       <span className=""><WindowIcon fontSize="large"/></span>
                   </div>
            {sidebarIndex == 0 && <GameGrid games={games} setGames={setGames}/>}    
            {sidebarIndex == 1 && <GameGrid games={games.filter((game)=>game.favorite)} setGames={setGames}/>}     

        </div>   
    )
}

export default MainContent;