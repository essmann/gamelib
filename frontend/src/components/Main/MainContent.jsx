import { useState, useEffect } from "react";
import GameGrid from "./GameGrid/GameGrid.jsx";
import WindowIcon from "@mui/icons-material/Window";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import { Slider } from "@mui/material";
import MenuContainer from "../MenuContainer.jsx";

function MainContent({ games, setGames, sidebarIndex }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    platforms: [],
    genres: [],
    ratingRange: [0, 10],
    yearRange: [1980, new Date().getFullYear()]
  });
  
  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const sortGames = (gamesToSort) => {
    return [...gamesToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "releaseDate":
          comparison = new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
          break;
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case "dateAdded":
          comparison = new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  return (
    <div className="main_content">
      <HeaderItem 
        search={search} 
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      {sidebarIndex === 0 && (
        <GameGrid 
          games={sortGames(games)} 
          setGames={setGames} 
          search={debouncedSearch} 
        />
      )}
      {sidebarIndex === 1 && (
        <GameGrid
          games={sortGames(games.filter((game) => game.favorite && game.title?.toLowerCase().includes(debouncedSearch.toLowerCase())))}
          setGames={setGames}
          search={debouncedSearch}
        />
      )}
    </div>
  );
}

export default MainContent;

function HeaderItem({ search, setSearch, sortBy, setSortBy, sortOrder, setSortOrder }) {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

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
        <button>Filter</button>
      </span>
      <span className="header_sort">
        <SortIcon fontSize="small" />
        <button onClick={() => setSortMenuOpen(!sortMenuOpen)}>
          Sort
        </button>
        {sortMenuOpen && (
          <SortMenu 
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onClose={() => setSortMenuOpen(false)}
          />
        )}
      </span>
    </div>
  );
}

function SortMenu({ sortBy, setSortBy, sortOrder, setSortOrder, onClose }) {
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "releaseDate", label: "Release Date" },
    { value: "rating", label: "Rating" },
    { value: "dateAdded", label: "Date Added" }
  ];

  return (
    <MenuContainer className="sort_container" onClose={onClose}>
      <div className="sort_menu">
        <div className="sort_header">Sort By</div>
        <div className="sort_options">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`sort_option ${sortBy === option.value ? "active" : ""}`}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="sort_divider"></div>
        <div className="sort_order">
          <button
            className={`sort_order_btn ${sortOrder === "asc" ? "active" : ""}`}
            onClick={() => setSortOrder("asc")}
          >
            Ascending
          </button>
          <button
            className={`sort_order_btn ${sortOrder === "desc" ? "active" : ""}`}
            onClick={() => setSortOrder("desc")}
          >
            Descending
          </button>
        </div>
      </div>
    </MenuContainer>
  );
}

function FilterMenu() {
  return (
    <MenuContainer className="filter_container">
      <div className="filter_menu">
        <div>Filter Menu</div>
      </div>
    </MenuContainer>
  );
}