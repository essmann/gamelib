import { useState, useContext } from "react";
import { Icon } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SettingsIcon from "@mui/icons-material/Settings";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { GameContext } from "../../Context/ContextProvider";
import exportData from "../../api/exportData";
import importGames from "../../api/importGames";

// List header component
function ListHeader({ title }) {
  return (
    <div className="list_header_container">
      <div className="list_header">{title}</div>
    </div>
  );
}

// Individual list item
function ListItem({
  title,
  icon,
  index,
  currentIndex,
  setIndex,
  count,
  countNumber,
  onClick,
}) {
  const { games } = useContext(GameContext);
  const isSelected = currentIndex === index;
  const itemCount = countNumber !== undefined
    ? countNumber
    : count
      ? index === 0
        ? games?.length || 0
        : index === 1
          ? games?.filter((game) => game.favorite)?.length || 0
          : 0
      : null;

  const handleClick = () => {
    setIndex(index);
  };

  return (
    <div
      className={`sidebar_item ${isSelected ? "selected" : ""} ${title}`}
      onClick={onClick || handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
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
function Sidebar({ setIndex, currentIndex, indexEnum }) {
  const [collapsed, setCollapsed] = useState(true);
  const { lists, games, setListMenu } = useContext(GameContext);
  
  async function onImport() {
    try {
      await importGames();
    } catch (err) {
      console.error('Error during import:', err);
    }
  }

   function handleExport(games, lists){
      exportData(games, lists);
  }
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar_items_container">
        <div className="collapse_btn">
          <button style={{ border: "none", outline: "none" }} onClick={() => setCollapsed(prev => !prev)}>
            {!collapsed ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
          </button>
        </div>

        <div className="sidebar_top_items">
          <ListHeader title="GAMES" />
          <ListItem title="All Games" icon={AppsIcon} index={indexEnum.allGames} currentIndex={currentIndex} setIndex={setIndex} count />
          <ListItem title="Favorites" icon={FavoriteBorderIcon} index={indexEnum.favorites || 1} currentIndex={currentIndex} setIndex={setIndex} count />
          <ListItem title="Lists" icon={TurnedInIcon} index={indexEnum.lists || 100} currentIndex={currentIndex} setIndex={setIndex} count countNumber={lists.length} onClick={()=>setListMenu(true)} />
          
          <ListHeader title="Etc" />
          <ListItem title="Import" icon={DownloadIcon} index={101} currentIndex={currentIndex} setIndex={setIndex} count={false} onClick={onImport} />
          <ListItem title="Export" icon={UploadIcon} index={102} currentIndex={currentIndex} setIndex={setIndex} count={false} onClick={() => exportData(games, lists)} />
        </div>

        <ListItem title="Settings" icon={SettingsIcon} index={indexEnum.settings || 99} currentIndex={currentIndex} setIndex={setIndex} count={false} />
      </div>
    </div>
  );
}

export default Sidebar;