import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//importing components
import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/Main/MainContent'
function App() {
  const [games, setGames] = useState(0)
  
  return (
    
      <div className='main_container'>
        <Sidebar/>
        <MainContent/>
      </div>
      
    
  )
}

export default App
