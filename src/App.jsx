import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-500">Here we set sail</h1>
      <p>React is running</p>
      <Button>Click Me</Button>
    </div>
  );
}

export default App;