import MenuContainer from "./MenuContainer";
import { useState } from "react";

function GameListMenu({ lists }) {
    if (!lists || lists.length === 0) {
        return <div className="empty-message">No game lists available</div>;
    }

    return (
        <MenuContainer>
            <div className="game-lists">
                {lists.map((list) => (
                    <GameList key={list.id} list={list} />
                ))}
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
