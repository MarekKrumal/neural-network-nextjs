import React, { useState } from "react";

type Props = {
  inputCount: number;
  layers: number[];
  outputCount: number;

  inputValues: number[];
  hiddenActivations: number[][];
  outputActivations: number[];

  // Nová signatura => pos: {x, y}
  onNeuronClick: (
    layerIndex: number | "input" | "output",
    neuronIndex: number,
    pos: { x: number; y: number }
  ) => void;
};

export default function MultiLayerSVG({
  inputCount,
  layers,
  outputCount,
  inputValues,
  hiddenActivations,
  outputActivations,
  onNeuronClick,
}: Props) {
  const [hoveredLayer, setHoveredLayer] = useState<
    number | "input" | "output" | null
  >(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Array of positions for each layer
  const layerPositions: { x: number; y: number }[][] = [];

  // input
  layerPositions[0] = generatePositions(80, 80, inputCount);

  // hidden layers
  for (let i = 0; i < layers.length; i++) {
    const xBase = 300 + i * 200;
    layerPositions[i + 1] = generatePositions(xBase, 60, layers[i]);
  }

  // output
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
    // Layers = hidden + input, total = layers.length+2
    for (let i = 0; i < layers.length + 1; i++) {
      const fromPos = layerPositions[i];
      const toPos = layerPositions[i + 1];
      for (let f = 0; f < fromPos.length; f++) {
        for (let t = 0; t < toPos.length; t++) {
          const highlight = isHighlighted(i, f, i + 1, t);
          lines.push(
            <line
              key={`line-${i}-${f}-${t}`}
              x1={fromPos[f].x}
              y1={fromPos[f].y}
              x2={toPos[t].x}
              y2={toPos[t].y}
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

  /** Responsivní poloměr */
  function getRadius(count: number, hovered: boolean) {
    const base = 30 - Math.min(20, count * 1.5);
    const rad = Math.max(10, base);
    return hovered ? rad + 4 : rad;
  }

  return (
    <svg
      width={1000}
      height={600}
      className="border border-gray-700 bg-gray-800"
    >
      {renderLines()}

      {/* INPUT */}
      {layerPositions[0].map((pos, i) => {
        const hovered = hoveredLayer === 0 && hoveredIndex === i;
        const r = getRadius(inputCount, hovered);
        return (
          <g key={`input-${i}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={hovered ? "#1d4ed8" : "#3b82f6"}
              onMouseEnter={() => handleMouseEnter(0, i)}
              onMouseLeave={handleMouseLeave}
              // Předáváme i pos
              onClick={() => onNeuronClick("input", i, pos)}
              style={{ cursor: "pointer" }}
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

      {/* HIDDEN vrstvy */}
      {layers.map((count, layerIdx) => {
        const positions = layerPositions[layerIdx + 1];
        const acts = hiddenActivations[layerIdx] ?? [];
        return positions.map((pos, j) => {
          const hovered = hoveredLayer === layerIdx + 1 && hoveredIndex === j;
          const r = getRadius(count, hovered);
          return (
            <g key={`hidden-${layerIdx}-${j}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r}
                fill={hovered ? "#3b82f6" : "#60a5fa"}
                onMouseEnter={() => handleMouseEnter(layerIdx + 1, j)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onNeuronClick(layerIdx + 1, j, pos)}
                style={{ cursor: "pointer" }}
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize={12}
                fontWeight="bold"
              >
                {acts[j]?.toFixed(2) || "0.00"}
              </text>
            </g>
          );
        });
      })}

      {/* OUTPUT */}
      {layerPositions[layers.length + 1].map((pos, o) => {
        const hovered =
          hoveredLayer === layers.length + 1 && hoveredIndex === o;
        const r = getRadius(outputCount, hovered);
        return (
          <g key={`output-${o}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={hovered ? "#1e3a8a" : "#2563eb"}
              onMouseEnter={() => handleMouseEnter(layers.length + 1, o)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onNeuronClick("output", o, pos)}
              style={{ cursor: "pointer" }}
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
