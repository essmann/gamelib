import { useState, useRef } from "react";
import MenuContainer from "../../../MenuContainer";

function AddGameMenu() {
  const [poster, setPoster] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [developer, setDeveloper] = useState("");
  const [rating, setRating] = useState(0);

  const fileInputRef = useRef(null);

  const handlePosterClick = () => fileInputRef.current.click();

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gameData = { poster, title, description, releaseDate, developer, rating };
    console.log(gameData);
    // send via IPC or API
  };

  return (
    <MenuContainer>
      <form className="add_game_form" onSubmit={handleSubmit}>
        {/* Poster */}
        <div className="poster_container" onClick={handlePosterClick}>
          {poster ? (
            <img src={poster} alt="Poster Preview" />
          ) : (
            <div className="poster_placeholder">Click to add poster</div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePosterChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Game info horizontally */}
        <div className="info_container">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text_input"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea_input"
          />
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="text_input"
            placeholder="Release Date"
          />
          <input
            type="text"
            placeholder="Developer"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            className="text_input"
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min={1}
            max={5}
            className="text_input"
          />
        </div>

        <button type="submit" className="submit_button">
          Add Game
        </button>
      </form>

      <style jsx>{`
        .add_game_form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          background: #1c1c1c;
          border-radius: 12px;
          color: #fff;
          font-family: sans-serif;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .poster_container {
          width: 180px;
          height: 280px;
          background: #2a2a2a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          flex-shrink: 0;
        }

        .poster_container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .poster_placeholder {
          color: #888;
          font-size: 1rem;
          text-align: center;
        }

        .info_container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          width: 100%;
        }

        .text_input,
        .textarea_input {
          background: #2a2a2a;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          color: #fff;
          font-size: 1rem;
          flex: 1 1 150px;
        }

        .textarea_input {
          min-height: 60px;
          resize: vertical;
        }

        .text_input::placeholder,
        .textarea_input::placeholder {
          color: #aaa;
        }

        .text_input:focus,
        .textarea_input:focus {
          outline: 2px solid #555;
        }

        .submit_button {
          background: #4a90e2;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 2rem;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .submit_button:hover {
          background: #357ab7;
        }
      `}</style>
    </MenuContainer>
  );
}

export default AddGameMenu;
