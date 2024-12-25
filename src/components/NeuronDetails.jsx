import { MathJax, MathJaxContext } from "mathjax-react";
import React from "react";

const NeuronDetails = ({ formula }) => {
  return (
    <MathJaxContext>
      <div className="p-4 bg-gray-100 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">Neuron Details</h2>
        <MathJax>{`\\( ${formula} \\)`}</MathJax>
      </div>
    </MathJaxContext>
  );
};

export default NeuronDetails;
