export default async function getLists() {
  try {
    const lists = await window.api.getLists();
    console.log("Fetched lists:", lists);
    return lists;
  } catch (err) {
    console.error("Failed to fetch lists:", err);
    return [];
  }
}
