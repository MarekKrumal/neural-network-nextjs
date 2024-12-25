import React from "react";

type Props = {
  inputCount: number;
  outputCount: number;
  inputValues: number[];
  weightsIH: number[][];
  weightsHO: number[][];
  onClose: () => void;
  onReinitNetwork: (newInputCount: number, newOutputCount: number) => void;
  setInputValues: React.Dispatch<React.SetStateAction<number[]>>;
  setWeightsIH: React.Dispatch<React.SetStateAction<number[][]>>;
  setWeightsHO: React.Dispatch<React.SetStateAction<number[][]>>;
};

export default function ConfigPanel({
  inputCount,
  outputCount,
  inputValues,
  weightsIH,
  weightsHO,
  onClose,
  onReinitNetwork,
  setInputValues,
  setWeightsIH,
  setWeightsHO,
}: Props) {
  // Ošetříme změnu inputCount a outputCount skrz onReinitNetwork
  function handleInputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    onReinitNetwork(val, outputCount);
  }

  function handleOutputCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < 1) return;
    onReinitNetwork(inputCount, val);
  }

  // Úprava Input Values
  function handleInputValueChange(idx: number, value: string) {
    const arr = [...inputValues];
    arr[idx] = Number(value);
    setInputValues(arr);
  }

  // Úprava WeightIH
  function handleWeightIH(i: number, j: number, value: string) {
    const copy = JSON.parse(JSON.stringify(weightsIH)) as number[][];
    copy[i][j] = Number(value);
    setWeightsIH(copy);
  }

  // Úprava WeightHO
  function handleWeightHO(j: number, o: number, value: string) {
    const copy = JSON.parse(JSON.stringify(weightsHO)) as number[][];
    copy[j][o] = Number(value);
    setWeightsHO(copy);
  }

  return (
    <div className="border border-gray-300 bg-gray-50 p-4 w-[800px]">
      <h2 className="text-lg font-bold mb-2">Edit Configuration</h2>

      {/* Počet vstupů a výstupů */}
      <div className="flex gap-8 mb-4">
        <div>
          <label className="font-medium">Number of Inputs:</label>
          <input
            type="number"
            value={inputCount}
            onChange={handleInputCountChange}
            className="border p-1 w-16 ml-2"
          />
        </div>
        <div>
          <label className="font-medium">Number of Outputs:</label>
          <input
            type="number"
            value={outputCount}
            onChange={handleOutputCountChange}
            className="border p-1 w-16 ml-2"
          />
        </div>
      </div>

      {/* Input Values */}
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

      {/* Tabulka vah s omezenou výškou */}
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
