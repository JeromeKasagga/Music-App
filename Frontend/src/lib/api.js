const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Helper to make authenticated requests with auto-refresh
const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("access_token");

  // Attach the token to the headers
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, { ...options, headers });

  // If the token expired (401 Unauthorized), try to refresh it
  if (res.status === 401) {
    try {
      console.log("Token expired. Refreshing...");
      const newToken = await api.refreshToken();

      // Retry the original request with the NEW token
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    } catch (error) {
      // If refresh fails, the refresh token is also dead. Force logout.
      console.error("Refresh failed, logging out.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/"; // Kick them to the landing page
      throw error;
    }
  }

  return res;
};

export const api = {
  //Helper to get token from supabase
  getToken: () => localStorage.getItem("access_token"),

  //Login function
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login Failed");
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  },

  // refresh function to get new acess token
  refreshToken: async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token");

    const res = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    // Django sends back a new access token
    localStorage.setItem("access_token", data.access);
    return data.access;
  },

  // fetch songs
  getSongs: async () => {
    const res = await fetchWithAuth(`${API_URL}/api/songs/`);
    if (!res.ok) throw new Error("Failed to fetch songs");
    return res.json();
  },

  // Upload Songs
  uploadSong: async (file, title, artist, duration = "0:00") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("duration", duration);

    const res = await fetchWithAuth(`${API_URL}/api/songs/upload/`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  // handle youtube request
  downloadYouTube: async (youtubeUrl) => {
    const res = await fetchWithAuth(`${API_URL}/api/songs/youtube/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: youtubeUrl }),
    });
    if (!res.ok) throw new Error("YouTube download failed");
    return res.json();
  },

  // youtube search function
  searchYouTube: async (query) => {
    const res = await fetchWithAuth(
      `${API_URL}/api/youtube/search/?q=${encodeURIComponent(query)}`,
    );
    if (!res.ok) throw new Error("Search failed");
    return res.json();
  },
};
