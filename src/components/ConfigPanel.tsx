import { Dispatch, SetStateAction } from "react";

type Props = {
  inputCount: number;
  layers: number[];
  outputCount: number;

  setInputCount: Dispatch<SetStateAction<number>>;
  setLayers: Dispatch<SetStateAction<number[]>>;
  setOutputCount: Dispatch<SetStateAction<number>>;

  inputValues: number[];
  setInputValues: Dispatch<SetStateAction<number[]>>;

  weights: number[][][];
  setWeights: Dispatch<SetStateAction<number[][][]>>;

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
  }

  function handleOutputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    setOutputCount(val);
  }

  function handleAddHiddenLayer() {
    setLayers([...layers, 4]);
  }
  function handleRemoveHiddenLayer() {
    if (layers.length > 0) {
      const arr = [...layers];
      arr.pop();
      setLayers(arr);
    }
  }

  function handleHiddenLayerNeuronChange(idx: number, value: string) {
    const arr = [...layers];
    arr[idx] = Number(value);
    setLayers(arr);
  }

  function handleWeightChange(
    layerIdx: number,
    r: number,
    c: number,
    value: string
  ) {
    const copy = structuredClone(weights) as number[][][];
    copy[layerIdx][r][c] = parseFloat(value);
    setWeights(copy);
  }

  return (
    <div className="flex flex-col p-6 gap-4 text-gray-200">
      <h2 className="text-xl font-bold mb-2 text-blue-300">
        Nastavení sítě a vah
      </h2>

      <p className="text-sm text-gray-400">
        Zde můžeš upravit počet vstupů (Input), skrytých vrstev (Hidden Layers)
        i výstupů (Output). Dále lze měnit váhy pro jednotlivé vrstvy, což
        ovlivňuje sílu spojení mezi neurony.
      </p>

      {/* Počet Input a Output */}
      <div className="flex gap-6">
        <div className="flex flex-col">
          <label className="font-medium text-sm">Počet vstupů (Inputs)</label>
          <input
            type="number"
            className="border border-gray-600 bg-gray-900 w-16 text-center rounded"
            value={inputCount}
            onChange={handleInputCountChange}
          />
          <p className="text-xs text-gray-400 mt-1">
            Kolik neuronů má mít vstupní vrstva
          </p>
        </div>
        <div className="flex flex-col">
          <label className="font-medium text-sm">Počet výstupů (Outputs)</label>
          <input
            type="number"
            className="border border-gray-600 bg-gray-900 w-16 text-center rounded"
            value={outputCount}
            onChange={handleOutputCountChange}
          />
          <p className="text-xs text-gray-400 mt-1">
            Kolik neuronů má mít výstupní vrstva
          </p>
        </div>
      </div>

      {/* Hidden layers */}
      <div className="border border-gray-600 p-2 rounded">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-blue-400">
            Skryté vrstvy (Hidden Layers): {layers.length} ks
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAddHiddenLayer}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded"
            >
              + Přidat vrstvu
            </button>
            <button
              onClick={handleRemoveHiddenLayer}
              className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded"
            >
              - Odebrat
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          Skryté vrstvy zpracovávají signál mezi vstupy a výstupy.
        </p>

        {layers.map((layerSize, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="text-sm">Vrstva {i + 1} (neurony):</span>
            <input
              type="number"
              value={layerSize}
              onChange={(e) => handleHiddenLayerNeuronChange(i, e.target.value)}
              className="border border-gray-600 bg-gray-900 w-16 text-center rounded"
            />
            <span className="text-xs text-gray-400">
              Počet neuronů pro hidden vrstvu #{i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Váhy */}
      <div
        className="border border-gray-600 p-2 rounded"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <p className="font-semibold text-blue-400 mb-2 text-md">
          Váhy pro každou vrstvu
        </p>
        <p className="text-xs text-gray-400 mb-2">
          Úprava vah (weight) mění sílu spojení mezi neurony. Vyšší kladná
          hodnota = silnější vliv, záporná hodnota = opačný vliv.
        </p>

        {weights.map((layerMat, layerIdx) => {
          let labelStr = "";
          if (layerIdx === 0 && layers.length > 0) {
            labelStr = "Vstup → Skrytá vrstva #1";
          } else if (layerIdx > 0 && layerIdx < layers.length) {
            labelStr = `Skrytá vrstva #${layerIdx} → Skrytá vrstva #${
              layerIdx + 1
            }`;
          } else if (layerIdx === layers.length) {
            labelStr = `Skrytá vrstva #${layers.length} → Výstup (Output)`;
          }

          return (
            <div key={layerIdx} className="mb-4 border-b border-gray-600 pb-2">
              <p className="text-sm text-blue-400 font-semibold mb-2">
                Vrstva {layerIdx}: {labelStr}
              </p>
              {layerMat.map((row, r) => (
                <div key={r} className="flex gap-2 mb-1">
                  {row.map((val, c) => (
                    <input
                      key={c}
                      type="number"
                      step="0.25"
                      value={val.toFixed(3)} // 3 des. místa
                      onChange={(e) =>
                        handleWeightChange(layerIdx, r, c, e.target.value)
                      }
                      className="border border-gray-600 bg-gray-900 w-20 text-center rounded"
                    />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
          onClick={onClose}
        >
          Zavřít
        </button>
      </div>
    </div>
  );
}
