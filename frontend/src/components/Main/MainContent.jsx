import GameGrid from "./GameGrid/GameGrid.jsx";
import dummyGames from "../../test_data/dummyGames.jsx";

function MainContent({games, setGames, sidebarIndex}){
    return (
        <div className="main_content">
            {sidebarIndex == 0 && <GameGrid games={games} setGames={setGames}/>}    
            {sidebarIndex == 1 && <GameGrid games={games.filter((game)=>game.favorite)} setGames={setGames}/>}     

        </div>   
    )
}

export default MainContent;