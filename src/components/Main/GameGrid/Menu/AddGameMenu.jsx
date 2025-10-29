import { useState, useRef } from "react";
import MenuContainer from "../../../MenuContainer";

function AddGameMenu({setIsOpen}) {
  const [poster, setPoster] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseDate: "",
    developer: "",
    publisher: "",
    genre: "",
    platform: "",
    rating: "",
    tags: "",
  });

  const fileInputRef = useRef(null);

  const handlePosterClick = () => fileInputRef.current.click();

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) setPoster(URL.createObjectURL(file));
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const gameData = { ...form, poster };
    console.log("Game Details:", gameData);
    alert(JSON.stringify(gameData, null, 2)); // optional: show in popup
    // send via IPC or API
  };

  return (
    <MenuContainer>
      <form className="add_game_form" onSubmit={handleSubmit}>
        {/* Poster on Left */}
        <div className="add_game_poster_container" onClick={handlePosterClick}>
          {poster ? (
            <img src={poster} alt="Poster" className="poster_preview" />
          ) : (
            <div className="upload_hint">Click to upload image</div>
          )}
          <input
            className="file_upload_input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePosterChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="add_game_inputs_container">
          <h2>Add New Game</h2>
          <div className="input_row">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />
            <input
              name="developer"
              placeholder="Developer"
              value={form.developer}
              onChange={handleChange}
            />
          </div>
          <div className="input_row">
            <input
              name="releaseDate"
              placeholder="Release Date"
              value={form.releaseDate}
              onChange={handleChange}
            />
            <input
              name="platform"
              placeholder="Platform"
              value={form.platform}
              onChange={handleChange}
            />
          </div>
          <div className="input_row">
            <input
              name="rating"
              placeholder="Rating (1-10)"
              value={form.rating}
              onChange={handleChange}
            />
            <input
              name="genre"
              placeholder="Genre"
              value={form.genre}
              onChange={handleChange}
            />
          </div>
          <div className="input_row textarea">
            <textarea
              placeholder="Description"
              className="input_textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="add_game_submit_container">
            <button type="submit" className="add_game_submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </MenuContainer>
  );
}

export default AddGameMenu;
