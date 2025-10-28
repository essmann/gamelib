function GameCard({ game }) {
  return (
    <div className="game_card ">
      <img className="game_card_image" src={game.poster} alt={game.title} />
      <div></div>
    </div>
  );
}

export default GameCard;

function GameFooter() {}
