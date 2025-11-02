import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styling/gameCard.css'
import './styling/sidebar.css'
import './styling/addGameMenu.css'
import './styling/gameMenu.css'
import './styling/searchMenu.css'
import App from './App.jsx'
import ContextProvider from './Context/ContextProvider.jsx' // ✅ correct import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
)
