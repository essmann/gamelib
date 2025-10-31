import { useState, useRef, useContext } from "react";
import MenuContainer from "../../../MenuContainer";
import { GameContext } from "../../../../Context/ContextProvider.jsx";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Game from "../../../../api/game.js";
import addGame from "../../../../api/endpoints/addGame.js";
function AddGameMenu() {
  const { setAddGameMenu, setGames } = useContext(GameContext);
  const [posterFile, setPosterFile] = useState(null); // store actual File
  const [game, setGame] = useState(
    new Game({
      id: null,
      title: "",
      description: "",
      release: "",
      poster: null,
      rating: "",
      favorite: 0,
      date_added: null,
    })
  );

  const fileInputRef = useRef(null);
  const handlePosterClick = () => fileInputRef.current.click();

  const handlePosterChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        let bytes = new Uint8Array(arrayBuffer);
      setPosterFile(file);
      setGame((prev) => new Game({ ...prev, poster: bytes })); // update Game instance
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame((prev) => new Game({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Game instance:", game);
    alert(JSON.stringify(game, null, 2));
    await addGame(game).then(()=>{
      setGames((prev)=>[...prev, game])
    });
    // TODO: convert poster to Uint8Array if sending to backend
  };

  return (
    <MenuContainer
      onClose={() => {
        setAddGameMenu(false);
      }}
    >
      <form className="add_game_form" onSubmit={handleSubmit}>
        {/* Poster on Left */}
        <div className="add_game_poster_container" onClick={handlePosterClick}>
          {posterFile ? (
            <img src={game.getPosterURL()} alt="Poster" className="poster_preview" />
          ) : (
            <div className="add_game_empty_poster">
              <div className="upload_hint">Click to upload image</div>
            </div>
          )}
          <input
            className="file_upload_input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePosterChange}
            style={{ display: "none" }}
          />
          <GameFooter
            game={game}
            onFavorite={() => {
              const newFav = game.favorite === 1 ? 0 : 1;
              setGame((prev) => new Game({ ...prev, favorite: newFav }));
            }}
          />
        </div>

        <div className="add_game_inputs_container">
          <h2>Add New Game</h2>
          <div className="input_row">
            <input
              name="title"
              placeholder="Title"
              value={game.title}
              onChange={handleChange}
            />
            <input
              name="release"
              placeholder="Release Date"
              value={game.release}
              onChange={handleChange}
            />
          </div>
          <div className="input_row">
            <input
              name="rating"
              placeholder="Rating (1-10)"
              value={game.rating}
              onChange={handleChange}
            />
          </div>
          <div className="input_row textarea">
            <textarea
              placeholder="Description"
              className="input_textarea"
              name="description"
              value={game.description}
              onChange={handleChange}
            />
          </div>

          <div className="add_game_submit_container">
            <button type="submit" className="add_game_submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </MenuContainer>
  );
}

export default AddGameMenu;

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
        {game?.favorite === 0 ? (
          <FavoriteBorderIcon fontSize="medium" />
        ) : (
          <FavoriteIcon fontSize="medium" />
        )}
      </div>
    </div>
  );
}

