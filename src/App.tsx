import NeuralNetworkCanvas from "./components/NeuralNetworkCanvas";

function App() {
  return (
    <main className="min-h-screen bg-[#0b1223] text-gray-200">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">
          Visualizace neuronových sítí
        </h1>
        <NeuralNetworkCanvas />
      </div>
    </main>
  );
}

export default App;
