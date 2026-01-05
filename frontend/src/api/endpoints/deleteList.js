async function deleteList(listId) {
  try {
    return await window.api.deleteList(listId);
  } catch (error) {
    console.error("Failed to delete list:", error);
    throw error;
  }
}

export default deleteList;
