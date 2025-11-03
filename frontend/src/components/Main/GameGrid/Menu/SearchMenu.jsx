import MenuContainer from "../../../MenuContainer";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useRef } from "react";
import getExternalGames from "../../../../api/endpoints/getExternalGames";
import { useContext } from "react";
import { GameContext } from "../../../../Context/ContextProvider";

function SearchMenu({ onClose }) {
  const { setAddGameMenu } = useContext(GameContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const handleSearch = async (q) => {
    if (q == null || q === "") {
      setResults([]);
      return;
    }
    const searchResponse = await getExternalGames(q);
    console.log(searchResponse);
    setResults(searchResponse);
    setSelectedIndex(0);
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
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Focus on mount
    handleFocus();

    // Refocus if focus is lost
    const interval = setInterval(handleFocus, 100);

    return () => clearInterval(interval);
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

  const handleSubmit = (game) => {
    console.log("Selected game:", game);
    setAddGameMenu(game);
    onClose();
    // Add your submission logic here
  };

  useEffect(() => {
    console.log("Selected index changed:", selectedIndex);
    if (selectedIndex >= 0 && resultsRef.current) {
      resultsRef.current.classList.add("selected");
      const items = resultsRef.current.querySelectorAll(".result_item");
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
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
