import { useState, useRef, useEffect, useCallback, useContext } from "react";
import MenuContainer from "../../../../MenuContainer.jsx";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Game from "../../../../../api/game.js";
import { GameContext } from "../../../../../Context/ContextProvider.jsx";
import addToList from "../../../../../api/endpoints/addToList.js";
import AddListMenu from "./AddListMenu.jsx";
import addList from "../../../../../api/endpoints/addList.js";
import CheckIcon from '@mui/icons-material/Check';
import { ClickAwayListener } from "@mui/material";
import updateGame from "../../../../../api/endpoints/updateGame.js";
const MAX_RATING = 10;

export default function GameMenu({ gameData, onClose, onSave, onDelete }) {
  const fileInputRef = useRef(null);
  const [game, setGame] = useState(() => new Game(gameData));
  const { setGames, lists } = useContext(GameContext);
  const [edit, setEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // --- List menu state ---
  const [isListMenuOpen, setIsListMenuOpen] = useState(false);
  const [listMenuPosition, setListMenuPosition] = useState({ top: 0, left: 0 });
  const addToListRef = useRef(null);

  const [prompt, setPrompt] = useState(null);
  // --- Reset state when gameData changes or exiting edit mode ---
  useEffect(() => {
    if (!edit) {
      setGame(new Game(gameData));
    }
  }, [gameData, edit]);

  // --- Handlers ---
  const handleUpdateGame = async (updatedGame) => {
  try {
    await updateGame(updatedGame);

    setGames(prev =>
      prev.map(game =>
        game.id === updatedGame.id ? updatedGame : game
      )
    );
  } catch (error) {
    console.log(error);
    console.log("Failed to update the game from gameMenu.");
  }
};


  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setGame(prevGame => new Game({ ...prevGame, newImageFile: file }));
      e.target.value = null;
    }
  }, []);

  const handleFavoriteToggle = useCallback(async () => {
    const updatedGame = new Game({ ...game, favorite: game.favorite === 1 ? 0 : 1 });
    setGame(updatedGame);
    setGames((prev) => prev.map(g => g.id === updatedGame.id ? updatedGame : g));

    try { await onSave(updatedGame); }
    catch (err) {
      console.error("Error saving favorite:", err);
      setGame(game);
      setGames((prev) => prev.map(g => g.id === game.id ? game : g));
    }
  }, [game, onSave, setGames]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSaving || !edit) return;
    setIsSaving(true);
    try { await onSave(game); setEdit(false); }
    catch (err) { console.error("Error saving game:", err); }
    finally { setIsSaving(false); }
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

  // --- List Menu Handlers ---

  const handleToggleListMenu = () => {
    if (addToListRef.current) {
      const buttonRect = addToListRef.current.getBoundingClientRect();
      const sidebarRect = document.querySelector('.vertical_sidebar')?.getBoundingClientRect();

      if (sidebarRect) {
        // Position relative to the sidebar button
        setListMenuPosition({
          top: buttonRect.top - sidebarRect.top,
          left: 0 // Will be positioned via CSS at left: 100%
        });
      }
    }
    setIsListMenuOpen(prev => !prev);
  };

  const handleListItemClick = async (list, gameId, gameName) => {
    console.log(`Added "${gameName}" to ${list.name}`);
    await addToList(list.id, gameId);
  };

  async function setRatingHandler(value) {
    let updatedGame = game;
    updatedGame = {...updatedGame, rating: value};
    updatedGame = new Game(updatedGame);
    setGame(updatedGame);
    await handleUpdateGame(updatedGame);
  }
  // --- Sub-Components ---
  const ActionButtons = () => {
    if (edit) {
      return (
        <div className="action_buttons edit_actions">
          <button type="submit" className="action_btn save_btn" disabled={isSaving}>
            <SaveIcon fontSize="small" /> {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="action_btn cancel_btn" onClick={handleCancel} disabled={isSaving}>
            <CancelIcon fontSize="small" /> Cancel
          </button>
        </div>
      );
    }
    return (
      <div className="action_buttons view_actions">
        <button type="button" className="action_btn edit_btn" onClick={() => setEdit(true)}>
          <EditIcon fontSize="small" /> Edit
        </button>
        <button type="button" className="action_btn delete_btn" onClick={handleDelete}>
          <DeleteIcon fontSize="small" /> Delete
        </button>
      </div>
    );
  };

  // --- Render ---
  return (
    <MenuContainer onClose={onClose} clickAwayExceptionClass={"game_card_image"}>
      {prompt !== null && <Prompt type={prompt} onClose={() => setPrompt(null)} setValueHandler={setRatingHandler}/>}
      <div className={`game_menu ${edit ? 'edit_mode' : 'view_mode'}`}>
        <form className="game_menu_form" onSubmit={handleSubmit}>
          <header className="game_menu_header">
            <span className="game_id_display">ID: {game.id}</span>
            <ActionButtons />
          </header>

          <div className="game_content_grid">
            <div className="poster_column">
              <div className={`poster_wrapper ${edit ? 'editable' : ''}`} onClick={() => edit && fileInputRef.current?.click()}>
                <img src={game?.getPosterURL()} alt={`${game.title} Poster`} className="poster_image" />
                {edit && (
                  <div className="poster_upload_overlay">
                    <CloudUploadIcon fontSize="large" />
                    <span>Change Image</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
              <div className="quick_actions_bar">
                <div className="stat_item rating">
                  <StarIcon className="stat_icon star_icon" />
                  <span className="stat_label">{`${game?.rating || 0} / ${MAX_RATING}`}</span>
                </div>
                <button type="button" className="stat_item favorite_btn" onClick={handleFavoriteToggle}>
                  {game?.favorite === 1 ? <FavoriteIcon className="stat_icon favorited" /> : <FavoriteBorderIcon className="stat_icon" />}
                  <span className="stat_label">{game?.favorite === 1 ? "Favorited" : "Favorite"}</span>
                </button>
              </div>
            </div>

            <div className="vertical_sidebar">
              <div className="sidebar_item flex" ref={addToListRef} onClick={handleToggleListMenu}>
                <div className="item_side">
                  <AddIcon className="sidebar_icon" />
                  <span className="sidebar_label">Add to List</span>
                </div>
              </div>

              <AddListMenu
                isOpen={isListMenuOpen}
                onClose={() => setIsListMenuOpen(false)}
                position={listMenuPosition}
                lists={lists}
                gameId={game.id}
                gameName={game.title}
                onListItemClick={handleListItemClick}
                onCreateNewList={async (name) => await addList(name)}
              />

              <div className="sidebar_item flex" onClick={() => setPrompt("rating")}>
                <div className="item_side" >
                  <StarIcon className="sidebar_icon" />
                  <span className="sidebar_label" >Rate</span>
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

function Prompt({ type, setValueHandler, onClose }) {
  const [value, setValue] = useState(null);
  const inputRef = useRef(null);
  
  function onSubmit() {
    if (type == "rating") {
      console.log(value);
      setValueHandler(value);
      onClose();
    }
    console.log("setting " + value);
  }
  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className="prompt flex">
        <input type="text" placeholder={`Enter ${type}: `} onInput={(e) => setValue(e.target.value)} ref={inputRef} autoFocus/>
        <span className="submit_span" onClick={onSubmit}>
          <CheckIcon fontSize="small" />
        </span>
      </div>
    </ClickAwayListener>
  )
}