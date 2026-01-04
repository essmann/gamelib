import { ClickAwayListener } from "@mui/material";

function MenuContainer({ children, onClose, className = "", clickAwayExceptionClass }) {
  const handleClickAway = (e) => {
    // Check if the clicked element has the exception class
    if (clickAwayExceptionClass && e.target.classList.contains(clickAwayExceptionClass)) {
      return;
    }
    
    // Check if clicked element is inside the menu container (important!)
    const menuContainer = e.currentTarget.querySelector('.menu_container');
    if (menuContainer && menuContainer.contains(e.target)) {
      return;
    }
    
    onClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={`menu_container ${className}`}>{children}</div>
    </ClickAwayListener>
  );
}

export default MenuContainer;
