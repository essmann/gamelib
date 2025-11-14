// src/api.ts or renderer/preload.js
export const login = async (formData) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const response = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // crucial for session cookies
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return await response.json();
};
