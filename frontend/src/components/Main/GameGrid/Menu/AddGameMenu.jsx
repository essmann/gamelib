import { useState, useRef, useContext, useEffect } from "react";
import MenuContainer from "../../../MenuContainer";
import { GameContext } from "../../../../Context/ContextProvider.jsx";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import Game from "../../../../api/game.js";
import addGame from "../../../../api/endpoints/addGame.js";

const MAX_RATING = 10;

function AddGameMenu({ data, onClose }) {
  const { setAddGameMenu, setGames } = useContext(GameContext);
  const fileInputRef = useRef(null);
  const [posterFile, setPosterFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [game, setGame] = useState(() => {
    if (typeof data === "object" && data !== null) {
      try {
        const externalGame = new Game(data);
        return externalGame;
      } catch (err) {
        console.error("Invalid game data passed to AddGameMenu:", err);
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

  const handlePosterClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePosterChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      let bytes = new Uint8Array(arrayBuffer);
      setPosterFile(URL.createObjectURL(file));
      setGame((prev) => new Game({ ...prev, poster: bytes }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rating') {
      let numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 0) numValue = 0;
      if (numValue > MAX_RATING) numValue = MAX_RATING;
      setGame((prev) => new Game({ ...prev, rating: numValue }));
    } else {
      setGame((prev) => new Game({ ...prev, [name]: value }));
    }
  };

  const handleFavoriteToggle = () => {
    setGame((prev) => {
      const newFav = prev.favorite === 1 ? 0 : 1;
      return new Game({ ...prev, favorite: newFav });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    console.log("Game instance:", game);

    try {
      // await addGame(game);
      //update the local database first.
      // then update online DB.
      await addGame(game);

      setGames((prev) => [...prev, game]);
      setAddGameMenu(false);
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAddGameMenu(false);
  };

  return (
    <MenuContainer
      onClose={() => {
        setAddGameMenu(false);
      }}
    >
      <div className="game_menu_wrapper ">
        <form className="game_menu_form" onSubmit={handleSubmit}>
          
          {/* Header */}
          <div className="game_menu_header">
            <input
              type="text"
              name="title"
              value={game.title}
              onChange={handleChange}
              className="game_title_input"
              placeholder="Enter game title..."
              required
            />
            
            <div className="action_buttons edit_actions">
              <button
                type="submit"
                className="action_btn save_btn"
                disabled={isSaving}
              >
                <AddIcon fontSize="small" />
                {isSaving ? 'Adding...' : 'Add Game'}
              </button>
              <button
                type="button"
                className="action_btn cancel_btn"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <CancelIcon fontSize="small" />
                Cancel
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="game_menu_content">
            
            {/* Poster Section */}
            <PosterSection
              posterFile={posterFile}
              game={game}
              fileInputRef={fileInputRef}
              handlePosterClick={handlePosterClick}
              handlePosterChange={handlePosterChange}
              handleFavoriteToggle={handleFavoriteToggle}
            />

            {/* Details Section */}
            <div className="game_details_section">
              
              {/* Metadata Grid */}
              <div className="game_metadata">
                <div className="metadata_field">
                  <label className="field_label">Release Date</label>
                  <div className="field_input_wrapper">
                    <input
                      name="release"
                      type="date"
                      value={game.release}
                      onChange={handleChange}
                      className="field_input "
                    />
                  </div>
                </div>
                
                <div className="metadata_field">
                  <label className="field_label">Rating</label>
                  <div className="field_input_wrapper">
                    <input
                      name="rating"
                      type="number"
                      min="0"
                      max={MAX_RATING}
                      value={game.rating}
                      onChange={handleChange}
                      className="field_input editable"
                      placeholder="0-10"
                    />
                    <span className="field_suffix">/ {MAX_RATING}</span>
                  </div>
                </div>
                <div className="metadata_field">
                  <label className="field_label">Genres</label>
                  <div className="field_input_wrapper">
                    <input
                      name="genres"
                      type="text"
                      value={game.genres}
                      onChange={handleChange}
                      className="field_input"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="game_description_container">
                <label className="field_label">Description</label>
                <textarea
                  name="description"
                  value={game.description}
                  onChange={handleChange}
                  className="game_description "
                  placeholder="Enter game description..."
                  spellCheck={false}
                />
              </div>

            </div>
          </div>
        </form>
      </div>
    </MenuContainer>
  );
}

export default AddGameMenu;

function PosterSection({ posterFile, game, fileInputRef, handlePosterClick, handlePosterChange, handleFavoriteToggle }) {
  console.log(game.favorite);
  return (
    <div className="poster_section">
      <div 
        className="poster_wrapper editable"
        onClick={handlePosterClick}
      >
        {posterFile ? (
          <>
            <img
              src={posterFile}
              alt="Game Poster"
              className="poster_image"
            />
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

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handlePosterChange}
      />

      <div className="poster_stats">
        <div className="stat_item rating">
          <StarIcon className="stat_icon" />
          <span className="stat_value">{game?.rating || 0}</span>
          <span className="stat_label">/ {MAX_RATING}</span>
        </div>
        
        <button
          type="button"
          className="stat_item favorite"
          onClick={(e) => {
            e.preventDefault();
            handleFavoriteToggle();
          }}
          title={game?.favorite === 1 ? "Remove from Favorites" : "Add to Favorites"}
        >
          {game?.favorite == 1 ? (
            <FavoriteIcon className="stat_icon" />

          ) : (
            <FavoriteBorderIcon className="stat_icon" />
          )}
          <span className="stat_label">
            {game?.favorite === 1 ? "Favorited" : "Favorite"}
          </span>
        </button>
      </div>
    </div>
  );
}