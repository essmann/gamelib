import { useContext } from "react";
import FloatingActionButtonSize from "../../MUI/FloatingActionButtonSize";
import { GameContext } from "../../../Context/ContextProvider.jsx";

function AddGameCard() {
const {  setSearchMenu } = useContext(GameContext);
  return (
    <div className="game_card game_card_add">
      <FloatingActionButtonSize onClick={() =>{
        setSearchMenu(true);
         console.log("Add game menu opened from addgamecard");
      }} />
      <div className="game_card_title"></div>
    </div>
  );
}


export default AddGameCard;
