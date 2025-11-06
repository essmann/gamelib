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

const MAX_RATING = 10;

export default function GameMenu({ gameData, onClose, onSave, onDelete }) {
  const fileInputRef = useRef(null);
  const [game, setGame] = useState(() => new Game(gameData));
  const { games, setGames } = useContext(GameContext);
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
      // Store the file for upload when saving
      setGame(prevGame => {
        return new Game({ ...prevGame, newImageFile: file });
      });
      e.target.value = null;
    }
  }, []);

  const handleFavoriteToggle = useCallback(async () => {
    const updatedGame = new Game({ 
      ...game, 
      favorite: game.favorite === 1 ? 0 : 1 
    });
    setGame(updatedGame);
    setGames((prev)=> prev.map(g => g.id === updatedGame.id ? updatedGame : g));
    
    // Save favorite change immediately without entering edit mode
    try {
      await onSave(updatedGame);
    } catch (err) {
      console.error("Error saving favorite:", err);
      // Revert on error
      setGame(game);
    }
  }, [game, onSave]);

  useEffect(()=>{
    const saveGame = async () => {
         await onSave(game);
        setEdit(false);
        setIsSaving(false);
    }
    if(isSaving){
      try{
        saveGame();
      }
      catch(err){
        console.error("Error saving game:", err);
      }
    }
    return;
  },[isSaving])

  const handleSubmit = () => {
    return "";
  }
  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
      if (onDelete) {
        onDelete(game.id);
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

  return (
    <MenuContainer onClose={onClose} clickAwayExceptionClass={"game_card_image"}>
      <div className={`game_menu_wrapper ${edit ? 'edit_mode' : 'view_mode'}`}>
        <form className="game_menu_form" onSubmit={handleSubmit}>
          
          {/* Header with Title and Actions */}
          <div className="game_menu_header">
            {edit ? (
              <input
                type="text"
                name="title"
                value={game.title}
                onChange={handleChange}
                className="game_title_input"
                placeholder="Game Title"
                required
              />
            ) : (
              <h1 className="game_title">{game.title}</h1>
            )}
            
            <ActionButtons
              isEdit={edit}
              isSaving={isSaving}
              onEdit={() => setEdit(true)}
              onSave={() => setIsSaving(true)}
              onDelete={handleDelete}
              onCancel={handleCancel}
            />
          </div>

          {/* Main Content Area */}
          <div className="game_menu_content">
            
            {/* Left Column - Poster */}
            <PosterSection
              game={game}
              edit={edit}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              handleFavoriteToggle={handleFavoriteToggle}
            />

            {/* Right Column - Details */}
            <div className="game_details_section">
              
              {/* Metadata Grid */}
              <div className="game_metadata">
                <MetadataField
                  label="Release Date"
                  name="release"
                  type={edit ? "date" : "text"}
                  value={game.release}
                  edit={edit}
                  onChange={handleChange}
                />
                
                <MetadataField
                  label="Rating"
                  name="rating"
                  type="number"
                  className="rating_input"
                  value={game.rating}
                  edit={edit}
                  onChange={handleChange}
                  min="0"
                  max={MAX_RATING}
                  suffix={`/ ${MAX_RATING}`}
                />
                <MetadataField
                  label="Genres"
                  name="genres"
                  type={edit ? "text" : "text"}
                  value={game?.getGenres() || ""}
                  edit={edit}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="game_description_container">
                <label className="field_label">Description</label>
                <textarea
                  name="description"
                  value={game.description}
                  onChange={handleChange}
                  readOnly={!edit}
                  className={`game_description ${edit ? 'editable' : ''}`}
                  placeholder="Enter game description..."
                />
              </div>

            </div>
          </div>
        </form>
      </div>
    </MenuContainer>
  );
}

function PosterSection({ game, edit, fileInputRef, handleImageChange, handleFavoriteToggle }) {
  const handlePosterClick = () => {
    if (edit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="poster_section">
      <div 
        className={`poster_wrapper ${edit ? 'editable' : ''}`}
        onClick={handlePosterClick}
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
          {game?.favorite === 0 ? (
            <FavoriteBorderIcon className="stat_icon" />
          ) : (
            <FavoriteIcon className="stat_icon favorited" />
          )}
          <span className="stat_label">
            {game?.favorite === 1 ? "Favorited" : "Favorite"}
          </span>
        </button>
      </div>
    </div>
  );
}

function MetadataField({ label, name, type, value, edit, onChange, min, max, suffix, className }) {
  return (
    <div className="metadata_field">
      <label className="field_label" >{label}</label>
      <div className="field_input_wrapper">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          readOnly={!edit}
          min={min}
          max={max}
          className={`field_input ${edit ? 'editable' : ''} ${className || '' }`}
        />
        {suffix && <span className="field_suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function ActionButtons({ isEdit, isSaving, onEdit, onSave, onDelete, onCancel }) {
  if (isEdit) {
    return (
      <div className="action_buttons edit_actions">
        <button
          type="button"
          className="action_btn save_btn"
          disabled={isSaving}
          onClick={onSave}
        >
          <SaveIcon fontSize="small" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="action_btn cancel_btn"
          onClick={onCancel}
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
        onClick={onEdit}
      >
        <EditIcon fontSize="small" />
        Edit 
      </button>
      <button
        type="button"
        className="action_btn delete_btn"
        onClick={onDelete}
      >
        <DeleteIcon fontSize="small" />
        Delete
      </button>
    </div>
  );
}