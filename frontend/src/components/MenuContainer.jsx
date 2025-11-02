import { ClickAwayListener } from "@mui/material";
function MenuContainer({ children, onClose, className = "", clickAwayExceptionClass }) {
  return (
    <ClickAwayListener onClickAway={(e)=>{
      console.log(e.target);
      console.log(e.target.className == clickAwayExceptionClass);
      if(e.target.className != clickAwayExceptionClass){
        
        onClose();
      }
    }}>
      <div className={`menu_container ${className}`}>{children}</div>
    </ClickAwayListener>
  );
}

export default MenuContainer;
