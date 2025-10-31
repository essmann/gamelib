import { useEffect } from "react";
import Game from "../../../api/game";
import { GameContext } from "../../../Context/ContextProvider";
import { useContext } from "react";
import { GameFooter } from "./Menu/AddGameMenu";
function GameCard({ game }) {
const {previewGameData, setPreviewGameData} = useContext(GameContext);
  useEffect(()=>{

      game.getPosterURL();
  },[])

  const onClick = () => {
    setPreviewGameData(game);
    console.log("Clicked game card. Updating..");
  }
  return (
    <>
      <div className="game_card " onClick={onClick}>
        <img className="game_card_image" src={game.getPosterURL() || ""} alt={game.title} />
        <div className="title_overlay">{game.title}</div>
        <GameFooter game={game} />
      </div>
    </>
  );
}

export default GameCard;

// function GameFooter({ game }) {
//   return <div className="game_footer"></div>;
// }
