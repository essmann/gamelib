async function addList(name){
    try{
        return await window.api.addList(name);
    }
    catch (error){
        console.log(error);
    }
}
export default addList;