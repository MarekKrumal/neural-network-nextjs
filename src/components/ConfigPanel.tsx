type Props = {
  inputCount: number;
  layers: number[];
  outputCount: number;

  setInputCount: React.Dispatch<React.SetStateAction<number>>;
  setLayers: React.Dispatch<React.SetStateAction<number[]>>;
  setOutputCount: React.Dispatch<React.SetStateAction<number>>;

  inputValues: number[];
  setInputValues: React.Dispatch<React.SetStateAction<number[]>>;

  weights: number[][][];
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
  function handleInputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    setInputCount(val);
    // inputValues se upraví v orchestrální logice (NeuralNetworkCanvas) při reinitu
  }

  function handleOutputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    setOutputCount(val);
  }

  function handleAddHiddenLayer() {
    const newLayers = [...layers];
    newLayers.push(4);
    setLayers(newLayers);
  }

  function handleRemoveHiddenLayer() {
    if (layers.length > 0) {
      const newLayers = [...layers];
      newLayers.pop();
      setLayers(newLayers);
    }
  }

  function handleHiddenLayerNeuronChange(idx: number, value: string) {
    const newLayers = [...layers];
    newLayers[idx] = Number(value);
    setLayers(newLayers);
  }

  function handleInputValueChange(idx: number, value: string) {
    const arr = [...inputValues];
    arr[idx] = Number(value);
    setInputValues(arr);
  }

  /** Změna konkrétní váhy ve vrstvě layerIdx */
  function handleWeightChange(
    layerIdx: number,
    r: number,
    c: number,
    value: string
  ) {
    const copy = structuredClone(weights) as number[][][];
    copy[layerIdx][r][c] = Number(value);
    setWeights(copy);
  }

  return (
    <div className="border border-gray-700 bg-gray-800 p-4 w-[900px] text-gray-200">
      <h2 className="text-lg font-bold mb-2 text-blue-300">
        Edit Configuration (w/ Weights)
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
            Hidden Layers (count: {layers.length})
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAddHiddenLayer}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded"
            >
              + Add Layer
            </button>
            <button
              onClick={handleRemoveHiddenLayer}
              className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded"
            >
              - Remove
            </button>
          </div>
        </div>

        {layers.map((n, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span>Hidden Layer {i + 1}:</span>
            <input
              type="number"
              value={n}
              onChange={(e) => handleHiddenLayerNeuronChange(i, e.target.value)}
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
        <div className="flex gap-2 flex-wrap">
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

      {/* Tabulky vah pro každou vrstvu */}
      <div
        className="mb-4 border border-gray-600 p-2"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <p className="font-semibold text-blue-400 mb-2">
          Weights for each layer
        </p>
        {weights.map((mat, layerIdx) => {
          // Upřesníme trošku:
          let labelStr = "";
          if (layerIdx === 0 && layers.length > 0) {
            labelStr = "Input → Hidden1";
          } else if (layerIdx > 0 && layerIdx < layers.length) {
            labelStr = `Hidden${layerIdx} → Hidden${layerIdx + 1}`;
          } else if (layerIdx === layers.length) {
            labelStr = `Hidden${layers.length} → Output`;
          }

          return (
            <div key={layerIdx} className="mb-3">
              <p className="text-sm text-gray-300 mb-1">
                Layer {layerIdx}:
                <span className="ml-2 text-blue-400">{labelStr}</span>
              </p>
              {mat.map((row, r) => (
                <div key={r} className="flex gap-2 mb-1">
                  {row.map((val, c) => (
                    <input
                      key={c}
                      type="number"
                      value={val}
                      onChange={(e) =>
                        handleWeightChange(layerIdx, r, c, e.target.value)
                      }
                      className="border border-gray-600 bg-gray-900 w-16 text-center"
                    />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
