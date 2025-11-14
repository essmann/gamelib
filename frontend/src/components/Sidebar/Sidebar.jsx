import { useState, useContext, useMemo } from "react";
import { Icon } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SettingsIcon from "@mui/icons-material/Settings";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import PersonIcon from "@mui/icons-material/Person";

import { GameContext } from "../../Context/ContextProvider";
import { UserContext } from "../../Context/UserContextProvider";

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
  isChild = false,
  isLogin = false,
  user = null,
  onClick,
}) {
  const { games } = useContext(GameContext);
  const isSelected = currentIndex === index;

  const itemCount = useMemo(() => {
    if (!count) return null;
    if (index === 0) return games?.length || 0;
    if (index === 1) return games?.filter((game) => game.favorite)?.length || 0;
    return 0;
  }, [games, count, index]);

  const handleClick = () => {
    setIndex(index);
    console.log("Clicked index:", index);
  };

  if (isLogin) {
    console.log(user);
    title = user?.username == null ? "Sign in" : user?.username;
  }

  return (
    <div
      className={`sidebar_item ${isSelected ? "selected" : ""} ${title} ${
        isChild ? "child_item" : ""
      }`}
      onClick={onClick || handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="list_item_icon">
        <Icon component={icon} />
      </div>
      <div className="list_item_title">{title}</div>
      {itemCount !== null && <div className="list_item_count">{itemCount}</div>}
    </div>
  );
}

// Main sidebar component
function Sidebar({ setIndex, currentIndex, indexEnum, user }) {
  const { games, setProfileMenu, setLoginMenu } = useContext(GameContext);
 
  const handleProfileButtonClick = () => {
    if(user?.username == null){
      setLoginMenu(true);
    }
    else {
      setProfileMenu(true);
    }
  }
  if (!games) console.warn("Games context is not available");

  return (
    <div className="sidebar">
      <div className="sidebar_items_container">
        <ListHeader title="PROFILE" />
        <ListItem
          title="User"
          icon={PersonIcon}
          index={1000}
          setIndex={setIndex}
          currentIndex={currentIndex}
          isLogin
          user={user}
          onClick={handleProfileButtonClick}
        />

        <ListHeader title="GAMES" />
        <ListItem
          title="All Games"
          icon={AppsIcon}
          index={indexEnum.allGames}
          currentIndex={currentIndex}
          setIndex={setIndex}
          count
        />
        <ListItem
          title="Favorites"
          icon={FavoriteBorderIcon}
          index={indexEnum.favorites || 1}
          currentIndex={currentIndex}
          setIndex={setIndex}
          count
        />
        <ListItem
          title="Lists"
          icon={TurnedInIcon}
          index={indexEnum.lists || 100}
          currentIndex={currentIndex}
          setIndex={setIndex}
          count
        />
        <ListItem
          title="Settings"
          icon={SettingsIcon}
          index={indexEnum.settings || 99}
          currentIndex={currentIndex}
          setIndex={setIndex}
          count={false}
        />
      </div>
    </div>
  );
}

export default Sidebar;
