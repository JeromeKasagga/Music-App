import AppLayout from "./AppLayout";
import { PlayerProvider } from "./components/PlayerContext";

function App() {
  return (
    <PlayerProvider>
      <AppLayout />
    </PlayerProvider>
  );
}

export default App;
