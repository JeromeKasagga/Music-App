const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const api = {
    //Helper to get token from supabase
    getToken: () => localStorage.getItem('access_token'),

    //Login function
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/api/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Login Failed');
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        return data;
    },


    // fetch songs
    getSongs: async () => {
        const res = await fetch(`${API_URL}/api/songs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch songs');
        return res.json();
    },


    // Upload Songs
    uploadSong: async (file, title, artist) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('artist', artist);

        const res = await fetch(`${API_URL}/api/songs/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: formData
        });
        if (!res.ok) throw new Error('Upload Failed');
        return res.json();
    }
};