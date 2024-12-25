import Latex from "react-latex";

interface SelectedNeuron {
  layerIndex: number | "input" | "output";
  neuronIndex: number;
}

type Props = {
  selectedNeuron: SelectedNeuron;
  inputValues: number[];
  hiddenActivations: number[][];
  outputActivations: number[];
  weights: number[][][];
  onClose: () => void;
  style?: React.CSSProperties; // nově, abychom mohli panel umístit
};

export default function NeuronFormulaPanel({
  selectedNeuron,
  inputValues,
  onClose,
  style = {},
}: Props) {
  const { layerIndex, neuronIndex } = selectedNeuron;

  let title = "";
  let latexFormula = "$\\text{No formula}$";

  if (layerIndex === "input") {
    title = `Input neuron #${neuronIndex + 1}`;
    latexFormula = `$x_{${neuronIndex + 1}} = ${
      inputValues[neuronIndex] ?? 0
    }$`;
  } else if (layerIndex === "output") {
    title = `Output neuron #${neuronIndex + 1}`;
    latexFormula = `$$ y_{${
      neuronIndex + 1
    }} = \\sigma\\Bigl(\\sum_{j} h_j w_{j,${neuronIndex + 1}}\\Bigr) $$`;
  } else {
    title = `Hidden layer ${layerIndex}, neuron #${neuronIndex + 1}`;
    latexFormula = `$$ z_{${neuronIndex + 1}}^{(${layerIndex})} 
    = \\sigma\\Bigl(\\sum_{i} a_i^{(layerIndex-1)} w_{i,${
      neuronIndex + 1
    }}^{(layerIndex)}\\Bigr) $$`;
  }

  return (
    <div
      style={{
        position: "absolute",
        border: "1px solid #444",
        background: "#222",
        color: "#eee",
        padding: "0.5rem",
        width: "220px",
        ...style,
      }}
    >
      <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "#4af" }}>
        {title}
      </h3>
      <Latex>{latexFormula}</Latex>

      <button
        style={{
          marginTop: "0.5rem",
          background: "#444",
          color: "#fff",
          padding: "0.3rem 0.6rem",
          border: "1px solid #666",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
