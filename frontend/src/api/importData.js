// utils/importGames.js
export default async function importData() {
  // Let user select a JSON file
  const file = await new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (event) => resolve(event.target.files[0]);
    input.click();
  });

  if (!file) return;

  // Read file text
  const text = await file.text();
  console.log(text);
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse JSON file:', err);
    throw new Error('Invalid JSON file.');
  }

  console.log(data);

  // Ensure both arrays exist
  data.games = Array.isArray(data.games) ? data.games : [];
  data.lists = Array.isArray(data.lists) ? data.lists : [];

  // Convert base64 posters to Uint8Array
 

  // Send the full object to backend import function
  console.log(JSON.stringify(data));
  return await window.api.importData(JSON.stringify(data));
}
