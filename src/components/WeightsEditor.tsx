type Props = {
  tempWeightsIH: number[][]; // dočasné váhy Input->Hidden
  tempWeightsHO: number[][]; // dočasné váhy Hidden->Output
  onIHChange: (i: number, j: number, value: string) => void;
  onHOChange: (j: number, o: number, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function WeightsEditor({
  tempWeightsIH,
  tempWeightsHO,
  onIHChange,
  onHOChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="border border-gray-400 p-4 bg-gray-50">
      <h2 className="font-bold mb-2 text-lg">Edit Weights</h2>

      <div className="flex gap-6">
        {/* Input->Hidden */}
        <div>
          <p className="font-semibold mb-2">Input → Hidden</p>
          {tempWeightsIH.map((row, i) => (
            <div key={`row-ih-${i}`} className="flex gap-2 mb-1">
              {row.map((val, j) => (
                <input
                  key={`ih-${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={(e) => onIHChange(i, j, e.target.value)}
                  className="border border-gray-300 p-1 w-16 text-center"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Hidden->Output */}
        <div>
          <p className="font-semibold mb-2">Hidden → Output</p>
          {tempWeightsHO.map((row, j) => (
            <div key={`row-ho-${j}`} className="flex gap-2 mb-1">
              {row.map((val, o) => (
                <input
                  key={`ho-${j}-${o}`}
                  type="number"
                  value={val}
                  onChange={(e) => onHOChange(j, o, e.target.value)}
                  className="border border-gray-300 p-1 w-16 text-center"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onSave}
          className="px-4 py-1 bg-green-600 text-white rounded"
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
