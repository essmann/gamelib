export function ContextProvider({ children }) {
  const [games, setGames] = useState([]); // shared state
  
  return (
    <GameContext.Provider value={{ games, setGames }}>
      {children}
    </GameContext.Provider>
  );
}
