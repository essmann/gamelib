function GameCard({ game }) {
  const t = URL.createObjectURL(new Blob([game.poster], { type: 'image/png' }));
  return (
    <div className="game_card ">
      <img className="game_card_image" src={t || ""} alt={game.title} />
      <div></div>
    </div>
  );
}

export default GameCard;

function GameFooter() {}
