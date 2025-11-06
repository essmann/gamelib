import { useContext, useMemo } from "react";
import AppsIcon from "@mui/icons-material/Apps";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Icon } from "@mui/material";
import { GameContext } from "../../Context/ContextProvider";
import SettingsIcon from '@mui/icons-material/Settings';
// List header component for section titles
function ListHeader({ title }) {
  return (
    <div className="list_header_container">
      <div className="list_header">{title}</div>
    </div>
  );
}

// Individual list item component
function ListItem({ 
  title, 
  icon, 
  index, 
  currentIndex,
  setIndex, 
  count,
  isChild = false 
}) {
  const { games } = useContext(GameContext);
  const isSelected = currentIndex === index;
  
  // Calculate count based on item type
  const itemCount = useMemo(() => {
    if (!count) return null;
    
    if (index === 0) { // All Games
      return games?.length || 0;
    } else if (index === 1) { // Favorites
      return games?.filter(game => game.favorite)?.length || 0;
    }
    return 0;
  }, [games, count, index]);

  const handleClick = () => {
    setIndex(index);
    console.log("Clicked index: " + index);
  };

  return (
    <div 
      className={`sidebar_item ${isSelected ? 'selected' : ''}  ${title} ${isChild ? 'child_item' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="list_item_icon">
        <Icon component={icon} />
      </div>
      <div className="list_item_title">{title}</div>
      {itemCount !== null && (
        <div className="list_item_count">{itemCount}</div>
      )}
    </div>
  );
}



// Main sidebar component
function Sidebar({ setIndex, currentIndex, indexEnum }) {
  const { games } = useContext(GameContext);

  // Validate context
  if (!games) {
    console.warn('Games context is not available');
  }

  return (
    <div className="sidebar">
      <div className="sidebar_items_container">
        <ListHeader title="GAMES" />
        
        <ListItem 
          title="All Games" 
          icon={AppsIcon} 
          index={indexEnum.allGames} 
          currentIndex={currentIndex}
          setIndex={setIndex}
          count={true}
        />
        
        <ListItem
          title="Favorites"
          icon={FavoriteBorderIcon}
          index={indexEnum.favorites || 1}
          currentIndex={currentIndex}
          setIndex={setIndex}
          count={true}
        />
        <ListItem
          title="Settings"
          icon={SettingsIcon}
          index={indexEnum.settings || 99}
          currentIndex={currentIndex}
          setIndex={setIndex}
          count={false}
        />

        {/* Example of parent item usage - uncomment if needed
        <ListParentItem 
          title="Categories" 
          icon={CategoryIcon}
          index={indexEnum.categories}
          currentIndex={currentIndex}
          setIndex={setIndex}
        >
          <ListItem 
            isChild={true} 
            title="Action" 
            icon={SportsEsportsIcon}
            index={indexEnum.action}
            currentIndex={currentIndex}
            setIndex={setIndex}
          />
          <ListItem 
            isChild={true} 
            title="Adventure" 
            icon={ExploreIcon}
            index={indexEnum.adventure}
            currentIndex={currentIndex}
            setIndex={setIndex}
          />
        </ListParentItem>
        */}
      </div>
    </div>
  );
}

export default Sidebar;