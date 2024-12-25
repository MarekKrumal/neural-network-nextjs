import NeuralNetworkCanvas from "../components/NeuralNetworkCanvas";

export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        Interactive Neural Network Visualization
      </h1>
      <NeuralNetworkCanvas />
    </main>
  );
}
