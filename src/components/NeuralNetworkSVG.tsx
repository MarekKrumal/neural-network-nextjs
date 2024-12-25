import { useState } from "react";

type Props = {
  inputCount: number;
  hiddenCount: number;
  outputCount: number;
  inputValues: number[];
  hiddenActivations: number[];
  outputActivations: number[];
};

export default function NeuralNetworkSVG({
  inputCount,
  hiddenCount,
  outputCount,
  inputValues,
  hiddenActivations,
  outputActivations,
}: Props) {
  // Hover stav
  const [hoveredLayer, setHoveredLayer] = useState<
    "input" | "hidden" | "output" | null
  >(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dynamicky vytvoříme pole pozic
  const inputNeuronPositions = generatePositions(50, 100, inputCount);
  const hiddenNeuronPositions = generatePositions(250, 80, hiddenCount);
  const outputNeuronPositions = generatePositions(450, 120, outputCount);

  function generatePositions(xBase: number, yStart: number, count: number) {
    // Rozložíme neurony svisle s mezerou 60 px
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push({ x: xBase, y: yStart + i * 60 });
    }
    return positions;
  }

  // Zvýraznění linek
  function isHighlight(
    layer: "input" | "hidden" | "output",
    idx: number,
    layer2: "input" | "hidden" | "output",
    idx2: number
  ) {
    // Zvýrazníme linku, pokud hovered je (layer, idx) nebo (layer2, idx2)
    return (
      (hoveredLayer === layer && hoveredIndex === idx) ||
      (hoveredLayer === layer2 && hoveredIndex === idx2)
    );
  }

  function renderConnections() {
    const lines = [];
    // Input->Hidden
    for (let i = 0; i < inputCount; i++) {
      for (let j = 0; j < hiddenCount; j++) {
        const highlight = isHighlight("input", i, "hidden", j);
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
    for (let j = 0; j < hiddenCount; j++) {
      for (let o = 0; o < outputCount; o++) {
        const highlight = isHighlight("hidden", j, "output", o);
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

  function handleMouseEnter(layer: "input" | "hidden" | "output", idx: number) {
    setHoveredLayer(layer);
    setHoveredIndex(idx);
  }
  function handleMouseLeave() {
    setHoveredLayer(null);
    setHoveredIndex(null);
  }

  // Vykreslení
  return (
    <svg width={600} height={500} className="border border-gray-300 bg-white">
      {renderConnections()}

      {/* Input neurony */}
      {inputNeuronPositions.map((pos, i) => {
        const hovered = hoveredLayer === "input" && hoveredIndex === i;
        return (
          <g key={`in-${i}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#1d4ed8" : "#3b82f6"}
              onMouseEnter={() => handleMouseEnter("input", i)}
              onMouseLeave={handleMouseLeave}
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
        const hovered = hoveredLayer === "hidden" && hoveredIndex === j;
        return (
          <g key={`h-${j}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#3b82f6" : "#60a5fa"}
              onMouseEnter={() => handleMouseEnter("hidden", j)}
              onMouseLeave={handleMouseLeave}
            />
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {hiddenActivations[j]?.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Output neurony */}
      {outputNeuronPositions.map((pos, o) => {
        const hovered = hoveredLayer === "output" && hoveredIndex === o;
        return (
          <g key={`out-${o}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#1e3a8a" : "#2563eb"}
              onMouseEnter={() => handleMouseEnter("output", o)}
              onMouseLeave={handleMouseLeave}
            />
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {outputActivations[o]?.toFixed(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
