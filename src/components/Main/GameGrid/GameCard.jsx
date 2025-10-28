function GameCard({ game }) {
  const t = URL.createObjectURL(new Blob([game.poster], { type: "image/png" }));
  return (
    <>
      <div className="game_card ">
        <img className="game_card_image" src={t || ""} alt={game.title} />
        <div className="title_overlay">{game.title}</div>
        <GameFooter game={game} />
      </div>
    </>
  );
}

export default GameCard;

function GameFooter({ game }) {
  return <div className="game_footer"></div>;
}
