import MenuContainer from "../../../MenuContainer";
import { useState } from "react";
function SearchMenu({ searchArray, onClose }) {
  const [query, setQuery] = useState("");
  const search = (query) => {
    const results = query
      ? searchArray.filter((item) =>
          item.toLowerCase().startsWith(query.toLowerCase())
        )
      : [];
  };
  return (
    <MenuContainer className="search_menu">
      <div>
        <div className="add_btn"></div>
        <input className="search_input" />
      </div>
      <div className="search_results_container"></div>
    </MenuContainer>
  );
}

export default SearchMenu;

function Result({ game }) {
    return (
        <div className="result_item">
            
        </div>
    )
}

function SearchResults({ array = [] }) {
  return (
    <div className="search_results">
      {array.map((game) => (
        <Result game={game} />
      ))}
    </div>
  );
}
