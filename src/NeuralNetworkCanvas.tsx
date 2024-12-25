import { useState, useEffect } from "react";

/**
 * Sigmoid aktivační funkce
 * @param {number} z
 * @returns {number}
 */
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

const NeuralNetworkCanvas = () => {
  // 1) VSTUPNÍ DATA
  const [inputValues, setInputValues] = useState([1, 2, 3]);

  // 2) VÁHY - pro jednoduchost jsou zafixované.
  //    V reálné app by se generovaly náhodně nebo se učily.
  const [weightsIH] = useState([
    // Váhy z 3 input neuronů do 4 hidden neuronů
    [0.5, 0.1, -0.2, 0.7], // váhy pro inputNeuron0
    [0.4, 0.3, 0.8, 0.2], // váhy pro inputNeuron1
    [0.9, -0.5, 0.3, 0.1], // váhy pro inputNeuron2
  ]);

  const [weightsHO] = useState([
    // váhy z 4 hidden neuronů do jednoho výstupního neuronu
    [0.2],
    [-0.4],
    [0.1],
    [0.7],
  ]);

  // 3) VÝSLEDNÉ AKTIVACE
  const [hiddenActivations, setHiddenActivations] = useState([0, 0, 0, 0]);
  const [outputActivation, setOutputActivation] = useState(0);

  // 4) PŘEPOČET DOPŘEDNÉ PROPAGACE
  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues]);

  const forwardPropagation = () => {
    // Výpočet hidden layer: hiddenNeuron_j = σ( sum(inputs_i * weightsIH[i][j]) )
    const newHidden = [];
    for (let j = 0; j < weightsIH[0].length; j++) {
      let sum = 0;
      for (let i = 0; i < inputValues.length; i++) {
        sum += inputValues[i] * weightsIH[i][j];
      }
      newHidden[j] = sigmoid(sum);
    }

    // Výpočet output layer: output = σ( sum(hidden_j * weightsHO[j][0]) )
    let sumOutput = 0;
    for (let j = 0; j < newHidden.length; j++) {
      sumOutput += newHidden[j] * weightsHO[j][0];
    }
    const newOutput = sigmoid(sumOutput);

    setHiddenActivations(newHidden);
    setOutputActivation(newOutput);
  };

  // 5) HANDLERY PRO ZMĚNU VSTUPŮ
  const handleChangeInput = (index, value) => {
    const newValues = [...inputValues];
    newValues[index] = Number(value);
    setInputValues(newValues);
  };

  // 6) VIZUALIZACE VRSTEV (pozice neuronů a spojení)
  // Souřadnice pro neurony – pro jednoduchost ručně definované
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

  const outputNeuronPosition = { x: 450, y: 230 };

  // Funkce, která vykreslí spojnice mezi vrstvami
  const renderConnections = () => {
    const lines = [];

    // Input -> Hidden
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

    // Hidden -> Output
    for (let j = 0; j < hiddenNeuronPositions.length; j++) {
      lines.push(
        <line
          key={`HO-${j}`}
          x1={hiddenNeuronPositions[j].x}
          y1={hiddenNeuronPositions[j].y}
          x2={outputNeuronPosition.x}
          y2={outputNeuronPosition.y}
          stroke="#999"
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold mt-4">
        Interactive Neural Network Visualization
      </h1>

      {/* 1) Textová políčka pro zadání vstupů */}
      <div className="flex gap-2 mb-4">
        <label className="font-medium">Input Values</label>
        {inputValues.map((val, idx) => (
          <input
            key={idx}
            type="number"
            value={val}
            onChange={(e) => handleChangeInput(idx, e.target.value)}
            className="border border-gray-300 p-1 w-16 text-center"
          />
        ))}
      </div>

      {/* 2) SVG pro neuronovou síť */}
      <svg width={600} height={500} className="border border-gray-300 bg-white">
        {/* Spojnice */}
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
              {inputValues[i]}
            </text>
          </g>
        ))}

        {/* Skrytá vrstva */}
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
              {hiddenActivations[j]?.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Výstupní neuron */}
        <circle
          cx={outputNeuronPosition.x}
          cy={outputNeuronPosition.y}
          r={20}
          fill="#2563eb"
        />
        <text
          x={outputNeuronPosition.x}
          y={outputNeuronPosition.y + 5}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {outputActivation.toFixed(2)}
        </text>
      </svg>
    </div>
  );
};

export default NeuralNetworkCanvas;
