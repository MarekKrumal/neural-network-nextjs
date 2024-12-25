import React, { useState } from "react";

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
  // Stavy pro hover
  const [hoveredLayer, setHoveredLayer] = useState<
    "input" | "hidden" | "output" | null
  >(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
  const outputNeuronPositions = [{ x: 450, y: 200 }];

  function isHoveredNeuron(
    layer: "input" | "hidden" | "output",
    index: number
  ) {
    return hoveredLayer === layer && hoveredIndex === index;
  }

  /** Vykreslení spojnic se zvýrazněním, pokud jsme na neuronu. */
  function renderConnections() {
    const lines = [];

    // Input->Hidden
    for (let i = 0; i < inputNeuronPositions.length; i++) {
      for (let j = 0; j < hiddenNeuronPositions.length; j++) {
        // Zvýraznit, pokud je hovered input i, hidden j
        const highlight =
          (hoveredLayer === "input" && hoveredIndex === i) ||
          (hoveredLayer === "hidden" && hoveredIndex === j);
        lines.push(
          <line
            key={`IH-${i}-${j}`}
            x1={inputNeuronPositions[i].x}
            y1={inputNeuronPositions[i].y}
            x2={hiddenNeuronPositions[j].x}
            y2={hiddenNeuronPositions[j].y}
            stroke={highlight ? "#f00" : "#999"}
            strokeWidth={highlight ? 2 : 1}
          />
        );
      }
    }

    // Hidden->Output
    for (let j = 0; j < hiddenNeuronPositions.length; j++) {
      for (let o = 0; o < outputNeuronPositions.length; o++) {
        const highlight =
          (hoveredLayer === "hidden" && hoveredIndex === j) ||
          (hoveredLayer === "output" && hoveredIndex === o);
        lines.push(
          <line
            key={`HO-${j}-${o}`}
            x1={hiddenNeuronPositions[j].x}
            y1={hiddenNeuronPositions[j].y}
            x2={outputNeuronPositions[o].x}
            y2={outputNeuronPositions[o].y}
            stroke={highlight ? "#f00" : "#999"}
            strokeWidth={highlight ? 2 : 1}
          />
        );
      }
    }
    return lines;
  }

  // Handlery
  function handleMouseEnterNeuron(
    layer: "input" | "hidden" | "output",
    index: number
  ) {
    setHoveredLayer(layer);
    setHoveredIndex(index);
  }
  function handleMouseLeaveNeuron() {
    setHoveredLayer(null);
    setHoveredIndex(null);
  }

  return (
    <svg width={600} height={500} className="border border-gray-300 bg-white">
      {renderConnections()}

      {/* Input neurony */}
      {inputNeuronPositions.map((pos, i) => {
        const hovered = isHoveredNeuron("input", i);
        return (
          <g
            key={`in-${i}`}
            onMouseEnter={() => handleMouseEnterNeuron("input", i)}
            onMouseLeave={handleMouseLeaveNeuron}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20} // zvětšení
              fill={hovered ? "#1d4ed8" : "#3b82f6"} // trošku tmavší barva
            />
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
        );
      })}

      {/* Hidden neurony */}
      {hiddenNeuronPositions.map((pos, j) => {
        const hovered = isHoveredNeuron("hidden", j);
        return (
          <g
            key={`h-${j}`}
            onMouseEnter={() => handleMouseEnterNeuron("hidden", j)}
            onMouseLeave={handleMouseLeaveNeuron}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#3b82f6" : "#60a5fa"}
            />
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
        );
      })}

      {/* Output neurony */}
      {outputNeuronPositions.map((pos, o) => {
        const hovered = isHoveredNeuron("output", o);
        return (
          <g
            key={`out-${o}`}
            onMouseEnter={() => handleMouseEnterNeuron("output", o)}
            onMouseLeave={handleMouseLeaveNeuron}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#1e3a8a" : "#2563eb"}
            />
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {outputActivations[o]?.toFixed(2) || "0.00"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
