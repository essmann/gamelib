import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

export default function AddListMenu({ 
  isOpen, 
  onClose, 
  position, 
  lists, 
  gameId, 
  gameName,
  onListItemClick,
  onCreateNewList
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  if (!isOpen) return null;

  const handleCreateClick = () => {
    setIsCreating(true);
    setNewListName("");
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewListName("");
  };

  const handleSubmitNewList = async (e) => {
    if (e) e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await onCreateNewList(newListName.trim());
      setIsCreating(false);
      setNewListName("");
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => {
      handleCancelCreate();
      onClose();
    }}>
      <div 
        className="list_menu floating" 
        style={{ 
          top: position.top, 
          left: position.left 
        }}
      >
        <ul className="list_menu_ul">
          {lists.map(list => {
            const isInList = list.games?.some(g => g.id === gameId);
            return (
              <li
                key={list.id}
                className={`list_menu_item ${isInList ? 'in_list' : ''}`}
                onClick={() => onListItemClick(list, gameId, gameName)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isInList ? (
                  <CheckIcon className="icon" fontSize="small" />
                ) : (
                  <AddIcon className="icon" fontSize="small" />
                )}
                {list.name}
              </li>
            );
          })}
          
          {isCreating ? (
            <li className="list_menu_item create_input">
              <div className="create_list_form">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name..."
                  autoFocus
                  maxLength={50}
                  onMouseDown={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newListName.trim()) {
                      e.preventDefault();
                      handleSubmitNewList(e);
                    }
                  }}
                />
                <div className="create_actions">
                  <button 
                    type="button"
                    className="create_btn confirm"
                    disabled={!newListName.trim()}
                    onClick={handleSubmitNewList}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <CheckIcon fontSize="small" />
                  </button>
                  <button 
                    type="button" 
                    className="create_btn cancel"
                    onClick={handleCancelCreate}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <li
              className="list_menu_item create_new"
              onClick={handleCreateClick}
              onMouseDown={(e) => e.preventDefault()}
            >
              <AddIcon className="icon" fontSize="small" />
              Create new list
            </li>
          )}
        </ul>
      </div>
    </ClickAwayListener>
  );
}