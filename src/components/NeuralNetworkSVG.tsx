import React from "react";

/**
 * Komponenta pro vykreslení neuronové sítě (1 hidden layer).
 * Vstup:
 *  - inputValues: number[]
 *  - hiddenActivations: number[]
 *  - outputActivations: number[]
 */
type Props = {
  inputValues: number[];
  hiddenActivations: number[];
  outputActivations: number[];
};

export default function NeuralNetworkSVG({
  inputValues,
  hiddenActivations,
  outputActivations,
}: Props) {
  // Souřadnice
  const inputNeuronPositions = [
    { x: 50, y: 100 },
    { x: 50, y: 200 },
    { x: 50, y: 300 },
  ];
  const hiddenNeuronPositions = [
    { x: 250, y: 80 },
    { x: 250, y: 180 },
    { x: 250, y: 280 },
    { x: 250, y: 380 },
  ];
  const outputNeuronPositions = [
    { x: 450, y: 200 },
    // Kdyby bylo víc output neuronů, mohl bys je rozdělit na 2..n
  ];

  // Spojnice Input->Hidden->Output
  function renderConnections() {
    const lines = [];

    // Input->Hidden
    for (let i = 0; i < inputNeuronPositions.length; i++) {
      for (let j = 0; j < hiddenNeuronPositions.length; j++) {
        lines.push(
          <line
            key={`IH-${i}-${j}`}
            x1={inputNeuronPositions[i].x}
            y1={inputNeuronPositions[i].y}
            x2={hiddenNeuronPositions[j].x}
            y2={hiddenNeuronPositions[j].y}
            stroke="#999"
            strokeWidth={1}
          />
        );
      }
    }

    // Hidden->Output
    for (let j = 0; j < hiddenNeuronPositions.length; j++) {
      for (let o = 0; o < outputNeuronPositions.length; o++) {
        lines.push(
          <line
            key={`HO-${j}-${o}`}
            x1={hiddenNeuronPositions[j].x}
            y1={hiddenNeuronPositions[j].y}
            x2={outputNeuronPositions[o].x}
            y2={outputNeuronPositions[o].y}
            stroke="#999"
            strokeWidth={1}
          />
        );
      }
    }

    return lines;
  }

  return (
    <svg width={600} height={500} className="border border-gray-300 bg-white">
      {renderConnections()}

      {/* Vstupní neurony */}
      {inputNeuronPositions.map((pos, i) => (
        <g key={`input-${i}`}>
          <circle cx={pos.x} cy={pos.y} r={20} fill="#3b82f6" />
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {inputValues[i] ?? 0}
          </text>
        </g>
      ))}

      {/* Hidden neurony */}
      {hiddenNeuronPositions.map((pos, j) => (
        <g key={`hidden-${j}`}>
          <circle cx={pos.x} cy={pos.y} r={20} fill="#60a5fa" />
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {hiddenActivations[j]?.toFixed(2) || "0.00"}
          </text>
        </g>
      ))}

      {/* Výstupní neurony (zde jen 1, ale připravené pole) */}
      {outputNeuronPositions.map((pos, idx) => (
        <g key={`output-${idx}`}>
          <circle cx={pos.x} cy={pos.y} r={20} fill="#2563eb" />
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {outputActivations[idx]?.toFixed(2) || "0.00"}
          </text>
        </g>
      ))}
    </svg>
  );
}
