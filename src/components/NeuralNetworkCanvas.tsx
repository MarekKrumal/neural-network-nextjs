import { useState, useEffect } from "react";
import Latex from "react-latex";
import "katex/dist/katex.min.css";

import ExplanationBox from "./ExplanationBox";
import NeuralNetworkSVG from "./NeuralNetworkSVG";
import WeightsEditor from "./WeightsEditor";

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export default function NeuralNetworkCanvas() {
  // -----------------------------
  // 1) Dynamické nastavení počtu vstupů/výstupů
  // -----------------------------
  const [inputCount, setInputCount] = useState(3); // default: 3 inputů
  const [outputCount, setOutputCount] = useState(1); // default: 1 výstup

  // Hodnoty vstupů
  const [inputValues, setInputValues] = useState<number[]>([1, 2, 3]);

  // Jednoduchá hidden vrstva o 4 neuronech
  // Váhy Input->Hidden (matice velikosti inputCount x 4)
  const [weightsIH, setWeightsIH] = useState<number[][]>([
    [0.5, 0.1, -0.2, 0.7],
    [0.4, 0.3, 0.8, 0.2],
    [0.9, -0.5, 0.3, 0.1],
  ]);

  // Váhy Hidden->Output (4 x outputCount)
  const [weightsHO, setWeightsHO] = useState<number[][]>([
    [0.2],
    [-0.4],
    [0.1],
    [0.7],
  ]);

  // Aktivace
  const [hiddenActivations, setHiddenActivations] = useState<number[]>([
    0, 0, 0, 0,
  ]);
  const [outputActivations, setOutputActivations] = useState<number[]>([0]);

  // Stavy pro editaci vah
  const [editMode, setEditMode] = useState(false);
  const [tempWeightsIH, setTempWeightsIH] = useState<number[][]>([]);
  const [tempWeightsHO, setTempWeightsHO] = useState<number[][]>([]);

  // -----------------------------
  // 2) Dopředná propagace
  // -----------------------------
  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, weightsIH, weightsHO]);

  function forwardPropagation() {
    // 1) Hidden layer
    const newHidden: number[] = [];
    for (let j = 0; j < weightsIH[0].length; j++) {
      let sum = 0;
      for (let i = 0; i < inputValues.length; i++) {
        sum += inputValues[i] * weightsIH[i][j];
      }
      newHidden[j] = sigmoid(sum);
    }

    // 2) Output layer (poslední vrstva)
    const newOut: number[] = [];
    for (let outIdx = 0; outIdx < outputCount; outIdx++) {
      let sumOut = 0;
      for (let j = 0; j < newHidden.length; j++) {
        sumOut += newHidden[j] * weightsHO[j][outIdx];
      }
      newOut.push(sigmoid(sumOut));
    }

    setHiddenActivations(newHidden);
    setOutputActivations(newOut);
  }

  // -----------------------------
  // 3) Handler pro změnu vstupů
  // -----------------------------
  function handleChangeInput(index: number, value: string) {
    const newVals = [...inputValues];
    newVals[index] = Number(value);
    setInputValues(newVals);
  }

  // -----------------------------
  // 4) Editace vah
  // -----------------------------
  function handleEditWeightsClick() {
    setTempWeightsIH(JSON.parse(JSON.stringify(weightsIH)));
    setTempWeightsHO(JSON.parse(JSON.stringify(weightsHO)));
    setEditMode(true);
  }

  function handleWeightsIHChange(i: number, j: number, value: string) {
    const arr = JSON.parse(JSON.stringify(tempWeightsIH)) as number[][];
    arr[i][j] = Number(value);
    setTempWeightsIH(arr);
  }

  function handleWeightsHOChange(j: number, o: number, value: string) {
    const arr = JSON.parse(JSON.stringify(tempWeightsHO)) as number[][];
    arr[j][o] = Number(value);
    setTempWeightsHO(arr);
  }

  function handleSaveWeights() {
    setWeightsIH(tempWeightsIH);
    setWeightsHO(tempWeightsHO);
    setEditMode(false);
  }

  function handleCancelWeights() {
    setEditMode(false);
  }

  // -----------------------------
  // 5) Změna počtu vstupů a výstupů (volitelné)
  // -----------------------------
  function handleInputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    setInputCount(val);
    // Tady bys mohl také resetovat inputValues a weightsIH dle nového počtu
    // Pro ukázku to necháme takhle, aby uživatel věděl, že by musel napsat init funkci.
  }

  function handleOutputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    setOutputCount(val);
    // Stejně tak upravit weightsHO, atd.
  }

  // -----------------------------
  // 6) Render
  // -----------------------------
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold">Interactive Neural Network</h1>

      {/* (a) Nastavení počtu vstupů a výstupů */}
      <div className="flex gap-4">
        <div>
          <label>Number of Inputs:</label>
          <input
            type="number"
            value={inputCount}
            onChange={handleInputCountChange}
            className="border p-1 w-16 ml-2"
          />
        </div>
        <div>
          <label>Number of Outputs:</label>
          <input
            type="number"
            value={outputCount}
            onChange={handleOutputCountChange}
            className="border p-1 w-16 ml-2"
          />
        </div>
      </div>

      {/* (b) Explanation text (co to dělá) */}
      <ExplanationBox />

      {/* (c) Vstupní hodnoty */}
      <div className="flex gap-2">
        <span>Input Values:</span>
        {inputValues.map((val, i) => (
          <input
            key={i}
            type="number"
            value={val}
            onChange={(e) => handleChangeInput(i, e.target.value)}
            className="border w-14 text-center"
          />
        ))}
      </div>

      {/* (d) Tlačítko pro editaci vah */}
      <button
        className="px-4 py-1 bg-blue-600 text-white rounded"
        onClick={handleEditWeightsClick}
      >
        Edit Weights
      </button>

      {/* (e) Vykreslení neuronové sítě */}
      <NeuralNetworkSVG
        inputValues={inputValues}
        hiddenActivations={hiddenActivations}
        outputActivations={outputActivations}
      />

      {/* (f) Editor vah (panel) */}
      {editMode && (
        <WeightsEditor
          tempWeightsIH={tempWeightsIH}
          tempWeightsHO={tempWeightsHO}
          onIHChange={handleWeightsIHChange}
          onHOChange={handleWeightsHOChange}
          onSave={handleSaveWeights}
          onCancel={handleCancelWeights}
        />
      )}
    </div>
  );
}
