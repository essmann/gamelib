import { useState, useRef, useEffect, useCallback } from "react";
import MenuContainer from "../../../MenuContainer";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Game from "../../../../api/game.js";
import { useContext } from "react";
import { GameContext } from "../../../../Context/ContextProvider.jsx";
// --- Constants ---
const MAX_RATING = 10;

/**
 * Main component to display and edit game details.
 * 
 * STRUCTURE CHANGES:
 * - Buttons are now inside GameDetailsSection for better vertical flow
 * - Action buttons appear at the bottom of the inputs container
 * - Maintains two-column layout: poster on left, details+buttons on right
 */
export default function GameMenu({ gameData, onClose, onSave, onDelete }) {
  const fileInputRef = useRef(null);
  const [game, setGame] = useState(() => new Game(gameData));
  const {games, setGames} = useContext(GameContext);
  const [edit, setEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!edit) {
      setGame(new Game(gameData));
    }
  }, [gameData, edit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setGame(prevGame => {
      const updatedProps = { ...prevGame };
      updatedProps[name] = value;
      
      if (name === 'rating') {
          let numValue = parseInt(value, 10);
          if (isNaN(numValue) || numValue < 0) numValue = 0;
          if (numValue > MAX_RATING) numValue = MAX_RATING;
          updatedProps.rating = numValue;
      }
      
      return new Game(updatedProps);
    });
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("New file selected:", file.name);
      e.target.value = null;
    }
  }, []);

  const handleFavoriteToggle = useCallback(() => {
    setGame(prevGame => {
      const isFavorite = prevGame.favorite === 1;
      return new Game({ ...prevGame, favorite: isFavorite ? 0 : 1 });
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!edit || isSaving) return;

    setIsSaving(true);
    console.log("Attempting to save game:", game);

    try {
      if (onSave) {
        onSave(game); 
      }
      setEdit(false);
    } catch (error) {
      console.error("Error saving game:", error);
    } finally {
      setIsSaving(false);
    }
  }, [game, edit, isSaving, onSave]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
      if (onDelete) {
        onDelete(game.id);
        setGames((prev) => prev.filter((_game) => _game.id !== game.id));
        
      }
      onClose();
    }
  }, [game.title, game.id, onDelete, onClose]);

  const handleCancel = useCallback(() => {
    setGame(new Game(gameData));
    setEdit(false);
  }, [gameData]);

  return (
    <MenuContainer onClose={onClose} clickAwayExceptionClass={"game_card_image"}>
      <form className={`add_game_form ${edit ? 'edit_mode' : 'preview_mode'}`} onSubmit={handleSubmit}>

        {/* Poster Section on Left */}
        <GamePosterSection
          game={game}
          edit={edit}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
          handleFavoriteToggle={handleFavoriteToggle}
        />

        {/* Input/Detail Section on Right - NOW INCLUDES BUTTONS */}
        <GameDetailsSection
          game={game}
          edit={edit}
          handleChange={handleChange}
          isSaving={isSaving}
          onEdit={() => setEdit(true)}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />

      </form>
    </MenuContainer>
  );
}

/**
 * Displays the game poster and the footer (rating/favorite).
 */
function GamePosterSection({ game, edit, fileInputRef, handleImageChange, handleFavoriteToggle }) {
  const handlePosterClick = () => {
    if (edit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="add_game_poster_container">
      <div className="poster_image_wrapper" onClick={handlePosterClick}>
        <img
          src={game.getPosterURL()}
          alt={`${game.title} Poster`}
          className={`poster_preview ${edit ? 'editable_poster' : ''}`}
        />
        {edit && (
          <div className="poster_overlay">
            <CloudUploadIcon fontSize="large" />
            <span>Change Poster</span>
          </div>
        )}
      </div>

      <input
        className="file_upload_input"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <GameFooter game={game} onFavorite={handleFavoriteToggle} />
    </div>
  );
}

/**
 * Displays the game's details (title, release, rating, description) and action buttons.
 * 
 * KEY CHANGE: Buttons are now included at the bottom of this component
 */
function GameDetailsSection({ game, edit, handleChange, isSaving, onEdit, onDelete, onCancel }) {
    return (
        <div className={`add_game_inputs_container ${edit ? 'edit' : 'preview'}`}>
            {/* Title */}
            {edit ? (
                <input
                    type="text"
                    name="title"
                    value={game.title}
                    onChange={handleChange}
                    className="title_input"
                    placeholder="Game Title"
                    required
                />
            ) : (
                <h2>{game.title}</h2>
            )}

            {/* Release Date */}
            <div className="input_row release_row">
                <span className="label">Released on</span>
                <input
                    name="release"
                    type={edit ? "date" : "text"}
                    placeholder="Release Date (YYYY-MM-DD)"
                    value={game.release}
                    readOnly={!edit}
                    onChange={handleChange}
                />
            </div>

            {/* Rating */}
            <div className="input_row rating_row">
                <span className="label">Rating</span>
                <input
                    name="rating"
                    type="number"
                    min="0"
                    max={MAX_RATING}
                    placeholder={`Rating (0-${MAX_RATING})`}
                    value={game.rating}
                    readOnly={!edit}
                    onChange={handleChange}
                />
            </div>

            {/* Description */}
            <div className="input_row textarea desc_row">
                <span className="label">Description</span>
                <textarea
                    placeholder="Description"
                    className="input_textarea"
                    name="description"
                    value={game.description}
                    readOnly={!edit}
                    onChange={handleChange}
                />
            </div>

            {/* Action Buttons - NOW AT BOTTOM OF INPUTS CONTAINER */}
            <div className="add_game_submit_container">
                <Buttons
                    isEdit={edit}
                    isSaving={isSaving}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCancel={onCancel}
                />
            </div>
        </div>
    );
}

/**
 * Displays the current rating and favorite icon.
 */
function GameFooter({ game, onFavorite }) {
  return (
    <div className="game_add_footer">
      <div className="game_add_footer_rating">
        <StarIcon fontSize="medium" className="rating_star_icon" />
        <span className="rating_label">{`${game?.rating || 0}/${MAX_RATING}`}</span>
      </div>
      <div
        className="game_footer_favorite"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite();
        }}
        title={game?.favorite === 1 ? "Remove from Favorites" : "Add to Favorites"}
      >
        {game?.favorite === 0 ? (
          <FavoriteBorderIcon fontSize="medium" className="favorite_border_icon" />
        ) : (
          <FavoriteIcon fontSize="medium" className="favorite_icon" />
        )}
      </div>
    </div>
  );
}

/**
 * Displays the action buttons based on the current mode (Preview or Edit).
 */
function Buttons({ isEdit, isSaving, onEdit, onDelete, onCancel }) {
  if (isEdit) {
    return (
      <div className="game_edit_buttons">
        <button
          type="submit"
          className="save_btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : <><SaveIcon fontSize="small" /> Save</>}
        </button>
        <button
          type="button"
          className="cancel_btn"
          onClick={onCancel}
          disabled={isSaving}
        >
          <CancelIcon fontSize="small" /> Cancel
        </button>
      </div>
    );
  } else {
    return (
      <div className="game_preview_buttons">
        <div className="edit_btn" onClick={onEdit} role="button" tabIndex="0">
          <EditIcon fontSize="small" /> Edit
        </div>
        <div className="delete_btn" onClick={onDelete} role="button" tabIndex="0">
          <DeleteIcon fontSize="small" /> Delete
        </div>
      </div>
    );
  }
}