import MenuContainer from "../../../MenuContainer";
import AddIcon from '@mui/icons-material/Add';import { useState, useEffect, useRef } from "react";
import getExternalGames from "../../../../api/endpoints/getExternalGames";
function SearchMenu({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);

  

  const handleSearch = async (q) => {
    if(q==null){
      setResults([]);
      return;
    }
    const searchResponse = await getExternalGames(q);
    console.log(searchResponse)
    setResults(searchResponse);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setQuery(value);

    // clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // set new debounce
    debounceRef.current = setTimeout(async () => {
      await handleSearch(value);
    }, 300); // 300ms delay
  };

  return (
    <MenuContainer className="search_menu" onClose={onClose}>
      <div className="search_input_container">
        
        <input
          className="search_input"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          spellCheck={false}
        />
        <div className="add_btn">
          <AddIcon fontSize="small"/>
        </div>
      </div>
      <div className="search_results_container">
        <SearchResults array={results} />
      </div>
    </MenuContainer>
  );
}

export default SearchMenu;

function Result({ game }) {
  return <div className="result_item">
    <div className="result_title"> {game.title}</div>
  </div>;
}

function SearchResults({ array = [] }) {
  return (
    <div className="search_results">
      {array.map((game, i) => (
        <Result key={i} game={game} />
      ))}
    </div>
  );
}
