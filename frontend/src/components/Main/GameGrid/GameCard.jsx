import { useEffect } from "react";
import Game from "../../../api/game";
import { GameContext } from "../../../Context/ContextProvider";
import { useContext } from "react";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
function GameCard({ game }) {
  const { previewGameData, setPreviewGameData, setGames } = useContext(GameContext);
  useEffect(() => {
    game.getPosterURL();
    // console.log("GameCard mounted or game changed." + game.title + game.favorite);
  }, []);

  const onClick = () => {
    setPreviewGameData(game);
    // console.log("Clicked game card. Updating..");
  };
  // const toggleFavorite = () => {
  //   game.favorite = game.favorite == 1 ? 0 : 1;
  //   game.updateGameData({ favorite: game.favorite });
  //   setGames((prevGames) =>
  //     prevGames.map((g) => (g.id === game.id ? { ...g, favorite: game.favorite } : g))
  //   );
  //   console.log("Toggled favorite for " + game.title + " to " + game.favorite);
  // }
  return (
    <>
      <div className="game_card " onClick={onClick}>
        <img
          className="game_card_image"
          src={game.getPosterURL() || ""}
          alt={game.title}
        />
        <div className="title_overlay">{game.title}</div>
        <GameFooter game={game} />
      </div>
    </>
  );
}

export default GameCard;
export function GameFooter({ game, onFavorite }) {
  return (
    <div className="game_add_footer">
      <div className="game_add_footer_rating">
        <StarIcon fontSize="medium" />
        <span className="rating_label">{`${game?.rating || 0}/10`}</span>
      </div>
      <div
        className="game_footer_favorite"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite();
        }}
      >
        {game?.favorite == 0 ? (
          <FavoriteBorderIcon fontSize="medium" />
        ) : (
          <FavoriteIcon fontSize="medium" />
        )}
      </div>
    </div>
  );
}
// function GameFooter({ game }) {
//   return <div className="game_footer"></div>;
// }
