import { useState, useEffect } from "react";
import GameGrid from "./GameGrid/GameGrid.jsx";
import WindowIcon from "@mui/icons-material/Window";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Slider } from "@mui/material";
import MenuContainer from "../MenuContainer.jsx";

function MainContent({ games, setGames, sidebarIndex }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler); // Cleanup previous timeout
  }, [search]);

  return (
    <div className="main_content">
      <HeaderItem search={search} setSearch={setSearch} />
      {/* <FilterMenu /> */}

      {sidebarIndex === 0 && <GameGrid games={games} setGames={setGames} search={debouncedSearch} />}
      {sidebarIndex === 1 && (
        <GameGrid
          games={games.filter((game) => game.favorite && game.title?.toLowerCase().includes(debouncedSearch.toLowerCase()))}
          setGames={setGames}
          search={debouncedSearch}
        />
      )}
    </div>
  );
}

export default MainContent;

function HeaderItem({ search, setSearch }) {
  return (
    <div className="main_content_header">
      <span className="header_search">
        <SearchIcon fontSize="small" />
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </span>
      <span className="header_filter">
        <FilterAltIcon fontSize="small" />
        <button> Filter</button>
      </span>

     
    </div>
  );
}

function FilterMenu() {
  return (
    <MenuContainer className="filter_container">
      <div className="filter_menu">

        <div>Filter Menu</div>
      </div>
    </MenuContainer>
  )
}