import { useState, useRef, useContext, useEffect, useCallback } from "react";
import MenuContainer from "../../../MenuContainer";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import Game from "../../../../api/game.js";
import addGame from "../../../../api/endpoints/addGame.js";
import { GameContext } from "../../../../Context/ContextProvider.jsx";

const MAX_RATING = 10;

export default function AddGameMenu({ data, onClose }) {
  const fileInputRef = useRef(null);
  const { setAddGameMenu, setGames } = useContext(GameContext);
''
  const [posterFile, setPosterFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [game, setGame] = useState(() => {
    if (typeof data === "object" && data !== null) {
      try {
        // Create a copy without the external ID to ensure autoincrement on save
        const { id, ...gameDataWithoutId } = data;
        return new Game(gameDataWithoutId);
      } catch (err) {
        console.error("Invalid game data passed:", err);
      }
    }
    return new Game({
      id: null,
      title: "",
      description: "",
      release: "",
      poster: null,
      rating: "",
      favorite: 0,
      date_added: null,
      genres: null,
      isCustom: true,
    });
  });

  useEffect(() => {
    if (typeof data === "object" && data !== null && data.poster) {
      setPosterFile(game.getPosterURL());
    }
  }, []);

  const handlePosterClick = () => fileInputRef.current?.click();

  const handlePosterChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    setPosterFile(URL.createObjectURL(file));
    setGame(prev => new Game({ ...prev, poster: bytes }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rating") {
      let num = parseInt(value, 10);
      if (isNaN(num) || num < 0) num = 0;
      if (num > MAX_RATING) num = MAX_RATING;
      setGame(prev => new Game({ ...prev, rating: num }));
    } else {
      setGame(prev => new Game({ ...prev, [name]: value }));
    }
  };

  const handleFavoriteToggle = () => {
    setGame(prev => new Game({ ...prev, favorite: prev.favorite === 1 ? 0 : 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      let newGame = await addGame(game);
      newGame = new Game(newGame);
      setGames(prev => [...prev, newGame]);
      setAddGameMenu(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add game.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => setAddGameMenu(false);

  return (
    <MenuContainer onClose={onClose} clickAwayExceptionClass={"game_card_image"}>
      <div className="game_menu edit_mode">
        <form className="game_menu_form" onSubmit={handleSubmit}>
          <header className="game_menu_header">
            <span className="game_id_display">New Game</span>
            <div className="action_buttons edit_actions">
              <button type="submit" className="action_btn save_btn" disabled={isSaving}>
                <AddIcon fontSize="small" /> {isSaving ? "Adding..." : "Add Game"}
              </button>
              <button type="button" className="action_btn cancel_btn" onClick={handleCancel} disabled={isSaving}>
                <CancelIcon fontSize="small" /> Cancel
              </button>
            </div>
          </header>

          <div className="game_content_grid">
            {/* Poster Column */}
            <div className="poster_column">
              <div className="poster_wrapper editable" onClick={handlePosterClick}>
                {posterFile ? (
                  <>
                    <img src={posterFile} alt="Game Poster" className="poster_image" />
                    <div className="poster_upload_overlay">
                      <CloudUploadIcon fontSize="large" />
                      <span>Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="poster_empty">
                    <CloudUploadIcon fontSize="large" />
                    <span>Click to upload poster</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handlePosterChange} />
              <div className="quick_actions_bar">
                <div className="stat_item rating">
                  <StarIcon className="stat_icon" />
                  <span className="stat_label">{`${game.rating || 0} / ${MAX_RATING}`}</span>
                </div>
                <button type="button" className="stat_item favorite_btn" onClick={handleFavoriteToggle}>
                  {game.favorite === 1 ? <FavoriteIcon className="stat_icon favorited" /> : <FavoriteBorderIcon className="stat_icon" />}
                  <span className="stat_label">{game.favorite === 1 ? "Favorited" : "Favorite"}</span>
                </button>
              </div>
            </div>

            {/* Sidebar / Details */}
            <div className="vertical_sidebar">
              <div className="sidebar_item">
                <label>Title</label>
                <input type="text" name="title" value={game.title} onChange={handleChange} placeholder="Game title..." required />
              </div>
              
             
            </div>
          </div>
        </form>
      </div>
    </MenuContainer>
  );
}
