import React from "react";

type Props = {
  inputCount: number;
  layers: number[];
  outputCount: number;

  setInputCount: React.Dispatch<React.SetStateAction<number>>;
  setLayers: React.Dispatch<React.SetStateAction<number[]>>;
  setOutputCount: React.Dispatch<React.SetStateAction<number>>;

  inputValues: number[];
  setInputValues: React.Dispatch<React.SetStateAction<number[]>>;

  weights: number[][][]; // polímatic
  setWeights: React.Dispatch<React.SetStateAction<number[][][]>>;

  onClose: () => void;
};

export default function ConfigPanel({
  inputCount,
  layers,
  outputCount,
  setInputCount,
  setLayers,
  setOutputCount,
  inputValues,
  setInputValues,
  weights,
  setWeights,
  onClose,
}: Props) {
  /** Přidá novou hidden vrstvu s default 4 neurony */
  function addHiddenLayer() {
    const newLayers = [...layers];
    newLayers.push(4);
    setLayers(newLayers);
  }

  /** Odebere poslední hidden vrstvu */
  function removeHiddenLayer() {
    if (layers.length > 0) {
      const newLayers = [...layers];
      newLayers.pop();
      setLayers(newLayers);
    }
  }

  function handleHiddenLayerChange(idx: number, value: string) {
    const newLayers = [...layers];
    newLayers[idx] = Number(value);
    setLayers(newLayers);
  }

  function handleInputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputCount(Number(e.target.value));
  }
  function handleOutputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOutputCount(Number(e.target.value));
  }

  function handleInputValueChange(idx: number, value: string) {
    const arr = [...inputValues];
    arr[idx] = Number(value);
    setInputValues(arr);
  }

  return (
    <div className="border border-gray-700 bg-gray-800 p-4 w-[800px] text-gray-200">
      <h2 className="text-lg font-bold mb-2 text-blue-300">
        Edit Configuration
      </h2>

      <div className="flex gap-6 mb-4">
        <div>
          <label className="font-medium">#Inputs:</label>
          <input
            type="number"
            className="border border-gray-600 bg-gray-900 ml-2 w-16 text-center"
            value={inputCount}
            onChange={handleInputCountChange}
          />
        </div>
        <div>
          <label className="font-medium">#Outputs:</label>
          <input
            type="number"
            className="border border-gray-600 bg-gray-900 ml-2 w-16 text-center"
            value={outputCount}
            onChange={handleOutputCountChange}
          />
        </div>
      </div>

      {/* Hidden layers */}
      <div className="mb-4 border border-gray-600 p-2">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-blue-400">
            Hidden Layers (celkem {layers.length})
          </p>
          <div className="flex gap-2">
            <button
              onClick={addHiddenLayer}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded"
            >
              + Add Layer
            </button>
            <button
              onClick={removeHiddenLayer}
              className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded"
            >
              - Remove
            </button>
          </div>
        </div>

        {layers.map((count, i) => (
          <div key={`layer-${i}`} className="flex items-center gap-2 mb-1">
            <span>Layer {i + 1}:</span>
            <input
              type="number"
              value={count}
              onChange={(e) => handleHiddenLayerChange(i, e.target.value)}
              className="border border-gray-600 bg-gray-900 w-16 text-center"
            />
            <span className="text-sm text-gray-400">neurons</span>
          </div>
        ))}
      </div>

      {/* Input Values */}
      <div className="mb-4 border border-gray-600 p-2">
        <p className="font-semibold text-blue-400 mb-2">
          Input Values (for {inputCount} inputs)
        </p>
        <div className="flex gap-2">
          {inputValues.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={(e) => handleInputValueChange(i, e.target.value)}
              className="border border-gray-600 bg-gray-900 w-14 text-center"
            />
          ))}
        </div>
      </div>

      {/* TODO: Tabulka pro weights (pokud chceš detailní editaci).
          S více vrstvami je to komplikovanější - 
          musel bys iterovat weights[i] (matice), atd.
      */}

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
