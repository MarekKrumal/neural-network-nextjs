import { useState, useEffect } from "react";
import ExplanationBox from "./ExplanationBox";
import NeuralNetworkSVG from "./NeuralNetworkSVG";
import ConfigPanel from "./ConfigPanel";
import LearningPanel from "./LearningPanel";
import "katex/dist/katex.min.css";

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function sigmoidPrime(z: number): number {
  // Derivace sigmoid = sigmoid(z) * (1 - sigmoid(z))
  const s = sigmoid(z);
  return s * (1 - s);
}

export default function NeuralNetworkCanvas() {
  // -----------------------------
  // 1) Počty vstupů, výstupů
  // -----------------------------
  const [inputCount, setInputCount] = useState(3);
  const [outputCount, setOutputCount] = useState(1);

  // Hodnoty vstupů
  const [inputValues, setInputValues] = useState<number[]>([1, 2, 3]);

  // Hidden neurony (fixně 4 pro demo)
  const hiddenCount = 4;

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

  // Zobrazit / skrýt konfigurační panel
  const [showConfig, setShowConfig] = useState(false);

  // Pro learning (zatím 1 output)
  const [targetValue, setTargetValue] = useState(0.5);
  const [learningRate, setLearningRate] = useState(0.1);

  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, weightsIH, weightsHO]);

  // -----------------------------
  // 2) Dopředná propagace
  // -----------------------------
  function forwardPropagation() {
    // 1) Hidden layer
    const newHidden: number[] = [];
    for (let j = 0; j < hiddenCount; j++) {
      let sum = 0;
      for (let i = 0; i < inputCount; i++) {
        // Pokud index i neexistuje v inputValues, je 0
        const x_i = inputValues[i] ?? 0;
        const w_ij = weightsIH[i]?.[j] ?? 0;
        sum += x_i * w_ij;
      }
      newHidden[j] = sigmoid(sum);
    }

    // 2) Output layer
    const newOut: number[] = [];
    for (let outIdx = 0; outIdx < outputCount; outIdx++) {
      let sumOut = 0;
      for (let j = 0; j < hiddenCount; j++) {
        const h_j = newHidden[j] ?? 0;
        const w_jo = weightsHO[j]?.[outIdx] ?? 0;
        sumOut += h_j * w_jo;
      }
      newOut.push(sigmoid(sumOut));
    }

    setHiddenActivations(newHidden);
    setOutputActivations(newOut);
  }

  // -----------------------------
  // 3) Změna počtu vstupů/výstupů
  // -----------------------------
  function reinitNetwork(newInputCount: number, newOutputCount: number) {
    // 1) Uprav inputValues
    let newInputs = [...inputValues];
    while (newInputs.length < newInputCount) {
      newInputs.push(0);
    }
    if (newInputs.length > newInputCount) {
      newInputs = newInputs.slice(0, newInputCount);
    }

    // 2) Uprav weightsIH: novou matici (newInputCount x hiddenCount)
    const newWih = Array.from({ length: newInputCount }, (_, i) =>
      Array.from({ length: hiddenCount }, (_, j) => {
        // zachovat stávající, pokud existuje, jinak random
        if (i < weightsIH.length && j < weightsIH[i].length) {
          return weightsIH[i][j];
        } else {
          return randomWeight();
        }
      })
    );

    // 3) Uprav weightsHO: novou matici (hiddenCount x newOutputCount)
    const newWho = Array.from({ length: hiddenCount }, (_, j) =>
      Array.from({ length: newOutputCount }, (_, o) => {
        // zachovat stávající, pokud existuje, jinak random
        if (j < weightsHO.length && o < weightsHO[j].length) {
          return weightsHO[j][o];
        } else {
          return randomWeight();
        }
      })
    );

    setInputValues(newInputs);
    setWeightsIH(newWih);
    setWeightsHO(newWho);
    setInputCount(newInputCount);
    setOutputCount(newOutputCount);
  }

  function randomWeight() {
    // random v rozmezí -1 až 1
    return Math.random() * 2 - 1;
  }

  // -----------------------------
  // 4) Jednoduché učení (1 output)
  // -----------------------------
  function handleLearnStep() {
    if (outputCount !== 1) {
      alert("Learning demo funguje jen s 1 outputem.");
      return;
    }

    // 1) Spočítat sumy pro hidden a output (zachytit si raw sum pro derivaci)
    const sumsHidden: number[] = [];
    const sumsOutput: number[] = []; // pro 1 output prvek sumsOutput[0]

    // Hidden
    for (let j = 0; j < hiddenCount; j++) {
      let sum = 0;
      for (let i = 0; i < inputCount; i++) {
        sum += (inputValues[i] ?? 0) * (weightsIH[i]?.[j] ?? 0);
      }
      sumsHidden[j] = sum;
    }
    const hActivations = sumsHidden.map((sum) => sigmoid(sum));

    // Output
    let sumOut = 0;
    for (let j = 0; j < hiddenCount; j++) {
      sumOut += hActivations[j] * (weightsHO[j]?.[0] ?? 0);
    }
    sumsOutput[0] = sumOut;
    const outAct = sigmoid(sumOut);

    // 2) Spočti error = (outAct - target)
    const error = outAct - targetValue;

    // 3) Backprop to output layer
    // dL/dw_{j} = (outAct - target) * derivSigmoid(sumOut) * h_j
    const dOut = error * sigmoidPrime(sumOut);

    // Uprav wHO[j][0]
    const newWho = JSON.parse(JSON.stringify(weightsHO)) as number[][];
    for (let j = 0; j < hiddenCount; j++) {
      const grad = dOut * hActivations[j];
      newWho[j][0] -= learningRate * grad; // gradient descend
    }

    // 4) Backprop to hidden layer
    // Pro hidden: dL/dwIH[i][j] = dOut * wHO[j][0] * sigmPrime(sumsHidden[j]) * x_i
    const newWih = JSON.parse(JSON.stringify(weightsIH)) as number[][];
    for (let j = 0; j < hiddenCount; j++) {
      const dHidden = dOut * weightsHO[j][0] * sigmoidPrime(sumsHidden[j]);
      for (let i = 0; i < inputCount; i++) {
        const grad = dHidden * (inputValues[i] ?? 0);
        newWih[i][j] -= learningRate * grad;
      }
    }

    setWeightsHO(newWho);
    setWeightsIH(newWih);

    // 5) forwardPropagation se zavolá z useEffect
  }

  // -----------------------------
  // UI a render
  // -----------------------------
  function toggleConfig() {
    setShowConfig(!showConfig);
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">Interactive Neural Network</h1>

      <ExplanationBox />

      {/* Panel (nad grafem) */}
      {showConfig && (
        <ConfigPanel
          inputCount={inputCount}
          outputCount={outputCount}
          inputValues={inputValues}
          weightsIH={weightsIH}
          weightsHO={weightsHO}
          onClose={toggleConfig}
          onReinitNetwork={reinitNetwork}
          setInputValues={setInputValues}
          setWeightsIH={setWeightsIH}
          setWeightsHO={setWeightsHO}
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

      {/* Vstupní hodnoty */}
      <div className="flex gap-2 items-center">
        <span>Input Values:</span>
        {inputValues.map((val, i) => (
          <input
            key={i}
            type="number"
            value={val}
            onChange={(e) => {
              const arr = [...inputValues];
              arr[i] = Number(e.target.value);
              setInputValues(arr);
            }}
            className="border w-14 text-center"
          />
        ))}
      </div>

      {/* Neuronová síť (SVG) */}
      <NeuralNetworkSVG
        inputValues={inputValues}
        hiddenActivations={hiddenActivations}
        outputActivations={outputActivations}
      />

      {/* Learning panel (jen pro 1 output) */}
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
