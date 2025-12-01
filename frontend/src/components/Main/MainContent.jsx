import GameGrid from "./GameGrid/GameGrid.jsx";
import dummyGames from "../../test_data/dummyGames.jsx";
import WindowIcon from "@mui/icons-material/Window";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Slider } from "@mui/material";

import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import forceSyncGamesForward from "../../api/forceSyncGamesForward.js";
function MainContent({ games, setGames, sidebarIndex }) {
  const [selectedHeaderItem, setSelectedHeaderItem] = useState(0);
  return (
    <div className="main_content">
      <HeaderItem games={games} />
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

function HeaderItem({ games }) {
  return (
    <div className="main_content_header">
      <span className="header_search">
        <SearchIcon fontSize="small" />
        <input type="text" placeholder="Search games..." />
      </span>
      <span className="header_filter">
        <FilterAltIcon fontSize="small" />
        <button> Filter</button>
      </span>
      <span className="header_sync">

       <button style={{borderRadius: 50}}>
         <CloudSyncIcon fontSize="medium" />
       </button>
      </span>
      <OnlineStatusItem online={true} />

      <div className="display_btns">
        <div className="header_slider">
          <Slider size="small" color="" />
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

function CloudStatusItem() {
  return (
    <div className="header_cloud">
      <div>
        <CloudDoneIcon fontSize="large" />
      </div>
    </div>
  )
}
function OnlineStatusItem({ online }) {
  return (
    <div className="header_online">
      <div>
        <div className="header_dot"></div>
        {online == true ? <div> Online </div> : <div> Offline </div>}
      </div>
    </div>
  )
}
