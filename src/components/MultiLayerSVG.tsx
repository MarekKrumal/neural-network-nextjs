import React, { useState } from "react";

type Props = {
  inputCount: number;
  layers: number[]; // např. [4, 5, 6] => 3 hidden layers
  outputCount: number;

  inputValues: number[];
  hiddenActivations: number[][]; // hiddenActivations[i] = pole neuronů vrstvy i
  outputActivations: number[];
};

export default function MultiLayerSVG({
  inputCount,
  layers,
  outputCount,
  inputValues,
  hiddenActivations,
  outputActivations,
}: Props) {
  const [hoveredLayer, setHoveredLayer] = useState<
    number | "input" | "output" | null
  >(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 0. Vrstva = input
  // 1..layers.length => hidden
  // poslední vrstva => output

  // Vytvoříme pole "layerPositions":
  // layerPositions[0] = souřadnice input neuronů
  // layerPositions[1] = souřadnice hidden[0]
  // layerPositions[2] = souřadnice hidden[1]
  // ...
  // layerPositions[layers.length] = hidden poslední
  // layerPositions[layers.length+1] = output
  const layerPositions: { x: number; y: number }[][] = [];

  // 1) Input positions
  layerPositions[0] = generatePositions(100, 80, inputCount);

  // 2) Hidden layers
  for (let i = 0; i < layers.length; i++) {
    const xBase = 300 + i * 200;
    layerPositions[i + 1] = generatePositions(xBase, 60, layers[i]);
  }

  // 3) Output
  const xOutput = 300 + layers.length * 200;
  layerPositions[layers.length + 1] = generatePositions(
    xOutput,
    100,
    outputCount
  );

  function generatePositions(xBase: number, yStart: number, count: number) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({ x: xBase, y: yStart + i * 60 });
    }
    return arr;
  }

  // Počet "vrstev" (včetně input a output) = layers.length + 2
  // => indexy 0..(layers.length+1)
  // spoje se táhnou z layer i do layer i+1
  function isHighlighted(
    layerIndex: number | "input" | "output",
    idx: number,
    layerIndex2: number | "input" | "output",
    idx2: number
  ) {
    return (
      (hoveredLayer === layerIndex && hoveredIndex === idx) ||
      (hoveredLayer === layerIndex2 && hoveredIndex === idx2)
    );
  }

  function renderLines() {
    const lines = [];
    // Z layer i do layer i+1
    const totalLayers = layers.length + 2; // 0..(n+1)
    for (let i = 0; i < totalLayers - 1; i++) {
      const fromPositions = layerPositions[i];
      const toPositions = layerPositions[i + 1];
      for (let f = 0; f < fromPositions.length; f++) {
        for (let t = 0; t < toPositions.length; t++) {
          const highlight = isHighlighted(i, f, i + 1, t);
          lines.push(
            <line
              key={`line-${i}-${f}-${t}`}
              x1={fromPositions[f].x}
              y1={fromPositions[f].y}
              x2={toPositions[t].x}
              y2={toPositions[t].y}
              stroke={highlight ? "#f00" : "#555"}
              strokeWidth={highlight ? 2 : 1}
            />
          );
        }
      }
    }
    return lines;
  }

  function handleMouseEnter(
    layerIndex: number | "input" | "output",
    idx: number
  ) {
    setHoveredLayer(layerIndex);
    setHoveredIndex(idx);
  }
  function handleMouseLeave() {
    setHoveredLayer(null);
    setHoveredIndex(null);
  }

  return (
    <svg
      width={1000}
      height={600}
      className="border border-gray-700 bg-gray-800"
    >
      {renderLines()}

      {/* Vrstvu 0 (input) */}
      {layerPositions[0].map((pos, i) => {
        const hovered = hoveredLayer === 0 && hoveredIndex === i;
        return (
          <g key={`input-${i}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#1d4ed8" : "#3b82f6"}
              onMouseEnter={() => handleMouseEnter(0, i)}
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

      {/* Hidden vrstvy */}
      {layers.map((count, layerIdx) => {
        const layerIndex = layerIdx + 1; // 1..n
        // positions = layerPositions[layerIndex]
        const acts = hiddenActivations[layerIdx] ?? [];
        return layerPositions[layerIndex].map((pos, j) => {
          const hovered = hoveredLayer === layerIndex && hoveredIndex === j;
          return (
            <g key={`hidden-${layerIdx}-${j}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={hovered ? 24 : 20}
                fill={hovered ? "#3b82f6" : "#60a5fa"}
                onMouseEnter={() => handleMouseEnter(layerIndex, j)}
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
                {acts[j]?.toFixed(2) ?? "0.00"}
              </text>
            </g>
          );
        });
      })}

      {/* Output vrstva = layerPositions[layers.length+1] */}
      {layerPositions[layers.length + 1].map((pos, o) => {
        const hovered =
          hoveredLayer === layers.length + 1 && hoveredIndex === o;
        return (
          <g key={`output-${o}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hovered ? 24 : 20}
              fill={hovered ? "#1e3a8a" : "#2563eb"}
              onMouseEnter={() => handleMouseEnter(layers.length + 1, o)}
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
              {outputActivations[o]?.toFixed(2) ?? "0.00"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
