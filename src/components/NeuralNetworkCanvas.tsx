import React, { useState, useEffect } from "react";
import ExplanationBox from "./ExplanationBox";
import MultiLayerSVG from "./MultiLayerSVG"; // Nová SVG komponenta, podporující multi-layers
import ConfigPanel from "./ConfigPanel";
import LearningPanel from "./LearningPanel";
import "katex/dist/katex.min.css";

/** Sigmoid + derivace */
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}
function sigmoidPrime(z: number): number {
  const s = sigmoid(z);
  return s * (1 - s);
}

/**
 * Tato komponenta orchestruje:
 *  - inputCount, outputCount
 *  - layers (pole počtu neuronů pro hidden layers)
 *  - matice vah pro každou vrstvu
 *  - dopřednou propagaci
 *  - backprop (jen pro 1 output, pro ukázku)
 */
export default function NeuralNetworkCanvas() {
  // -----------------------------
  // STAVY
  // -----------------------------
  const [inputCount, setInputCount] = useState(3);
  const [layers, setLayers] = useState<number[]>([4]); // např. [4, 5] = 2 hidden vrstvy, první 4 neurony, druhá 5 neuronů
  const [outputCount, setOutputCount] = useState(1);

  // Vstupní hodnoty
  const [inputValues, setInputValues] = useState<number[]>([1, 2, 3]);

  // Váhy v poli:
  // weights[0] = matice (inputCount x layers[0])   – Input → Hidden1
  // weights[1] = matice (layers[0] x layers[1])    – Hidden1 → Hidden2 (pokud existuje druhá vrstva)
  // ...
  // weights[last] = matice (layers[n-1] x outputCount) – HiddenLast → Output
  const [weights, setWeights] = useState<number[][][]>([]);

  // Po dopředné propagaci si pamatujeme aktivace hidden vrstev v poli
  // hiddenActivations[0] = pole aktivací 1. hidden vrstvy
  // hiddenActivations[1] = pole aktivací 2. hidden vrstvy
  const [hiddenActivations, setHiddenActivations] = useState<number[][]>([]);

  // Výstupní aktivace
  const [outputActivations, setOutputActivations] = useState<number[]>([]);

  // Zobrazit / skrýt config panel
  const [showConfig, setShowConfig] = useState(false);

  // Learning stavy (1 output)
  const [targetValue, setTargetValue] = useState(0.5);
  const [learningRate, setLearningRate] = useState(0.1);

  // -----------------------------
  // 1) Inicializace vah (když layers změní velikost)
  // -----------------------------
  useEffect(() => {
    initWeightsIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCount, layers, outputCount]);

  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, weights]);

  /** Zkontroluje, zda weights odpovídají (inputCount, layers, outputCount) a doplní chybějící. */
  function initWeightsIfNeeded() {
    // Příklad:
    // Počet hidden layers = layers.length
    // Celkový počet vrstvových přechodů = layers.length + 1
    // Např.: input → hidden1, hidden1 → hidden2, ... hiddenN → output
    const totalTransitions = layers.length + 1;
    const newWeights = [...weights];

    // 1) Input → Hidden1
    if (totalTransitions > 0) {
      newWeights[0] = reinitMatrix(newWeights[0] ?? [], inputCount, layers[0]);
    }

    // 2) Hidden i → Hidden i+1
    for (let i = 1; i < layers.length; i++) {
      newWeights[i] = reinitMatrix(
        newWeights[i] ?? [],
        layers[i - 1],
        layers[i]
      );
    }

    // 3) HiddenLast → Output
    newWeights[layers.length] = reinitMatrix(
      newWeights[layers.length] ?? [],
      layers[layers.length - 1],
      outputCount
    );

    // Oříznout, pokud by tam zbyly nepotřebné
    newWeights.length = totalTransitions;

    setWeights(newWeights);
  }

  /** Pomocná funkce vygeneruje (nebo zachová) matici starRows x starCols a upraví na newRows x newCols */
  function reinitMatrix(
    oldMatrix: number[][],
    newRows: number,
    newCols: number
  ) {
    const result: number[][] = [];
    for (let r = 0; r < newRows; r++) {
      const row: number[] = [];
      for (let c = 0; c < newCols; c++) {
        if (oldMatrix[r] && oldMatrix[r][c] !== undefined) {
          row[c] = oldMatrix[r][c];
        } else {
          row[c] = randomWeight();
        }
      }
      result.push(row);
    }
    return result;
  }

  function randomWeight() {
    return Math.random() * 2 - 1;
  }

  // -----------------------------
  // 2) Dopředná propagace (multi-layers)
  // -----------------------------
  function forwardPropagation() {
    if (weights.length < 1) return;
    // 1) Vytvoř pole hiddenActivations
    const newHiddenActivations: number[][] = [];

    // Vstup: array inputValues
    let currentActivations = [...inputValues];

    // Pro každou vrstvovou matici
    // i=0 => input → hidden1
    // i=1 => hidden1 → hidden2
    // ...
    // i=layers.length => hiddenLast → output
    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      const nextLayerSize = w[0].length; // columns
      const newLayerActs: number[] = [];

      for (let n = 0; n < nextLayerSize; n++) {
        let sum = 0;
        for (let k = 0; k < currentActivations.length; k++) {
          sum += (currentActivations[k] ?? 0) * (w[k]?.[n] ?? 0);
        }
        newLayerActs[n] = sigmoid(sum);
      }

      if (i < layers.length) {
        // Tohle je hidden vrstva
        newHiddenActivations[i] = newLayerActs;
      } else {
        // Tohle je výstup
        setOutputActivations(newLayerActs);
      }
      // posuň se – tahle vrstva je teď "currentActivations" do příští
      currentActivations = newLayerActs;
    }

    setHiddenActivations(newHiddenActivations);
  }

  // -----------------------------
  // 3) Základní backprop pro 1 output (jen pro demo)
  // -----------------------------
  function handleLearnStep() {
    if (outputCount !== 1) {
      alert("Backprop demo funguje jen s 1 output.");
      return;
    }
    if (layers.length < 1) {
      alert(
        "Musíš mít aspoň 1 hidden layer, aby to dávalo smysl v tomhle demu."
      );
      return;
    }

    // 1) Projdeme dopředně a uložíme si raw sums (potřeba pro derivaci):
    const sumsAll: number[][] = []; // sumsAll[i][neur] = sum pro vrstvu i, neuron neur
    let currentActs = [...inputValues];

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      const nextLayerSize = w[0].length;
      const sumsLayer: number[] = [];
      for (let n = 0; n < nextLayerSize; n++) {
        let sum = 0;
        for (let c = 0; c < currentActs.length; c++) {
          sum += (currentActs[c] ?? 0) * (w[c]?.[n] ?? 0);
        }
        sumsLayer[n] = sum;
      }
      sumsAll[i] = sumsLayer;
      // posuň se
      currentActs = sumsLayer.map(sigmoid);
    }
    const outAct = currentActs[0]; // Jediný output neuron

    // 2) Výpočet chyby
    const error = outAct - targetValue;
    const outSum = sumsAll[sumsAll.length - 1][0]; // sum pro output neuron
    const dOut = error * sigmoidPrime(outSum);

    // 3) Budeme updatovat weights od konce
    const newWeights = structuredClone(weights) as number[][][];

    // (a) HiddenLast -> Output
    {
      const lastLayerIdx = weights.length - 1;
      const sumsLastHidden = sumsAll[lastLayerIdx - 1] ?? sumsAll[lastLayerIdx];
      // sumsLastHidden = sumy pro poslední hidden layer
      const lastHiddenActs = sumsLastHidden.map(sigmoid);

      for (let j = 0; j < lastHiddenActs.length; j++) {
        const grad = dOut * lastHiddenActs[j];
        newWeights[lastLayerIdx][j][0] -= learningRate * grad;
      }
    }

    // (b) Zpětná propagace do (layers.length - 1) hidden vrstvy
    // Tady jen 2-vrstvý backprop, v reálu by se rekurzivně táhlo pro layers.
    // Pro ukázku necháme jen poslední hidden vrstvu.
    if (layers.length > 0) {
      const lastLayerIdx = weights.length - 1; // index matice hiddenLast->output
      const hiddenLayerIdx = lastLayerIdx - 1; // index matice hidden-1->hiddenLast nebo input->hiddenLast
      if (hiddenLayerIdx >= 0) {
        const sumsHidden = sumsAll[hiddenLayerIdx];
        // pro zjednodušení – jen poslední hidden, nepokračujeme do deeper layers
        for (let j = 0; j < sumsHidden.length; j++) {
          const sumHiddenJ = sumsHidden[j];
          const dHidden =
            dOut * weights[lastLayerIdx][j][0] * sigmoidPrime(sumHiddenJ);
          // Vezmeme starší vrstvu (hiddenLayerIdx - 1)?
          // tady je to složitější. Ukázka:
          const newMat = newWeights[hiddenLayerIdx];
          // musíme zjistit, kolik neuronů bylo ve vrstvě hiddenLayerIdx - 1
          // atd. Pro demo to necháme polovičaté ;)
          for (let i = 0; i < newMat.length; i++) {
            // gradient: dHidden * activation(i) ...
            // ale musíme si najít activation(i) z sumsAll[hiddenLayerIdx - 1], ...
            // Zkrátka je to složitější.
            // Pro plný multi-layer backprop bys sem dopsal rekurzivní vzoreček.
          }
        }
      }
    }

    setWeights(newWeights);
  }

  // -----------------------------
  // 4) Toggle config panel
  // -----------------------------
  function toggleConfig() {
    setShowConfig(!showConfig);
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="flex flex-col gap-6 items-center bg-gray-900 text-gray-200 min-h-screen p-4">
      <h1 className="text-2xl font-bold text-blue-400">
        Multi-Layer Neural Network
      </h1>

      <ExplanationBox />

      {/* Config panel */}
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
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          onClick={toggleConfig}
        >
          Edit Configuration
        </button>
      )}

      {/* Vstupní data */}
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

      {/* SVG */}
      <MultiLayerSVG
        inputCount={inputCount}
        layers={layers}
        outputCount={outputCount}
        inputValues={inputValues}
        hiddenActivations={hiddenActivations}
        outputActivations={outputActivations}
      />

      {/* Learning panel, jen pro 1 output (demo) */}
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
