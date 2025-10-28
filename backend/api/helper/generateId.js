function generateUniqueId(existingIds = new Set()) {
    let id;
    do {
        id = Math.floor(Math.random() * 1e9); // random integer up to 999,999,999
    } while (existingIds.has(id));
    return id;
}

module.exports = { generateUniqueId };