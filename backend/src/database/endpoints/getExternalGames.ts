 function getExternalGames(req: any, res: any) {
  let search = req.query.search || null;
  if (search == null) {
    return;
  }
  console.log("externalGames called with search: " + search); 

} 

export default getExternalGames;
