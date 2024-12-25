import React, { useState, useEffect } from "react";
import ExplanationBox from "./ExplanationBox";
import MultiLayerSVG from "./MultiLayerSVG";
import ConfigPanel from "./ConfigPanel";
import LearningPanel from "./LearningPanel";
import NeuronFormulaPanel from "./NeuronFormulaPanel";
import "katex/dist/katex.min.css";

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

interface SelectedNeuron {
  layerIndex: number | "input" | "output";
  neuronIndex: number;
}

export default function NeuralNetworkCanvas() {
  // -----------------------------
  // STAV
  // -----------------------------
  const [inputCount, setInputCount] = useState(3);
  const [layers, setLayers] = useState<number[]>([4]);
  const [outputCount, setOutputCount] = useState(1);

  // Inputy
  const [inputValues, setInputValues] = useState<number[]>([1, 2, 3]);

  // Váhy
  const [weights, setWeights] = useState<number[][][]>([]);

  // Aktivace hidden a output
  const [hiddenActivations, setHiddenActivations] = useState<number[][]>([]);
  const [outputActivations, setOutputActivations] = useState<number[]>([]);

  // Zobrazení konfig panelu
  const [showConfig, setShowConfig] = useState(false);

  // Učení (demo)
  const [targetValue, setTargetValue] = useState(0.5);
  const [learningRate, setLearningRate] = useState(0.1);

  // Vybraný neuron (LaTeX panel)
  const [selectedNeuron, setSelectedNeuron] = useState<SelectedNeuron | null>(
    null
  );
  // Souřadnice pro panel
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(
    null
  );

  // -----------------------------
  // useEffect: Při změně inputCount => uprav inputValues
  // -----------------------------
  useEffect(() => {
    if (inputValues.length < inputCount) {
      // Přidat nuly
      const diff = inputCount - inputValues.length;
      setInputValues([...inputValues, ...Array(diff).fill(0)]);
    } else if (inputValues.length > inputCount) {
      // Oříznout
      setInputValues(inputValues.slice(0, inputCount));
    }
  }, [inputCount]);

  // Kdykoli se změní (inputCount, layers, outputCount) => init vah
  useEffect(() => {
    initWeightsIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCount, layers, outputCount]);

  // Kdykoli se změní (inputValues, weights) => dopředná propagace
  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, weights]);

  // -----------------------------
  // FUNKCE
  // -----------------------------
  function initWeightsIfNeeded() {
    const totalTransitions = layers.length + 1;
    const newWeights = [...weights];

    // 1) Input->Hidden1 (pokud existuje hidden)
    if (layers.length > 0) {
      newWeights[0] = reinitMatrix(newWeights[0] ?? [], inputCount, layers[0]);
    }
    // 2) Hidden i->i+1
    for (let i = 1; i < layers.length; i++) {
      newWeights[i] = reinitMatrix(
        newWeights[i] ?? [],
        layers[i - 1],
        layers[i]
      );
    }
    // 3) HiddenLast->Output
    newWeights[layers.length] = reinitMatrix(
      newWeights[layers.length] ?? [],
      layers[layers.length - 1] ?? 0,
      outputCount
    );
    newWeights.length = totalTransitions;
    setWeights(newWeights);
  }

  function reinitMatrix(oldMat: number[][], newRows: number, newCols: number) {
    const result: number[][] = [];
    for (let r = 0; r < newRows; r++) {
      const row: number[] = [];
      for (let c = 0; c < newCols; c++) {
        if (oldMat[r] && oldMat[r][c] !== undefined) {
          row[c] = oldMat[r][c];
        } else {
          row[c] = Math.random() * 2 - 1;
        }
      }
      result.push(row);
    }
    return result;
  }

  function forwardPropagation() {
    if (weights.length < 1) return;
    let currentActs = [...inputValues];
    const newHiddenActivations: number[][] = [];

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      const nextLayerSize = w[0]?.length ?? 0;
      const newLayerActs: number[] = [];
      for (let n = 0; n < nextLayerSize; n++) {
        let sum = 0;
        for (let c = 0; c < currentActs.length; c++) {
          sum += currentActs[c] * (w[c]?.[n] ?? 0);
        }
        newLayerActs[n] = sigmoid(sum);
      }
      // Pokud i<layers.length => hidden vrstva
      if (i < layers.length) {
        newHiddenActivations[i] = newLayerActs;
      } else {
        // Output
        setOutputActivations(newLayerActs);
      }
      currentActs = newLayerActs;
    }
    setHiddenActivations(newHiddenActivations);
  }

  // Učení (1 output) – jen demo
  function handleLearnStep() {
    alert("Neimplementováno plně pro multi-layers.");
  }

  // Klik neuron => setSelectedNeuron + panelPos
  function handleNeuronClick(
    layerIndex: number | "input" | "output",
    neuronIndex: number,
    coords: { x: number; y: number }
  ) {
    setSelectedNeuron({ layerIndex, neuronIndex });
    // Např. posuneme panel o +20, +20 v Canvas
    setPanelPos({ x: coords.x, y: coords.y });
  }

  function closeNeuronPanel() {
    setSelectedNeuron(null);
    setPanelPos(null);
  }

  function toggleConfig() {
    setShowConfig(!showConfig);
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="flex flex-col gap-4 items-center bg-gray-900 text-gray-200 min-h-screen p-4 relative">
      <h1 className="text-2xl font-bold text-blue-400">
        Multi-Layer Neural Network
      </h1>

      <ExplanationBox />

      {showConfig && (
        <ConfigPanel
          inputCount={inputCount}
          layers={layers}
          outputCount={outputCount}
          setInputCount={setInputCount}
          setLayers={setLayers}
          setOutputCount={setOutputCount}
          inputValues={inputValues}
          setInputValues={setInputValues}
          weights={weights}
          setWeights={setWeights}
          onClose={toggleConfig}
        />
      )}
      {!showConfig && (
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          onClick={toggleConfig}
        >
          Edit Configuration
        </button>
      )}

      {/* Input Values */}
      <div className="flex gap-2 items-center">
        <span className="font-medium">Input Values:</span>
        {inputValues.map((val, i) => (
          <input
            key={i}
            type="number"
            className="border border-gray-700 bg-gray-800 text-gray-100 w-14 text-center"
            value={val}
            onChange={(e) => {
              const arr = [...inputValues];
              arr[i] = Number(e.target.value);
              setInputValues(arr);
            }}
          />
        ))}
      </div>

      <div className="border border-gray-700 bg-gray-800 p-2 relative">
        <MultiLayerSVG
          inputCount={inputCount}
          layers={layers}
          outputCount={outputCount}
          inputValues={inputValues}
          hiddenActivations={hiddenActivations}
          outputActivations={outputActivations}
          onNeuronClick={handleNeuronClick}
        />

        {selectedNeuron && panelPos && (
          <NeuronFormulaPanel
            selectedNeuron={selectedNeuron}
            inputValues={inputValues}
            hiddenActivations={hiddenActivations}
            outputActivations={outputActivations}
            weights={weights}
            onClose={closeNeuronPanel}
            style={{
              position: "absolute",
              left: panelPos.x + 20,
              top: panelPos.y + 20,
            }}
          />
        )}
      </div>

      {outputCount === 1 && (
        <LearningPanel
          targetValue={targetValue}
          setTargetValue={setTargetValue}
          learningRate={learningRate}
          setLearningRate={setLearningRate}
          outputValue={outputActivations[0] ?? 0}
          onLearnStep={handleLearnStep}
        />
      )}
    </div>
  );
}
