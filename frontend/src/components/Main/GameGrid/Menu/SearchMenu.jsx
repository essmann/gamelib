import MenuContainer from "../../../MenuContainer";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useRef } from "react";
import getExternalGames from "../../../../api/endpoints/getExternalGames";
import getExternalGameById from "../../../../api/endpoints/getExternalGameById";
import { useContext } from "react";
import { GameContext } from "../../../../Context/ContextProvider";

function SearchMenu({ onClose }) {
  const { setAddGameMenu } = useContext(GameContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const isMountedRef = useRef(true);
  const pendingRequestRef = useRef(null);

  const handleSearch = async (q) => {
    if (q == null || q === "") {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Mark this request as pending
    const requestId = Date.now();
    pendingRequestRef.current = requestId;

    try {
      setIsSearching(true);
      const searchResponse = await getExternalGames(q);
      
      // Only update state if this is still the latest request and component is mounted
      if (pendingRequestRef.current === requestId && isMountedRef.current) {
        console.log(searchResponse);
        // Limit results to maximum of 30 games
        const limitedResults = searchResponse.slice(0, 30);
        setResults(limitedResults);
        setSelectedIndex(0);
      }
    } catch (err) {
      console.error("Search error:", err);
      // Still clear searching state even on error if component is mounted
      if (isMountedRef.current) {
        setIsSearching(false);
      }
    } finally {
      if (isMountedRef.current && pendingRequestRef.current === requestId) {
        setIsSearching(false);
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await handleSearch(value);
    }, 300);
  };

  useEffect(() => {
    // Auto-focus on mount only
    if (inputRef.current) {
      inputRef.current.focus();
    }

    isMountedRef.current = true;

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      pendingRequestRef.current = null;
    };
  }, []);

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSubmit(results[selectedIndex]);
    }
  };

  const handleSubmit = async (game) => {
    console.log("Selected game:", game);
    try {
      // Fetch full game details by ID
      const fullGame = await getExternalGameById(game.id);
      if (fullGame) {
        console.log("Full game data:", fullGame);
        setAddGameMenu(fullGame);
      } else {
        console.warn("Failed to fetch full game details, using search result");
        setAddGameMenu(game);
      }
    } catch (err) {
      console.error("Error fetching full game data:", err);
      setAddGameMenu(game);
    }
    onClose();
  };

  // Scroll to selected item only, without smooth animation
  useEffect(() => {
    console.log("Selected index changed:", selectedIndex);
    if (selectedIndex >= 0 && resultsRef.current) {
      resultsRef.current.classList.add("selected");
      const items = resultsRef.current.querySelectorAll(".result_item");
      if (items[selectedIndex]) {
        // Use auto instead of smooth to avoid animation frame locks
        items[selectedIndex].scrollIntoView({
          block: "nearest",
          behavior: "auto",
        });
      }
    }
  }, [selectedIndex]);

  function handleButtonClick() {
    console.log("Add button clicked");
    setAddGameMenu(true);
    onClose();
  }

  return (
    <MenuContainer className="search_menu" onClose={onClose}>
      <div className="search_input_container">
        <input
          className="search_input"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          spellCheck={false}
          ref={inputRef}
        />
        <div className="add_btn" onClick={handleButtonClick}>
          <AddIcon fontSize="small" />
        </div>
      </div>
      <div className="search_results_container" ref={resultsRef}>
        <SearchResults
          array={results}
          selectedIndex={selectedIndex}
          onSelect={handleSubmit}
        />
      </div>
    </MenuContainer>
  );
}

export default SearchMenu;

function Result({ game, isSelected, onClick }) {
  return (
    <div
      className={`result_item ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="result_title">{game.title}</div>
    </div>
  );
}

function SearchResults({ array = [], selectedIndex, onSelect }) {
  return (
    <div className="search_results">
      {array.map((game, i) => (
        <Result
          key={i}
          game={game}
          isSelected={i === selectedIndex}
          onClick={() => onSelect(game)}
        />
      ))}
    </div>
  );
}
