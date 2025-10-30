import { useEffect } from "react";
import Game from "../../../api/game";
function GameCard({ game }) {
  useEffect(()=>{

      game.getPosterURL();
  },[])
  return (
    <>
      <div className="game_card ">
        <img className="game_card_image" src={game.getPosterURL() || ""} alt={game.title} />
        <div className="title_overlay">{game.title}</div>
        <GameFooter game={game} />
      </div>
    </>
  );
}

export default GameCard;

function GameFooter({ game }) {
  return <div className="game_footer"></div>;
}
