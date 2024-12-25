"use client";

import React, { useState } from "react";

const NeuralNetworkCanvas = () => {
  const [neurons, setNeurons] = useState([
    { id: 1, x: 100, y: 100, activation: 0.5 },
    { id: 2, x: 300, y: 100, activation: 0.8 },
  ]);

  const updateNeuronActivation = (id, newActivation) => {
    setNeurons((prevNeurons) =>
      prevNeurons.map((neuron) =>
        neuron.id === id ? { ...neuron, activation: newActivation } : neuron
      )
    );
  };

  const handleNeuronClick = (id) => {
    // Pro demonstraci: zvýšení aktivace o 0.1 při kliknutí
    updateNeuronActivation(
      id,
      Math.min(1, neurons.find((n) => n.id === id).activation + 0.1)
    );
  };

  return (
    <svg width={800} height={600} className="border border-gray-300">
      {neurons.map((neuron) => (
        <g
          key={neuron.id}
          transform={`translate(${neuron.x}, ${neuron.y})`}
          onClick={() => handleNeuronClick(neuron.id)}
        >
          <circle r={30} fill="#4caf50" />
          <text x={-10} y={5} fill="#fff" fontSize={12}>
            {neuron.activation.toFixed(2)}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default NeuralNetworkCanvas;
