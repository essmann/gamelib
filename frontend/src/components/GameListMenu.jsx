import MenuContainer from "./MenuContainer";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

function GameListMenu({ lists, onClose, onCreateList, onDeleteList }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newListName, setNewListName] = useState("");

    const handleCreateClick = () => {
        setIsCreating(true);
        setNewListName("");
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewListName("");
    };

    const handleSubmitNewList = async () => {
        if (!newListName.trim()) return;
        try {
            await onCreateList(newListName.trim());
            setIsCreating(false);
            setNewListName("");
        } catch (err) {
            console.error("Error creating list:", err);
        }
    };

    return (
        <MenuContainer onClose={onClose}>
            <div className="game-lists-container">
                <div className="lists-header">
                    <h1>Lists</h1>
                    <span className="list-count">{lists.length}</span>
                </div>

                <div className="lists-tree">
                    {lists.length === 0 ? (
                        <div className="empty-state">No lists yet</div>
                    ) : (
                        lists.map((list) => (
                            <GameList key={list.id} list={list} onDelete={() => onDeleteList(list.id)} />
                        ))
                    )}

                    {isCreating ? (
                        <div className="create-list-inline">
                            <input
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder="List name..."
                                autoFocus
                                maxLength={50}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newListName.trim()) {
                                        handleSubmitNewList();
                                    } else if (e.key === 'Escape') {
                                        handleCancelCreate();
                                    }
                                }}
                            />
                            <button 
                                className="inline-btn confirm"
                                disabled={!newListName.trim()}
                                onClick={handleSubmitNewList}
                            >
                                <CheckIcon fontSize="small" />
                            </button>
                            <button 
                                className="inline-btn cancel"
                                onClick={handleCancelCreate}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button className="create-list-btn" onClick={handleCreateClick}>
                            <AddIcon fontSize="small" />
                            <span>New list</span>
                        </button>
                    )}
                </div>
            </div>
        </MenuContainer>
    );
}

// Component for individual list with collapsible games
function GameList({ list, onDelete }) {
    const [open, setOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredGameId, setHoveredGameId] = useState(null);

    const handleDelete = () => {
        if (window.confirm(`Delete "${list.name}"?`)) {
            onDelete(list.id);
        }
    };

    const handleRemoveGame = (gameId, gameTitle) => {
        if (window.confirm(`Remove "${gameTitle}" from this list?`)) {
            // Add your API call here to remove game from list
            console.log(`Remove game ${gameId} from list ${list.id}`);
        }
    };

    return (
        <div className="tree-item">
            <div 
                className="tree-node"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="node-content" onClick={() => setOpen(!open)}>
                    {open ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                    {open ? <FolderOpenIcon fontSize="small" /> : <FolderIcon fontSize="small" />}
                    <span className="node-label">{list.name}</span>
                    <span className="node-count">({list.games?.length || 0})</span>
                </div>
                
                {isHovered && (
                    <button className="node-delete" onClick={handleDelete}>
                        <DeleteOutlineIcon fontSize="small" />
                    </button>
                )}
            </div>

            {open && (
                <div className="tree-children">
                    {!list.games || list.games.length === 0 ? (
                        <div className="empty-node">Empty</div>
                    ) : (
                        list.games.map((game) => (
                            <div 
                                key={game.id} 
                                className="tree-leaf"
                                onMouseEnter={() => setHoveredGameId(game.id)}
                                onMouseLeave={() => setHoveredGameId(null)}
                            >
                                <span className="leaf-bullet">•</span>
                                <span className="leaf-label">{game.title}</span>
                                {game.rating && (
                                    <span className="leaf-rating">★ {game.rating}</span>
                                )}
                                {hoveredGameId === game.id && (
                                    <button 
                                        className="leaf-delete"
                                        onClick={() => handleRemoveGame(game.id, game.title)}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default GameListMenu;