import GameGrid from "./GameGrid/GameGrid.jsx";
import dummyGames from "../../test_data/dummyGames.jsx";
import WindowIcon from "@mui/icons-material/Window";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Slider } from "@mui/material";
function MainContent({ games, setGames, sidebarIndex }) {
  const [selectedHeaderItem, setSelectedHeaderItem] = useState(0);
  return (
    <div className="main_content">
      <HeaderItem />
      {sidebarIndex == 0 && <GameGrid games={games} setGames={setGames} />}
      {sidebarIndex == 1 && (
        <GameGrid
          games={games.filter((game) => game.favorite)}
          setGames={setGames}
        />
      )}
    </div>
  );
}

export default MainContent;

function HeaderItem({}) {
  return (
    <div className="main_content_header">
        <span className="header_search">
            <SearchIcon fontSize="small"/>
            <input type="text" placeholder="Search games..." />
        </span>
        <span className="header_filter">
            <FilterAltIcon fontSize="small"/>
            <button> Filter</button>
        </span>
        <span className="header_sync">
            <FilterAltIcon fontSize="small"/>
            <button> Filter</button>
        </span>
        
      <div className="display_btns">
        <div className="header_slider">
            <Slider size="small" color=""/>
        </div>
        <span className="list_view selected">
        <ReorderIcon fontSize="large" />
      </span>
      <span className="">
        <WindowIcon fontSize="large" />
      </span>
      </div>
    </div>
  );
}
