import { ClickAwayListener } from "@mui/material";

export default function AddListMenu({ 
  isOpen, 
  onClose, 
  position, 
  lists, 
  gameId, 
  gameName,
  onListItemClick 
}) {
  if (!isOpen) return null;

  return (
    <ClickAwayListener onClickAway={onClose}>
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
                <span className="icon">{isInList ? '✔' : '+'}</span>
                {list.name}
              </li>
            );
          })}
        </ul>
      </div>
    </ClickAwayListener>
  );
}