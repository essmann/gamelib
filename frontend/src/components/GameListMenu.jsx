import MenuContainer from "./MenuContainer";
import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
function GameListMenu({ lists, onClose }) {



    function createNewList(){
        let x = ("Name of list");
    }
    return (
            <MenuContainer onClose={onClose}>
                <div className="game-lists">
                    {lists.map((list) => (
                        <GameList key={list.id} list={list} />
                    ))}
                    <div>
                        <div className="flex game-list add" onClick={createNewList}>
                            <AddIcon/>
                            <span>New list</span>
                        </div>
                    </div>
                </div>
            </MenuContainer>
    );
}

// Component for individual list with collapsible games
function GameList({ list }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="game-list">
            <h2 className="list-title" onClick={() => setOpen(!open)}>
                {list.name} {open ? "▼" : "▶"}
            </h2>
            {open && (
                <ul className="games">
                    {list.games.map((game) => (
                        <li key={game.id} className="game-item">
                            <strong>{game.title}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GameListMenu;
