import GameGrid from "./GameGrid/GameGrid.jsx";
import dummyGames from "../../test_data/dummyGames.jsx";

function MainContent(){
    return (
        <div className="main_content">
            <GameGrid games={dummyGames}/>     
        </div>   
    )
}

export default MainContent;