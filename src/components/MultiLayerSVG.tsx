import { useState } from "react";

type Props = {
  inputCount: number;
  layers: number[];
  outputCount: number;
  inputValues: number[];
  hiddenActivations: number[][];
  outputActivations: number[];
  onNeuronClick: (
    layerIndex: number | "input" | "output",
    neuronIndex: number,
    coords: { x: number; y: number }
  ) => void;
};

/**
 * Funkce vrací scale-faktor (0.5..1) podle počtu hidden-layers.
 *  - Při <=3 vrstvách vrací 1 (žádné zmenšení)
 *  - Od 4. vrstvy zmenšuje o 0.1 za každou navíc (až do minima 0.5)
 */
function getScaleFactor(numLayers: number): number {
  const maxFullLayers = 3; // do 3 hidden layers beze změny
  if (numLayers <= maxFullLayers) return 1;
  // kolik vrstev navíc
  const extra = numLayers - maxFullLayers;
  // každá navíc => -0.1
  const scale = 1 - extra * 0.1;
  // ale ať to nespadne pod 0.5
  return Math.max(scale, 0.5);
}

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

  // Podle počtu hidden-layers zvolíme "větší" viewBox, pokud jich je >=4,
  // aby bylo dost místa ve vodorovném směru.
  // Můžete klidně zvětšit i výšku, pokud by i vertikálně hrozilo "useknutí".
  const vbWidth = layers.length >= 4 ? 1400 : 1000;
  const vbHeight = 600;

  // Vypočteme scaleFactor => zmenšíme <g> uvnitř SVG, pokud 4 a více
  const scaleFactor = getScaleFactor(layers.length);

  /**
   * Vrstva 0 = input, 1..n = hidden, n+1 = output
   */
  const layerPositions: { x: number; y: number }[][] = [];

  // input
  layerPositions[0] = generatePositions(80, 80, inputCount);
  // hidden
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
    for (let i = 0; i < layers.length + 1; i++) {
      const fromPos = layerPositions[i];
      const toPos = layerPositions[i + 1];
      if (!fromPos || !toPos) continue;

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
              stroke={highlight ? "#f00" : "#999"}
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

  function getRadius(count: number, hovered: boolean) {
    // Dynamický poloměr podle počtu neuronů, aby se neprekrývaly
    const base = 30 - Math.min(20, count * 1.5);
    const rad = Math.max(10, base);
    return hovered ? rad + 4 : rad;
  }

  return (
    <svg
      // Dynamický viewBox (trochu širší, pokud >=4 hidden-layers)
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      className="w-full h-auto border border-gray-700 bg-gray-800"
    >
      {/* Vložíme <g> se scale(), aby se celé schéma zmenšilo, pokud je hodně hidden-layers */}
      <g transform={`scale(${scaleFactor})`}>
        {/* Čáry mezi neurony */}
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
                {inputValues[i]?.toFixed(3)}
              </text>
            </g>
          );
        })}

        {/* HIDDEN */}
        {layers.map((cnt, layerIdx) => {
          const positions = layerPositions[layerIdx + 1];
          const acts = hiddenActivations[layerIdx] ?? [];
          if (!positions) return null;

          return positions.map((pos, j) => {
            const hovered = hoveredLayer === layerIdx + 1 && hoveredIndex === j;
            const r = getRadius(cnt, hovered);
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
                  {acts[j]?.toFixed(3) || "0.000"}
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
                {outputActivations[o]?.toFixed(3) || "0.000"}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
