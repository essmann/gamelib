import { use, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//importing components
import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/Main/MainContent'
import AddGameMenu from './components/Main/GameGrid/Menu/AddGameMenu'
//importing api functions
import addGame from './api/endpoints/addGame'
import { useContext } from 'react'
import { getGames } from './api/endpoints/getGames'
import { GameContext } from './Context/ContextProvider'
import Game from './api/game'
import GameMenu from './components/Main/GameGrid/Menu/GameMenu'
function App() {
  const {previewGameData, setPreviewGameData, addGameMenu, setAddGameMenu, games, setGames} = useContext(GameContext);
  useEffect(() => {
    const before = Date.now();
    console.log("Before");
    const fetchGames = async () => {
      const gamesList =  await getGames();
      let arr = [];
      for(let i = 0; i<gamesList.length; i++){
           arr[i] = new Game(gamesList[i]);

      }
      console.log(arr);
      // console.log(gamesList)
      setGames(arr);
      const after = Date.now();
      console.log("Time taken to fetch games in App.jsx: " + (after - before)/1000 + " seconds");
    }
    fetchGames();
    console.log("Fetched");
  }, [])
  
  return (
    
      <div className='main_container'>
        <Sidebar/>
        <MainContent games={games} setGames = {setGames} />
        { addGameMenu && <AddGameMenu/>}
        {    previewGameData  && <GameMenu gameData={previewGameData} onClose={()=>{
            setPreviewGameData(null);
        }}/>}
      </div>
      
    
  )
}

export default App
