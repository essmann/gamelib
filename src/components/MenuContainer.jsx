import { ClickAwayListener } from "@mui/material";
function MenuContainer({ children, onClose }) {
  return (
    <ClickAwayListener onClickAway={()=>onClose()}>
      <div className="menu_container">{children}</div>
    </ClickAwayListener>
  );
}

export default MenuContainer;
