import { useState, useRef, useEffect, useCallback, useContext } from "react";
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
import { GameContext } from "../../../../Context/ContextProvider.jsx";
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const MAX_RATING = 10;

export default function GameMenu({ gameData, onClose, onSave, onDelete }) {
  const fileInputRef = useRef(null);
  const [game, setGame] = useState(() => new Game(gameData));
  const { setGames } = useContext(GameContext);
  const [edit, setEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when gameData changes or exiting edit mode
  useEffect(() => {
    if (!edit) {
      setGame(new Game(gameData));
    }
  }, [gameData, edit]);

  // --- Core Handlers ---

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setGame(prevGame => {
      const updatedProps = { ...prevGame };
      updatedProps[name] = value;

      if (name === 'rating') {
        // Allow floating point numbers (real numbers)
        let numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) numValue = 0;
        if (numValue > MAX_RATING) numValue = MAX_RATING;
        updatedProps.rating = numValue;
      }

      // CRITICAL: Always return a new Game instance to preserve class methods
      return new Game(updatedProps);
    });
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setGame(prevGame => new Game({ ...prevGame, newImageFile: file }));
      e.target.value = null;
    }
  }, []);

  const handleFavoriteToggle = useCallback(async () => {
    // Create the updated state first
    const updatedGame = new Game({
      ...game,
      favorite: game.favorite === 1 ? 0 : 1
    });

    // Update local state and context immediately
    setGame(updatedGame);
    setGames((prev) => prev.map(g => g.id === updatedGame.id ? updatedGame : g));

    // Save change immediately
    try {
      await onSave(updatedGame);
    } catch (err) {
      console.error("Error saving favorite:", err);
      // Revert state on save failure
      setGame(game);
      setGames((prev) => prev.map(g => g.id === game.id ? game : g));
    }
  }, [game, onSave, setGames]);

  // FIX: Consolidated saving logic into handleSubmit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSaving || !edit) return; // Only allow save if in edit mode and not already saving

    setIsSaving(true);

    try {
      await onSave(game);
      setEdit(false);
    } catch (err) {
      console.error("Error saving game:", err);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, game, onSave, edit]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
      if (onDelete) {
        onDelete(game);
        setGames((prev) => prev.filter((_game) => _game.id !== game.id));
      }
      onClose();
    }
  }, [game.title, game.id, onDelete, onClose, setGames]);

  const handleCancel = useCallback(() => {
    setGame(new Game(gameData));
    setEdit(false);
    setIsSaving(false);
  }, [gameData]);

  // --- Render Sub-Components (Simplified and Inlined Logic) ---

  const ActionButtons = () => {
    if (edit) {
      return (
        <div className="action_buttons edit_actions">
          <button
            type="submit" // Triggers form submit (handleSubmit)
            className="action_btn save_btn"
            disabled={isSaving}
          >
            <SaveIcon fontSize="small" />
            {isSaving ? 'Saving...' : 'Save'}
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
      );
    }

    return (
      <div className="action_buttons view_actions">
        <button
          type="button"
          className="action_btn edit_btn"
          onClick={() => setEdit(true)}
        >
          <EditIcon fontSize="small" />
          Edit
        </button>
        <button
          type="button"
          className="action_btn delete_btn"
          onClick={handleDelete}
        >
          <DeleteIcon fontSize="small" />
          Delete
        </button>
      </div>
    );
  };

  // const MetadataField = ({ label, name, type, value, min, max, suffix, className, readOnly = false }) => {
  //   return (
  //     <div className="metadata_field">
  //       <label className="field_label" htmlFor={name}>{label}</label>
  //       <div className="field_input_wrapper">
  //         <input
  //           id={name}
  //           name={name}
  //           type={type}
  //           value={String(value || '')}
  //           onChange={handleChange}
  //           readOnly={!edit || readOnly} // readOnly combines with !edit
  //           min={min}
  //           max={max}
  //           className={`field_input ${edit ? 'editable' : ''} ${className || ''}`}
  //           step={name === 'rating' ? "0.1" : undefined}
  //         />
  //         {suffix && <span className="field_suffix">{suffix}</span>}
  //       </div>
  //     </div>
  //   );
  // };

  // --- Main Render ---

  const menuClassName = edit ? 'edit_mode' : 'view_mode';

  return (
    <MenuContainer onClose={onClose} clickAwayExceptionClass={"game_card_image"}>
      <div className={`game_menu ${menuClassName}`}>
        <form className="game_menu_form" onSubmit={handleSubmit}>

          {/* TOP BAR / ID Display */}
          <header className="game_menu_header">
            <span className="game_id_display">ID: {game.id}</span>
            <ActionButtons />
          </header>

          <div className="game_content_grid">

            {/* Left Column: Poster, Rating, Favorite */}
            <div className="poster_column">
              <div
                className={`poster_wrapper ${edit ? 'editable' : ''}`}
                onClick={() => edit && fileInputRef.current?.click()}
              >
                <img
                  src={game.getPosterURL()}
                  alt={`${game.title} Poster`}
                  className="poster_image"
                />
                {edit && (
                  <div className="poster_upload_overlay">
                    <CloudUploadIcon fontSize="large" />
                    <span>Change Image</span>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <div className="quick_actions_bar">
                <div className="stat_item rating">
                  <StarIcon className="stat_icon star_icon" />
                  {/* <span className="stat_value">{game?.rating || 0}</span> */}
                  <span className="stat_label"> {`${game?.rating || 0}`}/ {MAX_RATING}</span>
                </div>

                <button
                  type="button"
                  className="stat_item favorite_btn"
                  onClick={handleFavoriteToggle}
                  title={game?.favorite === 1 ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {game?.favorite === 1 ? (
                    <FavoriteIcon className="stat_icon favorited" />
                  ) : (
                    <FavoriteBorderIcon className="stat_icon" />
                  )}
                  <span className="stat_label">
                    {game?.favorite === 1 ? "Favorited" : "Favorite"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Title, Details, Description */}
            {/* Vertical Sidebar */}
            <div className="vertical_sidebar">


              <div className="sidebar_item flex">

                <div className="item_side">
                  <AddIcon className="sidebar_icon" />
                  <span className="sidebar_label">Add to List</span>
                </div>


              </div>
              
              <div className="sidebar_item flex">

                <div className="item_side">
                  <StarIcon className="sidebar_icon" />
                  <span className="sidebar_label">Rate</span>
                </div>


              </div>
              
              <div className="sidebar_item flex">

                <div className="item_side">
                  <AddPhotoAlternateIcon className="sidebar_icon" />
                  <span className="sidebar_label">Change poster</span>
                </div>


              </div>
              <div className="sidebar_information">

                <div className="item_side">
                  <span className="sidebar_label">Added at {game.getDate()}</span>
                </div>

              </div>

            </div>


          </div>
        </form>
      </div>
    </MenuContainer>
  );
}