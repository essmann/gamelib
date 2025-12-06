async function addToList(listId, gameId){
    try{
        return await window.api.addToList(listId, gameId);
    }
    catch (error){
        console.log(error);
    }
}
export default addToList;