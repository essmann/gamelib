const fetchUser = async (setUser) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
          credentials: "include", // crucial for session cookies
        });
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setUser(null);
      }
    };

export default fetchUser;