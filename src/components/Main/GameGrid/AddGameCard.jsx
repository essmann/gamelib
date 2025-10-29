import { useContext } from "react";
import FloatingActionButtonSize from "../../MUI/FloatingActionButtonSize";
import { GameContext } from '../../../Context/ContextProvider.jsx'

function AddGameCard() {
const {menu, setMenu} = useContext(GameContext);
  return (
    <div className="game_card game_card_add">
      <FloatingActionButtonSize onClick={()=>{
        setMenu((prev)=>!prev);
      }} />
      <div className="game_card_title"></div>
    </div>
  );
}

export default AddGameCard;
