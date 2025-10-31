import { useState, useRef } from "react";
import MenuContainer from "../../../MenuContainer";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Game from "../../../../api/game.js";

export default function GameMenu({ gameData }) {
  const fileInputRef = useRef(null);
  const [game] = useState(new Game(gameData)); // no need to update state
  const [edit, setEdit] = useState(false);
  return (
    <MenuContainer onClose={() => {}}>
      <form className="add_game_form">
        {/* Poster on Left */}
        <div className="add_game_poster_container">
          <img
            src={game.getPosterURL()}
            alt="Poster"
            className="poster_preview"
          />

          <input
            className="file_upload_input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <GameFooter game={game} onFavorite={() => {}} />
        </div>

        <div className="add_game_inputs_container">
          <h2>{game.title}</h2>
          <div className="input_row">
            <input
              name="release"
              placeholder="Release Date"
              value={game.release}
              readOnly
            />
          </div>
          <div className="input_row">
            <input
              name="rating"
              placeholder="Rating (1-10)"
              value={game.rating}
              readOnly
            />
          </div>
          <div className="input_row textarea">
            <textarea
              placeholder="Description"
              className="input_textarea"
              name="description"
              value={game.description}
              readOnly
            />
          </div>

          <div className="add_game_submit_container">
            <button type="submit" className="add_game_submit" disabled>
              Submit
            </button>
          </div>
        </div>
      </form>
    </MenuContainer>
  );
}

function GameFooter({ game, onFavorite }) {
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
        {game?.favorite === 0 ? (
          <FavoriteBorderIcon fontSize="medium" />
        ) : (
          <FavoriteIcon fontSize="medium" />
        )}
      </div>
    </div>
  );
}
