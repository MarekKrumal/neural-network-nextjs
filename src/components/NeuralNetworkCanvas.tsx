import { useState, useEffect } from "react";
import ExplanationBox from "./ExplanationBox";
import MultiLayerSVG from "./MultiLayerSVG";
import ConfigPanel from "./ConfigPanel";
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
  // STAVY
  // -----------------------------
  const [inputCount, setInputCount] = useState(3);
  const [layers, setLayers] = useState<number[]>([4]);
  const [outputCount, setOutputCount] = useState(1);

  // Vstupní data
  const [inputValues, setInputValues] = useState<number[]>([1, 2, 3]);

  // Váhy (pole matic):
  //   weights[0] = matice (inputCount × layers[0]) – Input → Hidden1
  //   weights[i] = matice (layers[i-1] × layers[i]) – Hidden i → Hidden i+1
  //   weights[layers.length] = matice (layers[last] × outputCount) – HiddenLast → Output
  const [weights, setWeights] = useState<number[][][]>([]);

  // Aktivace skrytých vrstev + výstupu
  const [hiddenActivations, setHiddenActivations] = useState<number[][]>([]);
  const [outputActivations, setOutputActivations] = useState<number[]>([]);

  // Zobrazení konfiguračního panelu
  const [showConfig, setShowConfig] = useState(false);

  // Panel s rovnicí (po kliknutí na neuron)
  const [selectedNeuron, setSelectedNeuron] = useState<SelectedNeuron | null>(
    null
  );
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(
    null
  );

  // -----------------------------
  // HOOKS
  // -----------------------------

  // (1) Při změně inputCount => uprav inputValues
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

  // (2) Kdykoli se změní (inputCount, layers, outputCount) => inicializuj / doplň váhy
  useEffect(() => {
    initWeightsIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputCount, layers, outputCount]);

  // (3) Při změně inputValues NEBO weights => přepočti dopřednou propagaci
  useEffect(() => {
    forwardPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, weights]);

  // -----------------------------
  // FUNKCE
  // -----------------------------

  /**
   * Zajistí, že v `weights` existuje správný počet matic
   * (layers.length + 1). Chybějící prvky inicializuje náhodně.
   */
  function initWeightsIfNeeded() {
    const newWeights = [...weights];
    const totalTransitions = layers.length + 1; // Input->Hidden1 + Hidden i->i+1 + HiddenLast->Output

    // 1) Input->Hidden1
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

    // Pokud by tam bylo něco navíc, ořízneme
    newWeights.length = totalTransitions;
    setWeights(newWeights);
  }

  /**
   * reinitMatrix:
   * Ponechá existující hodnoty oldMat[r][c], jinak inicializuje random v [-1,1].
   */
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

  /**
   * Dopředná propagace:
   * inputValues => (váhy 0) => hiddenActivations[0] => ...
   * nakonec outputActivations
   */
  function forwardPropagation() {
    if (weights.length === 0) return;

    let currentActs = [...inputValues];
    const newHiddenActs: number[][] = [];

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];
      if (!w[0]) break;

      const nextLayerSize = w[0].length;
      const nextActs: number[] = [];
      for (let n = 0; n < nextLayerSize; n++) {
        let sum = 0;
        for (let c = 0; c < currentActs.length; c++) {
          sum += currentActs[c] * (w[c]?.[n] ?? 0);
        }
        nextActs[n] = sigmoid(sum);
      }
      // Pokud i < layers.length => hidden
      if (i < layers.length) {
        newHiddenActs[i] = nextActs;
      } else {
        // Output
        setOutputActivations(nextActs);
      }
      currentActs = nextActs;
    }
    setHiddenActivations(newHiddenActs);
  }

  /**
   * Když kliknu na neuron => ulož info a souřadnice
   */
  function handleNeuronClick(
    layerIndex: number | "input" | "output",
    neuronIndex: number,
    coords: { x: number; y: number }
  ) {
    setSelectedNeuron({ layerIndex, neuronIndex });
    setPanelPos(coords);
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
    <div className="flex flex-col gap-6 w-full relative text-gray-200">
      <div className="flex flex-col items-center gap-4">
        <ExplanationBox />

        {!showConfig && (
          <button
            onClick={toggleConfig}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Edit Configuration
          </button>
        )}
      </div>

      {showConfig && (
        <div className="mx-auto border border-gray-700 bg-gray-800 p-4 max-w-8xl text-gray-200 rounded">
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
        </div>
      )}

      {/* Input Values */}
      <div className="flex flex-col items-center gap-2">
        <span className="font-semibold text-lg text-blue-300">
          Vstupní hodnoty (Input Values):
        </span>
        <div className="flex gap-2">
          {inputValues.map((val, i) => (
            <input
              key={i}
              type="number"
              step="1"
              className="border border-gray-700 bg-gray-800 text-gray-100 w-16 text-center rounded"
              value={val}
              onChange={(e) => {
                const arr = [...inputValues];
                arr[i] = parseFloat(e.target.value);
                setInputValues(arr);
              }}
            />
          ))}
        </div>
      </div>

      {/* MultiLayerSVG + Panel pro rovnice */}
      {/* Přidáváme minHeight + overflow:visible, aby se panel NeuronFormulaPanel neusekával */}
      <div
        className="border border-gray-700 bg-gray-800 relative rounded w-full"
        style={{ minHeight: "700px", overflow: "visible" }}
      >
        <MultiLayerSVG
          inputCount={inputCount}
          layers={layers}
          outputCount={outputCount}
          inputValues={inputValues}
          hiddenActivations={hiddenActivations}
          outputActivations={outputActivations}
          onNeuronClick={handleNeuronClick}
        />

        {/* Panel s rovnicí */}
        {selectedNeuron && panelPos && (
          <NeuronFormulaPanel
            selectedNeuron={selectedNeuron}
            inputValues={inputValues}
            onClose={closeNeuronPanel}
            style={{
              position: "absolute",
              left: panelPos.x + 20,
              top: panelPos.y + 20,
              // ať je nad SVG
              zIndex: 50,
            }}
          />
        )}
      </div>
    </div>
  );
}
