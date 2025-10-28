import GameGrid from "./GameGrid/GameGrid.jsx";
import dummyGames from "../../test_data/dummyGames.jsx";

function MainContent({games, setGames}){
    return (
        <div className="main_content">
            <GameGrid games={games} setGames={setGames}/>     
        </div>   
    )
}

export default MainContent;