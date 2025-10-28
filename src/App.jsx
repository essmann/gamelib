import { use, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//importing components
import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/Main/MainContent'

//importing api functions
import addGame from './api/endpoints/addGame'
import { getGames } from './api/endpoints/getGames'

function App() {
  const [games, setGames] = useState(0)
  useEffect(() => {
    const before = Date.now();
    console.log("Before");
    const fetchGames = async () => {
      const gamesList =  await getGames();
      console.log(gamesList);
      setGames(gamesList);
      const after = Date.now();
      console.log("Time taken to fetch games in App.jsx: " + (after - before)/1000 + " seconds");
    }
    fetchGames();
  }, [])
  
  return (
    
      <div className='main_container'>
        <Sidebar/>
        <MainContent games={games} setGames = {setGames} />
      </div>
      
    
  )
}

export default App
