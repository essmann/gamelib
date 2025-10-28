import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//importing components
import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/Main/MainContent'

import addGame from './api/addGame'
function App() {
  const [games, setGames] = useState(0)
  useEffect(()=>{
    const dummyGame = {
      id: Math.floor(Math.random()*1e9),
      title: "Test Game",
      release: "2025-12-12",
      description: "This is a test game",
      poster: null
    }
    const add =  async () =>{
      await addGame(dummyGame);
    } 
     add();
  })
  
  return (
    
      <div className='main_container'>
        <Sidebar/>
        <MainContent/>
      </div>
      
    
  )
}

export default App
