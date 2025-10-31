import { ClickAwayListener } from "@mui/material";
function MenuContainer({ children, onClose, className = "" }) {
  return (
    <ClickAwayListener onClickAway={() => onClose()}>
      <div className={`menu_container ${className}`}>{children}</div>
    </ClickAwayListener>
  );
}

export default MenuContainer;
