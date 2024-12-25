import { useState, useEffect } from "react";
import ExplanationBox from "./ExplanationBox";
import NeuralNetworkSVG from "./NeuralNetworkSVG";
import ConfigPanel from "./ConfigPanel";
import LearningPanel from "./LearningPanel";
import "katex/dist/katex.min.css";

// Sigmoid + derivace
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}
function sigmoidPrime(z: number): number {
  const s = sigmoid(z);
  return s * (1 - s);
}

/**
 * Hlavní "orchestrující" komponenta,
 * drží stavy: inputCount, hiddenCount, outputCount, váhy atd.
 */
export default function NeuralNetworkCanvas() {
  // -----------------------------
  // STAVY
  // -----------------------------
  const [inputCount, setInputCount] = useState(3);
  const [hiddenCount, setHiddenCount] = useState(4);
  const [outputCount, setOutputCount] = useState(1);

  // Vstupní hodnoty
  const [inputValues, setInputValues] = useState<number[]>([1, 2, 3]);

  // Váhy Input->Hidden (inputCount x hiddenCount)
  const [weightsIH, setWeightsIH] = useState<number[][]>([
    [0.5, 0.1, -0.2, 0.7],
    [0.4, 0.3, 0.8, 0.2],
    [0.9, -0.5, 0.3, 0.1],
  ]);

  // Váhy Hidden->Output (hiddenCount x outputCount)
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

  // Konfigurační panel zobrazen?
  const [showConfig, setShowConfig] = useState(false);

  // Learning stavy (1 output)
  const [targetValue, setTargetValue] = useState(0.5);
  const [learningRate, setLearningRate] = useState(0.1);

  // -----------------------------
  // 1) Spočti dopřednou propagaci při změně stavu
  // -----------------------------
  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, weightsIH, weightsHO]);

  function forwardPropagation() {
    // Skrytá vrstva
    const newHidden: number[] = [];
    for (let j = 0; j < hiddenCount; j++) {
      let sum = 0;
      for (let i = 0; i < inputCount; i++) {
        const x_i = inputValues[i] ?? 0;
        const w_ij = weightsIH[i]?.[j] ?? 0;
        sum += x_i * w_ij;
      }
      newHidden[j] = sigmoid(sum);
    }
    // Výstup
    const newOutput: number[] = [];
    for (let o = 0; o < outputCount; o++) {
      let sum = 0;
      for (let j = 0; j < hiddenCount; j++) {
        const h_j = newHidden[j] ?? 0;
        const w_jo = weightsHO[j]?.[o] ?? 0;
        sum += h_j * w_jo;
      }
      newOutput.push(sigmoid(sum));
    }
    setHiddenActivations(newHidden);
    setOutputActivations(newOutput);
  }

  // -----------------------------
  // 2) Re-inicializace s ohledem na inputCount/hiddenCount/outputCount
  // -----------------------------
  function reinitNetwork(
    newInputCount: number,
    newHiddenCount: number,
    newOutputCount: number
  ) {
    // a) InputValues
    let newInputs = [...inputValues];
    while (newInputs.length < newInputCount) {
      newInputs.push(0);
    }
    if (newInputs.length > newInputCount) {
      newInputs = newInputs.slice(0, newInputCount);
    }

    // b) WeightsIH (newInputCount x newHiddenCount)
    const newWih = Array.from({ length: newInputCount }, (_, i) =>
      Array.from({ length: newHiddenCount }, (_, j) => {
        if (i < weightsIH.length && j < weightsIH[i].length) {
          return weightsIH[i][j];
        } else {
          return randomWeight();
        }
      })
    );

    // c) WeightsHO (newHiddenCount x newOutputCount)
    const newWho = Array.from({ length: newHiddenCount }, (_, j) =>
      Array.from({ length: newOutputCount }, (_, o) => {
        if (j < weightsHO.length && o < weightsHO[j].length) {
          return weightsHO[j][o];
        } else {
          return randomWeight();
        }
      })
    );

    setInputCount(newInputCount);
    setHiddenCount(newHiddenCount);
    setOutputCount(newOutputCount);

    setInputValues(newInputs);
    setWeightsIH(newWih);
    setWeightsHO(newWho);
  }

  function randomWeight() {
    return Math.random() * 2 - 1;
  }

  // -----------------------------
  // 3) Jednoduchý backprop pro 1 výstup
  // -----------------------------
  function handleLearnStep() {
    if (outputCount !== 1) {
      alert("Learning demo funguje jen pro 1 output!");
      return;
    }

    // Předpočítej sumHidden, sumOutput
    const sumsHidden: number[] = [];
    for (let j = 0; j < hiddenCount; j++) {
      let sum = 0;
      for (let i = 0; i < inputCount; i++) {
        sum += (inputValues[i] ?? 0) * (weightsIH[i]?.[j] ?? 0);
      }
      sumsHidden[j] = sum;
    }
    const hActs = sumsHidden.map(sigmoid);

    let sumOut = 0;
    for (let j = 0; j < hiddenCount; j++) {
      sumOut += hActs[j] * (weightsHO[j]?.[0] ?? 0);
    }
    const outAct = sigmoid(sumOut);

    // Error
    const error = outAct - targetValue;

    // Output gradient
    const dOut = error * sigmoidPrime(sumOut);

    // Upravit weightsHO
    const newWho = structuredClone(weightsHO) as number[][];
    for (let j = 0; j < hiddenCount; j++) {
      const grad = dOut * hActs[j];
      newWho[j][0] -= learningRate * grad;
    }

    // Hidden gradient
    const newWih = structuredClone(weightsIH) as number[][];
    for (let j = 0; j < hiddenCount; j++) {
      const dHidden = dOut * weightsHO[j][0] * sigmoidPrime(sumsHidden[j]);
      for (let i = 0; i < inputCount; i++) {
        const grad = dHidden * (inputValues[i] ?? 0);
        newWih[i][j] -= learningRate * grad;
      }
    }

    setWeightsHO(newWho);
    setWeightsIH(newWih);
  }

  // -----------------------------
  // 4) Otevřít/zavřít config panel
  // -----------------------------
  function toggleConfig() {
    setShowConfig(!showConfig);
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">
        Interactive Neural Network (Fully Dynamic)
      </h1>

      <ExplanationBox />

      {/* Config panel */}
      {showConfig && (
        <ConfigPanel
          inputCount={inputCount}
          hiddenCount={hiddenCount}
          outputCount={outputCount}
          inputValues={inputValues}
          weightsIH={weightsIH}
          weightsHO={weightsHO}
          setInputValues={setInputValues}
          setWeightsIH={setWeightsIH}
          setWeightsHO={setWeightsHO}
          onClose={toggleConfig}
          onReinitNetwork={reinitNetwork}
        />
      )}
      {!showConfig && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={toggleConfig}
        >
          Edit Configuration
        </button>
      )}

      {/* VSTUPY */}
      <div className="flex gap-2 items-center">
        <span className="font-medium">Input Values:</span>
        {inputValues.map((val, i) => (
          <input
            key={i}
            type="number"
            className="border w-14 text-center"
            value={val}
            onChange={(e) => {
              const arr = [...inputValues];
              arr[i] = Number(e.target.value);
              setInputValues(arr);
            }}
          />
        ))}
      </div>

      {/* SVG - adaptivní neurony */}
      <NeuralNetworkSVG
        inputCount={inputCount}
        hiddenCount={hiddenCount}
        outputCount={outputCount}
        inputValues={inputValues}
        hiddenActivations={hiddenActivations}
        outputActivations={outputActivations}
      />

      {/* Learning panel jen pro 1 output */}
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
