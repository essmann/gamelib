import { useEffect, useState, useContext } from "react";
import "./App.css";

// Components
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/Main/MainContent";
import AddGameMenu from "./components/Main/GameGrid/Menu/AddGameMenu";
import GameMenu from "./components/Main/GameGrid/Menu/GameMenu";
import SearchMenu from "./components/Main/GameGrid/Menu/SearchMenu";
import MenuManager from "./components/MenuManager";
// API
import { getGames } from "./api/endpoints/getGames";
import deleteGame from "./api/endpoints/deleteGame";
import Game from "./api/game";
import fetchUser from "./api/endpoints/auth/fetchUser";

// Context
import { GameContext } from "./Context/ContextProvider";
import { UserContext } from "./Context/UserContextProvider";
import getBackendGames from "./api/endpoints/getBackendGames";

// Constants
const SIDEBAR_INDEX = {
  allGames: 0,
  favorites: 1,
};

function App() {
  const {
    previewGameData,
    setPreviewGameData,
    addGameMenu,
    games,
    setGames,
    searchMenu,
    setSearchMenu,
  } = useContext(GameContext);

  const [synced, setSynced] = useState(false);

  const { setIsLoggedIn, user, setUser } = useContext(UserContext);

  useEffect(() => {}, []);

  // collect user data on refresh via session ID. wont return anything if no session ID is present in cookie.

  useEffect(() => {
    console.log("Fetching user information...");
    let _fetchUser = async () => {
      let user = await fetchUser(setUser);
      console.log(user);
    };
    _fetchUser();
  }, []); // <-- empty array = only runs once

  // When a user successfully logs in.
  useEffect(() => {
    if (user?.username) {
      console.log("User detected");
      let item = localStorage.getItem("games_last_modified");
      if(!item){
        
      }
    }
    return;
  }, [user]);
  useEffect(() => {
    let x = async () => {
      const games = await getBackendGames();
      console.log("GAMES NIGGA");
      console.log(games);
    };
    x();
  }, []);

  useEffect(() => {}, [user]);

  const [sidebarIndex, setSidebarIndex] = useState(SIDEBAR_INDEX.allGames);

  // Fetch games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log("Fetching games...");
        const startTime = performance.now();
        const gamesList = await getGames(false);

        // Convert to Game instances
        const gamesArray = gamesList.map((gameData) => new Game(gameData));
        console.log(gamesArray);
        setGames(gamesArray);
        // console.log(gamesArray);
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`Games fetched in ${duration} seconds`);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
  }, [setGames]);

  useEffect(() => {}, [deleteGame]);
  const handleCloseGameMenu = () => {
    setPreviewGameData(null);
  };

  return (
    <div className="main_container">
      <Sidebar
        currentIndex={sidebarIndex}
        setIndex={setSidebarIndex}
        indexEnum={SIDEBAR_INDEX}
        user={user}
      />

      <MainContent
        games={games}
        setGames={setGames}
        sidebarIndex={sidebarIndex}
      />

      <MenuManager />
    </div>
  );
}

export default App;
