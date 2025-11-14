export const logout = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const response = await fetch(`${BACKEND_URL}/logout`, {
    method: "GET",
    credentials: "include", // <-- IMPORTANT (sends session cookie)
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }

  return await response.json();
};

export default logout;
