import React from "react";

type Props = {
  inputCount: number;
  hiddenCount: number;
  outputCount: number;

  inputValues: number[];
  weightsIH: number[][];
  weightsHO: number[][];

  setInputValues: React.Dispatch<React.SetStateAction<number[]>>;
  setWeightsIH: React.Dispatch<React.SetStateAction<number[][]>>;
  setWeightsHO: React.Dispatch<React.SetStateAction<number[][]>>;

  onClose: () => void;

  // Slouží k re-inicializaci (včetně hiddenCount)
  onReinitNetwork: (
    newInputCount: number,
    newHiddenCount: number,
    newOutputCount: number
  ) => void;
};

export default function ConfigPanel({
  inputCount,
  hiddenCount,
  outputCount,
  inputValues,
  weightsIH,
  weightsHO,
  setInputValues,
  setWeightsIH,
  setWeightsHO,
  onClose,
  onReinitNetwork,
}: Props) {
  function handleInputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    onReinitNetwork(val, hiddenCount, outputCount);
  }
  function handleHiddenCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    onReinitNetwork(inputCount, val, outputCount);
  }
  function handleOutputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    onReinitNetwork(inputCount, hiddenCount, val);
  }

  // Uprav inputValues (okamžitě)
  function handleInputValueChange(idx: number, value: string) {
    const arr = [...inputValues];
    arr[idx] = Number(value);
    setInputValues(arr);
  }

  // Uprav WeightIH
  function handleWeightIH(i: number, j: number, value: string) {
    const copy = structuredClone(weightsIH) as number[][];
    copy[i][j] = Number(value);
    setWeightsIH(copy);
  }
  // Uprav WeightHO
  function handleWeightHO(j: number, o: number, value: string) {
    const copy = structuredClone(weightsHO) as number[][];
    copy[j][o] = Number(value);
    setWeightsHO(copy);
  }

  return (
    <div className="border border-gray-300 bg-gray-50 p-4 w-[800px]">
      <h2 className="text-lg font-bold mb-2">Edit Configuration</h2>

      <div className="flex gap-8 mb-4">
        <div>
          <label className="font-medium">#Inputs:</label>
          <input
            type="number"
            className="border p-1 w-16 ml-2"
            value={inputCount}
            onChange={handleInputCountChange}
          />
        </div>
        <div>
          <label className="font-medium">#Hidden:</label>
          <input
            type="number"
            className="border p-1 w-16 ml-2"
            value={hiddenCount}
            onChange={handleHiddenCountChange}
          />
        </div>
        <div>
          <label className="font-medium">#Outputs:</label>
          <input
            type="number"
            className="border p-1 w-16 ml-2"
            value={outputCount}
            onChange={handleOutputCountChange}
          />
        </div>
      </div>

      {/* Edit inputValues */}
      <div className="mb-4">
        <p className="font-semibold mb-2">
          Input Values (for {inputCount} inputs)
        </p>
        <div className="flex gap-2">
          {inputValues.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={(e) => handleInputValueChange(i, e.target.value)}
              className="border w-14 text-center"
            />
          ))}
        </div>
      </div>

      {/* Tabulka vah */}
      <div
        className="mb-4 border border-gray-200 p-2"
        style={{ maxHeight: "250px", overflowY: "auto" }}
      >
        <p className="font-semibold mb-2">Weights: Input → Hidden</p>
        {weightsIH.map((row, i) => (
          <div key={`row-ih-${i}`} className="flex gap-2 mb-1">
            {row.map((val, j) => (
              <input
                key={`ih-${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => handleWeightIH(i, j, e.target.value)}
                className="border p-1 w-16 text-center"
              />
            ))}
          </div>
        ))}
      </div>

      <div
        className="mb-4 border border-gray-200 p-2"
        style={{ maxHeight: "250px", overflowY: "auto" }}
      >
        <p className="font-semibold mb-2">Weights: Hidden → Output</p>
        {weightsHO.map((row, j) => (
          <div key={`row-ho-${j}`} className="flex gap-2 mb-1">
            {row.map((val, o) => (
              <input
                key={`ho-${j}-${o}`}
                type="number"
                value={val}
                onChange={(e) => handleWeightHO(j, o, e.target.value)}
                className="border p-1 w-16 text-center"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-1 bg-gray-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
