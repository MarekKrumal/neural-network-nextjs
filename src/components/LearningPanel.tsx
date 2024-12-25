type Props = {
  targetValue: number;
  setTargetValue: React.Dispatch<React.SetStateAction<number>>;
  learningRate: number;
  setLearningRate: React.Dispatch<React.SetStateAction<number>>;
  outputValue: number;
  onLearnStep: () => void;
};

export default function LearningPanel({
  targetValue,
  setTargetValue,
  learningRate,
  setLearningRate,
  outputValue,
  onLearnStep,
}: Props) {
  return (
    <div className="border p-4 w-[500px] bg-gray-50 text-sm text-black">
      <h2 className="text-lg font-bold mb-2">Learning Demo</h2>
      <p className="mb-1">
        Tady můžeš zadat cílovou hodnotu (Target) pro 1 výstupní neuron a
        posunout váhy jedním krokem backprop, aby se výstup přiblížil k cíli.
      </p>
      <div className="flex gap-4 mt-2">
        <div>
          <label className="font-medium">Target Value:</label>
          <input
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="border p-1 w-20 ml-2"
            step="0.01"
          />
        </div>
        <div>
          <label className="font-medium">Learning Rate:</label>
          <input
            type="number"
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="border p-1 w-20 ml-2"
            step="0.01"
          />
        </div>
      </div>
      <div className="mt-2">
        Current Output: <strong>{outputValue.toFixed(4)}</strong>
      </div>
      <button
        className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
        onClick={onLearnStep}
      >
        Learn Step
      </button>
    </div>
  );
}
