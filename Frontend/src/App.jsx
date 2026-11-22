import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { PlayerProvider } from "./Context/PlayerContext";
import Login from "./components/Login";
import AppLayout from "./AppLayout";
import LandingPage from "./components/LandingPage";
import { SearchProvider } from "./Context/SearchContext";

// "Protected Route" wrapper
function AppContent() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // If not logged in, show the Login screen
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // If logged in, show the app
  return (
    <PlayerProvider>
      <SearchProvider>
        <AppLayout />
      </SearchProvider>
    </PlayerProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
